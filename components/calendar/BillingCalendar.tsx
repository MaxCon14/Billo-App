import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors } from "@/lib/theme";
import type { Subscription } from "@/types/subscription";

interface BillingCalendarProps {
  subscriptions: Subscription[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function BillingCalendar({
  subscriptions,
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
}: BillingCalendarProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const days = getCalendarDays(year, month);
  const today = new Date();

  const billingDays = new Map<number, string[]>();
  subscriptions.forEach((sub) => {
    const d = new Date(sub.next_billing_date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!billingDays.has(day)) billingDays.set(day, []);
      billingDays.get(day)!.push(sub.category?.color ?? "#0D9488");
    }
  });

  const monthLabel = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    onMonthChange(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    onMonthChange(new Date(year, month + 1, 1));
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Pressable onPress={prevMonth} style={styles.navButton}>
          <ChevronLeft size={20} color="#78716C" />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable onPress={nextMonth} style={styles.navButton}>
          <ChevronRight size={20} color="#78716C" />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((day) => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const date = new Date(year, month, day);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dots = billingDays.get(day) ?? [];

          return (
            <Pressable
              key={day}
              onPress={() => onSelectDate(date)}
              style={styles.dayCell}
            >
              <View
                style={[
                  styles.dayCircle,
                  isSelected && styles.dayCircleSelected,
                  isToday && !isSelected && styles.dayCircleToday,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isToday && !isSelected && styles.dayTextToday,
                  ]}
                >
                  {day}
                </Text>
              </View>
              {dots.length > 0 && (
                <View style={styles.dotsRow}>
                  {dots.slice(0, 3).map((color, i) => (
                    <View
                      key={i}
                      style={[styles.dot, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    padding: 16,
  },
  headerRow: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navButton: {
    padding: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.stone[900],
  },
  weekdayRow: {
    flexDirection: "row",
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.stone[500],
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    height: 48,
    width: "14.28%",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  dayCircleSelected: {
    backgroundColor: colors.primary[600],
  },
  dayCircleToday: {
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  dayText: {
    fontSize: 14,
    color: colors.stone[900],
  },
  dayTextSelected: {
    fontWeight: "700",
    color: colors.white,
  },
  dayTextToday: {
    fontWeight: "600",
    color: colors.primary[600],
  },
  dotsRow: {
    marginTop: 2,
    flexDirection: "row",
    gap: 2,
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 2,
  },
});
