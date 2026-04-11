-- Add biometric lock preference to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS biometric_lock_enabled BOOLEAN DEFAULT false;
