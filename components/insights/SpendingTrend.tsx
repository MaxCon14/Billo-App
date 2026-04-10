import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { colors, shadows, radius } from "@/lib/theme";

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
    <View style={styles.card}>
      <Text style={styles.title}>Spending Trend</Text>

      {data.length === 0 ? (
        <Text style={styles.emptyText}>No trend data yet</Text>
      ) : (
        <View style={[styles.barsRow, { height: barMaxHeight + 40 }]}>
          {data.map((item, index) => {
            const barHeight = (item.amount / maxAmount) * barMaxHeight;
            const isLast = index === data.length - 1;
            return (
              <View key={item.month} style={styles.barColumn}>
                <Text style={[styles.barLabel, isLast && styles.barLabelCurrent]}>
                  {formatCurrency(item.amount, "USD")}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(barHeight, 4),
                      backgroundColor: isLast
                        ? colors.primary[500]
                        : colors.primary[200],
                    },
                  ]}
                />
                <Text style={[styles.monthLabel, isLast && styles.monthLabelCurrent]}>
                  {item.month}
                </Text>
              </View>
            );
          })}
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
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barLabel: {
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "600",
    color: colors.stone[400],
  },
  barLabelCurrent: {
    color: colors.primary[600],
    fontWeight: "700",
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  monthLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "500",
    color: colors.stone[400],
  },
  monthLabelCurrent: {
    color: colors.primary[600],
    fontWeight: "700",
  },
});
