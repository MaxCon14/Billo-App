import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBankStore } from '@/stores/bankStore';
import type {
  ConnectedBank,
  DetectedSubscription,
  Provider,
  SyncResult,
} from '@/types/truelayer';

// ─── Providers Query ────────────────────────────────────────────────────────

/**
 * Fetches the TrueLayer provider catalogue for a given country.
 *
 * `tlCode` is the TrueLayer lowercase country code (e.g. "uk", "fr"),
 * *not* the ISO alpha-2. The SUPPORTED_COUNTRIES list holds both.
 */
export function useProviders(tlCode: string) {
  return useQuery<Provider[]>({
    queryKey: ['tl-providers', tlCode],
    queryFn: async () => {
      const session = (await supabase.auth.getSession()).data.session;
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

      const res = await fetch(
        `${supabaseUrl}/functions/v1/truelayer-get-providers?country=${tlCode}`,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token ?? anonKey}`,
            apikey: anonKey,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error('useProviders error:', res.status, text);
        throw new Error(`Failed to fetch providers (${res.status})`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('useProviders unexpected shape:', data);
        return [];
      }
      return data as Provider[];
    },
    enabled: !!tlCode,
    staleTime: 1000 * 60 * 30,
  });
}

// ─── Connected Banks ────────────────────────────────────────────────────────

export function useConnectedBanks() {
  const user = useAuthStore((s) => s.user);

  return useQuery<ConnectedBank[]>({
    queryKey: ['connected-banks'],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('connected_banks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ConnectedBank[];
    },
    enabled: !!user?.id,
  });
}

// ─── Create Auth Link (Connect Bank) ────────────────────────────────────────

/**
 * Kicks off the TrueLayer OAuth flow: asks the edge function for an
 * authorize URL (with a pending-auth row created server-side) and opens
 * it in the system browser. The user returns via the deep link
 * `subtracker://bank-connected?bank_id=...`.
 */
export function useConnectBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: {
      id: string;
      name: string;
      logo?: string | null;
      country?: string | null;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        'truelayer-create-auth-link',
        {
          body: {
            provider_id: provider.id,
            provider_name: provider.name,
            provider_logo: provider.logo ?? null,
            provider_country: provider.country ?? null,
          },
        }
      );
      if (error) throw error;
      return data as { url: string; state: string };
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] });
      await Linking.openURL(data.url);
    },
  });
}

// ─── Sync Transactions ──────────────────────────────────────────────────────

export function useSyncTransactions() {
  const queryClient = useQueryClient();
  const setIsSyncing = useBankStore((s) => s.setIsSyncing);
  const setNewDetectedCount = useBankStore((s) => s.setNewDetectedCount);

  return useMutation({
    mutationFn: async (bankId: string) => {
      setIsSyncing(true);
      const { data, error } = await supabase.functions.invoke(
        'truelayer-sync-transactions',
        { body: { bank_id: bankId } }
      );
      if (error) throw error;
      return data as SyncResult;
    },
    onSuccess: (data) => {
      setIsSyncing(false);
      setNewDetectedCount(data.subscriptions_detected);
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] });
      queryClient.invalidateQueries({ queryKey: ['detected-subscriptions'] });
    },
    onError: () => {
      setIsSyncing(false);
    },
  });
}

// ─── Detected Subscriptions ─────────────────────────────────────────────────

export function useDetectedSubscriptions() {
  const user = useAuthStore((s) => s.user);

  return useQuery<DetectedSubscription[]>({
    queryKey: ['detected-subscriptions'],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('detected_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('amount', { ascending: false });
      if (error) throw error;
      return data as DetectedSubscription[];
    },
    enabled: !!user?.id,
  });
}

export function useAcceptDetected() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (detected: DetectedSubscription) => {
      if (!user?.id) throw new Error('User must be authenticated');
      const { error: subError } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        name: detected.name,
        amount: detected.amount,
        currency: detected.currency,
        billing_cycle: detected.billing_cycle || 'monthly',
        next_billing_date:
          detected.next_billing_date || new Date().toISOString().split('T')[0],
        is_active: true,
        auto_detected: true,
      } as any);
      if (subError) throw subError;

      const { error: updateError } = await supabase
        .from('detected_subscriptions')
        .update({ status: 'added' } as any)
        .eq('id', detected.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detected-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export function useIgnoreDetected() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('detected_subscriptions')
        .update({ status: 'ignored' } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detected-subscriptions'] });
    },
  });
}

// ─── Disconnect Bank ────────────────────────────────────────────────────────

export function useDisconnectBank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bankId: string) => {
      await supabase.from('bank_transactions').delete().eq('bank_id', bankId);
      await supabase
        .from('detected_subscriptions')
        .delete()
        .eq('bank_id', bankId);
      const { error } = await supabase
        .from('connected_banks')
        .delete()
        .eq('id', bankId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] });
      queryClient.invalidateQueries({ queryKey: ['detected-subscriptions'] });
    },
  });
}

// ─── Auto-sync ──────────────────────────────────────────────────────────────

/**
 * Syncs any active bank that hasn't been synced in the last 24 hours.
 * Runs one sync at a time to avoid flooding the edge function.
 */
export function useAutoSync() {
  const user = useAuthStore((s) => s.user);
  const sync = useSyncTransactions();

  const runAutoSync = useCallback(async () => {
    if (!user?.id) return;
    const { data: banks } = await supabase
      .from('connected_banks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');
    if (!banks || banks.length === 0) return;

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    for (const bank of banks) {
      const lastSync = bank.last_synced_at
        ? new Date(bank.last_synced_at)
        : new Date(0);
      if (lastSync < oneDayAgo) {
        sync.mutate(bank.id);
        break;
      }
    }
  }, [user?.id, sync]);

  return runAutoSync;
}
