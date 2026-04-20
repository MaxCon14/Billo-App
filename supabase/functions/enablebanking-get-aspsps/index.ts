import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, fetchAspsps } from "../_shared/enablebanking.ts";

/**
 * Returns the list of Enable Banking ASPSPs (banks) for a given country.
 *
 * Query param: ?country=GB  (ISO alpha-2, case-insensitive)
 * Auth: anon key (public endpoint, --no-verify-jwt)
 *
 * Response: Array of { name, country, logo?, sandbox? }
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const country = url.searchParams.get("country") ?? "";

    const aspsps = await fetchAspsps(country || undefined);

    // Map to a shape the app expects (mirrors the old Provider shape)
    const providers = aspsps.map((a) => ({
      provider_id: `${a.country.toLowerCase()}-${a.name.toLowerCase().replace(/\s+/g, "-")}`,
      display_name: a.name,
      logo_url: a.logo ?? null,
      country: a.country.toLowerCase(),
      aspsp_name: a.name,
      aspsp_country: a.country,
      sandbox: a.sandbox ?? false,
      scopes: ["transactions", "balances"],
    }));

    return new Response(JSON.stringify(providers), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("get-aspsps error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
