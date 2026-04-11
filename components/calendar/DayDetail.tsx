import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react-native";
import { colors, shadows, radius } from "@/lib/theme";

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
          icon={<CalendarOff size={24} color={colors.stone[400]} />}
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
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: 20,
    ...shadows.md,
  },
  dateLabel: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "700",
    color: colors.stone[900],
  },
  list: {
    gap: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginLeft: 54,
  },
  subName: {
    marginLeft: 14,
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  subAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.stone[900],
  },
  totalBar: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.stone[200],
    paddingTop: 16,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[400],
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
    letterSpacing: -0.3,
  },
});
