import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { GC_BASE, corsHeaders, getGoCardlessToken, jsonResponse } from "../_shared/gocardless.ts";

/**
 * Returns available banking institutions for a given country.
 * Accepts country via JSON body { country: "GB" } (preferred — works
 * with supabase.functions.invoke) or ?country=GB query param.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Read country from body OR query string for flexibility
    let country: string | null = null;

    const url = new URL(req.url);
    country = url.searchParams.get("country");

    if (!country) {
      try {
        const body = await req.json();
        country = body?.country ?? null;
      } catch {
        // No body or invalid JSON — fall through
      }
    }

    country = country?.toUpperCase() ?? null;

    if (!country || country.length !== 2) {
      return jsonResponse(
        { error: "country required (ISO 3166 two-letter code)" },
        400
      );
    }

    const token = await getGoCardlessToken();

    const res = await fetch(`${GC_BASE}/institutions/?country=${country}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`Institutions fetch failed (${res.status}):`, err);
      return jsonResponse(
        { error: "Failed to fetch institutions", detail: err },
        502
      );
    }

    const institutions = await res.json();
    return jsonResponse(institutions);
  } catch (error) {
    console.error("Institutions error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500
    );
  }
});
