-- ============================================================================
-- Migration: Replace Plaid with GoCardless Bank Account Data
-- ============================================================================

-- Drop old Plaid tables
DROP TABLE IF EXISTS public.plaid_items CASCADE;

-- Remove plaid_transaction_id from subscriptions (keep auto_detected)
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS plaid_transaction_id;

-- ─── Connected Banks ───────────────────────────────────────────────────────
CREATE TABLE public.connected_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  institution_logo TEXT,
  requisition_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired')),
  connected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Bank Transactions ─────────────────────────────────────────────────────
CREATE TABLE public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_id UUID NOT NULL REFERENCES public.connected_banks(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE,
  booking_date DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  creditor_name TEXT,
  debtor_name TEXT,
  description TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Detected Subscriptions (temp holding table for user review) ────────────
CREATE TABLE public.detected_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES public.connected_banks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_cycle TEXT DEFAULT 'monthly',
  last_charged DATE,
  next_billing_date DATE,
  category_hint TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'added', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_connected_banks_user ON public.connected_banks(user_id);
CREATE INDEX idx_connected_banks_status ON public.connected_banks(user_id, status);
CREATE INDEX idx_bank_transactions_user ON public.bank_transactions(user_id);
CREATE INDEX idx_bank_transactions_bank ON public.bank_transactions(bank_id);
CREATE INDEX idx_bank_transactions_booking ON public.bank_transactions(booking_date);
CREATE INDEX idx_bank_transactions_creditor ON public.bank_transactions(creditor_name);
CREATE INDEX idx_detected_subscriptions_user ON public.detected_subscriptions(user_id, status);

-- ─── Row Level Security ─────────────────────────────────────────────────────
ALTER TABLE public.connected_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detected_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own connected banks"
  ON public.connected_banks FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own bank transactions"
  ON public.bank_transactions FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own detected subscriptions"
  ON public.detected_subscriptions FOR ALL USING (user_id = auth.uid());
