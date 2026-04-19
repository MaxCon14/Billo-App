import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react-native";
import { colors, radius, typography } from "@/lib/theme";

interface DayDetailProps {
  date: Date;
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
}

export function DayDetail({ date, subscriptions, onSubscriptionPress }: DayDetailProps) {
  const total = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.dateLabel}>{formatDate(date)}</Text>

      {subscriptions.length === 0 ? (
        <EmptyState
          title="No bills due"
          description="Nothing scheduled for this day."
          icon={<CalendarOff size={24} color={colors.muted} />}
          style={{ paddingVertical: 24 }}
        />
      ) : (
        <>
          <View style={styles.list}>
            {subscriptions.map((sub, index) => (
              <Pressable
                key={sub.id}
                onPress={() => onSubscriptionPress(sub)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <View style={styles.row}>
                  <Logo name={sub.name} logoUrl={sub.logo_url} websiteUrl={sub.website_url} size={40} />
                  <Text style={styles.subName} numberOfLines={1}>
                    {sub.name}
                  </Text>
                  <Text style={styles.subAmount}>
                    {formatCurrency(sub.amount, sub.currency)}
                  </Text>
                </View>
                {index < subscriptions.length - 1 && (
                  <View style={styles.rowSeparator} />
                )}
              </Pressable>
            ))}
          </View>
          <View style={styles.totalBar}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(total, "USD")}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateLabel: {
    marginBottom: 16,
    fontFamily: "Syne_700Bold",
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
  },
  list: {
    gap: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 54,
  },
  subName: {
    marginLeft: 14,
    flex: 1,
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
  },
  subAmount: {
    fontFamily: "Syne_700Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.foreground,
  },
  totalBar: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.muted,
  },
  totalAmount: {
    fontFamily: typography.heading.fontFamily,
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent.yellow,
    letterSpacing: -0.3,
  },
});
