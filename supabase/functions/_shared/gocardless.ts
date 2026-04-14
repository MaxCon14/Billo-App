// Shared helpers for GoCardless Bank Account Data API edge functions.
// Each edge function runs in its own isolate, so the token cache is
// per-function — but that's fine, GoCardless tokens are valid for 24h
// and refreshing once per cold start is cheap.

export const GC_BASE = "https://bankaccountdata.gocardless.com/api/v2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Returns a valid GoCardless access token, fetching a fresh one if the
 * cache is empty or about to expire (60s safety margin). Throws on
 * configuration or network errors.
 */
export async function getGoCardlessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const secretId = Deno.env.get("GOCARDLESS_SECRET_ID");
  const secretKey = Deno.env.get("GOCARDLESS_SECRET_KEY");

  if (!secretId || !secretKey) {
    throw new Error(
      "GOCARDLESS_SECRET_ID and GOCARDLESS_SECRET_KEY must be set as edge function secrets"
    );
  }

  const res = await fetch(`${GC_BASE}/token/new/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret_id: secretId, secret_key: secretKey }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GoCardless token request failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  cachedToken = data.access;
  // access_expires is in seconds; default 24h if missing
  tokenExpiresAt = now + (data.access_expires ?? 86400) * 1000;

  return cachedToken!;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
