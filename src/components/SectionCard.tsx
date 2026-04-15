import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

type Props = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radiusL,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.muted,
    marginBottom: 8,
  },
});
