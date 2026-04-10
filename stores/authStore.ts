import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, IS_DEMO_MODE } from '@/lib/supabase';
import type { Profile } from '@/types/database';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  initialize: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at'>>) => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  ...initialState,

  initialize: () => {
    if (IS_DEMO_MODE) {
      // In demo mode, don't auto-login — show the auth screen
      set({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      });
      return () => {};
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        });

        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null, isAuthenticated: false });
        }

        set({ isLoading: false, isInitialized: true });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    if (IS_DEMO_MODE) {
      set({
        user: { id: 'demo-user', email } as User,
        session: null,
        profile: {
          id: 'demo-user',
          full_name: email.split('@')[0],
          avatar_url: null,
          currency: 'USD',
          notification_email: true,
          notification_push: true,
          reminder_days_before: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true, error: null });
    if (IS_DEMO_MODE) {
      set({
        user: { id: 'demo-user', email } as User,
        session: null,
        profile: {
          id: 'demo-user',
          full_name: fullName,
          avatar_url: null,
          currency: 'USD',
          notification_email: true,
          notification_push: true,
          reminder_days_before: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isAuthenticated: true,
        isLoading: false,
      });
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
      if (error) throw error;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  signOut: async () => {
    if (IS_DEMO_MODE) {
      set({ ...initialState, isLoading: false, isInitialized: true });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ ...initialState, isLoading: false, isInitialized: true });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  fetchProfile: async () => {
    if (IS_DEMO_MODE) return;
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
    if (IS_DEMO_MODE) {
      const { profile } = get();
      set({ profile: { ...profile!, ...updates, updated_at: new Date().toISOString() } });
      return;
    }

    const { user } = get();
    if (!user) throw new Error('No authenticated user');

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
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
