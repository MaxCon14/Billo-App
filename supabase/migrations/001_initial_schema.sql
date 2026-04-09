-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD',
  notification_email BOOLEAN DEFAULT true,
  notification_push BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('weekly', 'monthly', 'quarterly', 'semi_annual', 'yearly')),
  billing_day INTEGER,
  next_billing_date DATE NOT NULL,
  start_date DATE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  auto_detected BOOLEAN DEFAULT false,
  plaid_transaction_id TEXT,
  notes TEXT,
  notify_before_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plaid linked accounts
CREATE TABLE public.plaid_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plaid_item_id TEXT NOT NULL UNIQUE,
  plaid_access_token TEXT NOT NULL,
  institution_name TEXT,
  institution_id TEXT,
  status TEXT DEFAULT 'active',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction history for detected subscriptions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  plaid_transaction_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  merchant_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification log
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('renewal_reminder', 'price_change', 'new_detected', 'payment_failed')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_billing ON public.subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_active ON public.subscriptions(user_id, is_active);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own categories" ON public.categories FOR ALL USING (user_id = auth.uid() OR is_default = true);

CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own plaid items" ON public.plaid_items FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own transactions" ON public.transactions FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid());

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Seed default categories
INSERT INTO public.categories (name, color, icon, is_default) VALUES
  ('Streaming', '#E24B4A', 'tv', true),
  ('Music', '#7F77DD', 'music', true),
  ('Gaming', '#639922', 'gamepad-2', true),
  ('Productivity', '#378ADD', 'briefcase', true),
  ('Cloud Storage', '#1D9E75', 'cloud', true),
  ('News & Reading', '#D85A30', 'newspaper', true),
  ('Fitness', '#D4537E', 'dumbbell', true),
  ('Finance', '#BA7517', 'wallet', true),
  ('Other', '#888780', 'package', true);
