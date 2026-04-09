import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react-native";

interface SpendingSummaryProps {
  totalMonthly: number;
  totalYearly: number;
  currency: string;
  subscriptionCount: number;
}

export function SpendingSummary({
  totalMonthly,
  totalYearly,
  currency,
  subscriptionCount,
}: SpendingSummaryProps) {
  return (
    <View className="overflow-hidden rounded-2xl bg-primary-600 p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-primary-100">Monthly Spending</Text>
        <View className="rounded-full bg-white/20 p-2">
          <TrendingUp size={18} color="#fff" />
        </View>
      </View>

      <Text className="mt-2 text-3xl font-bold text-white">
        {formatCurrency(totalMonthly, currency)}
      </Text>

      <View className="mt-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-primary-200">Yearly</Text>
          <Text className="text-sm font-semibold text-white">
            {formatCurrency(totalYearly, currency)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-primary-200">Active Subscriptions</Text>
          <Text className="text-sm font-semibold text-white">{subscriptionCount}</Text>
        </View>
      </View>
    </View>
  );
}
