import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendData {
  month: string;
  amount: number;
}

interface SpendingTrendProps {
  data: TrendData[];
}

export function SpendingTrend({ data }: SpendingTrendProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const barMaxHeight = 120;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Text className="py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            No trend data yet
          </Text>
        ) : (
          <View>
            <View className="flex-row items-end justify-between" style={{ height: barMaxHeight + 30 }}>
              {data.map((item, index) => {
                const barHeight = (item.amount / maxAmount) * barMaxHeight;
                const isLast = index === data.length - 1;
                return (
                  <View key={item.month} className="flex-1 items-center">
                    <Text className="mb-1 text-xs font-medium text-stone-500 dark:text-stone-400">
                      {formatCurrency(item.amount, "USD")}
                    </Text>
                    <View
                      className={`w-8 rounded-t-lg ${isLast ? "bg-primary-500" : "bg-primary-200 dark:bg-primary-800"}`}
                      style={{ height: Math.max(barHeight, 4) }}
                    />
                    <Text className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                      {item.month}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </CardContent>
    </Card>
  );
}
