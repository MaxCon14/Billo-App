import React, { useEffect, useCallback, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, AppState, View, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { colors, darkColors } from "@/lib/theme";
import { BiometricLockScreen } from "@/components/BiometricLockScreen";
import { useBiometricStore } from "@/stores/biometricStore";
import * as LocalAuthentication from "expo-local-authentication";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const GRACE_PERIOD_MS = 30_000; // 30 seconds

function BiometricGate({ children }: { children: React.ReactNode }) {
  // Use store directly to avoid creating a second useAuth() instance
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const { isLocked, lastBackgroundTime, setLocked, setLastBackgroundTime } = useBiometricStore();
  const appState = useRef(AppState.currentState);
  const hasPromptedOnMount = useRef(false);

  const biometricEnabled = profile?.biometric_lock_enabled ?? false;

  const authenticate = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        setLocked(false);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock SubTracker",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setLocked(false);
      }
    } catch {
      // Keep locked on error
    }
  }, [setLocked]);

  // Prompt on cold launch
  useEffect(() => {
    if (!user || !biometricEnabled || hasPromptedOnMount.current) return;
    hasPromptedOnMount.current = true;
    authenticate();
  }, [user, biometricEnabled, authenticate]);

  // Reset lock state when biometric is disabled
  useEffect(() => {
    if (!biometricEnabled) {
      setLocked(false);
      hasPromptedOnMount.current = false;
    } else if (user && !hasPromptedOnMount.current) {
      setLocked(true);
    }
  }, [biometricEnabled, user, setLocked]);

  // AppState listener: lock on background, unlock check on foreground
  useEffect(() => {
    if (!biometricEnabled || !user) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current === "active" && nextState.match(/inactive|background/)) {
        // Going to background - record timestamp
        setLastBackgroundTime(Date.now());
      }

      if (appState.current.match(/inactive|background/) && nextState === "active") {
        // Coming back to foreground - check grace period
        const bg = useBiometricStore.getState().lastBackgroundTime;
        if (bg && Date.now() - bg > GRACE_PERIOD_MS) {
          setLocked(true);
          authenticate();
        }
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [biometricEnabled, user, authenticate, setLastBackgroundTime, setLocked]);

  // If biometric is not enabled or user is not logged in, don't gate
  if (!biometricEnabled || !user) {
    return <>{children}</>;
  }

  if (isLocked) {
    return <BiometricLockScreen onUnlock={authenticate} />;
  }

  return <>{children}</>;
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.stone[50] }}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <AuthGuard>
          <BiometricGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colorScheme === "dark" ? darkColors.bg : colors.stone[50],
                },
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="subscription/[id]"
                options={{
                  headerShown: true,
                  title: "Subscription Details",
                  headerTintColor: colors.primary[600],
                  headerStyle: {
                    backgroundColor: colorScheme === "dark" ? darkColors.bg : colors.stone[50],
                  },
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontSize: 17,
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="subscription/add"
                options={{
                  headerShown: true,
                  title: "Add Subscription",
                  headerTintColor: colors.primary[600],
                  presentation: "modal",
                  headerStyle: {
                    backgroundColor: colorScheme === "dark" ? darkColors.bg : colors.stone[50],
                  },
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontSize: 17,
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="subscription/edit"
                options={{
                  headerShown: true,
                  title: "Edit Subscription",
                  headerTintColor: colors.primary[600],
                  presentation: "modal",
                  headerStyle: {
                    backgroundColor: colorScheme === "dark" ? darkColors.bg : colors.stone[50],
                  },
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontSize: 17,
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="plaid/link"
                options={{
                  headerShown: true,
                  title: "Connect Bank",
                  headerTintColor: colors.primary[600],
                  presentation: "modal",
                  headerStyle: {
                    backgroundColor: colorScheme === "dark" ? darkColors.bg : colors.stone[50],
                  },
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontSize: 17,
                  },
                  headerShadowVisible: false,
                }}
              />
            </Stack>
          </BiometricGate>
        </AuthGuard>
      </ToastProvider>
    </QueryClientProvider>
  );
}
