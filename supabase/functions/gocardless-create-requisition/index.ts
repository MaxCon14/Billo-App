import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GC_BASE = "https://bankaccountdata.gocardless.com/api/v2";

/**
 * Creates a GoCardless requisition (bank connection request).
 *
 * Body: { institution_id: string, institution_name: string, institution_logo?: string }
 * Auth: Bearer token from Supabase auth (user must be logged in)
 *
 * Returns: { link: string, requisition_id: string }
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    ).auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { institution_id, institution_name, institution_logo } = await req.json();

    if (!institution_id) {
      return new Response(
        JSON.stringify({ error: "institution_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get GoCardless access token
    const { data: tokenData, error: tokenError } = await supabase.functions.invoke(
      "gocardless-get-token",
      { body: {} }
    );

    if (tokenError || !tokenData?.access) {
      return new Response(
        JSON.stringify({ error: "Failed to obtain access token" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create requisition
    const res = await fetch(`${GC_BASE}/requisitions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirect: "subtracker://bank-connected",
        institution_id,
        reference: `${user.id}_${Date.now()}`,
        user_language: "EN",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Requisition create error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to create bank connection" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requisition = await res.json();

    // Store in connected_banks
    const { error: dbError } = await supabase.from("connected_banks").insert({
      user_id: user.id,
      institution_id,
      institution_name: institution_name || institution_id,
      institution_logo: institution_logo || null,
      requisition_id: requisition.id,
      status: "pending",
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    return new Response(
      JSON.stringify({
        link: requisition.link,
        requisition_id: requisition.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create requisition error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
