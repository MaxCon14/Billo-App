export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  currency: string;
  notification_enabled: boolean;
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
        Insert: Omit<import('@/types/subscription').Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<import('@/types/subscription').Subscription, 'id' | 'created_at'>>;
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
      plaid_items: {
        Row: import('@/types/plaid').PlaidItem;
        Insert: Omit<import('@/types/plaid').PlaidItem, 'id' | 'created_at'>;
        Update: Partial<Omit<import('@/types/plaid').PlaidItem, 'id' | 'created_at'>>;
      };
    };
  };
}
