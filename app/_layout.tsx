import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";
import { IS_DEMO_MODE } from "@/lib/supabase";
import { colors, darkColors } from "@/lib/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: IS_DEMO_MODE ? 0 : 2,
    },
  },
});

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
        </AuthGuard>
      </ToastProvider>
    </QueryClientProvider>
  );
}
