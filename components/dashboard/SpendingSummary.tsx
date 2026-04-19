import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react-native";
import { colors, radius, typography } from "@/lib/theme";

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
          <TrendingUp size={18} color={colors.background} />
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
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLabel: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    textTransform: typography.label.textTransform,
    fontWeight: typography.label.fontWeight,
    color: colors.muted,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  totalAmount: {
    marginTop: 12,
    fontFamily: typography.heading.fontFamily,
    fontSize: 32,
    fontWeight: "700",
    color: colors.accent.yellow,
    letterSpacing: typography.heading.letterSpacing,
  },
  divider: {
    marginTop: 20,
    marginBottom: 16,
    height: 1,
    backgroundColor: colors.border,
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
    backgroundColor: colors.border,
  },
  footerLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: 12,
    fontWeight: "400",
    color: colors.muted,
    marginBottom: 4,
  },
  footerValue: {
    fontFamily: "Syne_700Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
  },
});
