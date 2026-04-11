export type BillingCycle =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'yearly';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  is_default: boolean;
  user_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  billing_day: number;
  next_billing_date: string;
  start_date: string;
  category_id: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  auto_detected: boolean;
  plaid_transaction_id: string | null;
  notes: string | null;
  notify_before_renewal: boolean;
  is_trial: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface SubscriptionFormData {
  name: string;
  amount: number;
  currency: string;
  billing_cycle: BillingCycle;
  billing_day: number | null;
  next_billing_date: string;
  start_date: string | null;
  category_id: string | null;
  logo_url: string | null;
  website_url: string | null;
  notes: string | null;
  notify_before_renewal: boolean;
  is_trial: boolean;
  trial_ends_at: string | null;
}

export type NotificationType =
  | 'renewal_reminder'
  | 'price_change'
  | 'new_detected'
  | 'payment_failed';

export interface Notification {
  id: string;
  user_id: string;
  subscription_id: string | null;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  sent_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  subscription_id: string | null;
  plaid_transaction_id: string | null;
  amount: number;
  date: string;
  merchant_name: string | null;
  created_at: string;
}

export type SortOption =
  | 'name'
  | 'amount_asc'
  | 'amount_desc'
  | 'next_billing'
  | 'created';

export interface FilterState {
  category_id: string | null;
  is_active: boolean | null;
  search: string;
  sort: SortOption;
}
