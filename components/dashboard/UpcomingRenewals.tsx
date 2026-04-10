import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { formatCurrency, getDaysUntil } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/theme";

interface UpcomingRenewalsProps {
  subscriptions: Subscription[];
  onSubscriptionPress: (subscription: Subscription) => void;
  onViewAll?: () => void;
}

export function UpcomingRenewals({
  subscriptions,
  onSubscriptionPress,
  onViewAll,
}: UpcomingRenewalsProps) {
  const upcoming = subscriptions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <View style={styles.headerRow}>
          <CardTitle>Upcoming Renewals</CardTitle>
          {onViewAll && (
            <Pressable onPress={onViewAll} style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View all</Text>
              <ChevronRight size={14} color={colors.primary[600]} />
            </Pressable>
          )}
        </View>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <Text style={styles.emptyText}>No upcoming renewals</Text>
        ) : (
          <View style={styles.list}>
            {upcoming.map((sub) => {
              const days = getDaysUntil(sub.next_billing_date);
              return (
                <Pressable
                  key={sub.id}
                  onPress={() => onSubscriptionPress(sub)}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <View style={styles.row}>
                    <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                    <View style={styles.nameCol}>
                      <Text style={styles.name}>{sub.name}</Text>
                      <Text style={styles.daysText}>
                        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `in ${days} days`}
                      </Text>
                    </View>
                    <Text style={styles.amount}>
                      {formatCurrency(sub.amount, sub.currency)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    marginRight: 4,
    fontSize: 14,
    color: colors.primary[600],
  },
  emptyText: {
    paddingVertical: 16,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[500],
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
  nameCol: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[900],
  },
  daysText: {
    fontSize: 12,
    color: colors.stone[500],
  },
  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.stone[900],
  },
});
