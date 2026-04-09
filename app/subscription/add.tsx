import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { SAMPLE_CATEGORIES } from "@/lib/sampleData";
import type { SubscriptionFormData } from "@/types/subscription";

export default function AddSubscriptionScreen() {
  const router = useRouter();

  function handleSubmit(data: SubscriptionFormData) {
    // In production, use useCreateSubscription().mutate(data)
    console.log("Creating subscription:", data);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg" edges={["bottom"]}>
      <SubscriptionForm
        onSubmit={handleSubmit}
        isLoading={false}
        categories={SAMPLE_CATEGORIES}
      />
    </SafeAreaView>
  );
}
