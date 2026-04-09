import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  Subscription,
  SubscriptionFormData,
  Category,
  FilterState,
  SortOption,
} from '@/types/subscription';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';

// ─── Helpers ────────────────────────────────────────────────────────────────

function applyFilters(
  subscriptions: Subscription[],
  filters: FilterState,
): Subscription[] {
  let result = [...subscriptions];

  // Search filter – case-insensitive partial match on name
  if (filters.search && filters.search.trim() !== '') {
    const term = filters.search.trim().toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(term));
  }

  // Category filter
  if (filters.category_id) {
    result = result.filter((s) => s.category_id === filters.category_id);
  }

  // Active filter – only apply when explicitly set (not undefined/null)
  if (typeof filters.is_active === 'boolean') {
    result = result.filter((s) => s.is_active === filters.is_active);
  }

  return result;
}

function applySort(
  subscriptions: Subscription[],
  sort: SortOption | undefined,
): Subscription[] {
  if (!sort) return subscriptions;

  const sorted = [...subscriptions];

  switch (sort) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'amount_asc':
      sorted.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
      break;
    case 'amount_desc':
      sorted.sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
      break;
    case 'next_billing_date':
      sorted.sort((a, b) => {
        const dateA = a.next_billing_date
          ? new Date(a.next_billing_date).getTime()
          : Infinity;
        const dateB = b.next_billing_date
          ? new Date(b.next_billing_date).getTime()
          : Infinity;
        return dateA - dateB;
      });
      break;
    case 'created_at':
      sorted.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // newest first
      });
      break;
    default:
      break;
  }

  return sorted;
}

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Fetch all subscriptions for the current user with category data,
 * applying active filters and sort from the filter store.
 */
export function useSubscriptions() {
  const user = useAuthStore((s) => s.user);
  const filters = useFilterStore((s) => s.filters);
  const sort = useFilterStore((s) => s.sort);

  return useQuery<Subscription[]>({
    queryKey: ['subscriptions', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!user?.id,
    select: (data) => applySort(applyFilters(data, filters), sort),
  });
}

/**
 * Fetch a single subscription by ID with its category.
 */
export function useSubscription(id: string | undefined) {
  return useQuery<Subscription>({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      if (!id) throw new Error('Subscription ID is required');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    enabled: !!id,
  });
}

// ─── Mutations ──────────────────────────────────────────────────────────────

/**
 * Create a new subscription.
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: async (formData: SubscriptionFormData) => {
      if (!user?.id) throw new Error('User must be authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({ ...formData, user_id: user.id })
        .select('*, category:categories(*)')
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

/**
 * Update an existing subscription.
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data: formData,
    }: {
      id: string;
      data: Partial<SubscriptionFormData>;
    }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(formData)
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({
        queryKey: ['subscriptions', data.id],
      });
    },
  });
}

/**
 * Delete a subscription.
 */
export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

/**
 * Toggle a subscription's is_active status.
 */
export function useToggleSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ is_active })
        .eq('id', id)
        .select('*, category:categories(*)')
        .single();

      if (error) throw error;
      return data as Subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

// ─── Categories ─────────────────────────────────────────────────────────────

/**
 * Fetch all categories available to the user (default + user-created).
 */
export function useCategories() {
  const user = useAuthStore((s) => s.user);

  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .order('name');

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user?.id,
  });
}
