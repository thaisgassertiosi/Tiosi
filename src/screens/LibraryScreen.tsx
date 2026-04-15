import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { loadBowls } from "../storage/bowlsStorage";
import type { Bowl } from "../types/bowl";
import { theme } from "../theme";
import { generateBowlInsight } from "../utils/generateBowlInsight";

type Props = NativeStackScreenProps<RootStackParamList, "Library">;

export function LibraryScreen({ navigation }: Props) {
  const [bowls, setBowls] = useState<Bowl[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBowls = useCallback(async () => {
    const list = await loadBowls();
    setBowls(list);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void fetchBowls();
    }, [fetchBowls]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    void fetchBowls();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (bowls.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyMark}>◇</Text>
        <Text style={styles.emptyTitle}>Your library is waiting</Text>
        <Text style={styles.emptyBody}>
          When you save a bowl, it will appear here — a soft record of tones you
          work with.
        </Text>
        <Pressable
          onPress={() => navigation.navigate("AddBowl")}
          style={styles.emptyLink}
        >
          <Text style={styles.emptyLinkText}>Add your first bowl</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={bowls}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => {
        const insight = generateBowlInsight(item);
        return (
          <Pressable
            onPress={() => navigation.navigate("BowlDetail", { id: item.id })}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={styles.cardRow}>
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={styles.thumb}
                  accessibilityLabel={`Photo of ${item.name}`}
                />
              ) : (
                <View style={styles.thumbPlaceholder}>
                  <Text style={styles.thumbMark}>◯</Text>
                </View>
              )}
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.note} · {item.size}"
                </Text>
                <Text style={styles.cardDesc}>{insight.descriptor}</Text>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg,
  },
  list: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: theme.surfaceSoft,
    borderRadius: theme.radiusL,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  cardRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: theme.radiusM,
    backgroundColor: theme.border,
    borderWidth: 1,
    borderColor: theme.goldSoft,
  },
  thumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: theme.radiusM,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbMark: { fontSize: 22, color: theme.goldSoft },
  cardText: { flex: 1, minWidth: 0 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.textDeep,
    marginBottom: 4,
  },
  cardMeta: { fontSize: 13, color: theme.muted, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: theme.purple, lineHeight: 18 },
  emptyWrap: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMark: {
    fontSize: 28,
    color: theme.goldSoft,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.textDeep,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.muted,
    textAlign: "center",
  },
  emptyLink: { marginTop: 24, paddingVertical: 8 },
  emptyLinkText: {
    fontSize: 15,
    color: theme.purple,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
