import React from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { colors } from "@/lib/theme";

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
        <ActivityIndicator size="large" color="#0D9488" />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={s.centered}>
        <Text style={{ color: colors.stone[500] }}>Subscription not found</Text>
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
        <View style={s.headerCenter}>
          <Logo name={subscription.name} logoUrl={subscription.logo_url} size={72} />
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

        <View style={s.priceRow}>
          <Card style={s.flex1}>
            <CardContent style={s.priceCard}>
              <DollarSign size={18} color="#0D9488" />
              <Text style={s.priceLabel}>Per cycle</Text>
              <Text style={s.priceValue}>{formatCurrency(subscription.amount, subscription.currency)}</Text>
              <Text style={s.priceSub}>{subscription.billing_cycle}</Text>
            </CardContent>
          </Card>
          <Card style={s.flex1}>
            <CardContent style={s.priceCard}>
              <Calendar size={18} color="#0D9488" />
              <Text style={s.priceLabel}>Next billing</Text>
              <Text style={s.priceValue}>{daysUntil === 0 ? "Today" : `${daysUntil}d`}</Text>
              <Text style={s.priceSub}>{formatDate(subscription.next_billing_date)}</Text>
            </CardContent>
          </Card>
        </View>

        <Card>
          <CardContent>
            <Text style={s.sectionTitle}>Spending Summary</Text>
            <View style={s.summaryGap}>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Monthly cost</Text>
                <Text style={s.summaryValue}>{formatCurrency(monthly, subscription.currency)}</Text>
              </View>
              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>Yearly cost</Text>
                <Text style={s.summaryValue}>{formatCurrency(yearly, subscription.currency)}</Text>
              </View>
              {subscription.start_date && (
                <View style={s.summaryRow}>
                  <Text style={s.summaryLabel}>Member since</Text>
                  <Text style={s.summaryValue}>{formatDate(subscription.start_date)}</Text>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {subscription.notes && (
          <Card>
            <CardContent>
              <Text style={s.sectionTitle}>Notes</Text>
              <Text style={s.notesText}>{subscription.notes}</Text>
            </CardContent>
          </Card>
        )}

        <View style={s.actionsGap}>
          <Button variant="outline" onPress={() => router.push(`/subscription/edit?id=${subscription.id}`)}>
            <View style={s.btnInner}>
              <Edit3 size={16} color="#0D9488" />
              <Text style={[s.btnText, { color: colors.primary[600] }]}>Edit Subscription</Text>
            </View>
          </Button>
          <Button variant="outline" onPress={handleToggle} disabled={toggleMutation.isPending}>
            <View style={s.btnInner}>
              {subscription.is_active ? (
                <>
                  <Pause size={16} color="#78716C" />
                  <Text style={[s.btnText, { color: colors.stone[600] }]}>Pause Subscription</Text>
                </>
              ) : (
                <>
                  <Play size={16} color="#0D9488" />
                  <Text style={[s.btnText, { color: colors.primary[600] }]}>Resume Subscription</Text>
                </>
              )}
            </View>
          </Button>
          {subscription.website_url && (
            <Button variant="outline" onPress={() => {}}>
              <View style={s.btnInner}>
                <ExternalLink size={16} color="#78716C" />
                <Text style={[s.btnText, { color: colors.stone[600] }]}>Visit Website</Text>
              </View>
            </Button>
          )}
          <Button variant="destructive" onPress={handleDelete} disabled={deleteMutation.isPending}>
            <View style={s.btnInner}>
              <Trash2 size={16} color="#fff" />
              <Text style={[s.btnText, { color: colors.white, fontWeight: "600" }]}>Delete</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.stone[50] },
  flex1: { flex: 1 },
  scrollContent: { padding: 16, gap: 16 },
  headerCenter: { alignItems: "center", paddingVertical: 16 },
  name: { marginTop: 12, fontSize: 24, fontWeight: "bold", color: colors.stone[900] },
  desc: { marginTop: 4, fontSize: 14, color: colors.stone[500] },
  badgeRow: { marginTop: 8, flexDirection: "row", gap: 8 },
  priceRow: { flexDirection: "row", gap: 12 },
  priceCard: { alignItems: "center", paddingVertical: 16 },
  priceLabel: { marginTop: 4, fontSize: 12, color: colors.stone[500] },
  priceValue: { fontSize: 18, fontWeight: "bold", color: colors.stone[900] },
  priceSub: { fontSize: 12, color: colors.stone[400] },
  sectionTitle: { marginBottom: 12, fontSize: 14, fontWeight: "600", color: colors.stone[900] },
  summaryGap: { gap: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, color: colors.stone[500] },
  summaryValue: { fontSize: 14, fontWeight: "500", color: colors.stone[900] },
  notesText: { fontSize: 14, color: colors.stone[500] },
  actionsGap: { gap: 12 },
  btnInner: { flexDirection: "row", alignItems: "center" },
  btnText: { marginLeft: 8, fontWeight: "500" },
});
