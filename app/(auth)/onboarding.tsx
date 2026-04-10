import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Plus, Building2, Bell, ArrowRight } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { colors, shadows, radius } from "@/lib/theme";

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
          <Icon size={40} color={colors.primary[600]} />
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
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && styles.primaryBtnPressed,
          ]}
        >
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>
              {step === STEPS.length - 1 ? "Get Started" : "Next"}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </View>
        </Pressable>

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
    paddingHorizontal: 40,
  },
  iconCircle: {
    marginBottom: 36,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: colors.stone[900],
  },
  description: {
    marginBottom: 40,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: colors.stone[400],
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary[600],
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.stone[200],
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
  primaryBtnPressed: {
    backgroundColor: colors.primary[700],
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  skipButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.stone[400],
  },
});
