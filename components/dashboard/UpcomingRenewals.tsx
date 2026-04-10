import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, shadows, radius } from "@/lib/theme";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
  onViewAll?: () => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return colors.red[500];
  if (days < 7) return colors.amber[500];
  return colors.stone[400];
}

function getDaysLabel(days: number): string {
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `in ${days} days`;
}

export function UpcomingRenewals({
  subscriptions,
  onSubscriptionPress,
  onViewAll,
}: UpcomingRenewalsProps) {
  const upcoming = subscriptions.slice(0, 5);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Upcoming Renewals</Text>
        {onViewAll && (
          <Pressable onPress={onViewAll} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View all</Text>
            <ChevronRight size={14} color={colors.primary[600]} />
          </Pressable>
        )}
      </View>

      {upcoming.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming renewals</Text>
      ) : (
        <View style={styles.list}>
          {upcoming.map((sub, index) => {
            const days = getDaysUntil(sub.next_billing_date);
            return (
              <Pressable
                key={sub.id}
                onPress={() => onSubscriptionPress(sub)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <View style={styles.row}>
                  <Logo name={sub.name} logoUrl={sub.logo_url} size={40} />
                  <View style={styles.nameCol}>
                    <Text style={styles.name} numberOfLines={1}>
                      {sub.name}
                    </Text>
                    <Text
                      style={[styles.daysText, { color: getDaysColor(days) }]}
                    >
                      {getDaysLabel(days)}
                    </Text>
                  </View>
                  <Text style={styles.amount}>
                    {formatCurrency(sub.amount, sub.currency)}
                  </Text>
                </View>
                {index < upcoming.length - 1 && (
                  <View style={styles.separator} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    padding: 20,
    ...shadows.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    marginRight: 2,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary[600],
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[400],
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
    paddingVertical: 8,
  },
  nameCol: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
    marginBottom: 2,
  },
  daysText: {
    fontSize: 13,
    fontWeight: "500",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.stone[900],
  },
  separator: {
    height: 1,
    backgroundColor: colors.stone[100],
    marginLeft: 54,
  },
});
