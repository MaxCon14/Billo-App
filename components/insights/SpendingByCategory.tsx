import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/types/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/theme";

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
          <Text style={styles.emptyText}>No category data yet</Text>
        ) : (
          <View style={styles.list}>
            {data.map((item) => (
              <View key={item.category.id}>
                <View style={styles.labelRow}>
                  <View style={styles.categoryLabel}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: item.category.color },
                      ]}
                    />
                    <Text style={styles.categoryName}>
                      {item.category.name}
                    </Text>
                  </View>
                  <View style={styles.valueRow}>
                    <Text style={styles.percentage}>
                      {item.percentage.toFixed(0)}%
                    </Text>
                    <Text style={styles.amount}>
                      {formatCurrency(item.total, "USD")}
                    </Text>
                  </View>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        backgroundColor: item.category.color,
                        width: `${item.percentage}%`,
                      },
                    ]}
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

const styles = StyleSheet.create({
  emptyText: {
    paddingVertical: 16,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[500],
  },
  list: {
    gap: 16,
  },
  labelRow: {
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    marginRight: 8,
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[700],
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentage: {
    marginRight: 8,
    fontSize: 12,
    color: colors.stone[500],
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[900],
  },
  barTrack: {
    height: 8,
    overflow: "hidden",
    borderRadius: 4,
    backgroundColor: colors.stone[200],
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
});
