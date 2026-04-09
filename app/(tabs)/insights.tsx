import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpendingByCategory } from "@/components/insights/SpendingByCategory";
import { SpendingTrend } from "@/components/insights/SpendingTrend";
import { MostExpensive } from "@/components/insights/MostExpensive";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { SAMPLE_SUBSCRIPTIONS } from "@/lib/sampleData";
import { getMonthlyAmount, getYearlyAmount } from "@/lib/utils";
import type { Category } from "@/types/subscription";

export default function InsightsScreen() {
  const activeSubs = useMemo(
    () => SAMPLE_SUBSCRIPTIONS.filter((s) => s.is_active),
    []
  );

  const totalMonthly = useMemo(
    () => activeSubs.reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.billing_cycle), 0),
    [activeSubs]
  );

  const totalYearly = useMemo(
    () => activeSubs.reduce((sum, s) => sum + getYearlyAmount(s.amount, s.billing_cycle), 0),
    [activeSubs]
  );

  const byCategory = useMemo(() => {
    const map = new Map<string, { category: Category; total: number; count: number }>();
    activeSubs.forEach((sub) => {
      const cat = sub.category;
      if (!cat) return;
      const existing = map.get(cat.id);
      const monthly = getMonthlyAmount(sub.amount, sub.billing_cycle);
      if (existing) {
        existing.total += monthly;
        existing.count += 1;
      } else {
        map.set(cat.id, { category: cat, total: monthly, count: 1 });
      }
    });
    const items = [...map.values()].sort((a, b) => b.total - a.total);
    const grandTotal = items.reduce((sum, i) => sum + i.total, 0);
    return items.map((i) => ({
      ...i,
      percentage: grandTotal > 0 ? (i.total / grandTotal) * 100 : 0,
    }));
  }, [activeSubs]);

  const mostExpensive = useMemo(
    () =>
      [...activeSubs].sort(
        (a, b) =>
          getMonthlyAmount(b.amount, b.billing_cycle) -
          getMonthlyAmount(a.amount, a.billing_cycle)
      ),
    [activeSubs]
  );

  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, i) => ({
      month,
      amount: totalMonthly * (0.85 + Math.random() * 0.3),
    }));
  }, [totalMonthly]);

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Insights
        </Text>

        <SpendingSummary
          totalMonthly={totalMonthly}
          totalYearly={totalYearly}
          currency="USD"
          subscriptionCount={activeSubs.length}
        />

        <SpendingByCategory data={byCategory} />
        <SpendingTrend data={trendData} />
        <MostExpensive subscriptions={mostExpensive} />
      </ScrollView>
    </SafeAreaView>
  );
}
