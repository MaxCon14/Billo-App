import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import { colors } from "@/lib/theme";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: (subscription: Subscription) => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return colors.red[500];
  if (days < 7) return "#CA8A04"; // yellow-600
  return colors.stone[500];
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const daysUntil = getDaysUntil(subscription.next_billing_date);
  const daysLabel =
    daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `in ${daysUntil} days`;

  return (
    <Pressable
      onPress={() => onPress(subscription)}
      style={({ pressed }) => pressed ? styles.pressed : undefined}
    >
      <View style={styles.card}>
        <Logo
          name={subscription.name}
          logoUrl={subscription.logo_url}
          size={44}
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {subscription.name}
          </Text>
          <View style={styles.badgeRow}>
            {subscription.category && (
              <Badge
                variant="default"
                style={{ backgroundColor: subscription.category.color + "20" }}
              >
                <Text style={[styles.categoryText, { color: subscription.category.color }]}>
                  {subscription.category.name}
                </Text>
              </Badge>
            )}
            {!subscription.is_active && (
              <Badge variant="secondary">
                <Text style={styles.pausedText}>Paused</Text>
              </Badge>
            )}
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>
            {formatCurrency(subscription.amount, subscription.currency)}
          </Text>
          <Text style={[styles.daysLabel, { color: getDaysColor(daysUntil) }]}>
            {daysLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    padding: 16,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.stone[900],
  },
  badgeRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pausedText: {
    fontSize: 12,
    color: colors.stone[500],
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.stone[900],
  },
  daysLabel: {
    marginTop: 4,
    fontSize: 12,
  },
});
