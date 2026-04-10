import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { colors } from "@/lib/theme";
import type { BillingCycle } from "@/types/subscription";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  cycle?: BillingCycle;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
}

const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  semi_annual: "/6mo",
  yearly: "/yr",
};

const SIZE_FONT: Record<string, number> = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function PriceDisplay({
  amount,
  currency = "USD",
  cycle,
  size = "md",
  style: styleProp,
}: PriceDisplayProps) {
  return (
    <View style={[styles.container, styleProp]}>
      <Text style={[styles.amount, { fontSize: SIZE_FONT[size] }]}>
        {formatCurrency(amount, currency)}
      </Text>
      {cycle && (
        <Text style={styles.cycle}>{CYCLE_LABELS[cycle]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  amount: {
    fontWeight: "700",
    color: colors.stone[900],
  },
  cycle: {
    marginLeft: 2,
    fontSize: 12,
    color: colors.stone[500],
  },
});
