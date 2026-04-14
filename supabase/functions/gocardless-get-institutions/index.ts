import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GC_BASE = "https://bankaccountdata.gocardless.com/api/v2";

/**
 * Returns available banking institutions for a given country.
 * Query param: ?country=CY (ISO 3166 two-letter code)
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const country = url.searchParams.get("country")?.toUpperCase();

    if (!country || country.length !== 2) {
      return new Response(
        JSON.stringify({ error: "country query param required (ISO 3166 two-letter code)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get access token from sibling function
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

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

    const res = await fetch(`${GC_BASE}/institutions/?country=${country}`, {
      headers: { Authorization: `Bearer ${tokenData.access}` },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Institutions fetch error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to fetch institutions" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const institutions = await res.json();

    return new Response(JSON.stringify(institutions), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Institutions error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
