import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { BillingCalendar } from "@/components/calendar/BillingCalendar";
import { DayDetail } from "@/components/calendar/DayDetail";
import { SAMPLE_SUBSCRIPTIONS } from "@/lib/sampleData";

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const subsForSelectedDay = useMemo(() => {
    return SAMPLE_SUBSCRIPTIONS.filter((sub) => {
      if (!sub.is_active) return false;
      const billingDate = new Date(sub.next_billing_date);
      return (
        billingDate.getFullYear() === selectedDate.getFullYear() &&
        billingDate.getMonth() === selectedDate.getMonth() &&
        billingDate.getDate() === selectedDate.getDate()
      );
    });
  }, [selectedDate]);

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Billing Calendar
        </Text>

        <BillingCalendar
          subscriptions={SAMPLE_SUBSCRIPTIONS.filter((s) => s.is_active)}
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
