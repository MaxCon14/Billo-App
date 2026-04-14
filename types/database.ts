export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  notification_email: boolean;
  notification_push: boolean;
  reminder_days_before: number;
  biometric_lock_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      subscriptions: {
        Row: import('@/types/subscription').Subscription;
        Insert: Omit<import('@/types/subscription').Subscription, 'id' | 'created_at' | 'updated_at' | 'category'>;
        Update: Partial<Omit<import('@/types/subscription').Subscription, 'id' | 'created_at' | 'category'>>;
      };
      categories: {
        Row: import('@/types/subscription').Category;
        Insert: Omit<import('@/types/subscription').Category, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/subscription').Category, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: import('@/types/subscription').Notification;
        Insert: Omit<import('@/types/subscription').Notification, 'id'>;
        Update: Partial<Omit<import('@/types/subscription').Notification, 'id'>>;
      };
      transactions: {
        Row: import('@/types/subscription').Transaction;
        Insert: Omit<import('@/types/subscription').Transaction, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/subscription').Transaction, 'id' | 'created_at'>>;
      };
      connected_banks: {
        Row: import('@/types/truelayer').ConnectedBank;
        Insert: Omit<import('@/types/truelayer').ConnectedBank, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/truelayer').ConnectedBank, 'id' | 'created_at'>>;
      };
      bank_transactions: {
        Row: import('@/types/truelayer').BankTransaction;
        Insert: Omit<import('@/types/truelayer').BankTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/truelayer').BankTransaction, 'id' | 'created_at'>>;
      };
      detected_subscriptions: {
        Row: import('@/types/truelayer').DetectedSubscription;
        Insert: Omit<import('@/types/truelayer').DetectedSubscription, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/truelayer').DetectedSubscription, 'id' | 'created_at'>>;
      };
      truelayer_pending_auths: {
        Row: {
          state: string;
          user_id: string;
          provider_id: string;
          provider_name: string;
          provider_logo: string | null;
          provider_country: string | null;
          created_at: string;
        };
        Insert: {
          state?: string;
          user_id: string;
          provider_id: string;
          provider_name: string;
          provider_logo?: string | null;
          provider_country?: string | null;
          created_at?: string;
        };
        Update: Partial<{
          state: string;
          user_id: string;
          provider_id: string;
          provider_name: string;
          provider_logo: string | null;
          provider_country: string | null;
          created_at: string;
        }>;
      };
    };
  };
}
