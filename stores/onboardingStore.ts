import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingSteps {
  welcome: boolean;
  addFirst: boolean;
  connectBank: boolean;
  notifications: boolean;
}

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  steps: OnboardingSteps;
}

interface OnboardingActions {
  completeStep: (step: keyof OnboardingSteps) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
}

const initialState: OnboardingState = {
  hasCompletedOnboarding: false,
  currentStep: 0,
  steps: {
    welcome: false,
    addFirst: false,
    connectBank: false,
    notifications: false,
  },
};

const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      completeStep: (step: keyof OnboardingSteps) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [step]: true,
          },
        }));
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 3),
        }));
      },

      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        }));
      },

      skipOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'subtracker-onboarding',
      storage: createJSONStorage(() => asyncStorageAdapter),
    }
  )
);
