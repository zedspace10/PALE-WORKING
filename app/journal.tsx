import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import { useColors } from "@/hooks/useColors";
import { EntryType, JournalEntry, useJournal } from "@/hooks/useJournal";

const TYPE_LABELS: Record<EntryType, string> = {
  worry: "WORRY",
  reflection: "REFLECTION",
  goal: "GOAL",
  thought: "THOUGHT",
};

const TYPE_COLORS: Record<EntryType, string> = {
  worry: "#C8A0F0",
  reflection: "#7BA9F0",
  goal: "#90D4B0",
  thought: "#F0C87A",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EntryCard({
  entry,
  onDelete,
}: {
  entry: JournalEntry;
  onDelete: () => void;
}) {
  const colors = useColors();
  const typeColor = TYPE_COLORS[entry.type];

  return (
    <View
      style={[
        styles.entryCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.entryMeta}>
        <View
          style={[
            styles.typePill,
            { backgroundColor: typeColor + "18", borderColor: typeColor + "40" },
          ]}
        >
          <Text style={[styles.typeLabel, { color: typeColor }]}>
            {TYPE_LABELS[entry.type]}
          </Text>
        </View>
        <Text style={[styles.entryDate, { color: colors.mutedForeground }]}>
          {formatDate(entry.date)}
        </Text>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="trash-2" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.entryText, { color: colors.foreground }]}>
        {entry.text}
      </Text>
    </View>
  );
}

type WriteView = { active: false } | { active: true; type: EntryType; text: string };

export default function JournalScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { entries, loading, addEntry, deleteEntry, lookingBack } = useJournal();

  const [view, setView] = useState<WriteView>({ active: false });
  const [saving, setSaving] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = async () => {
    if (!view.active || !view.text.trim()) return;
    setSaving(true);
    await addEntry({ type: view.type, text: view.text.trim() });
    setSaving(false);
    setView({ active: false });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete entry?",
      "This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteEntry(id),
        },
      ],
      { userInterfaceStyle: "dark" }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.35} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 12,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Journal
          </Text>
          <Text
            style={[styles.headerSub, { color: colors.mutedForeground }]}
          >
            private perspective
          </Text>
        </View>
        {!view.active && (
          <TouchableOpacity
            onPress={() =>
              setView({ active: true, type: "reflection", text: "" })
            }
            style={[
              styles.newBtn,
              {
                backgroundColor: colors.primary + "18",
                borderColor: colors.primary + "40",
              },
            ]}
          >
            <Feather name="edit-3" size={15} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Write view */}
      {view.active ? (
        <ScrollView
          contentContainerStyle={[
            styles.writeContent,
            {
              paddingBottom: bottomPad + 40,
              paddingHorizontal: 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[styles.writePrompt, { color: colors.mutedForeground }]}
          >
            What's on your mind?
          </Text>

          {/* Type selector */}
          <View style={styles.typeRow}>
            {(Object.keys(TYPE_LABELS) as EntryType[]).map((t) => {
              const active = view.type === t;
              const tc = TYPE_COLORS[t];
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() =>
                    setView((v) => (v.active ? { ...v, type: t } : v))
                  }
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: active ? tc + "22" : colors.card,
                      borderColor: active ? tc + "60" : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeChipText,
                      { color: active ? tc : colors.mutedForeground },
                    ]}
                  >
                    {TYPE_LABELS[t]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            value={view.text}
            onChangeText={(text) =>
              setView((v) => (v.active ? { ...v, text } : v))
            }
            placeholder="Write freely. This is private."
            placeholderTextColor={colors.mutedForeground + "80"}
            style={[
              styles.textArea,
              {
                color: colors.foreground,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          <View style={styles.writeActions}>
            <TouchableOpacity
              onPress={() => setView({ active: false })}
              style={[
                styles.cancelBtn,
                { borderColor: colors.border },
              ]}
            >
              <Text
                style={[styles.cancelText, { color: colors.mutedForeground }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving || !view.text.trim()}
              style={[
                styles.saveBtn,
                {
                  backgroundColor:
                    view.text.trim() ? colors.primary : colors.primary + "50",
                },
              ]}
            >
              <Text
                style={[
                  styles.saveBtnText,
                  { color: colors.primaryForeground },
                ]}
              >
                {saving ? "Saving…" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: bottomPad + 40,
              paddingHorizontal: 24,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Looking back */}
          {lookingBack.length > 0 && (
            <View style={styles.lookingBackSection}>
              <Text
                style={[
                  styles.sectionLabel,
                  { color: colors.accent },
                ]}
              >
                LOOKING BACK
              </Text>
              <Text
                style={[
                  styles.lookingBackSub,
                  { color: colors.mutedForeground },
                ]}
              >
                Around this time last year, you wrote:
              </Text>
              {lookingBack.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  onDelete={() => handleDelete(e.id)}
                />
              ))}
            </View>
          )}

          {/* All entries */}
          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyTitle, { color: colors.foreground }]}
              >
                A space for your thoughts
              </Text>
              <Text
                style={[
                  styles.emptyBody,
                  { color: colors.mutedForeground },
                ]}
              >
                Record your worries, reflections, and goals here. Over time,
                you'll be able to look back and see how much has changed.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setView({ active: true, type: "reflection", text: "" })
                }
                style={[
                  styles.firstEntryBtn,
                  {
                    borderColor: colors.primary + "55",
                    backgroundColor: colors.primary + "10",
                  },
                ]}
              >
                <Text
                  style={[styles.firstEntryText, { color: colors.primary }]}
                >
                  Write your first entry
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {lookingBack.length > 0 && (
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: colors.mutedForeground, marginBottom: 12 },
                  ]}
                >
                  ALL ENTRIES
                </Text>
              )}
              {entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  onDelete={() => handleDelete(e.id)}
                />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginBottom: 2,
  },
  headerTitles: { flex: 1, gap: 2 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  newBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  listContent: { gap: 14, paddingTop: 24 },
  lookingBackSection: { gap: 10, marginBottom: 8 },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  lookingBackSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginBottom: 4,
  },
  entryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typePill: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  typeLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
  },
  entryDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  entryText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
  },
  firstEntryBtn: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  firstEntryText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  writeContent: { paddingTop: 28, gap: 20 },
  writePrompt: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  typeChipText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    minHeight: 220,
  },
  writeActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  saveBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
});
