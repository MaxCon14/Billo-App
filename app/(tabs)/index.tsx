import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";
import type { Subscription } from "@/types/subscription";

export default function DashboardScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const insights = useInsights(subscriptions);

  const currency = profile?.currency ?? "USD";

  const chartData = insights.byCategory.map((item) => ({
    category: item.category.name,
    amount: item.total,
    color: item.category.color,
  }));

  function handleSubscriptionPress(sub: Subscription) {
    router.push(`/subscription/${sub.id}`);
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              SubTracker
            </Text>
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              {profile?.full_name ? `Welcome, ${profile.full_name}` : "Manage your subscriptions"}
            </Text>
          </View>
        </View>

        <SpendingSummary
          totalMonthly={insights.totalMonthly}
          totalYearly={insights.totalYearly}
          currency={currency}
          subscriptionCount={subscriptions?.filter((s) => s.is_active).length ?? 0}
        />

        <QuickActions
          onAddSubscription={() => router.push("/subscription/add")}
          onConnectBank={() => router.push("/plaid/link")}
        />

        <UpcomingRenewals
          subscriptions={insights.upcomingRenewals}
          onSubscriptionPress={handleSubscriptionPress}
          onViewAll={() => router.push("/(tabs)/subscriptions" as never)}
        />

        <SpendingChart data={chartData} />
      </ScrollView>
    </SafeAreaView>
  );
}
