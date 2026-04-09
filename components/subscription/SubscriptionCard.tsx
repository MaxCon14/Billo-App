import React from "react";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { formatCurrency, getDaysUntil, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: (subscription: Subscription) => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return "text-red-500";
  if (days < 7) return "text-yellow-600 dark:text-yellow-400";
  return "text-stone-500 dark:text-stone-400";
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const daysUntil = getDaysUntil(subscription.next_billing_date);
  const daysLabel =
    daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `in ${daysUntil} days`;

  return (
    <Pressable
      onPress={() => onPress(subscription)}
      className="active:opacity-80"
    >
      <View className="flex-row items-center rounded-2xl border border-surface-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
        <Logo
          name={subscription.name}
          logoUrl={subscription.logo_url}
          size={44}
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {subscription.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            {subscription.category && (
              <Badge
                variant="default"
                style={{ backgroundColor: subscription.category.color + "20" }}
              >
                <Text style={{ color: subscription.category.color }} className="text-xs font-medium">
                  {subscription.category.name}
                </Text>
              </Badge>
            )}
            {!subscription.is_active && (
              <Badge variant="secondary">
                <Text className="text-xs text-stone-500">Paused</Text>
              </Badge>
            )}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-stone-900 dark:text-stone-100">
            {formatCurrency(subscription.amount, subscription.currency)}
          </Text>
          <Text className={cn("mt-1 text-xs", getDaysColor(daysUntil))}>
            {daysLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
