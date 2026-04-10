import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency, getMonthlyAmount } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, shadows, radius } from "@/lib/theme";

interface MostExpensiveProps {
  subscriptions: Subscription[];
}

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export function MostExpensive({ subscriptions }: MostExpensiveProps) {
  const top5 = subscriptions.slice(0, 5);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Most Expensive</Text>

      {top5.length === 0 ? (
        <Text style={styles.emptyText}>No subscriptions to rank</Text>
      ) : (
        <View style={styles.list}>
          {top5.map((sub, index) => {
            const monthly = getMonthlyAmount(sub.amount, sub.billing_cycle);
            const isMedal = index < 3;
            return (
              <View key={sub.id} style={styles.row}>
                <View
                  style={[
                    styles.rank,
                    {
                      backgroundColor: isMedal
                        ? MEDAL_COLORS[index] + "25"
                        : colors.stone[100],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rankText,
                      {
                        color: isMedal
                          ? MEDAL_COLORS[index]
                          : colors.stone[500],
                      },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Logo name={sub.name} logoUrl={sub.logo_url} size={40} />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {sub.name}
                  </Text>
                  <Text style={styles.cycle}>{sub.billing_cycle}</Text>
                </View>
                <Text style={styles.amount}>
                  {formatCurrency(monthly, sub.currency)}/mo
                </Text>
              </View>
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.stone[900],
    marginBottom: 16,
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontSize: 14,
    color: colors.stone[400],
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rank: {
    marginRight: 12,
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  rankText: {
    fontSize: 13,
    fontWeight: "800",
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
    marginBottom: 2,
  },
  cycle: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.stone[400],
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.stone[900],
    letterSpacing: -0.2,
  },
});
