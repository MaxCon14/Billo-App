import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BillingCalendar } from "@/components/calendar/BillingCalendar";
import { DayDetail } from "@/components/calendar/DayDetail";
import { DashboardSkeleton } from "@/components/shared/LoadingSkeleton";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { colors } from "@/lib/theme";

export default function CalendarScreen() {
  const router = useRouter();
  const { data: subscriptions = [], isLoading } = useSubscriptions();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activeSubs = useMemo(
    () => subscriptions.filter((s) => s.is_active),
    [subscriptions]
  );

  const subsForSelectedDay = useMemo(() => {
    return activeSubs.filter((sub) => {
      const billingDate = new Date(sub.next_billing_date);
      return (
        billingDate.getFullYear() === selectedDate.getFullYear() &&
        billingDate.getMonth() === selectedDate.getMonth() &&
        billingDate.getDate() === selectedDate.getDate()
      );
    });
  }, [activeSubs, selectedDate]);

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
          <Text style={s.title}>Calendar</Text>
          <Text style={s.subtitle}>Upcoming billing dates</Text>
        </View>

        <BillingCalendar
          subscriptions={activeSubs}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <DayDetail
          date={selectedDate}
          subscriptions={subsForSelectedDay}
          onSubscriptionPress={(sub) => router.push(`/subscription/${sub.id}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 24 },
  headerSection: {
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    lineHeight: 21,
    color: colors.muted,
    marginTop: 4,
  },
});
