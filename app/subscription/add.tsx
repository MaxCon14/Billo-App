import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useCreateSubscription, useCategories } from "@/hooks/useSubscriptions";
import { useToast } from "@/components/ui/toast";
import type { SubscriptionFormData } from "@/types/subscription";
import { colors } from "@/lib/theme";

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
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <SubscriptionForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
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
});
