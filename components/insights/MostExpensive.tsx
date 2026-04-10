import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency, getMonthlyAmount } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";
import { Logo } from "@/components/shared/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { colors } from "@/lib/theme";

interface MostExpensiveProps {
  subscriptions: Subscription[];
}

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export function MostExpensive({ subscriptions }: MostExpensiveProps) {
  const top5 = subscriptions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Expensive</CardTitle>
      </CardHeader>
      <CardContent>
        {top5.length === 0 ? (
          <Text style={s.emptyText}>No subscriptions to rank</Text>
        ) : (
          <View style={s.list}>
            {top5.map((sub, index) => {
              const monthly = getMonthlyAmount(sub.amount, sub.billing_cycle);
              return (
                <View key={sub.id} style={s.row}>
                  <View style={[s.rank, { backgroundColor: index < 3 ? MEDAL_COLORS[index] + "30" : colors.stone[100] }]}>
                    <Text style={[s.rankText, { color: index < 3 ? MEDAL_COLORS[index] : colors.stone[500] }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Logo name={sub.name} logoUrl={sub.logo_url} size={36} />
                  <View style={s.info}>
                    <Text style={s.name}>{sub.name}</Text>
                    <Text style={s.cycle}>{sub.billing_cycle}</Text>
                  </View>
                  <Text style={s.amount}>{formatCurrency(monthly, sub.currency)}/mo</Text>
                </View>
              );
            })}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

const s = StyleSheet.create({
  emptyText: { paddingVertical: 16, textAlign: "center", fontSize: 14, color: colors.stone[500] },
  list: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  rank: { marginRight: 12, height: 28, width: 28, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  rankText: { fontSize: 12, fontWeight: "bold" },
  info: { marginLeft: 12, flex: 1 },
  name: { fontSize: 14, fontWeight: "500", color: colors.stone[900] },
  cycle: { fontSize: 12, color: colors.stone[500] },
  amount: { fontSize: 14, fontWeight: "bold", color: colors.stone[900] },
});
