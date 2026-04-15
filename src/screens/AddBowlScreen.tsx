import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { SimpleSelect } from "../components/SimpleSelect";
import type { RootStackParamList } from "../navigation/types";
import { addBowl } from "../storage/bowlsStorage";
import type { Bowl } from "../types/bowl";
import { theme } from "../theme";
import { noteOrder } from "../data/notes";

type Props = NativeStackScreenProps<RootStackParamList, "AddBowl">;

const sizeOptions = [5, 6, 7, 8, 9, 10, 12].map((n) => ({
  label: `${n}"`,
  value: n,
}));

const noteOptions = noteOrder.map((n) => ({ label: n, value: n }));

function parseTagNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function AddBowlScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [tagRaw, setTagRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setError(null);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a name from the bowl’s tag.");
      return;
    }
    if (!note) {
      setError("Choose a note.");
      return;
    }
    if (size === null) {
      setError("Choose a size.");
      return;
    }
    const tagNumber = parseTagNumber(tagRaw);
    if (tagNumber === null) {
      setError("Enter a tag number (for example +5, -20, or 45).");
      return;
    }

    const bowl: Bowl = {
      id: newId(),
      name: trimmedName,
      note,
      size,
      tagNumber,
      createdAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      await addBowl(bowl);
      navigation.replace("BowlDetail", { id: bowl.id });
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.lead}>
          Add the details from your tag. There is no wrong bowl — only honest
          listening.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Sedona Red Rock, Platinum"
          placeholderTextColor={theme.muted}
          style={styles.input}
          autoCapitalize="words"
        />

        <SimpleSelect
          label="Note"
          placeholder="Select note"
          value={note}
          options={noteOptions}
          onChange={setNote}
        />

        <SimpleSelect
          label="Size (inches)"
          placeholder="Select size"
          value={size}
          options={sizeOptions}
          onChange={setSize}
        />

        <Text style={styles.label}>Tag number</Text>
        <TextInput
          value={tagRaw}
          onChangeText={setTagRaw}
          placeholder="e.g. +5, -20, +45"
          placeholderTextColor={theme.muted}
          style={styles.input}
          keyboardType="numbers-and-punctuation"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={saving ? "Saving…" : "Save bowl"}
          onPress={onSave}
          disabled={saving}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.muted,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: theme.muted,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusM,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.surface,
    marginBottom: 16,
  },
  error: {
    color: theme.danger,
    marginBottom: 12,
    fontSize: 14,
  },
});
