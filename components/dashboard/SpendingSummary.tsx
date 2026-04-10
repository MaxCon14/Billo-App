import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react-native";
import { colors, radius, shadows } from "@/lib/theme";

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
          <TrendingUp size={18} color={colors.white} />
        </View>
      </View>

      <Text style={styles.totalAmount}>
        {formatCurrency(totalMonthly, currency)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footerRow}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Yearly Total</Text>
          <Text style={styles.footerValue}>
            {formatCurrency(totalYearly, currency)}
          </Text>
        </View>
        <View style={styles.footerSeparator} />
        <View style={styles.footerItemRight}>
          <Text style={styles.footerLabel}>Active</Text>
          <Text style={styles.footerValue}>{subscriptionCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: radius.xl,
    backgroundColor: colors.primary[600],
    padding: 20,
    ...shadows.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary[200],
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  totalAmount: {
    marginTop: 12,
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -0.5,
  },
  divider: {
    marginTop: 20,
    marginBottom: 16,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerItem: {
    flex: 1,
  },
  footerItemRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  footerSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.primary[200],
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
});
