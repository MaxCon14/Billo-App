import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useCreateSubscription, useCategories } from "@/hooks/useSubscriptions";
import { useToast } from "@/components/ui/toast";
import type { SubscriptionFormData } from "@/types/subscription";

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateSubscription();

  function handleSubmit(data: SubscriptionFormData) {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast("Subscription added!", "success");
        router.back();
      },
      onError: (err) => {
        toast(err.message || "Failed to add subscription", "error");
      },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["bottom"]}>
      <SubscriptionForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        categories={categories}
      />
    </SafeAreaView>
  );
}
