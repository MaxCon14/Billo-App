import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Mail } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      toast("Please enter your email and password", "error");
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      toast(err.message || "Failed to sign in", "error");
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      toast(err.message || "Failed to sign in with Google", "error");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-dark-bg">
      <View className="flex-1 justify-center px-6">
        <View className="mb-10 items-center">
          <View className="mb-4 rounded-2xl bg-primary-600 p-4">
            <CreditCard size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            SubTracker
          </Text>
          <Text className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
            Track and manage all your subscriptions in one place
          </Text>
        </View>

        <View className="gap-4">
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button onPress={handleLogin} disabled={isLoading} className="mt-2">
            <Text className="text-base font-semibold text-white">
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Button>

          <View className="my-4 flex-row items-center">
            <View className="h-px flex-1 bg-surface-300 dark:bg-dark-border" />
            <Text className="mx-4 text-xs text-stone-500 dark:text-stone-400">OR</Text>
            <View className="h-px flex-1 bg-surface-300 dark:bg-dark-border" />
          </View>

          <Button variant="outline" onPress={handleGoogleLogin} disabled={isLoading}>
            <View className="flex-row items-center">
              <Mail size={18} color="#78716C" />
              <Text className="ml-2 text-sm font-medium text-stone-700 dark:text-stone-300">
                Continue with Google
              </Text>
            </View>
          </Button>

          <View className="mt-4 flex-row items-center justify-center">
            <Text className="text-sm text-stone-500 dark:text-stone-400">
              Don't have an account?{" "}
            </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
