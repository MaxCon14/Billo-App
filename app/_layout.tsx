import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui/toast";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
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
      <View className="flex-1 items-center justify-center bg-surface-50 dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#0D9488" />
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
                backgroundColor: colorScheme === "dark" ? "#0C0A09" : "#FAFAF9",
              },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="subscription/[id]"
              options={{
                headerShown: true,
                title: "Subscription Details",
                headerTintColor: "#0D9488",
              }}
            />
            <Stack.Screen
              name="subscription/add"
              options={{
                headerShown: true,
                title: "Add Subscription",
                headerTintColor: "#0D9488",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="subscription/edit"
              options={{
                headerShown: true,
                title: "Edit Subscription",
                headerTintColor: "#0D9488",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="plaid/link"
              options={{
                headerShown: true,
                title: "Connect Bank",
                headerTintColor: "#0D9488",
                presentation: "modal",
              }}
            />
          </Stack>
        </AuthGuard>
      </ToastProvider>
    </QueryClientProvider>
  );
}
