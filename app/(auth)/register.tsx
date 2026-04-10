import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister() {
    if (!fullName.trim() || !email.trim() || !password) {
      toast("Please fill in all fields", "error");
      return;
    }
    if (password !== confirmPassword) {
      toast("Passwords don't match", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    try {
      await signUp(email.trim(), password, fullName.trim());
      toast("Account created! Check your email to verify.", "success");
      router.replace("/(auth)/onboarding");
    } catch (err: any) {
      toast(err.message || "Failed to create account", "error");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg">
      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center">
          <View className="mb-4 rounded-2xl bg-primary-600 p-4">
            <CreditCard size={32} color="#fff" />
          </View>
          <Text className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Create Account
          </Text>
          <Text className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Start tracking your subscriptions today
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Create a password (6+ characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button onPress={handleRegister} disabled={isLoading} className="mt-2">
            <Text className="text-base font-semibold text-white">
              {isLoading ? "Creating account..." : "Create Account"}
            </Text>
          </Button>

          <View className="mt-4 flex-row items-center justify-center">
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
