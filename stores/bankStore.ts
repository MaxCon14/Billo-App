import { create } from 'zustand';

interface BankStore {
  /** The requisition_id created during the current connect flow */
  pendingRequisitionId: string | null;
  /** Whether a sync is currently in progress */
  isSyncing: boolean;
  /** Number of newly detected subscriptions from last sync */
  newDetectedCount: number;
  setPendingRequisitionId: (id: string | null) => void;
  setIsSyncing: (syncing: boolean) => void;
  setNewDetectedCount: (count: number) => void;
  clearNewDetected: () => void;
}

export const useBankStore = create<BankStore>()((set) => ({
  pendingRequisitionId: null,
  isSyncing: false,
  newDetectedCount: 0,
  setPendingRequisitionId: (id) => set({ pendingRequisitionId: id }),
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setNewDetectedCount: (count) => set({ newDetectedCount: count }),
  clearNewDetected: () => set({ newDetectedCount: 0 }),
}));
