import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
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
        <Text style={s.title}>Billing Calendar</Text>

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
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: colors.stone[900] },
});
