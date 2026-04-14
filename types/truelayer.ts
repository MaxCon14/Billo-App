// ─── TrueLayer API Types ────────────────────────────────────────────────────

export interface Provider {
  provider_id: string;
  display_name: string;
  logo_url?: string;
  country?: string;
  scopes?: string[];
}

// ─── Database Row Types ─────────────────────────────────────────────────────

export interface ConnectedBank {
  id: string;
  user_id: string;
  /** TrueLayer provider id, e.g. "ob-monzo". Stored in institution_id for DB compat. */
  institution_id: string;
  institution_name: string;
  institution_logo: string | null;
  /** Opaque external identifier (for TrueLayer we store refresh_token here for compat). */
  requisition_id: string | null;
  provider_country: string | null;
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
  status: 'pending' | 'active' | 'expired';
  connected_at: string | null;
  expires_at: string | null;
  last_synced_at: string | null;
  created_at: string;
}

export interface BankTransaction {
  id: string;
  user_id: string;
  bank_id: string;
  transaction_id: string | null;
  booking_date: string;
  amount: number;
  currency: string;
  creditor_name: string | null;
  debtor_name: string | null;
  description: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface DetectedSubscription {
  id: string;
  user_id: string;
  bank_id: string | null;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: string;
  last_charged: string | null;
  next_billing_date: string | null;
  category_hint: string | null;
  status: 'pending' | 'added' | 'ignored';
  created_at: string;
}

// ─── Country definitions ────────────────────────────────────────────────────
// TrueLayer's Data API primarily covers UK + the EU open banking corridor.

export interface Country {
  code: string; // ISO 3166-1 alpha-2 UPPERCASE (app-facing)
  tlCode: string; // TrueLayer lowercase code (api-facing)
  name: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'GB', tlCode: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', tlCode: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', tlCode: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'ES', tlCode: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', tlCode: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', tlCode: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'IE', tlCode: 'ie', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', tlCode: 'pt', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BE', tlCode: 'be', name: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', tlCode: 'at', name: 'Austria', flag: '🇦🇹' },
  { code: 'PL', tlCode: 'pl', name: 'Poland', flag: '🇵🇱' },
  { code: 'FI', tlCode: 'fi', name: 'Finland', flag: '🇫🇮' },
  { code: 'LT', tlCode: 'lt', name: 'Lithuania', flag: '🇱🇹' },
];

// ─── Sync Result ────────────────────────────────────────────────────────────

export interface SyncResult {
  transactions_fetched: number;
  subscriptions_detected: number;
  bank_status: string;
}
