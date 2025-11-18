import { auth } from "@/FirebaseConfig";
import { AppButton } from "@/components/ui/AppButton";
import { useTheme } from "@/theme/ThemeProvider";
import { useThemedStyles } from "@/theme/useThemedStyles";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const user = auth.currentUser;
  const styles = useThemedStyles((t) =>
    StyleSheet.create({
      safe: {
        flex: 1,
        backgroundColor: t.colors.background,
      },
      container: {
        flex: 1,
        padding: t.spacing.lg,
        gap: t.spacing.lg,
      },
      card: {
        backgroundColor: t.colors.card,
        padding: t.spacing.lg,
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: t.colors.border,
        shadowColor: t.colors.shadow,
        shadowOpacity: 0.2,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      accentBadge: {
        alignSelf: "flex-start",
        backgroundColor: t.colors.accent,
        paddingHorizontal: t.spacing.sm,
        paddingVertical: 4,
        borderRadius: t.radii.pill,
      },
      badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
      },
      title: {
        marginTop: t.spacing.sm,
        fontSize: 26,
        fontWeight: "700",
        color: t.colors.text,
      },
      subtitle: {
        marginTop: t.spacing.xs,
        color: t.colors.textSecondary,
        fontSize: 16,
      },
      highlight: {
        marginTop: t.spacing.md,
        fontSize: 14,
        color: t.colors.muted,
      },
      signOutCard: {
        padding: t.spacing.lg,
        borderRadius: t.radii.md,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      signOutText: {
        color: t.colors.text,
        fontSize: 18,
        fontWeight: "600",
      },
      signOutButton: {
        borderRadius: t.radii.pill,
      },
    })
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)");
    } catch (err) {
      console.error("Sign-out failed", err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.accentBadge}>
            <Text style={styles.badgeText}>Today&apos;s focus</Text>
          </View>
          <Text style={styles.title}>Stay mindful of your screen time.</Text>
          <Text style={styles.subtitle}>
            Track usage, see insights, and upload your weekly report when
            you&apos;re ready.
          </Text>
          {user?.email && (
            <Text style={styles.highlight}>Signed in as {user.email}</Text>
          )}
        </View>
        <View style={styles.signOutCard}>
          <Text style={styles.signOutText}>Ready to take a break?</Text>
          <AppButton
            label="Sign out"
            onPress={handleSignOut}
            style={[styles.signOutButton, { paddingHorizontal: theme.spacing.lg }]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
