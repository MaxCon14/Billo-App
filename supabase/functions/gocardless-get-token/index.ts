import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GC_BASE = "https://bankaccountdata.gocardless.com/api/v2";

// In-memory token cache (per isolate)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Internal helper — obtains a GoCardless access token.
 * Caches the token in memory for its validity period.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const now = Date.now();

    // Return cached token if still valid (with 60s safety margin)
    if (cachedToken && now < tokenExpiresAt - 60_000) {
      return new Response(
        JSON.stringify({ access: cachedToken }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const secretId = Deno.env.get("GOCARDLESS_SECRET_ID");
    const secretKey = Deno.env.get("GOCARDLESS_SECRET_KEY");

    if (!secretId || !secretKey) {
      return new Response(
        JSON.stringify({ error: "GoCardless credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(`${GC_BASE}/token/new/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret_id: secretId,
        secret_key: secretKey,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("GoCardless token error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to obtain GoCardless token" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    cachedToken = data.access;
    // access_expires is in seconds
    tokenExpiresAt = now + (data.access_expires ?? 86400) * 1000;

    return new Response(
      JSON.stringify({ access: data.access }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Token error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
