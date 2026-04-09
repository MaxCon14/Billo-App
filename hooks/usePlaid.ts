import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { PlaidItem } from '@/types/plaid';

// ─── Plaid Link ─────────────────────────────────────────────────────────────

interface PlaidLinkSuccessMetadata {
  institution?: {
    name: string;
    institution_id: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    mask: string | null;
    type: string;
    subtype: string;
  }>;
  link_session_id: string;
  public_token: string;
}

/**
 * Manages the full Plaid Link flow:
 * 1. Create a link token via Supabase edge function
 * 2. Handle onSuccess callback to persist the plaid item
 */
export function usePlaidLink() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const createLinkToken = useCallback(async () => {
    if (!user?.id) throw new Error('User must be authenticated');

    setIsReady(false);

    const { data, error } = await supabase.functions.invoke(
      'create-link-token',
      {
        body: { user_id: user.id },
      },
    );

    if (error) throw error;

    const token = data?.link_token;
    if (!token) throw new Error('No link token returned');

    setLinkToken(token);
    setIsReady(true);

    return token;
  }, [user?.id]);

  const onSuccess = useCallback(
    async (metadata: PlaidLinkSuccessMetadata) => {
      if (!user?.id) throw new Error('User must be authenticated');

      const { error } = await supabase.from('plaid_items').insert({
        user_id: user.id,
        public_token: metadata.public_token,
        institution_id: metadata.institution?.institution_id ?? null,
        institution_name: metadata.institution?.name ?? null,
        link_session_id: metadata.link_session_id,
        accounts: metadata.accounts,
      });

      if (error) throw error;

      // Reset state after successful save
      setLinkToken(null);
      setIsReady(false);

      // Refresh plaid items list
      queryClient.invalidateQueries({ queryKey: ['plaid-items'] });
    },
    [user?.id, queryClient],
  );

  return {
    linkToken,
    isReady,
    createLinkToken,
    onSuccess,
  };
}

// ─── Plaid Items Query ──────────────────────────────────────────────────────

/**
 * Fetch all Plaid items for the current user.
 */
export function usePlaidItems() {
  const user = useAuthStore((s) => s.user);

  return useQuery<PlaidItem[]>({
    queryKey: ['plaid-items'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('plaid_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PlaidItem[];
    },
    enabled: !!user?.id,
  });
}

// ─── Remove Plaid Item ──────────────────────────────────────────────────────

/**
 * Remove a Plaid item (unlink institution).
 */
export function useRemovePlaidItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('plaid_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-items'] });
    },
  });
}
