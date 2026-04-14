-- ============================================================================
-- Migration: Switch open-banking provider to TrueLayer
-- ============================================================================
-- Additive migration on top of 004_gocardless_tables.sql. Keeps
-- connected_banks / bank_transactions / detected_subscriptions and adds the
-- OAuth token columns TrueLayer needs, plus a short-lived table for mapping
-- the OAuth `state` nonce back to a user during the redirect callback.

-- ─── Token storage on connected_banks ──────────────────────────────────────
ALTER TABLE public.connected_banks
  ADD COLUMN IF NOT EXISTS access_token TEXT,
  ADD COLUMN IF NOT EXISTS refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS provider_country TEXT;

-- requisition_id is now used as the TrueLayer "connection" identifier. No
-- schema change needed — we just repurpose the column.

COMMENT ON COLUMN public.connected_banks.access_token IS
  'TrueLayer access token. Short-lived (1h). Refreshed via refresh_token.';
COMMENT ON COLUMN public.connected_banks.refresh_token IS
  'TrueLayer refresh token (offline_access scope). Stored with RLS scoping; encrypt at rest before production.';

-- ─── Pending OAuth state (state -> user mapping) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.truelayer_pending_auths (
  state UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  provider_logo TEXT,
  provider_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_truelayer_pending_user
  ON public.truelayer_pending_auths(user_id);

ALTER TABLE public.truelayer_pending_auths ENABLE ROW LEVEL SECURITY;

-- Users can only see their own pending auths; edge functions use service role
-- so they bypass RLS.
CREATE POLICY "Users can manage own pending auths"
  ON public.truelayer_pending_auths FOR ALL USING (user_id = auth.uid());

-- Cleanup job: rows older than 1 hour are abandoned auth attempts.
-- Not scheduled automatically; run periodically or via cron.
-- DELETE FROM public.truelayer_pending_auths WHERE created_at < NOW() - INTERVAL '1 hour';
