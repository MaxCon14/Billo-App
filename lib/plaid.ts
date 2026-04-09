import { PlaidLinkOnSuccessMetadata } from '@/types/plaid';

interface PlaidLinkConfig {
  token: string;
  onSuccess: (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => void;
  onExit: (error: PlaidLinkError | null, metadata: PlaidLinkExitMetadata) => void;
}

interface PlaidLinkError {
  error_code: string;
  error_message: string;
  error_type: string;
  display_message: string | null;
}

interface PlaidLinkExitMetadata {
  status: string | null;
  institution: {
    name: string;
    id: string;
  } | null;
  link_session_id: string;
  request_id: string;
}

/**
 * Create a configuration object for react-native-plaid-link-sdk's PlaidLink component.
 *
 * @param token - The link token obtained from your server via the Plaid API.
 * @param onSuccess - Callback invoked when the user successfully links an account.
 * @param onExit - Callback invoked when the user exits the Plaid Link flow.
 * @returns A PlaidLink configuration object.
 */
export function createPlaidLinkConfig({
  token,
  onSuccess,
  onExit,
}: PlaidLinkConfig) {
  return {
    tokenConfig: {
      token,
      logLevel: __DEV__ ? 'debug' : 'error',
    },
    onSuccess: (success: { publicToken: string; metadata: PlaidLinkOnSuccessMetadata }) => {
      onSuccess(success.publicToken, success.metadata);
    },
    onExit: (exit: { error: PlaidLinkError | null; metadata: PlaidLinkExitMetadata }) => {
      if (exit.error) {
        console.error('Plaid Link exit with error:', exit.error);
      }
      onExit(exit.error, exit.metadata);
    },
  };
}
