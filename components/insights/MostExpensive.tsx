import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { getMonthlyAmount } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MostExpensiveProps {
  subscriptions: Subscription[];
}

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export function MostExpensive({ subscriptions }: MostExpensiveProps) {
  const top5 = subscriptions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Expensive</CardTitle>
      </CardHeader>
      <CardContent>
        {top5.length === 0 ? (
          <Text className="py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            No subscriptions to rank
          </Text>
        ) : (
          <View className="gap-3">
            {top5.map((sub, index) => {
              const monthly = getMonthlyAmount(sub.amount, sub.billing_cycle);
              return (
                <View key={sub.id} className="flex-row items-center">
                  <View className="mr-3 h-7 w-7 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: index < 3 ? MEDAL_COLORS[index] + "30" : "#F5F5F4",
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color: index < 3 ? MEDAL_COLORS[index] : "#78716C",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {sub.name}
                    </Text>
                    <Text className="text-xs text-stone-500 dark:text-stone-400">
                      {sub.billing_cycle}
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(monthly, sub.currency)}/mo
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
