import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import { colors, shadows, radius } from "@/lib/theme";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: (subscription: Subscription) => void;
}

const CYCLE_SHORT: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  semi_annual: "Semi-annual",
  yearly: "Yearly",
};

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  return (
    <Pressable
      onPress={() => onPress(subscription)}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <Logo
          name={subscription.name}
          logoUrl={subscription.logo_url}
          size={44}
        />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {subscription.name}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {subscription.category?.name ?? "Uncategorized"}
            {!subscription.is_active && "  \u00B7  Paused"}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {formatCurrency(subscription.amount, subscription.currency)}
          </Text>
          <Text style={styles.cycle}>
            {CYCLE_SHORT[subscription.billing_cycle] ?? subscription.billing_cycle}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: 16,
    ...shadows.sm,
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
    marginBottom: 3,
  },
  category: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.stone[400],
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.stone[900],
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  cycle: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.stone[400],
  },
});
