import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Plus, Building2, Bell, ArrowRight } from "lucide-react-native";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: CreditCard,
    title: "Welcome to SubTracker",
    description:
      "Track all your subscriptions in one place. See how much you're spending and never miss a renewal.",
  },
  {
    icon: Plus,
    title: "Add Your Subscriptions",
    description:
      "Manually add your subscriptions or connect your bank to auto-detect recurring charges.",
  },
  {
    icon: Building2,
    title: "Connect Your Bank",
    description:
      "Link your bank account to automatically find and track your subscriptions.",
  },
  {
    icon: Bell,
    title: "Stay Notified",
    description:
      "Get reminders before renewals so you never get surprised by a charge.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/(tabs)");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8 rounded-3xl bg-primary-100 p-6 dark:bg-primary-900">
          <Icon size={48} color="#0D9488" />
        </View>

        <Text className="mb-3 text-center text-2xl font-bold text-stone-900 dark:text-stone-100">
          {currentStep.title}
        </Text>
        <Text className="mb-8 text-center text-base text-stone-500 dark:text-stone-400">
          {currentStep.description}
        </Text>

        <View className="mb-8 flex-row gap-2">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === step ? "w-8 bg-primary-600" : "w-2 bg-surface-300 dark:bg-dark-border"
              }`}
            />
          ))}
        </View>
      </View>

      <View className="px-6 pb-8">
        <Button onPress={handleNext}>
          <View className="flex-row items-center">
            <Text className="mr-2 text-base font-semibold text-white">
              {step === STEPS.length - 1 ? "Get Started" : "Next"}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </View>
        </Button>

        {step < STEPS.length - 1 && (
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            className="mt-4 items-center"
          >
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              Skip
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
