import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import { colors, radius, typography } from "@/lib/theme";
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
  const isTrial = subscription.is_trial && subscription.trial_ends_at;
  const trialDays = isTrial ? getDaysUntil(subscription.trial_ends_at!) : null;

  return (
    <Pressable
      onPress={() => onPress(subscription)}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <Logo
          name={subscription.name}
          logoUrl={subscription.logo_url}
          websiteUrl={subscription.website_url}
          size={44}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {subscription.name}
            </Text>
            {isTrial && (
              <View style={[styles.trialBadge, trialDays !== null && trialDays < 3 && styles.trialBadgeUrgent]}>
                <Text style={styles.trialBadgeText}>TRIAL</Text>
              </View>
            )}
          </View>
          <Text style={styles.category} numberOfLines={1}>
            {isTrial && trialDays !== null
              ? trialDays <= 0
                ? "Trial expired"
                : trialDays === 1
                  ? "Ends tomorrow"
                  : `Ends in ${trialDays} days`
              : subscription.category?.name ?? "Uncategorized"}
            {!subscription.is_active && !isTrial && "  \u00B7  Paused"}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          {isTrial ? (
            <>
              <Text style={styles.trialFreeText}>FREE</Text>
              <Text style={styles.cycle}>Trial</Text>
            </>
          ) : (
            <>
              <Text style={styles.amount}>
                {formatCurrency(subscription.amount, subscription.currency)}
              </Text>
              <Text style={styles.cycle}>
                {CYCLE_SHORT[subscription.billing_cycle] ?? subscription.billing_cycle}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
  },
  name: {
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    flexShrink: 1,
  },
  trialBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.accent.pink,
  },
  trialBadgeUrgent: {
    backgroundColor: colors.destructive,
  },
  trialBadgeText: {
    fontFamily: typography.label.fontFamily,
    fontSize: 10,
    fontWeight: "700",
    color: colors.background,
    letterSpacing: 0.5,
  },
  category: {
    fontFamily: typography.body.fontFamily,
    fontSize: 12,
    fontWeight: "400",
    color: colors.muted,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontFamily: "Syne_700Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  trialFreeText: {
    fontFamily: "Syne_700Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent.green,
    marginBottom: 3,
  },
  cycle: {
    fontFamily: typography.body.fontFamily,
    fontSize: 12,
    fontWeight: "400",
    color: colors.muted,
  },
});
