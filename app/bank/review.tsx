import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Check, X, Sparkles, Plus } from "lucide-react-native";
import {
  useDetectedSubscriptions,
  useAcceptDetected,
  useIgnoreDetected,
} from "@/hooks/useTrueLayer";
import { useBankStore } from "@/stores/bankStore";
import { useToast } from "@/components/ui/toast";
import { Logo } from "@/components/shared/Logo";
import { colors, radius } from "@/lib/theme";
import type { DetectedSubscription } from "@/types/truelayer";

function formatCurrency(amount: number, currency: string) {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "\u20AC" : currency === "GBP" ? "\u00A3" : "";
  return `${symbol}${amount.toFixed(2)}`;
}

const CYCLE_LABEL: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  semi_annual: "Semi-annual",
  yearly: "Yearly",
};

export default function ReviewDetectedScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: detected, isLoading } = useDetectedSubscriptions();
  const acceptMutation = useAcceptDetected();
  const ignoreMutation = useIgnoreDetected();
  const clearNewDetected = useBankStore((s) => s.clearNewDetected);

  const pending = (detected ?? []).filter((d) => d.status === "pending");

  async function handleAccept(item: DetectedSubscription) {
    try {
      await acceptMutation.mutateAsync(item);
      toast(`${item.name} added!`, "success");
    } catch {
      toast("Failed to add subscription", "error");
    }
  }

  async function handleIgnore(item: DetectedSubscription) {
    try {
      await ignoreMutation.mutateAsync(item.id);
    } catch {
      toast("Failed to dismiss", "error");
    }
  }

  async function handleAddAll() {
    for (const item of pending) {
      try {
        await acceptMutation.mutateAsync(item);
      } catch {
        // Continue with rest
      }
    }
    toast(`${pending.length} subscriptions added!`, "success");
  }

  function handleDone() {
    clearNewDetected();
    router.replace("/(tabs)");
  }

  if (isLoading) {
    return (
      <SafeAreaView style={s.screen} edges={["bottom"]}>
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.yellow} />
          <Text style={s.loadingText}>Scanning transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (pending.length === 0) {
    return (
      <SafeAreaView style={s.screen} edges={["bottom"]}>
        <View style={s.emptyContainer}>
          <View style={s.emptyIcon}>
            <Sparkles size={40} color={colors.accent.yellow} />
          </View>
          <Text style={s.emptyTitle}>All caught up!</Text>
          <Text style={s.emptySubtitle}>
            No new subscriptions detected from your bank transactions.
          </Text>
          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [s.doneBtn, pressed && s.pressed]}
          >
            <Text style={s.doneBtnText}>Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.screen} edges={["bottom"]}>
      <View style={s.container}>
        <View style={s.header}>
          <View style={s.headerIcon}>
            <Sparkles size={24} color={colors.accent.yellow} />
          </View>
          <Text style={s.headerTitle}>
            We found {pending.length} subscription{pending.length !== 1 ? "s" : ""}
          </Text>
          <Text style={s.headerSubtitle}>
            Review and add the ones you want to track
          </Text>
        </View>

        {pending.length > 1 && (
          <Pressable
            onPress={handleAddAll}
            style={({ pressed }) => [s.addAllBtn, pressed && s.pressed]}
          >
            <Plus size={16} color={colors.background} />
            <Text style={s.addAllText}>Add All ({pending.length})</Text>
          </Pressable>
        )}

        <FlatList
          data={pending}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          renderItem={({ item }) => (
            <View style={s.card}>
              <Logo name={item.name} size={44} />
              <View style={s.cardInfo}>
                <Text style={s.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={s.cardMeta}>
                  {formatCurrency(item.amount, item.currency)}
                  {" \u00B7 "}
                  {CYCLE_LABEL[item.billing_cycle] ?? item.billing_cycle}
                </Text>
                {item.category_hint && (
                  <Text style={s.cardCategory}>{item.category_hint}</Text>
                )}
              </View>
              <View style={s.cardActions}>
                <Pressable
                  onPress={() => handleAccept(item)}
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.acceptBtn,
                    pressed && s.pressed,
                  ]}
                >
                  <Check size={18} color={colors.background} strokeWidth={3} />
                </Pressable>
                <Pressable
                  onPress={() => handleIgnore(item)}
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.ignoreBtn,
                    pressed && s.pressed,
                  ]}
                >
                  <X size={18} color={colors.muted} strokeWidth={2.5} />
                </Pressable>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />

        <Pressable
          onPress={handleDone}
          style={({ pressed }) => [s.doneBtn, pressed && s.pressed]}
        >
          <Text style={s.doneBtnText}>Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 32,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Syne_700Bold",
    color: colors.foreground,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  addAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.accent.yellow,
    borderRadius: radius.full,
    paddingVertical: 12,
    marginBottom: 16,
  },
  addAllText: {
    fontSize: 14,
    fontFamily: "Syne_700Bold",
    color: colors.background,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardName: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.foreground,
  },
  cardMeta: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  cardCategory: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: "Syne_600SemiBold",
    textTransform: "uppercase",
    color: colors.accent.yellow,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 10,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtn: {
    backgroundColor: colors.accent.green,
  },
  ignoreBtn: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  doneBtn: {
    backgroundColor: colors.accent.yellow,
    borderRadius: radius.full,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: "Syne_700Bold",
    color: colors.background,
  },
});
