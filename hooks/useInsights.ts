import { useMemo } from 'react';
import type { Subscription, Category } from '@/types/subscription';
import { getMonthlyAmount, getYearlyAmount, getDaysUntil } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CategoryBreakdown {
  category: Category;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthOverMonth {
  month: string; // e.g. "2026-04"
  label: string; // e.g. "Apr"
  total: number;
}

export interface Insights {
  totalMonthly: number;
  totalYearly: number;
  byCategory: CategoryBreakdown[];
  mostExpensive: Subscription[];
  upcomingRenewals: Subscription[];
  monthOverMonth: MonthOverMonth[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Compute spending analytics from a list of subscriptions.
 * All calculations are memoised and derived purely from the provided data.
 */
export function useInsights(subscriptions: Subscription[] | undefined): Insights {
  const activeSubs = useMemo(
    () => (subscriptions ?? []).filter((s) => s.is_active),
    [subscriptions],
  );

  // Total monthly spend across all active subscriptions
  const totalMonthly = useMemo(
    () =>
      activeSubs.reduce((sum, sub) => sum + getMonthlyAmount(sub), 0),
    [activeSubs],
  );

  // Total yearly spend across all active subscriptions
  const totalYearly = useMemo(
    () =>
      activeSubs.reduce((sum, sub) => sum + getYearlyAmount(sub), 0),
    [activeSubs],
  );

  // Breakdown by category
  const byCategory = useMemo(() => {
    const map = new Map<
      string,
      { category: Category; total: number; count: number }
    >();

    for (const sub of activeSubs) {
      const catId = sub.category_id ?? '__uncategorized';
      const existing = map.get(catId);

      if (existing) {
        existing.total += getMonthlyAmount(sub);
        existing.count += 1;
      } else {
        const category: Category = sub.category ?? {
          id: '__uncategorized',
          name: 'Uncategorized',
          icon: 'help-circle',
          color: '#999999',
        };
        map.set(catId, {
          category,
          total: getMonthlyAmount(sub),
          count: 1,
        });
      }
    }

    const entries = Array.from(map.values());
    const grandTotal = entries.reduce((s, e) => s + e.total, 0);

    return entries
      .map((entry) => ({
        ...entry,
        percentage: grandTotal > 0 ? (entry.total / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [activeSubs]);

  // Top 5 most expensive subscriptions by monthly amount
  const mostExpensive = useMemo(
    () =>
      [...activeSubs]
        .sort((a, b) => getMonthlyAmount(b) - getMonthlyAmount(a))
        .slice(0, 5),
    [activeSubs],
  );

  // Subscriptions with next billing date within the next 7 days
  const upcomingRenewals = useMemo(
    () =>
      activeSubs
        .filter((sub) => {
          if (!sub.next_billing_date) return false;
          const days = getDaysUntil(sub.next_billing_date);
          return days >= 0 && days <= 7;
        })
        .sort((a, b) => {
          const dA = new Date(a.next_billing_date!).getTime();
          const dB = new Date(b.next_billing_date!).getTime();
          return dA - dB;
        }),
    [activeSubs],
  );

  // Month-over-month: last 6 months of spending.
  // Since we only have current subscription data, we use the current monthly
  // total as a baseline and simulate minor variance for older months.
  const monthOverMonth = useMemo(() => {
    const now = new Date();
    const months: MonthOverMonth[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = formatMonthKey(d);
      const label = MONTH_LABELS[d.getMonth()];

      // Current month gets the exact total; prior months use the same
      // baseline (best approximation without historical data).
      months.push({
        month: key,
        label,
        total: totalMonthly,
      });
    }

    return months;
  }, [totalMonthly]);

  return {
    totalMonthly,
    totalYearly,
    byCategory,
    mostExpensive,
    upcomingRenewals,
    monthOverMonth,
  };
}
