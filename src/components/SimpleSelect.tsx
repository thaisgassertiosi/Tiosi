import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";

export type SelectOption<T extends string | number> = {
  label: string;
  value: T;
};

type Props<T extends string | number> = {
  label: string;
  placeholder: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

export function SimpleSelect<T extends string | number>({
  label,
  placeholder,
  value,
  options,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.field,
          pressed && { opacity: 0.92 },
        ]}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.option,
                    pressed && { backgroundColor: theme.bg },
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
            <Pressable style={styles.cancel} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 13,
    color: theme.muted,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  field: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radiusM,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: theme.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: { fontSize: 16, color: theme.text, flex: 1 },
  placeholder: { fontSize: 16, color: theme.muted, flex: 1 },
  chevron: { fontSize: 14, color: theme.muted, marginLeft: 8 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(44,41,37,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: theme.radiusL,
    borderTopRightRadius: theme.radiusL,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  optionText: { fontSize: 16, color: theme.text },
  cancel: {
    marginTop: 12,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelText: { fontSize: 15, color: theme.muted },
});
