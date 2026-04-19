import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, radius, typography } from "@/lib/theme";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
  onViewAll?: () => void;
}

function getDaysColor(days: number): string {
  if (days < 3) return colors.destructive;
  if (days < 7) return colors.accent.yellow;
  return colors.muted;
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
            <ChevronRight size={14} color={colors.accent.yellow} />
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
                  <Logo name={sub.name} logoUrl={sub.logo_url} websiteUrl={sub.website_url} size={40} />
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
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Syne_700Bold",
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    marginRight: 2,
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: "500",
    color: colors.accent.yellow,
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.muted,
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
  nameCol: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontFamily: typography.body.fontFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 2,
  },
  daysText: {
    fontFamily: typography.body.fontFamily,
    fontSize: 13,
    fontWeight: "500",
  },
  amount: {
    fontFamily: "Syne_700Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 54,
  },
});
