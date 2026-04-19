// ============================================================================
// TrueLayer shared helpers
// ============================================================================
// Used by the gocardless-replacement edge functions. All TrueLayer calls flow
// through here so sandbox/live switching and token refresh are centralised.

const CLIENT_ID = Deno.env.get("TRUELAYER_CLIENT_ID") ?? "";
const CLIENT_SECRET = Deno.env.get("TRUELAYER_CLIENT_SECRET") ?? "";
const ENV = (Deno.env.get("TRUELAYER_ENV") ?? "sandbox").toLowerCase();

const IS_LIVE = ENV === "live" || ENV === "production";

export const AUTH_BASE = IS_LIVE
  ? "https://auth.truelayer.com"
  : "https://auth.truelayer-sandbox.com";

export const API_BASE = IS_LIVE
  ? "https://api.truelayer.com"
  : "https://api.truelayer-sandbox.com";

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export function assertCredentials(): void {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "TRUELAYER_CLIENT_ID and TRUELAYER_CLIENT_SECRET must be set"
    );
  }
}

/**
 * Build the OAuth authorization URL the app opens in the user's browser.
 *
 * `providers` may be a single TrueLayer provider id (e.g. "ob-monzo") or a
 * space-separated list. `enable_mock=true` is injected in sandbox so the
 * mock bank shows up for testing.
 */
export function buildAuthorizeUrl(opts: {
  providerId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: "info accounts balance transactions offline_access",
    redirect_uri: opts.redirectUri,
    providers: opts.providerId,
    state: opts.state,
  });
  if (!IS_LIVE) {
    params.set("enable_mock", "true");
    params.set("enable_oauth_providers", "true");
    params.set("enable_open_banking_providers", "true");
    params.set("enable_credentials_sharing_providers", "true");
  }
  return `${AUTH_BASE}/?${params.toString()}`;
}

/** Exchange an OAuth authorization code for access + refresh tokens. */
export async function exchangeCodeForToken(opts: {
  code: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  assertCredentials();
  const res = await fetch(`${AUTH_BASE}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: opts.redirectUri,
      code: opts.code,
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TrueLayer token exchange failed (${res.status}): ${body}`);
  }
  return (await res.json()) as TokenResponse;
}

/** Refresh an access token using a stored refresh token. */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  assertCredentials();
  const res = await fetch(`${AUTH_BASE}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    }).toString(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TrueLayer refresh failed (${res.status}): ${body}`);
  }
  return (await res.json()) as TokenResponse;
}

/**
 * Fetch the catalogue of providers. TrueLayer's provider directory is public
 * (no auth needed) and returned as a flat JSON array with `country` codes.
 */
export interface TrueLayerProvider {
  provider_id: string;
  display_name: string;
  logo_url?: string;
  country?: string;
  scopes?: string[];
}

// TrueLayer auth URLs use "uk" but the provider list uses ISO "gb".
const COUNTRY_CODE_MAP: Record<string, string> = { uk: "gb" };

export async function fetchProviders(
  country: string
): Promise<TrueLayerProvider[]> {
  // Try base endpoint first, then versioned as fallback
  let raw: TrueLayerProvider[] | null = null;
  for (const path of ["/api/providers", "/api/providers/v3"]) {
    const res = await fetch(`${AUTH_BASE}${path}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) { raw = json as TrueLayerProvider[]; break; }
    }
    console.warn(`Providers fetch failed for ${path}: ${res.status}`);
  }
  if (!raw) throw new Error("Failed to fetch providers from TrueLayer");
  console.log(`Fetched ${raw.length} total providers`);
  const filtered = filterByCountry(raw, country);
  console.log(`Filtered to ${filtered.length} providers for country "${country}"`);
  return filtered;
}

function filterByCountry(
  providers: TrueLayerProvider[],
  country: string
): TrueLayerProvider[] {
  const iso = (COUNTRY_CODE_MAP[country.toLowerCase()] ?? country).toLowerCase();
  return providers.filter((p) => {
    const pc = (p.country ?? "").toLowerCase();
    return pc === iso || pc === country.toLowerCase();
  });
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
