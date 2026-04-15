import { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SectionCard } from "../components/SectionCard";
import type { RootStackParamList } from "../navigation/types";
import { getBowlById } from "../storage/bowlsStorage";
import type { Bowl } from "../types/bowl";
import { theme } from "../theme";
import { generateBowlInsight } from "../utils/generateBowlInsight";
import { interpretTuning } from "../utils/interpretTuning";
import { interpretSize } from "../utils/interpretSize";
import { matchAlchemy } from "../utils/matchAlchemy";
type Props = NativeStackScreenProps<RootStackParamList, "BowlDetail">;

export function BowlDetailScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [bowl, setBowl] = useState<Bowl | null | undefined>(undefined);

  const load = useCallback(async () => {
    const b = await getBowlById(id);
    setBowl(b);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  useLayoutEffect(() => {
    if (bowl) {
      navigation.setOptions({ title: bowl.name });
    }
  }, [bowl, navigation]);

  if (bowl === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (bowl === null) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>This bowl is not in your library.</Text>
        <Text style={styles.emptyBody}>
          It may have been removed, or the link is older than your latest saves.
        </Text>
      </View>
    );
  }

  const insight = generateBowlInsight(bowl);
  const tuning = interpretTuning(bowl.tagNumber);
  const size = interpretSize(bowl.size);
  const alchemy = matchAlchemy(bowl.name);
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.summaryLabel}>Summary</Text>
      <Text style={styles.summary}>{insight.summary}</Text>

      <SectionCard title="Bowl details">
        <Row label="Name" value={bowl.name} />
        <Row label="Note" value={bowl.note} />
        <Row label="Size" value={`${bowl.size}"`} />
        <Row label="Tag number" value={String(bowl.tagNumber)} />
      </SectionCard>

      <SectionCard title="Note">
        <Text style={styles.body}>{insight.note}</Text>
      </SectionCard>

      <SectionCard title="Tuning">
        <Text style={styles.body}>{insight.tuning}</Text>
        <Text style={styles.meta}>
          Closest reference: {tuning.centerName} ({tuning.description})
        </Text>
      </SectionCard>

      <SectionCard title="Alchemy">
        <Text style={styles.body}>{insight.alchemy}</Text>
        {alchemy.kind !== "fallback" ? (
          <Text style={styles.meta}>Matched as: {alchemy.displayName}</Text>
        ) : null}
      </SectionCard>

      <SectionCard title="Size">
        <Text style={styles.body}>{insight.size}</Text>
        <Text style={styles.meta}>{size.title}</Text>
      </SectionCard>

      <SectionCard title="Overall feel">
        <Text style={styles.body}>{insight.overallFeel}</Text>
      </SectionCard>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.bg,
  },
  empty: {
    flex: 1,
    backgroundColor: theme.bg,
    padding: 24,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  emptyBody: { fontSize: 15, color: theme.muted, lineHeight: 22 },
  summaryLabel: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: theme.muted,
    marginBottom: 8,
  },
  summary: {
    fontSize: 17,
    lineHeight: 26,
    color: theme.text,
    marginBottom: 20,
  },
  body: { fontSize: 15, lineHeight: 24, color: theme.text },
  meta: {
    marginTop: 10,
    fontSize: 13,
    color: theme.muted,
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  rowLabel: { fontSize: 14, color: theme.muted, marginRight: 12 },
  rowValue: {
    fontSize: 14,
    color: theme.text,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
});
