import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react-native";
import { colors } from "@/lib/theme";

interface SpendingSummaryProps {
  totalMonthly: number;
  totalYearly: number;
  currency: string;
  subscriptionCount: number;
}

export function SpendingSummary({
  totalMonthly,
  totalYearly,
  currency,
  subscriptionCount,
}: SpendingSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>Monthly Spending</Text>
        <View style={styles.iconCircle}>
          <TrendingUp size={18} color="#fff" />
        </View>
      </View>

      <Text style={styles.totalAmount}>
        {formatCurrency(totalMonthly, currency)}
      </Text>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.footerLabel}>Yearly</Text>
          <Text style={styles.footerValue}>
            {formatCurrency(totalYearly, currency)}
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerLabel}>Active Subscriptions</Text>
          <Text style={styles.footerValue}>{subscriptionCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary[100],
  },
  iconCircle: {
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
  },
  totalAmount: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "700",
    color: colors.white,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLabel: {
    fontSize: 12,
    color: colors.primary[200],
  },
  footerValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  footerRight: {
    alignItems: "flex-end",
  },
});
