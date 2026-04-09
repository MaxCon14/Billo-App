import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  category: string;
  amount: number;
  color: string;
}

interface SpendingChartProps {
  data: ChartData[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Text className="py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            No spending data yet
          </Text>
        ) : (
          <View className="gap-3">
            {data.map((item) => (
              <View key={item.category}>
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-xs font-medium text-stone-700 dark:text-stone-300">
                    {item.category}
                  </Text>
                  <Text className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {formatCurrency(item.amount, "USD")}
                  </Text>
                </View>
                <View className="h-2.5 overflow-hidden rounded-full bg-surface-200 dark:bg-dark-border">
                  <View
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.color,
                      width: `${(item.amount / maxAmount) * 100}%`,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
