import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpendingByCategory } from "@/components/insights/SpendingByCategory";
import { SpendingTrend } from "@/components/insights/SpendingTrend";
import { MostExpensive } from "@/components/insights/MostExpensive";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";

export default function InsightsScreen() {
  const { profile } = useAuth();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const insights = useInsights(subscriptions);
  const currency = profile?.currency ?? "USD";

  const trendData = insights.monthOverMonth.map((m) => ({
    month: m.label,
    amount: m.total,
  }));

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
        <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Insights
        </Text>

        <SpendingSummary
          totalMonthly={insights.totalMonthly}
          totalYearly={insights.totalYearly}
          currency={currency}
          subscriptionCount={subscriptions?.filter((s) => s.is_active).length ?? 0}
        />

        <SpendingByCategory data={insights.byCategory} />
        <SpendingTrend data={trendData} />
        <MostExpensive subscriptions={insights.mostExpensive} />
      </ScrollView>
    </SafeAreaView>
  );
}
