// ============================================================================
// Enable Banking shared helpers
// ============================================================================

const APP_ID = Deno.env.get("ENABLE_BANKING_APP_ID") ?? "";
const PRIVATE_KEY_PEM = Deno.env.get("ENABLE_BANKING_PRIVATE_KEY") ?? "";

export const API_BASE = "https://api.enablebanking.com";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function assertCredentials(): void {
  if (!APP_ID || !PRIVATE_KEY_PEM) {
    throw new Error(
      "ENABLE_BANKING_APP_ID and ENABLE_BANKING_PRIVATE_KEY must be set"
    );
  }
}

function base64url(input: Uint8Array | string): string {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function importPrivateKey(): Promise<CryptoKey> {
  // Strip PEM headers (handles both PKCS8 and PKCS1 headers)
  const pem = PRIVATE_KEY_PEM
    .replace(/-----BEGIN (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/-----END (?:RSA )?PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

export async function generateJWT(): Promise<string> {
  const key = await importPrivateKey();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: APP_ID }));
  const payload = base64url(JSON.stringify({ iss: APP_ID, aud: "enablebanking.com", iat: now, exp: now + 3600 }));

  const sigInput = `${header}.${payload}`;
  const data = new TextEncoder().encode(sigInput);
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);

  return `${sigInput}.${base64url(new Uint8Array(sig))}`;
}

export async function apiHeaders(): Promise<Record<string, string>> {
  assertCredentials();
  const jwt = await generateJWT();
  return {
    Authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// ─── API helpers ─────────────────────────────────────────────────────────────

export interface EBaspsp {
  name: string;
  country: string;
  logo?: string;
  sandbox?: boolean;
  bic_fis?: string[];
}

export interface EBAccount {
  uid: string;
  account_id?: { iban?: string; bban?: string };
  currency: string;
  name?: string;
  product?: string;
  cash_account_type?: string;
}

export interface EBSession {
  session_id: string;
  accounts: EBAccount[];
  status?: string;
  valid_until?: string;
}

export interface EBTransaction {
  transaction_id?: string;
  entry_reference?: string;
  booking_date: string;
  value_date?: string;
  transaction_amount: { amount: string; currency: string };
  creditor_name?: string;
  debtor_name?: string;
  remittance_information_unstructured?: string;
  additional_information?: string;
}

export async function fetchAspsps(country?: string): Promise<EBaspsp[]> {
  const headers = await apiHeaders();
  const url = country
    ? `${API_BASE}/aspsps?country=${country.toUpperCase()}`
    : `${API_BASE}/aspsps`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ASPSP list failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  // API may return { aspsps: [...] } or a plain array
  const list = Array.isArray(data) ? data : (data.aspsps ?? []);
  return list as EBaspsp[];
}

export async function createAuthSession(opts: {
  aspspName: string;
  aspspCountry: string;
  redirectUrl: string;
  state: string;
}): Promise<{ url: string }> {
  const headers = await apiHeaders();
  const validUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const body = {
    access: {
      balances: {},
      transactions: {},
      valid_until: validUntil,
    },
    aspsp: {
      name: opts.aspspName,
      country: opts.aspspCountry.toUpperCase(),
    },
    state: opts.state,
    redirect_url: opts.redirectUrl,
    psu_type: "personal",
  };

  const res = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create auth session failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  // Response may return { url } or { auth_url }
  const url = data.url ?? data.auth_url;
  if (!url) throw new Error("Enable Banking did not return an auth URL");
  return { url };
}

export async function createSession(code: string): Promise<EBSession> {
  const headers = await apiHeaders();
  const res = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create session failed (${res.status}): ${err}`);
  }

  return (await res.json()) as EBSession;
}

export async function fetchTransactions(opts: {
  accountUid: string;
  dateFrom: string;
  dateTo: string;
}): Promise<EBTransaction[]> {
  const headers = await apiHeaders();
  const params = new URLSearchParams({
    date_from: opts.dateFrom,
    date_to: opts.dateTo,
  });

  const res = await fetch(
    `${API_BASE}/accounts/${opts.accountUid}/transactions?${params}`,
    { headers }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Transactions fetch failed for ${opts.accountUid} (${res.status}): ${err}`
    );
  }

  const data = await res.json();
  return (data.transactions ?? []) as EBTransaction[];
}
