import React from "react";
import { Pressable, Text, View } from "react-native";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react-native";

interface DayDetailProps {
  date: Date;
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
}

export function DayDetail({ date, subscriptions, onSubscriptionPress }: DayDetailProps) {
  const total = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <View className="mt-4 rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
      <Text className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">
        {formatDate(date)}
      </Text>

      {subscriptions.length === 0 ? (
        <EmptyState
          title="No bills due"
          description="Nothing scheduled for this day."
          icon={<CalendarOff size={24} color="#A8A29E" />}
          className="py-6"
        />
      ) : (
        <>
          <View className="gap-3">
            {subscriptions.map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => onSubscriptionPress(sub)}
                className="active:opacity-80"
              >
                <View className="flex-row items-center">
                  <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                  <Text className="ml-3 flex-1 text-sm font-medium text-stone-900 dark:text-stone-100">
                    {sub.name}
                  </Text>
                  <Text className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {formatCurrency(sub.amount, sub.currency)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
          <View className="mt-3 border-t border-surface-200 pt-3 dark:border-dark-border">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-stone-500 dark:text-stone-400">
                Total
              </Text>
              <Text className="text-base font-bold text-stone-900 dark:text-stone-100">
                {formatCurrency(total, "USD")}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
