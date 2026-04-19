import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency, getMonthlyAmount } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { colors, radius } from "@/lib/theme";

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
                        : colors.surfaceRaised,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.rankText,
                      {
                        color: isMedal
                          ? MEDAL_COLORS[index]
                          : colors.muted,
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
    borderRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontFamily: 'Syne_700Bold',
    fontSize: 18,
    color: colors.foreground,
    marginBottom: 16,
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: "center",
    fontFamily: 'Syne_400Regular',
    fontSize: 14,
    color: colors.muted,
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
    fontFamily: 'Syne_800ExtraBold',
  },
  info: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: 'Syne_700Bold',
    color: colors.foreground,
    marginBottom: 2,
  },
  cycle: {
    fontSize: 12,
    fontFamily: 'Syne_400Regular',
    color: colors.muted,
  },
  amount: {
    fontSize: 15,
    fontFamily: 'Syne_700Bold',
    color: colors.foreground,
    letterSpacing: -0.2,
  },
});
