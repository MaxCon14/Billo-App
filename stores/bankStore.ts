import { create } from 'zustand';

interface BankStore {
  /** Whether a sync is currently in progress */
  isSyncing: boolean;
  /** Number of newly detected subscriptions from last sync */
  newDetectedCount: number;
  setIsSyncing: (syncing: boolean) => void;
  setNewDetectedCount: (count: number) => void;
  clearNewDetected: () => void;
}

export const useBankStore = create<BankStore>()((set) => ({
  isSyncing: false,
  newDetectedCount: 0,
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setNewDetectedCount: (count) => set({ newDetectedCount: count }),
  clearNewDetected: () => set({ newDetectedCount: 0 }),
}));
