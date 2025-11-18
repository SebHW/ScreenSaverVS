import { auth } from "@/FirebaseConfig";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppButton } from "@/components/ui/AppButton";
import { useTheme } from "@/theme/ThemeProvider";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();
  const styles = useThemedStyles((t) =>
    StyleSheet.create({
      safe: {
        flex: 1,
        backgroundColor: t.colors.background,
      },
      container: {
        flex: 1,
        paddingHorizontal: t.spacing.xl,
        paddingVertical: t.spacing.lg,
        justifyContent: "center",
      },
      heading: {
        fontSize: 32,
        fontWeight: "700",
        color: t.colors.text,
      },
      subheading: {
        marginTop: t.spacing.sm,
        color: t.colors.textSecondary,
        fontSize: 16,
      },
      card: {
        backgroundColor: t.colors.card,
        padding: t.spacing.lg,
        borderRadius: t.radii.md,
        marginTop: t.spacing.lg,
        gap: t.spacing.md,
        shadowColor: t.colors.shadow,
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        borderWidth: 1,
        borderColor: t.colors.border,
      },
      label: {
        color: t.colors.text,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: t.spacing.xs,
      },
      input: {
        backgroundColor: t.colors.inputBackground,
        color: t.colors.inputText,
        borderRadius: t.radii.sm,
        borderWidth: 1,
        borderColor: t.colors.border,
        paddingHorizontal: t.spacing.md,
        paddingVertical: t.spacing.sm + 4,
        fontSize: 16,
      },
      toggleRow: {
        position: "absolute",
        top: t.spacing.md,
        right: 0,
      },
    })
  );

  const disabled = !email || !password;

  const handleSignIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.toggleRow}>
          <ThemeToggle />
        </View>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subheading}>
          Sign in to view your screen time and usage insights.
        </Text>
        <View style={styles.card}>
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="name@email.com"
              placeholderTextColor={theme.colors.placeholder}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={theme.colors.placeholder}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <AppButton
            label="Sign in"
            onPress={handleSignIn}
            disabled={disabled}
            style={{ opacity: disabled ? 0.7 : 1 }}
          />
          <AppButton
            variant="secondary"
            label="Create an account"
            onPress={handleSignUp}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
