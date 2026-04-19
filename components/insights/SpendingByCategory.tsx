import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/types/subscription";
import { colors, radius } from "@/lib/theme";

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
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: colors.foreground,
    marginBottom: 16,
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontFamily: 'Syne_400Regular',
    fontSize: 14,
    color: colors.muted,
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
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
    color: colors.foreground,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  percentage: {
    marginRight: 10,
    fontFamily: 'Syne_400Regular',
    fontSize: 13,
    color: colors.muted,
  },
  amount: {
    fontFamily: 'Syne_700Bold',
    fontSize: 14,
    color: colors.foreground,
  },
  barTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  barFill: {
    height: "100%",
    borderRadius: radius.full,
  },
});
