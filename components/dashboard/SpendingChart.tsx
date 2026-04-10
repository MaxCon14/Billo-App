import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { colors, shadows, radius } from "@/lib/theme";

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
    <View style={styles.card}>
      <Text style={styles.title}>Spending by Category</Text>

      {data.length === 0 ? (
        <Text style={styles.emptyText}>No spending data yet</Text>
      ) : (
        <View style={styles.list}>
          {data.map((item) => (
            <View key={item.category} style={styles.itemContainer}>
              <View style={styles.labelRow}>
                <View style={styles.categoryInfo}>
                  <View
                    style={[styles.dot, { backgroundColor: item.color }]}
                  />
                  <Text style={styles.categoryLabel}>{item.category}</Text>
                </View>
                <Text style={styles.amountLabel}>
                  {formatCurrency(item.amount, "USD")}
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: item.color,
                      width: `${(item.amount / maxAmount) * 100}%`,
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
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[700],
  },
  amountLabel: {
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
