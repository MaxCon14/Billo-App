import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { EmptyState } from "@/components/shared/EmptyState";
import { CalendarOff } from "lucide-react-native";
import { colors } from "@/lib/theme";

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
          icon={<CalendarOff size={24} color="#A8A29E" />}
          style={{ paddingVertical: 24 }}
        />
      ) : (
        <>
          <View style={styles.list}>
            {subscriptions.map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => onSubscriptionPress(sub)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <View style={styles.row}>
                  <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                  <Text style={styles.subName}>{sub.name}</Text>
                  <Text style={styles.subAmount}>
                    {formatCurrency(sub.amount, sub.currency)}
                  </Text>
                </View>
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stone[200],
    backgroundColor: colors.white,
    padding: 16,
  },
  dateLabel: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[900],
  },
  list: {
    gap: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  subName: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[900],
  },
  subAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[900],
  },
  totalBar: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.stone[200],
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[500],
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.stone[900],
  },
});
