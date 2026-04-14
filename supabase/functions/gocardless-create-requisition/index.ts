import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GC_BASE, corsHeaders, getGoCardlessToken, jsonResponse } from "../_shared/gocardless.ts";

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
      return jsonResponse({ error: "Authorization required" }, 401);
    }

    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    ).auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { institution_id, institution_name, institution_logo } = await req.json();

    if (!institution_id) {
      return jsonResponse({ error: "institution_id required" }, 400);
    }

    const token = await getGoCardlessToken();

    // Create requisition
    const res = await fetch(`${GC_BASE}/requisitions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
      console.error(`Requisition create failed (${res.status}):`, err);
      return jsonResponse(
        { error: "Failed to create bank connection", detail: err },
        502
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

    return jsonResponse({
      link: requisition.link,
      requisition_id: requisition.id,
    });
  } catch (error) {
    console.error("Create requisition error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500
    );
  }
});
