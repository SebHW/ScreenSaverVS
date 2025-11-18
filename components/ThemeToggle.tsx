import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { scheme, theme, toggleTheme } = useTheme();
  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => ({
        marginRight: theme.spacing.md,
        padding: theme.spacing.sm,
        borderRadius: theme.radii.pill,
        backgroundColor: pressed
          ? theme.colors.accentMuted + "1A"
          : "transparent",
      })}
      hitSlop={8}
    >
      <Ionicons
        name={scheme === "dark" ? "moon" : "sunny"}
        color={theme.colors.text}
        size={22}
      />
    </Pressable>
  );
}
