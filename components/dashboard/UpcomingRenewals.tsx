import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
  onViewAll?: () => void;
}

export function UpcomingRenewals({
  subscriptions,
  onSubscriptionPress,
  onViewAll,
}: UpcomingRenewalsProps) {
  const upcoming = subscriptions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between">
          <CardTitle>Upcoming Renewals</CardTitle>
          {onViewAll && (
            <Pressable onPress={onViewAll} className="flex-row items-center">
              <Text className="mr-1 text-sm text-primary-600 dark:text-primary-400">View all</Text>
              <ChevronRight size={14} color="#0D9488" />
            </Pressable>
          )}
        </View>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <Text className="py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            No upcoming renewals
          </Text>
        ) : (
          <View className="gap-3">
            {upcoming.map((sub) => {
              const days = getDaysUntil(sub.next_billing_date);
              return (
                <Pressable
                  key={sub.id}
                  onPress={() => onSubscriptionPress(sub)}
                  className="active:opacity-80"
                >
                  <View className="flex-row items-center">
                    <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {sub.name}
                      </Text>
                      <Text className="text-xs text-stone-500 dark:text-stone-400">
                        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `in ${days} days`}
                      </Text>
                    </View>
                    <Text className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {formatCurrency(sub.amount, sub.currency)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
