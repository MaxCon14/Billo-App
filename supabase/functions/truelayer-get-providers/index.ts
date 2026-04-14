import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, fetchProviders } from "../_shared/truelayer.ts";

/**
 * Returns TrueLayer providers for a given country (ISO 3166 two-letter).
 * Query param: ?country=GB
 *
 * TrueLayer's country field is two-letter lowercase, so we normalise.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const country = url.searchParams.get("country")?.toLowerCase();

    if (!country || country.length !== 2) {
      return new Response(
        JSON.stringify({ error: "country query param required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const providers = await fetchProviders(country);
    return new Response(JSON.stringify(providers), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Providers error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message ?? "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
