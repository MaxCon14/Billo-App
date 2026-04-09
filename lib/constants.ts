import { BillingCycle } from '@/types/subscription';

export const BILLING_CYCLES: Array<{
  value: BillingCycle;
  label: string;
  shortLabel: string;
}> = [
  { value: 'weekly', label: 'Weekly', shortLabel: 'Wk' },
  { value: 'monthly', label: 'Monthly', shortLabel: 'Mo' },
  { value: 'quarterly', label: 'Quarterly', shortLabel: 'Qt' },
  { value: 'semi_annual', label: 'Semi-Annual', shortLabel: '6Mo' },
  { value: 'yearly', label: 'Yearly', shortLabel: 'Yr' },
];

export const DEFAULT_CATEGORIES: Array<{
  name: string;
  color: string;
  icon: string;
}> = [
  { name: 'Streaming', color: '#E50914', icon: 'tv' },
  { name: 'Music', color: '#1DB954', icon: 'music' },
  { name: 'Gaming', color: '#9147FF', icon: 'gamepad-2' },
  { name: 'Productivity', color: '#0078D4', icon: 'briefcase' },
  { name: 'Cloud Storage', color: '#4285F4', icon: 'cloud' },
  { name: 'News & Reading', color: '#FF6600', icon: 'newspaper' },
  { name: 'Fitness', color: '#FF2D55', icon: 'dumbbell' },
  { name: 'Finance', color: '#34C759', icon: 'wallet' },
  { name: 'Other', color: '#8E8E93', icon: 'grid' },
];

export const CURRENCIES: Array<{
  code: string;
  symbol: string;
  name: string;
}> = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
  { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
];

export const REMINDER_OPTIONS: Array<{
  value: number;
  label: string;
}> = [
  { value: 1, label: '1 day before' },
  { value: 2, label: '2 days before' },
  { value: 3, label: '3 days before' },
  { value: 5, label: '5 days before' },
  { value: 7, label: '7 days before' },
];
