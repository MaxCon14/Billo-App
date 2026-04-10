import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/theme";

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
          <Text style={styles.emptyText}>No spending data yet</Text>
        ) : (
          <View style={styles.list}>
            {data.map((item) => (
              <View key={item.category}>
                <View style={styles.labelRow}>
                  <Text style={styles.categoryLabel}>{item.category}</Text>
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
    gap: 12,
  },
  labelRow: {
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.stone[700],
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.stone[900],
  },
  barTrack: {
    height: 10,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: colors.stone[200],
  },
  barFill: {
    height: "100%",
    borderRadius: 9999,
  },
});
