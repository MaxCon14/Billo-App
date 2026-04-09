import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { cn } from "@/lib/utils";
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
    <View className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable onPress={prevMonth} className="p-2">
          <ChevronLeft size={20} color="#78716C" />
        </Pressable>
        <Text className="text-base font-semibold text-stone-900 dark:text-stone-100">
          {monthLabel}
        </Text>
        <Pressable onPress={nextMonth} className="p-2">
          <ChevronRight size={20} color="#78716C" />
        </Pressable>
      </View>

      <View className="flex-row">
        {WEEKDAYS.map((day) => (
          <View key={day} className="flex-1 items-center pb-2">
            <Text className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} className="h-12 w-[14.28%]" />;
          }

          const date = new Date(year, month, day);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dots = billingDays.get(day) ?? [];

          return (
            <Pressable
              key={day}
              onPress={() => onSelectDate(date)}
              className="h-12 w-[14.28%] items-center justify-center"
            >
              <View
                className={cn(
                  "h-8 w-8 items-center justify-center rounded-full",
                  isSelected && "bg-primary-600",
                  isToday && !isSelected && "border border-primary-500"
                )}
              >
                <Text
                  className={cn(
                    "text-sm",
                    isSelected
                      ? "font-bold text-white"
                      : isToday
                        ? "font-semibold text-primary-600 dark:text-primary-400"
                        : "text-stone-900 dark:text-stone-100"
                  )}
                >
                  {day}
                </Text>
              </View>
              {dots.length > 0 && (
                <View className="mt-0.5 flex-row gap-0.5">
                  {dots.slice(0, 3).map((color, i) => (
                    <View
                      key={i}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: color }}
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
