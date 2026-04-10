import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CreditCard, Mail } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/toast";
import { colors } from "@/lib/theme";

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
            <CreditCard size={32} color="#fff" />
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

          <Button onPress={handleLogin} disabled={isLoading} style={{ marginTop: 8 }}>
            <Text style={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </Button>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button variant="outline" onPress={handleGoogleLogin} disabled={isLoading}>
            <View style={styles.googleRow}>
              <Mail size={18} color="#78716C" />
              <Text style={styles.googleText}>Continue with Google</Text>
            </View>
          </Button>

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
    backgroundColor: colors.stone[50],
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
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.primary[600],
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.stone[900],
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
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
  dividerRow: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    height: 1,
    flex: 1,
    backgroundColor: colors.stone[300],
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: colors.stone[500],
  },
  googleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.stone[700],
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
