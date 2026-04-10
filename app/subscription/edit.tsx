import React from "react";
import { ActivityIndicator, View } from "react-native";
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
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-50 dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#0D9488" />
      </SafeAreaView>
    );
  }

  if (!subscription) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-surface-50 dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#0D9488" />
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
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["bottom"]}>
      <SubscriptionForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        categories={categories}
      />
    </SafeAreaView>
  );
}
