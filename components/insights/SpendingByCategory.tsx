import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/types/subscription";
import { colors, shadows, radius } from "@/lib/theme";

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
    <View style={styles.card}>
      <Text style={styles.title}>Spending by Category</Text>

      {data.length === 0 ? (
        <Text style={styles.emptyText}>No category data yet</Text>
      ) : (
        <View style={styles.list}>
          {data.map((item) => (
            <View key={item.category.id} style={styles.itemContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: 20,
    ...shadows.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
    marginBottom: 16,
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[400],
  },
  list: {
    gap: 16,
  },
  itemContainer: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDot: {
    marginRight: 10,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[700],
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentage: {
    marginRight: 10,
    fontSize: 13,
    fontWeight: "500",
    color: colors.stone[400],
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.stone[900],
  },
  barTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.stone[100],
  },
  barFill: {
    height: "100%",
    borderRadius: radius.full,
  },
});
