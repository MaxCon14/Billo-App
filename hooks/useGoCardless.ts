import { useCallback } from 'react';
import { Linking } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useBankStore } from '@/stores/bankStore';
import type {
  ConnectedBank,
  DetectedSubscription,
  Institution,
  SyncResult,
} from '@/types/gocardless';

// ─── Institutions Query ─────────────────────────────────────────────────────

export function useInstitutions(country: string) {
  return useQuery<Institution[]>({
    queryKey: ['institutions', country],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<Institution[]>(
        'gocardless-get-institutions',
        { body: { country } }
      );

      if (error) {
        console.error('useInstitutions error:', error);
        throw error;
      }
      if (!Array.isArray(data)) {
        console.error('useInstitutions: unexpected response shape', data);
        throw new Error('Unexpected response from gocardless-get-institutions');
      }
      return data;
    },
    enabled: !!country && country.length === 2,
    staleTime: 1000 * 60 * 30, // Cache institutions for 30 min
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

// ─── Create Requisition (Connect Bank) ──────────────────────────────────────

export function useCreateRequisition() {
  const queryClient = useQueryClient();
  const setPendingRequisitionId = useBankStore((s) => s.setPendingRequisitionId);

  return useMutation({
    mutationFn: async (institution: {
      id: string;
      name: string;
      logo?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        'gocardless-create-requisition',
        {
          body: {
            institution_id: institution.id,
            institution_name: institution.name,
            institution_logo: institution.logo,
          },
        }
      );

      if (error) throw error;
      return data as { link: string; requisition_id: string };
    },
    onSuccess: async (data) => {
      setPendingRequisitionId(data.requisition_id);
      queryClient.invalidateQueries({ queryKey: ['connected-banks'] });
      // Open the bank authorization in system browser
      await Linking.openURL(data.link);
    },
  });
}

// ─── Sync Transactions ──────────────────────────────────────────────────────

export function useSyncTransactions() {
  const queryClient = useQueryClient();
  const setIsSyncing = useBankStore((s) => s.setIsSyncing);
  const setNewDetectedCount = useBankStore((s) => s.setNewDetectedCount);

  return useMutation({
    mutationFn: async (requisitionId: string) => {
      setIsSyncing(true);
      const { data, error } = await supabase.functions.invoke(
        'gocardless-sync-transactions',
        { body: { requisition_id: requisitionId } }
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

// ─── Accept / Ignore Detected Subscription ──────────────────────────────────

export function useAcceptDetected() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (detected: DetectedSubscription) => {
      if (!user?.id) throw new Error('User must be authenticated');

      // Create the subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name: detected.name,
          amount: detected.amount,
          currency: detected.currency,
          billing_cycle: detected.billing_cycle || 'monthly',
          next_billing_date: detected.next_billing_date || new Date().toISOString().split('T')[0],
          is_active: true,
          auto_detected: true,
        } as any);

      if (subError) throw subError;

      // Mark as added
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
      // Delete associated transactions first (cascade should handle it, but be explicit)
      await supabase
        .from('bank_transactions')
        .delete()
        .eq('bank_id', bankId);

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

// ─── Auto-sync Hook ─────────────────────────────────────────────────────────

/**
 * Checks connected banks on mount and syncs any that haven't been synced
 * in the last 24 hours.
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
      const lastSync = bank.last_synced_at ? new Date(bank.last_synced_at) : new Date(0);
      if (lastSync < oneDayAgo && bank.requisition_id) {
        sync.mutate(bank.requisition_id);
        break; // Only sync one at a time to avoid overwhelming
      }
    }
  }, [user?.id, sync]);

  return runAutoSync;
}
