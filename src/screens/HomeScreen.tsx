import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import type { RootStackParamList } from "../navigation/types";
import { theme } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.inner}>
        <Text style={styles.mark}>✶</Text>
        <Text style={styles.title}>Tiosi</Text>
        <Text style={styles.tagline}>
          A quiet companion for Crystal Tones bowls — name what you hold, listen
          with clarity.
        </Text>
        <View style={styles.actions}>
          <PrimaryButton
            label="Add Bowl"
            onPress={() => navigation.navigate("AddBowl")}
          />
          <PrimaryButton
            label="My Library"
            variant="ghost"
            onPress={() => navigation.navigate("Library")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    justifyContent: "center",
  },
  mark: {
    fontSize: 22,
    color: theme.accentSoft,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 42,
    letterSpacing: 2,
    color: theme.text,
    textAlign: "center",
    fontWeight: "300",
  },
  tagline: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: theme.muted,
    textAlign: "center",
  },
  actions: { marginTop: 40, gap: 12 },
});
