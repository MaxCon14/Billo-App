import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  initialize: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  ...initialState,

  initialize: () => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        set({ session, user: session?.user ?? null });

        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null });
        }

        set({ isLoading: false, isInitialized: true });
      }
    );

    // Return unsubscribe function for cleanup
    return () => {
      subscription.unsubscribe();
    };
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUpWithEmail: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ ...initialState, isLoading: false, isInitialized: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  updateProfile: async (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => {
    const { user } = get();
    if (!user) throw new Error('No authenticated user');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
}));
