// ─── GoCardless API Types ───────────────────────────────────────────────────

export interface Institution {
  id: string;
  name: string;
  bic: string;
  logo: string;
  transaction_total_days: string;
  countries: string[];
}

export interface Requisition {
  id: string;
  redirect: string;
  status: string;
  institution_id: string;
  link: string;
  accounts: string[];
  reference: string;
  user_language: string;
}

// ─── Database Row Types ─────────────────────────────────────────────────────

export interface ConnectedBank {
  id: string;
  user_id: string;
  institution_id: string;
  institution_name: string;
  institution_logo: string | null;
  requisition_id: string | null;
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

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES: Country[] = [
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
];

// ─── Sync Result ────────────────────────────────────────────────────────────

export interface SyncResult {
  transactions_fetched: number;
  subscriptions_detected: number;
  bank_status: string;
}
