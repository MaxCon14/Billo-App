-- Add free trial fields to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS trial_ends_at DATE;
