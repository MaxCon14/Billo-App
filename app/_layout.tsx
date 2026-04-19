import React, { useEffect, useCallback, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, AppState, View } from "react-native";
import * as Linking from "expo-linking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts, Syne_400Regular, Syne_600SemiBold, Syne_700Bold, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import * as SplashScreen from "expo-splash-screen";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/lib/theme";
import { BiometricLockScreen } from "@/components/BiometricLockScreen";
import { useBiometricStore } from "@/stores/biometricStore";
import { useSyncTransactions } from "@/hooks/useTrueLayer";
import * as LocalAuthentication from "expo-local-authentication";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const GRACE_PERIOD_MS = 30_000;

function BiometricGate({ children }: { children: React.ReactNode }) {
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const { isLocked, setLocked, setLastBackgroundTime } = useBiometricStore();
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
        promptMessage: "Unlock Billo",
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

  useEffect(() => {
    if (!user || !biometricEnabled || hasPromptedOnMount.current) return;
    hasPromptedOnMount.current = true;
    authenticate();
  }, [user, biometricEnabled, authenticate]);

  useEffect(() => {
    if (!biometricEnabled) {
      setLocked(false);
      hasPromptedOnMount.current = false;
    } else if (user && !hasPromptedOnMount.current) {
      setLocked(true);
    }
  }, [biometricEnabled, user, setLocked]);

  useEffect(() => {
    if (!biometricEnabled || !user) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current === "active" && nextState.match(/inactive|background/)) {
        setLastBackgroundTime(Date.now());
      }

      if (appState.current.match(/inactive|background/) && nextState === "active") {
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

  if (!biometricEnabled || !user) {
    return <>{children}</>;
  }

  if (isLocked) {
    return <BiometricLockScreen onUnlock={authenticate} />;
  }

  return <>{children}</>;
}

function BankDeepLinkHandler() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const syncMutation = useSyncTransactions();

  const handleUrl = useCallback(
    (url: string) => {
      if (!user) return;
      const parsed = Linking.parse(url);
      if (parsed.hostname !== "bank-connected" && !url.includes("bank-connected")) return;

      const bankId = parsed.queryParams?.bank_id;
      const error = parsed.queryParams?.error;

      if (error || typeof bankId !== "string" || !bankId) {
        if (error) console.error("Bank connect error:", error);
        return;
      }

      syncMutation.mutate(bankId, {
        onSuccess: () => {
          router.push("/bank/review");
        },
        onError: () => {
          router.push("/bank/review");
        },
      });
    },
    [user, router, syncMutation]
  );

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => handleUrl(url));

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, [handleUrl]);

  return null;
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent.yellow} />
      </View>
    );
  }

  return <>{children}</>;
}

const headerStyle = {
  backgroundColor: colors.background,
};

const headerTitleStyle = {
  fontFamily: "Syne_700Bold",
  fontWeight: "600" as const,
  fontSize: 17,
  color: colors.foreground,
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_600SemiBold,
    Syne_700Bold,
    Syne_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StatusBar style="light" />
        <AuthGuard>
          <BiometricGate>
            <BankDeepLinkHandler />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
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
                  headerTintColor: colors.foreground,
                  headerStyle,
                  headerTitleStyle,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="subscription/add"
                options={{
                  headerShown: true,
                  title: "Add Subscription",
                  headerTintColor: colors.foreground,
                  presentation: "modal",
                  headerStyle,
                  headerTitleStyle,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="subscription/edit"
                options={{
                  headerShown: true,
                  title: "Edit Subscription",
                  headerTintColor: colors.foreground,
                  presentation: "modal",
                  headerStyle,
                  headerTitleStyle,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="bank/connect"
                options={{
                  headerShown: true,
                  title: "Connect Bank",
                  headerTintColor: colors.foreground,
                  presentation: "modal",
                  headerStyle,
                  headerTitleStyle,
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="bank/review"
                options={{
                  headerShown: true,
                  title: "Review Subscriptions",
                  headerTintColor: colors.foreground,
                  presentation: "modal",
                  headerStyle,
                  headerTitleStyle,
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
