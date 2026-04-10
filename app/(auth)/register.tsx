import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { colors } from "@/lib/theme";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <CreditCard size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start tracking your subscriptions today
          </Text>
        </View>

        <View style={styles.form}>
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

          <Button onPress={handleRegister} disabled={isLoading} style={{ marginTop: 8 }}>
            <Text style={styles.buttonText}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Text>
          </Button>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.stone[50],
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.stone[500],
  },
  form: {
    gap: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  footerRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.stone[500],
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary[600],
  },
});
