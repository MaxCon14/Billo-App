import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import {
  useSubscription,
  useUpdateSubscription,
  useCategories,
} from "@/hooks/useSubscriptions";
import { useToast } from "@/components/ui/toast";
import type { SubscriptionFormData } from "@/types/subscription";
import { colors } from "@/lib/theme";

export default function EditSubscriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { data: subscription, isLoading } = useSubscription(id);
  const { data: categories = [] } = useCategories();
  const updateMutation = useUpdateSubscription();

  function handleSubmit(data: SubscriptionFormData) {
    if (!id) return;
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast("Subscription updated!", "success");
          router.back();
        },
        onError: (err) => {
          toast(err.message || "Failed to update subscription", "error");
        },
      }
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.yellow} />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent.yellow} />
      </SafeAreaView>
    );
  }

  const initialData: Partial<SubscriptionFormData> = {
    name: subscription.name,
    amount: subscription.amount,
    currency: subscription.currency,
    billing_cycle: subscription.billing_cycle,
    billing_day: subscription.billing_day,
    next_billing_date: subscription.next_billing_date,
    start_date: subscription.start_date,
    category_id: subscription.category_id,
    logo_url: subscription.logo_url,
    website_url: subscription.website_url,
    notes: subscription.notes,
    notify_before_renewal: subscription.notify_before_renewal,
    is_trial: subscription.is_trial ?? false,
    trial_ends_at: subscription.trial_ends_at ?? null,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <SubscriptionForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        categories={categories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
