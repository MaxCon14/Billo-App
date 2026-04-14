import React, { useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { SpendingSummary } from "@/components/dashboard/SpendingSummary";
import { TrialsEndingSoon } from "@/components/dashboard/TrialsEndingSoon";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useInsights } from "@/hooks/useInsights";
import { useAuth } from "@/hooks/useAuth";
import { useAutoSync, useDetectedSubscriptions } from "@/hooks/useGoCardless";
import { useBankStore } from "@/stores/bankStore";
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
  const { data: detected } = useDetectedSubscriptions();
  const newDetectedCount = useBankStore((s) => s.newDetectedCount);
  const runAutoSync = useAutoSync();
  const autoSyncRan = useRef(false);

  const currency = profile?.currency ?? "USD";

  // Auto-sync on mount (once)
  useEffect(() => {
    if (!autoSyncRan.current && profile) {
      autoSyncRan.current = true;
      runAutoSync();
    }
  }, [profile, runAutoSync]);

  const pendingDetected = (detected ?? []).filter((d) => d.status === "pending");
  const showDetectedBanner = pendingDetected.length > 0 || newDetectedCount > 0;
  const detectedCount = pendingDetected.length || newDetectedCount;

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

        {/* New subscriptions detected banner */}
        {showDetectedBanner && (
          <Pressable
            onPress={() => router.push("/bank/review")}
            style={({ pressed }) => [s.detectedBanner, pressed && s.pressed]}
          >
            <View style={s.detectedIcon}>
              <Sparkles size={18} color={colors.primary[600]} />
            </View>
            <View style={s.detectedInfo}>
              <Text style={s.detectedTitle}>
                {detectedCount} new subscription{detectedCount !== 1 ? "s" : ""} found
              </Text>
              <Text style={s.detectedSubtitle}>
                Tap to review and add to your list
              </Text>
            </View>
          </Pressable>
        )}

        <SpendingSummary
          totalMonthly={insights.totalMonthly}
          totalYearly={insights.totalYearly}
          currency={currency}
          subscriptionCount={subscriptions?.filter((s) => s.is_active).length ?? 0}
        />

        <QuickActions
          onAddSubscription={() => router.push("/subscription/add")}
          onConnectBank={() => router.push("/bank/connect")}
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
  detectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary[50],
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  detectedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  detectedInfo: { flex: 1 },
  detectedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary[600],
  },
  detectedSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.stone[500],
  },
  pressed: { opacity: 0.7 },
});
