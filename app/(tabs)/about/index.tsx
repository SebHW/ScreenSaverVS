import { useThemedStyles } from "@/theme/useThemedStyles";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      safe: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      container: {
        flex: 1,
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
      },
      title: {
        fontSize: 24,
        fontWeight: "700",
        color: theme.colors.text,
      },
      text: {
        color: theme.colors.textSecondary,
        lineHeight: 22,
        fontSize: 16,
      },
      card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.md,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        gap: theme.spacing.sm,
      },
      accent: {
        color: theme.colors.accent,
        fontWeight: "700",
      },
    })
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>ScreenSaverVS</Text>
        <Text style={styles.text}>
          A simple way to capture your device usage, highlight trends, and keep
          your screen time intentional.
        </Text>
        <View style={styles.card}>
          <Text style={styles.accent}>Built for clarity</Text>
          <Text style={styles.text}>
            The app runs entirely on-device, using Firebase just for secure
            authentication. Your usage data stays private until you choose to
            share it.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
