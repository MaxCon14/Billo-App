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
} from "@/hooks/useGoCardless";
import { useBankStore } from "@/stores/bankStore";
import { useToast } from "@/components/ui/toast";
import { Logo } from "@/components/shared/Logo";
import { colors, shadows, radius } from "@/lib/theme";
import type { DetectedSubscription } from "@/types/gocardless";

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
          <ActivityIndicator size="large" color={colors.primary[600]} />
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
            <Sparkles size={40} color={colors.primary[500]} />
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
            <Sparkles size={24} color={colors.primary[600]} />
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
            <Plus size={16} color={colors.white} />
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
                  <Check size={18} color={colors.white} strokeWidth={3} />
                </Pressable>
                <Pressable
                  onPress={() => handleIgnore(item)}
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.ignoreBtn,
                    pressed && s.pressed,
                  ]}
                >
                  <X size={18} color={colors.stone[500]} strokeWidth={2.5} />
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
  screen: { flex: 1, backgroundColor: colors.stone[50] },
  container: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: colors.stone[400],
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
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.stone[900],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.stone[400],
    textAlign: "center",
    lineHeight: 22,
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
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.stone[900],
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.stone[400],
  },
  addAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
    paddingVertical: 12,
    marginBottom: 16,
    ...shadows.sm,
  },
  addAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 16,
    ...shadows.sm,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.stone[900],
  },
  cardMeta: {
    marginTop: 3,
    fontSize: 13,
    color: colors.stone[500],
  },
  cardCategory: {
    marginTop: 2,
    fontSize: 11,
    color: colors.primary[500],
    fontWeight: "500",
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
    backgroundColor: colors.green[500],
  },
  ignoreBtn: {
    backgroundColor: colors.stone[100],
  },
  pressed: { opacity: 0.7 },
  doneBtn: {
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    ...shadows.sm,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
