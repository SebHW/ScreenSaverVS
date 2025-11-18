import { useThemedStyles } from "@/theme/useThemedStyles";
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.lg,
      },
      title: {
        fontSize: 30,
        fontWeight: "700",
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
      },
      link: {
        color: "#fff",
        fontWeight: "600",
      },
      button: {
        marginTop: theme.spacing.lg,
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radii.pill,
      },
      message: {
        color: theme.colors.textSecondary,
        textAlign: "center",
      },
    })
  );

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Lost in space</Text>
        <Text style={styles.message}>
          The page you were looking for has drifted away.
        </Text>
        <Link asChild href="/(tabs)">
          <Pressable style={styles.button}>
            <Text style={styles.link}>Return home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
