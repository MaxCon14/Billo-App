// ─── Bank Provider (Enable Banking ASPSP) ───────────────────────────────────

export interface Provider {
  provider_id: string;     // synthetic: "{country}-{name-slug}"
  display_name: string;
  logo_url?: string | null;
  country?: string;
  aspsp_name: string;      // Enable Banking canonical name
  aspsp_country: string;   // ISO alpha-2 uppercase
  sandbox?: boolean;
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
// Enable Banking covers 29 European countries via PSD2.

export interface Country {
  code: string; // ISO 3166-1 alpha-2 UPPERCASE
  name: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
];

// ─── Sync Result ────────────────────────────────────────────────────────────

export interface SyncResult {
  transactions_fetched: number;
  subscriptions_detected: number;
  bank_status: string;
}
