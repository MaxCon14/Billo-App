import React from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  DollarSign,
  ExternalLink,
  Pause,
  Play,
  Trash2,
  Edit3,
} from "lucide-react-native";
import { Logo } from "@/components/shared/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  useSubscription,
  useDeleteSubscription,
  useToggleSubscription,
} from "@/hooks/useSubscriptions";
import {
  formatCurrency,
  formatDate,
  getDaysUntil,
  getMonthlyAmount,
  getYearlyAmount,
} from "@/lib/utils";
import { colors, shadows, radius } from "@/lib/theme";

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: subscription, isLoading } = useSubscription(id);
  const deleteMutation = useDeleteSubscription();
  const toggleMutation = useToggleSubscription();

  if (isLoading) {
    return (
      <SafeAreaView style={s.centered}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={s.centered}>
        <Text style={{ color: colors.stone[400], fontSize: 16 }}>Subscription not found</Text>
      </SafeAreaView>
    );
  }

  const daysUntil = getDaysUntil(subscription.next_billing_date);
  const monthly = getMonthlyAmount(subscription.amount, subscription.billing_cycle);
  const yearly = getYearlyAmount(subscription.amount, subscription.billing_cycle);

  function handleToggle() {
    toggleMutation.mutate(
      { id: subscription!.id, is_active: !subscription!.is_active },
      {
        onSuccess: () => {
          toast(subscription!.is_active ? "Subscription paused" : "Subscription resumed", "success");
        },
        onError: () => toast("Failed to update subscription", "error"),
      }
    );
  }

  function handleDelete() {
    Alert.alert(
      "Delete Subscription",
      `Are you sure you want to delete ${subscription!.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMutation.mutate(subscription!.id, {
              onSuccess: () => {
                toast("Subscription deleted", "success");
                router.back();
              },
              onError: () => toast("Failed to delete subscription", "error"),
            });
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={s.screen} edges={["bottom"]}>
      <ScrollView style={s.flex1} contentContainerStyle={s.scrollContent}>
        {/* Hero Section */}
        <View style={s.heroSection}>
          <Logo name={subscription.name} logoUrl={subscription.logo_url} size={80} />
          <Text style={s.name}>{subscription.name}</Text>
          {subscription.description && <Text style={s.desc}>{subscription.description}</Text>}
          <View style={s.badgeRow}>
            {subscription.category && (
              <Badge style={{ backgroundColor: subscription.category.color + "20" }}>
                <Text style={{ color: subscription.category.color, fontSize: 12, fontWeight: "500" }}>
                  {subscription.category.name}
                </Text>
              </Badge>
            )}
            <Badge variant={subscription.is_active ? "default" : "secondary"}>
              <Text style={{ fontSize: 12, fontWeight: "500", color: subscription.is_active ? colors.primary[800] : colors.stone[500] }}>
                {subscription.is_active ? "Active" : "Paused"}
              </Text>
            </Badge>
          </View>
        </View>

        {/* Price Cards - 2 column grid */}
        <View style={s.priceRow}>
          <View style={s.priceCard}>
            <View style={s.priceIconCircle}>
              <DollarSign size={18} color={colors.primary[600]} />
            </View>
            <Text style={s.priceLabel}>Per cycle</Text>
            <Text style={s.priceValue}>{formatCurrency(subscription.amount, subscription.currency)}</Text>
            <Text style={s.priceSub}>{subscription.billing_cycle}</Text>
          </View>
          <View style={s.priceCard}>
            <View style={s.priceIconCircle}>
              <Calendar size={18} color={colors.primary[600]} />
            </View>
            <Text style={s.priceLabel}>Next billing</Text>
            <Text style={s.priceValue}>{daysUntil === 0 ? "Today" : `${daysUntil}d`}</Text>
            <Text style={s.priceSub}>{formatDate(subscription.next_billing_date)}</Text>
          </View>
        </View>

        {/* Spending Summary */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Spending Summary</Text>
          <View style={s.summaryGap}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Monthly cost</Text>
              <Text style={s.summaryValue}>{formatCurrency(monthly, subscription.currency)}</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Yearly cost</Text>
              <Text style={s.summaryValue}>{formatCurrency(yearly, subscription.currency)}</Text>
            </View>
            {subscription.start_date && (
              <>
                <View style={s.summaryDivider} />
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Member since</Text>
                  <Text style={s.summaryValue}>{formatDate(subscription.start_date)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Notes */}
        {subscription.notes && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Notes</Text>
            <Text style={s.notesText}>{subscription.notes}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={s.actionsGap}>
          <Pressable
            onPress={() => router.push(`/subscription/edit?id=${subscription.id}`)}
            style={({ pressed }) => [s.actionBtn, s.actionBtnPrimary, pressed && s.actionBtnPressed]}
          >
            <Edit3 size={18} color={colors.primary[600]} />
            <Text style={[s.actionBtnText, { color: colors.primary[600] }]}>Edit Subscription</Text>
          </Pressable>

          <Pressable
            onPress={handleToggle}
            disabled={toggleMutation.isPending}
            style={({ pressed }) => [s.actionBtn, s.actionBtnOutline, pressed && s.actionBtnPressed]}
          >
            {subscription.is_active ? (
              <>
                <Pause size={18} color={colors.stone[500]} />
                <Text style={[s.actionBtnText, { color: colors.stone[600] }]}>Pause Subscription</Text>
              </>
            ) : (
              <>
                <Play size={18} color={colors.primary[600]} />
                <Text style={[s.actionBtnText, { color: colors.primary[600] }]}>Resume Subscription</Text>
              </>
            )}
          </Pressable>

          {subscription.website_url && (
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => [s.actionBtn, s.actionBtnOutline, pressed && s.actionBtnPressed]}
            >
              <ExternalLink size={18} color={colors.stone[500]} />
              <Text style={[s.actionBtnText, { color: colors.stone[600] }]}>Visit Website</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            style={({ pressed }) => [s.actionBtn, s.actionBtnDestructive, pressed && s.actionBtnDestructivePressed]}
          >
            <Trash2 size={18} color={colors.white} />
            <Text style={[s.actionBtnText, { color: colors.white, fontWeight: "600" }]}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 20 },

  /* Hero */
  heroSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: colors.stone[900],
  },
  desc: {
    marginTop: 6,
    fontSize: 15,
    color: colors.stone[400],
    textAlign: "center",
  },
  badgeRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },

  /* Price Cards */
  priceRow: {
    flexDirection: "row",
    gap: 12,
  },
  priceCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    ...shadows.md,
  },
  priceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 13,
    color: colors.stone[400],
    fontWeight: "500",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.stone[900],
  },
  priceSub: {
    fontSize: 12,
    color: colors.stone[400],
    marginTop: 2,
  },

  /* Cards */
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    ...shadows.md,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.stone[400],
  },
  summaryGap: { gap: 0 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.stone[100],
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.stone[500],
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  notesText: {
    fontSize: 15,
    color: colors.stone[500],
    lineHeight: 22,
  },

  /* Actions */
  actionsGap: { gap: 12, marginTop: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: radius.xl,
    gap: 10,
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  actionBtnOutline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stone[200],
  },
  actionBtnDestructive: {
    backgroundColor: colors.red[500],
  },
  actionBtnPressed: {
    opacity: 0.7,
  },
  actionBtnDestructivePressed: {
    backgroundColor: colors.red[600],
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
