import type { Subscription, Category } from "@/types/subscription";

export const SAMPLE_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Streaming", color: "#E24B4A", icon: "tv", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-2", name: "Music", color: "#7F77DD", icon: "music", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-3", name: "Gaming", color: "#639922", icon: "gamepad-2", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-4", name: "Productivity", color: "#378ADD", icon: "briefcase", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-5", name: "Cloud Storage", color: "#1D9E75", icon: "cloud", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-6", name: "News & Reading", color: "#D85A30", icon: "newspaper", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-7", name: "Fitness", color: "#D4537E", icon: "dumbbell", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-8", name: "Finance", color: "#BA7517", icon: "wallet", is_default: true, user_id: null, created_at: "2024-01-01" },
  { id: "cat-9", name: "Other", color: "#888780", icon: "package", is_default: true, user_id: null, created_at: "2024-01-01" },
];

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

export const SAMPLE_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-1", user_id: "user-1", name: "Netflix", description: "Premium plan", amount: 22.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 15, next_billing_date: futureDate(3),
    start_date: "2023-06-15", category_id: "cat-1", logo_url: null, website_url: "https://netflix.com",
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2023-06-15", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[0],
  },
  {
    id: "sub-2", user_id: "user-1", name: "Spotify", description: "Family plan", amount: 16.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 1, next_billing_date: futureDate(5),
    start_date: "2023-03-01", category_id: "cat-2", logo_url: null, website_url: "https://spotify.com",
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2023-03-01", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[1],
  },
  {
    id: "sub-3", user_id: "user-1", name: "iCloud+", description: "200GB storage", amount: 2.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 10, next_billing_date: futureDate(12),
    start_date: "2022-01-10", category_id: "cat-5", logo_url: null, website_url: null,
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2022-01-10", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[4],
  },
  {
    id: "sub-4", user_id: "user-1", name: "ChatGPT Plus", description: null, amount: 20.00,
    currency: "USD", billing_cycle: "monthly", billing_day: 20, next_billing_date: futureDate(1),
    start_date: "2023-11-20", category_id: "cat-4", logo_url: null, website_url: "https://openai.com",
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: "May cancel after trial",
    notify_before_renewal: true, created_at: "2023-11-20", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[3],
  },
  {
    id: "sub-5", user_id: "user-1", name: "Xbox Game Pass", description: "Ultimate", amount: 17.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 5, next_billing_date: futureDate(8),
    start_date: "2023-08-05", category_id: "cat-3", logo_url: null, website_url: null,
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2023-08-05", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[2],
  },
  {
    id: "sub-6", user_id: "user-1", name: "NYT Digital", description: "All access", amount: 25.00,
    currency: "USD", billing_cycle: "monthly", billing_day: 18, next_billing_date: futureDate(15),
    start_date: "2024-01-18", category_id: "cat-6", logo_url: null, website_url: "https://nytimes.com",
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2024-01-18", updated_at: "2024-01-18",
    category: SAMPLE_CATEGORIES[5],
  },
  {
    id: "sub-7", user_id: "user-1", name: "Peloton", description: "App membership", amount: 13.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 22, next_billing_date: futureDate(20),
    start_date: "2023-09-22", category_id: "cat-7", logo_url: null, website_url: null,
    is_active: true, auto_detected: false, plaid_transaction_id: null, notes: null,
    notify_before_renewal: true, created_at: "2023-09-22", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[6],
  },
  {
    id: "sub-8", user_id: "user-1", name: "YouTube Premium", description: null, amount: 13.99,
    currency: "USD", billing_cycle: "monthly", billing_day: 8, next_billing_date: futureDate(25),
    start_date: "2023-04-08", category_id: "cat-1", logo_url: null, website_url: null,
    is_active: false, auto_detected: false, plaid_transaction_id: null, notes: "Paused for now",
    notify_before_renewal: false, created_at: "2023-04-08", updated_at: "2024-01-01",
    category: SAMPLE_CATEGORIES[0],
  },
];
