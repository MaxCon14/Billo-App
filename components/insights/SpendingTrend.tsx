import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/theme";

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
          <Text style={styles.emptyText}>No trend data yet</Text>
        ) : (
          <View>
            <View style={[styles.barsRow, { height: barMaxHeight + 30 }]}>
              {data.map((item, index) => {
                const barHeight = (item.amount / maxAmount) * barMaxHeight;
                const isLast = index === data.length - 1;
                return (
                  <View key={item.month} style={styles.barColumn}>
                    <Text style={styles.barLabel}>
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
                    <Text style={styles.monthLabel}>{item.month}</Text>
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

const styles = StyleSheet.create({
  emptyText: {
    paddingVertical: 16,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[500],
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
    marginBottom: 4,
    fontSize: 12,
    fontWeight: "500",
    color: colors.stone[500],
  },
  bar: {
    width: 32,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  monthLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.stone[500],
  },
});
