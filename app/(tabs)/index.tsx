import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
import { colors } from "@/lib/theme";
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
            <Text style={s.title}>SubTracker</Text>
            <Text style={s.subtitle}>
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

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "bold", color: colors.stone[900] },
  subtitle: { fontSize: 14, color: colors.stone[500] },
});
