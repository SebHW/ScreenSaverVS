import { ReactNode } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useThemedStyles } from "@/theme/useThemedStyles";

type ButtonVariant = "primary" | "secondary" | "ghost";

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: ReactNode;
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  style,
  textStyle,
  leftIcon,
}: Props) {
  const styles = useThemedStyles((theme) =>
    StyleSheet.create({
      base: {
        borderRadius: theme.radii.sm,
        paddingVertical: theme.spacing.sm + 4,
        paddingHorizontal: theme.spacing.lg,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: theme.spacing.xs,
      },
      primary: {
        backgroundColor: theme.colors.accent,
      },
      secondary: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: "transparent",
      },
      ghost: {
        backgroundColor: "transparent",
      },
      disabled: {
        opacity: 0.6,
      },
      text: {
        fontWeight: "600",
        fontSize: 16,
      },
      textPrimary: {
        color: "#fff",
      },
      textSecondary: {
        color: theme.colors.text,
      },
      textGhost: {
        color: theme.colors.textSecondary,
      },
    })
  );

  const variantStyle =
    variant === "primary"
      ? styles.primary
      : variant === "secondary"
        ? styles.secondary
        : styles.ghost;

  const textVariantStyle =
    variant === "primary"
      ? styles.textPrimary
      : variant === "secondary"
        ? styles.textSecondary
        : styles.textGhost;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variantStyle, disabled && styles.disabled, style]}
    >
      {leftIcon}
      <Text style={[styles.text, textVariantStyle, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}
