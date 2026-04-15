import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { theme } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost";
  style?: ViewStyle;
  disabled?: boolean;
  icon?: ReactNode;
};

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  style,
  disabled,
  icon,
}: Props) {
  const isGhost = variant === "ghost";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isGhost ? styles.ghost : styles.primary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, isGhost && styles.labelGhost]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.radiusM,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    shadowColor: theme.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  primary: {
    backgroundColor: theme.purple,
    borderColor: theme.purple,
  },
  ghost: {
    backgroundColor: theme.surfaceSoft,
    borderColor: theme.goldSoft,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    color: theme.surface,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  labelGhost: {
    color: theme.textDeep,
  },
});
