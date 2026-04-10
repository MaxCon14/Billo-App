import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Plus, Building2, Bell, ArrowRight } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/theme";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon size={48} color="#0D9488" />
        </View>

        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>

        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === step ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleNext}>
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>
              {step === STEPS.length - 1 ? "Get Started" : "Next"}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </View>
        </Button>

        {step < STEPS.length - 1 && (
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.stone[50],
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconCircle: {
    marginBottom: 32,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    padding: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: colors.stone[900],
  },
  description: {
    marginBottom: 32,
    textAlign: "center",
    fontSize: 16,
    color: colors.stone[500],
  },
  dotsRow: {
    marginBottom: 32,
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.primary[600],
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.stone[300],
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  skipButton: {
    marginTop: 16,
    alignItems: "center",
  },
  skipText: {
    fontSize: 14,
    color: colors.stone[500],
  },
});
