import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ui/toast";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
            name="plaid/link"
            options={{
              headerShown: true,
              title: "Connect Bank",
              headerTintColor: "#0D9488",
              presentation: "modal",
            }}
          />
        </Stack>
      </ToastProvider>
    </QueryClientProvider>
  );
}
