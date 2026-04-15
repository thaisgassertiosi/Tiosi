import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PrimaryButton } from "../components/PrimaryButton";
import { SimpleSelect } from "../components/SimpleSelect";
import type { RootStackParamList } from "../navigation/types";
import { persistBowlPhoto } from "../storage/bowlPhoto";
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
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openPicker = async (source: "library" | "camera") => {
    setError(null);
    if (source === "library") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Photo library access is needed to attach a bowl photo.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });
      if (!res.canceled && res.assets[0]?.uri) {
        setPickedUri(res.assets[0].uri);
      }
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setError("Camera access is needed to photograph your bowl.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!res.canceled && res.assets[0]?.uri) {
      setPickedUri(res.assets[0].uri);
    }
  };

  const choosePhoto = () => {
    const buttons: {
      text: string;
      style?: "destructive" | "cancel";
      onPress?: () => void;
    }[] = [
      { text: "Photo library", onPress: () => void openPicker("library") },
      { text: "Camera", onPress: () => void openPicker("camera") },
    ];
    if (pickedUri) {
      buttons.push({
        text: "Remove photo",
        style: "destructive",
        onPress: () => setPickedUri(null),
      });
    }
    buttons.push({ text: "Cancel", style: "cancel" });
    Alert.alert("Bowl photo", "Add an image for your library (optional).", buttons);
  };

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

    const id = newId();
    let photoUri: string | null | undefined;
    if (pickedUri) {
      const saved = await persistBowlPhoto(id, pickedUri);
      photoUri = saved ?? undefined;
      if (!saved) {
        Alert.alert(
          "Photo not saved",
          "Your bowl will still be saved without a photo — this device could not copy the image into app storage.",
        );
      }
    }

    const bowl: Bowl = {
      id,
      name: trimmedName,
      note,
      size,
      tagNumber,
      createdAt: new Date().toISOString(),
      ...(photoUri ? { photoUri } : {}),
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

        <Text style={styles.label}>Photo (optional)</Text>
        <Text style={styles.photoHint}>
          Saved on this device with your library — not uploaded to a server.
        </Text>
        {pickedUri ? (
          <View style={styles.previewWrap}>
            <Image source={{ uri: pickedUri }} style={styles.preview} />
            <Pressable onPress={choosePhoto} style={styles.changePhoto}>
              <Text style={styles.changePhotoText}>Change or remove photo</Text>
            </Pressable>
          </View>
        ) : (
          <PrimaryButton
            label="Add bowl photo"
            variant="ghost"
            onPress={choosePhoto}
            style={{ marginBottom: 16 }}
          />
        )}

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
    color: theme.text,
    marginBottom: 20,
    backgroundColor: theme.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusM,
    padding: 14,
  },
  label: {
    fontSize: 13,
    color: theme.purple,
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  photoHint: {
    fontSize: 13,
    color: theme.muted,
    marginBottom: 10,
    lineHeight: 18,
  },
  previewWrap: { marginBottom: 20 },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: theme.radiusL,
    backgroundColor: theme.border,
    borderWidth: 1,
    borderColor: theme.goldSoft,
  },
  changePhoto: { marginTop: 10, alignSelf: "flex-start" },
  changePhotoText: {
    fontSize: 14,
    color: theme.purple,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.goldSoft,
    borderRadius: theme.radiusM,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.text,
    backgroundColor: theme.surfaceSoft,
    marginBottom: 16,
  },
  error: {
    color: theme.danger,
    marginBottom: 12,
    fontSize: 14,
  },
});
