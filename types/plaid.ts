export interface PlaidItem {
  id: string;
  user_id: string;
  plaid_item_id: string;
  plaid_access_token: string;
  institution_name: string | null;
  institution_id: string | null;
  status: string;
  last_synced_at: string | null;
  created_at: string;
}

export interface PlaidLinkOnSuccessMetadata {
  institution: {
    name: string;
    id: string;
  } | null;
  accounts: Array<{
    id: string;
    name: string;
    mask: string | null;
    type: string;
    subtype: string | null;
  }>;
  link_session_id: string;
}

export interface PlaidTransaction {
  transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
  category: string[];
  pending: boolean;
}
