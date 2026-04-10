import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * True when no real Supabase credentials are configured.
 * Screens use sample data in this mode so the app can be previewed.
 */
export const IS_DEMO_MODE =
  !supabaseUrl ||
  supabaseUrl === 'your_supabase_url' ||
  !supabaseAnonKey ||
  supabaseAnonKey === 'your_supabase_anon_key';

export const supabase = createClient(
  IS_DEMO_MODE ? 'https://placeholder.supabase.co' : supabaseUrl,
  IS_DEMO_MODE ? 'placeholder-key' : supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
