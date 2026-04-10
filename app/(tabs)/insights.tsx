import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpendingByCategory } from "@/components/insights/SpendingByCategory";
import { SpendingTrend } from "@/components/insights/SpendingTrend";
import { MostExpensive } from "@/components/insights/MostExpensive";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/lib/theme";

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
      <SafeAreaView style={s.screen} edges={["top"]}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView style={s.flex1} contentContainerStyle={s.scrollContent}>
        <View style={s.headerSection}>
          <Text style={s.title}>Insights</Text>
          <Text style={s.subtitle}>Your spending at a glance</Text>
        </View>

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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 24 },
  headerSection: {
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.stone[400],
    marginTop: 4,
  },
});
