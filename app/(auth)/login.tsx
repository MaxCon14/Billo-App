import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Mail } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { colors, radius } from "@/lib/theme";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <CreditCard size={32} color={colors.background} />
          </View>
          <Text style={styles.title}>SubTracker</Text>
          <Text style={styles.subtitle}>
            Track and manage all your subscriptions in one place
          </Text>
        </View>

        <View style={styles.form}>
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

          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
              isLoading && styles.primaryBtnDisabled,
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleGoogleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.googleBtn,
              pressed && styles.googleBtnPressed,
            ]}
          >
            <View style={styles.googleRow}>
              <Mail size={18} color={colors.muted} />
              <Text style={styles.googleText}>Continue with Google</Text>
            </View>
          </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.footerLink}>Sign Up</Text>
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
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Syne_800ExtraBold",
    letterSpacing: -0.56,
    color: colors.foreground,
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    lineHeight: 21,
    color: colors.muted,
    paddingHorizontal: 16,
  },
  form: {
    gap: 16,
  },
  primaryBtn: {
    marginTop: 8,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.accent.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Syne_700Bold",
    color: colors.background,
  },
  dividerRow: {
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 11,
    fontFamily: "Syne_600SemiBold",
    textTransform: "uppercase",
    color: colors.muted,
  },
  googleBtn: {
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.transparent,
    alignItems: "center",
    justifyContent: "center",
  },
  googleBtnPressed: {
    opacity: 0.85,
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.foreground,
  },
  footerRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Syne_400Regular",
    color: colors.muted,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Syne_600SemiBold",
    color: colors.accent.yellow,
  },
});
