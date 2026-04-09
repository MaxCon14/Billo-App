import React from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { BillingCycle } from "@/types/subscription";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  cycle?: BillingCycle;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  semi_annual: "/6mo",
  yearly: "/yr",
};

const SIZE_CLASSES = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
};

export function PriceDisplay({
  amount,
  currency = "USD",
  cycle,
  size = "md",
  className,
}: PriceDisplayProps) {
  return (
    <View className={cn("flex-row items-baseline", className)}>
      <Text
        className={cn(
          "font-bold text-stone-900 dark:text-stone-100",
          SIZE_CLASSES[size]
        )}
      >
        {formatCurrency(amount, currency)}
      </Text>
      {cycle && (
        <Text className="ml-0.5 text-xs text-stone-500 dark:text-stone-400">
          {CYCLE_LABELS[cycle]}
        </Text>
      )}
    </View>
  );
}
