import React from "react";
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
  XCircle,
} from "lucide-react-native";
import { findCancellationUrl } from "@/lib/cancellationLinks";
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
import { colors, radius } from "@/lib/theme";

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
        <ActivityIndicator size="large" color={colors.accent.yellow} />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={s.centered}>
        <Text style={{ color: colors.muted, fontSize: 14, fontFamily: "Syne_400Regular" }}>Subscription not found</Text>
      </SafeAreaView>
    );
  }

  const isTrial = subscription.is_trial && subscription.trial_ends_at;
  const trialDaysLeft = isTrial ? getDaysUntil(subscription.trial_ends_at!) : null;
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

  function handleCancelTrial() {
    const cancelUrl = findCancellationUrl(subscription!.name);
    Alert.alert(
      "Cancel Trial",
      `Cancel your ${subscription!.name} trial? Billo will mark it as cancelled${cancelUrl ? " and open the cancellation page" : ""}.`,
      [
        { text: "Not now", style: "cancel" },
        {
          text: "Cancel Trial",
          style: "destructive",
          onPress: () => {
            toggleMutation.mutate(
              { id: subscription!.id, is_active: false },
              {
                onSuccess: () => {
                  toast(`${subscription!.name} trial cancelled`, "success");
                  if (cancelUrl) Linking.openURL(cancelUrl);
                },
                onError: () => toast("Failed to cancel trial", "error"),
              }
            );
          },
        },
      ]
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
          <Logo name={subscription.name} logoUrl={subscription.logo_url} websiteUrl={subscription.website_url} size={80} />
          <Text style={s.name}>{subscription.name}</Text>
          {subscription.description && <Text style={s.desc}>{subscription.description}</Text>}
          <View style={s.badgeRow}>
            {subscription.category && (
              <Badge style={{ backgroundColor: subscription.category.color + "20" }}>
                <Text style={{ color: subscription.category.color, fontSize: 12, fontFamily: "Syne_400Regular" }}>
                  {subscription.category.name}
                </Text>
              </Badge>
            )}
            {isTrial ? (
              <Badge style={{ backgroundColor: colors.surfaceRaised }}>
                <Text style={{ fontSize: 12, fontFamily: "Syne_600SemiBold", color: colors.accent.yellow }}>
                  {trialDaysLeft !== null && trialDaysLeft <= 0
                    ? "Trial Expired"
                    : trialDaysLeft === 1
                      ? "Trial ends tomorrow"
                      : `Trial \u2022 ${trialDaysLeft}d left`}
                </Text>
              </Badge>
            ) : (
              <Badge variant={subscription.is_active ? "default" : "secondary"}>
                <Text style={{ fontSize: 12, fontFamily: "Syne_400Regular", color: subscription.is_active ? colors.accent.green : colors.muted }}>
                  {subscription.is_active ? "Active" : "Paused"}
                </Text>
              </Badge>
            )}
          </View>
        </View>

        {/* Price Cards - 2 column grid */}
        <View style={s.priceRow}>
          <View style={s.priceCard}>
            <View style={s.priceIconCircle}>
              <DollarSign size={18} color={colors.accent.yellow} />
            </View>
            <Text style={s.priceLabel}>Per cycle</Text>
            <Text style={s.priceValue}>{formatCurrency(subscription.amount, subscription.currency)}</Text>
            <Text style={s.priceSub}>{subscription.billing_cycle}</Text>
          </View>
          <View style={s.priceCard}>
            <View style={s.priceIconCircle}>
              <Calendar size={18} color={colors.accent.yellow} />
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

        {/* Trial cancellation — prominent card */}
        {isTrial ? (
          <View style={[s.card, s.trialCancelCard]}>
            <View style={s.trialCancelHeader}>
              <XCircle size={20} color={colors.destructive} />
              <Text style={s.trialCancelTitle}>Cancel Trial</Text>
            </View>
            <Text style={s.cancelNote}>
              Billo will mark this trial as cancelled
              {findCancellationUrl(subscription.name) ? " and open the cancellation page so you won't be charged." : ". You'll need to cancel directly with the provider."}
            </Text>
            <Pressable
              onPress={handleCancelTrial}
              disabled={toggleMutation.isPending}
              style={({ pressed }) => [s.cancelBtn, pressed && s.cancelBtnPressed]}
            >
              <XCircle size={18} color={colors.destructive} />
              <Text style={s.cancelBtnText}>Cancel Trial Now</Text>
            </Pressable>
          </View>
        ) : (
          /* Regular cancellation link */
          (() => {
            const cancelUrl = findCancellationUrl(subscription.name);
            return (
              <View style={s.card}>
                <Text style={s.sectionTitle}>Cancel Subscription</Text>
                <Text style={s.cancelNote}>
                  This opens the provider's website to cancel your plan.
                </Text>
                {cancelUrl ? (
                  <Pressable
                    onPress={() => Linking.openURL(cancelUrl)}
                    style={({ pressed }) => [s.cancelBtn, pressed && s.cancelBtnPressed]}
                  >
                    <XCircle size={18} color={colors.destructive} />
                    <Text style={s.cancelBtnText}>Go to Cancellation Page</Text>
                  </Pressable>
                ) : (
                  <View style={s.cancelBtnDisabled}>
                    <XCircle size={18} color={colors.muted} />
                    <Text style={s.cancelBtnTextDisabled}>Cancellation page not available</Text>
                  </View>
                )}
              </View>
            );
          })()
        )}

        {/* Action Buttons */}
        <View style={s.actionsGap}>
          <Pressable
            onPress={() => router.push(`/subscription/edit?id=${subscription.id}`)}
            style={({ pressed }) => [s.actionBtn, s.actionBtnPrimary, pressed && s.actionBtnPressed]}
          >
            <Edit3 size={18} color={colors.accent.yellow} />
            <Text style={[s.actionBtnText, { color: colors.accent.yellow }]}>Edit Subscription</Text>
          </Pressable>

          <Pressable
            onPress={handleToggle}
            disabled={toggleMutation.isPending}
            style={({ pressed }) => [s.actionBtn, s.actionBtnOutline, pressed && s.actionBtnPressed]}
          >
            {subscription.is_active ? (
              <>
                <Pause size={18} color={colors.muted} />
                <Text style={[s.actionBtnText, { color: colors.muted }]}>Pause Subscription</Text>
              </>
            ) : (
              <>
                <Play size={18} color={colors.accent.yellow} />
                <Text style={[s.actionBtnText, { color: colors.accent.yellow }]}>Resume Subscription</Text>
              </>
            )}
          </Pressable>

          {subscription.website_url && (
            <Pressable
              onPress={() => Linking.openURL(subscription.website_url!)}
              style={({ pressed }) => [s.actionBtn, s.actionBtnOutline, pressed && s.actionBtnPressed]}
            >
              <ExternalLink size={18} color={colors.muted} />
              <Text style={[s.actionBtnText, { color: colors.foreground }]}>Visit Website</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
            style={({ pressed }) => [s.actionBtn, s.actionBtnDestructive, pressed && s.actionBtnDestructivePressed]}
          >
            <Trash2 size={18} color={colors.foreground} />
            <Text style={[s.actionBtnText, { color: colors.foreground, fontFamily: "Syne_700Bold" }]}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 20 },

  /* Hero */
  heroSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  name: {
    marginTop: 16,
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 11,
    fontFamily: "Syne_600SemiBold",
    textTransform: "uppercase",
    color: colors.muted,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 22,
    fontFamily: "Syne_700Bold",
    color: colors.foreground,
  },
  priceSub: {
    fontSize: 12,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
    marginTop: 2,
  },

  /* Cards */
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 11,
    fontFamily: "Syne_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.muted,
  },
  summaryGap: { gap: 0 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.foreground,
  },
  notesText: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
    lineHeight: 21,
  },

  /* Actions */
  actionsGap: { gap: 12, marginTop: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: radius.full,
    gap: 10,
  },
  actionBtnPrimary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnOutline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnDestructive: {
    backgroundColor: colors.destructive,
  },
  actionBtnPressed: {
    opacity: 0.85,
  },
  actionBtnDestructivePressed: {
    opacity: 0.85,
  },
  actionBtnText: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
  },

  /* Trial cancel card */
  trialCancelCard: {
    borderColor: colors.destructive,
  },
  trialCancelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  trialCancelTitle: {
    fontSize: 15,
    fontFamily: "Syne_700Bold",
    color: colors.destructive,
  },

  /* Cancel */
  cancelNote: {
    fontSize: 13,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
    marginBottom: 16,
    lineHeight: 18,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.destructive,
  },
  cancelBtnPressed: {
    opacity: 0.85,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.destructive,
  },
  cancelBtnDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnTextDisabled: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
});
