import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { colors, radius } from "@/lib/theme";

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
                        ? colors.accent.yellow
                        : colors.surfaceRaised,
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
    fontFamily: 'Syne_600SemiBold',
    fontSize: 11,
    color: colors.muted,
  },
  barLabelCurrent: {
    color: colors.accent.yellow,
    fontFamily: 'Syne_700Bold',
  },
  bar: {
    width: 28,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  monthLabel: {
    marginTop: 10,
    fontFamily: 'Syne_400Regular',
    fontSize: 12,
    color: colors.muted,
  },
  monthLabelCurrent: {
    color: colors.accent.yellow,
    fontFamily: 'Syne_700Bold',
  },
});
