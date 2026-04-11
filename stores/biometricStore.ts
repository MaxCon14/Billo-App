import { create } from "zustand";

interface BiometricState {
  isLocked: boolean;
  lastBackgroundTime: number | null;
  setLocked: (locked: boolean) => void;
  setLastBackgroundTime: (time: number | null) => void;
}

export const useBiometricStore = create<BiometricState>()((set) => ({
  isLocked: true,
  lastBackgroundTime: null,
  setLocked: (locked) => set({ isLocked: locked }),
  setLastBackgroundTime: (time) => set({ lastBackgroundTime: time }),
}));
