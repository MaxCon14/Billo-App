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

const SIZE_CONFIG: Record<string, { amount: number; cycle: number }> = {
  sm: { amount: 14, cycle: 10 },
  md: { amount: 18, cycle: 12 },
  lg: { amount: 28, cycle: 14 },
};

export function PriceDisplay({
  amount,
  currency = "USD",
  cycle,
  size = "md",
  style: styleProp,
}: PriceDisplayProps) {
  const config = SIZE_CONFIG[size];

  return (
    <View style={[styles.container, styleProp]}>
      <Text style={[styles.amount, { fontSize: config.amount }]}>
        {formatCurrency(amount, currency)}
      </Text>
      {cycle && (
        <Text style={[styles.cycle, { fontSize: config.cycle }]}>
          {CYCLE_LABELS[cycle]}
        </Text>
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
    letterSpacing: -0.3,
  },
  cycle: {
    marginLeft: 2,
    fontWeight: "500",
    color: colors.stone[400],
  },
});
