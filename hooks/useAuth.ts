import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Primary auth hook – returns all state and actions from the Zustand auth store.
 * Automatically calls initialize() on first mount so auth listeners are set up.
 */
export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // initialize() is idempotent — module-level flag prevents duplicate listeners
    store.initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user: store.user,
    session: store.session,
    profile: store.profile,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    error: store.error,
    initialize: store.initialize,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    signInWithGoogle: store.signInWithGoogle,
    signInWithApple: store.signInWithApple,
    resetPassword: store.resetPassword,
    updateProfile: store.updateProfile,
  };
}

/**
 * Lightweight hook that returns only session information.
 */
export function useSession() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  return { session, isLoading };
}

/**
 * Lightweight hook that returns only the current user object.
 */
export function useUser() {
  const user = useAuthStore((s) => s.user);
  return user;
}
