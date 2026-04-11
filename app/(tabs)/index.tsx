import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { TrialsEndingSoon } from "@/components/dashboard/TrialsEndingSoon";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";
import { colors, shadows, radius } from "@/lib/theme";
import type { Subscription } from "@/types/subscription";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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
      <SafeAreaView style={s.screen} edges={["top"]}>
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.screen} edges={["top"]}>
      <ScrollView style={s.flex1} contentContainerStyle={s.scrollContent}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>{getGreeting()}</Text>
            <Text style={s.name}>
              {profile?.full_name || "there"}
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

        <TrialsEndingSoon
          subscriptions={subscriptions ?? []}
          onSubscriptionPress={handleSubscriptionPress}
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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  greeting: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.stone[400],
    letterSpacing: 0.2,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
    marginTop: 2,
  },
});
