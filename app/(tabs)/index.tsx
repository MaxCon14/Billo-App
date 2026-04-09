import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SAMPLE_SUBSCRIPTIONS } from "@/lib/sampleData";
import { getMonthlyAmount, getYearlyAmount, getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";

export default function DashboardScreen() {
  const router = useRouter();
  const subscriptions = SAMPLE_SUBSCRIPTIONS;

  const activeSubs = useMemo(
    () => subscriptions.filter((s) => s.is_active),
    [subscriptions]
  );

  const totalMonthly = useMemo(
    () => activeSubs.reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.billing_cycle), 0),
    [activeSubs]
  );

  const totalYearly = useMemo(
    () => activeSubs.reduce((sum, s) => sum + getYearlyAmount(s.amount, s.billing_cycle), 0),
    [activeSubs]
  );

  const upcomingSorted = useMemo(
    () =>
      [...activeSubs]
        .filter((s) => getDaysUntil(s.next_billing_date) >= 0)
        .sort((a, b) => getDaysUntil(a.next_billing_date) - getDaysUntil(b.next_billing_date)),
    [activeSubs]
  );

  const chartData = useMemo(() => {
    const categoryMap = new Map<string, { category: string; amount: number; color: string }>();
    activeSubs.forEach((sub) => {
      const catName = sub.category?.name ?? "Other";
      const catColor = sub.category?.color ?? "#888780";
      const existing = categoryMap.get(catName);
      const monthly = getMonthlyAmount(sub.amount, sub.billing_cycle);
      if (existing) {
        existing.amount += monthly;
      } else {
        categoryMap.set(catName, { category: catName, amount: monthly, color: catColor });
      }
    });
    return [...categoryMap.values()].sort((a, b) => b.amount - a.amount);
  }, [activeSubs]);

  function handleSubscriptionPress(sub: Subscription) {
    router.push(`/subscription/${sub.id}`);
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
              Manage your subscriptions
            </Text>
          </View>
        </View>

        <SpendingSummary
          totalMonthly={totalMonthly}
          totalYearly={totalYearly}
          currency="USD"
          subscriptionCount={activeSubs.length}
        />

        <QuickActions
          onAddSubscription={() => router.push("/subscription/add")}
          onConnectBank={() => router.push("/plaid/link")}
        />

        <UpcomingRenewals
          subscriptions={upcomingSorted}
          onSubscriptionPress={handleSubscriptionPress}
          onViewAll={() => router.push("/subscriptions" as never)}
        />

        <SpendingChart data={chartData} />
      </ScrollView>
    </SafeAreaView>
  );
}
