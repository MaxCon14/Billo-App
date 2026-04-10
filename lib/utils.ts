import { BillingCycle } from '@/types/subscription';

/**
 * Format a numeric amount as a currency string using Intl.NumberFormat.
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}

/**
 * Format a date string or Date object into a human-readable string.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculate the next billing date based on the current date and billing cycle.
 */
export function getNextBillingDate(
  currentDate: Date,
  billingCycle: BillingCycle
): Date {
  const next = new Date(currentDate);

  switch (billingCycle) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'semi_annual':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
}

/**
 * Get the number of days from today until the given date.
 * Returns a negative number if the date is in the past.
 */
export function getDaysUntil(date: string | Date): number {
  const target = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // Reset times to midnight for accurate day calculation
  const targetMidnight = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffMs = targetMidnight.getTime() - nowMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Normalize a subscription amount to its monthly equivalent.
 */
export function getMonthlyAmount(
  amount: number,
  billingCycle: BillingCycle
): number {
  switch (billingCycle) {
    case 'weekly':
      return (amount * 52) / 12;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'semi_annual':
      return amount / 6;
    case 'yearly':
      return amount / 12;
  }
}

/**
 * Normalize a subscription amount to its yearly equivalent.
 */
export function getYearlyAmount(
  amount: number,
  billingCycle: BillingCycle
): number {
  switch (billingCycle) {
    case 'weekly':
      return amount * 52;
    case 'monthly':
      return amount * 12;
    case 'quarterly':
      return amount * 4;
    case 'semi_annual':
      return amount * 2;
    case 'yearly':
      return amount;
  }
}
