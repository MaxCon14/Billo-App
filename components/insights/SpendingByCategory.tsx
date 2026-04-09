import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/types/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  category: Category;
  total: number;
  percentage: number;
}

interface SpendingByCategoryProps {
  data: CategoryData[];
}

export function SpendingByCategory({ data }: SpendingByCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <Text className="py-4 text-center text-sm text-stone-500 dark:text-stone-400">
            No category data yet
          </Text>
        ) : (
          <View className="gap-4">
            {data.map((item) => (
              <View key={item.category.id}>
                <View className="mb-1.5 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <Text className="text-sm font-medium text-stone-700 dark:text-stone-300">
                      {item.category.name}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="mr-2 text-xs text-stone-500 dark:text-stone-400">
                      {item.percentage.toFixed(0)}%
                    </Text>
                    <Text className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {formatCurrency(item.total, "USD")}
                    </Text>
                  </View>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-dark-border">
                  <View
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.category.color,
                      width: `${item.percentage}%`,
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
