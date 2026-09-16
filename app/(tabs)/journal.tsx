import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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
import { MagicalAction } from "@/components/MagicalSurface";
import { formatJournalUniverseAge } from "@/constants/journal";
import { useColors } from "@/hooks/useColors";
import { EntryType, JournalEntry, useJournal } from "@/hooks/useJournal";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

const TYPE_LABELS: Record<EntryType, string> = {
  worry: "WORRY",
  reflection: "REFLECTION",
  goal: "GOAL",
  thought: "THOUGHT",
};

const TYPE_COLORS: Record<EntryType, string> = {
  worry: "#A995FF",
  reflection: "#8B9BB4",
  goal: "#90D4B0",
  thought: "#D4A8C8",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
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
  const tc = TYPE_COLORS[entry.type];

  return (
    <View
      style={[
        styles.entryCard,
        { backgroundColor: colors.glass, borderColor: colors.luminousBorder },
      ]}
    >
      <View style={styles.entryMeta}>
        <View
          style={[
            styles.typePill,
            { backgroundColor: tc + "18", borderColor: tc + "40" },
          ]}
        >
          <Text style={[styles.typePillText, { color: tc }]}>
            {TYPE_LABELS[entry.type]}
          </Text>
        </View>
        <Text style={[styles.entryDate, { color: colors.mutedForeground }]}>
          {formatDate(entry.date)}
        </Text>
        {entry.moonPhase ? (
          <Text style={[styles.moonPhase, { color: colors.mutedForeground }]}>
            {entry.moonPhase}
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.deleteBtn}
        >
          <Feather name="trash-2" size={13} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.entryText, { color: colors.foreground }]}>
        {entry.text}
      </Text>
      {entry.universeAge || entry.universeAgeEstimate ? (
        <Text style={[styles.universeAge, { color: colors.mutedForeground }]}>
          Universe age estimate: {formatJournalUniverseAge(entry)}
        </Text>
      ) : null}
    </View>
  );
}

type WriteState =
  { active: false } | { active: true; type: EntryType; text: string };

export default function JournalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    entries,
    loading,
    saving,
    error,
    addEntry,
    deleteEntry,
    retryLoad,
    onThisDay,
  } = useJournal();
  const scrollRef = useRef<ScrollView>(null);
  useResetScrollOnFocus(scrollRef);

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [write, setWrite] = useState<WriteState>({ active: false });
  const handleSave = async () => {
    if (!write.active || !write.text.trim()) return;
    try {
      await addEntry({ type: write.type, text: write.text.trim() });
      setWrite({ active: false });
    } catch {
      // The hook exposes the retryable error and the draft stays in `write`.
    }
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
          onPress: () => deleteEntry(id).catch(() => undefined),
        },
      ],
      { userInterfaceStyle: "dark" },
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      />
    );
  }

  if (error?.operation === "load") {
    return (
      <View
        style={[
          styles.container,
          styles.loadError,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          Journal unavailable
        </Text>
        <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
          {error.message}
        </Text>
        <TouchableOpacity
          onPress={retryLoad}
          style={[styles.firstEntryBtn, { borderColor: colors.primary }]}
        >
          <Text style={[styles.firstEntryText, { color: colors.primary }]}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={50} containerOpacity={0.25} />

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
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Journal
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            stored locally · unencrypted
          </Text>
        </View>
        {!write.active && (
          <TouchableOpacity
            onPress={() =>
              setWrite({ active: true, type: "reflection", text: "" })
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

      {/* Write mode */}
      {write.active ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.writeContent,
            { paddingHorizontal: 24, paddingBottom: bottomPad + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.writePrompt, { color: colors.mutedForeground }]}>
            What's on your mind?
          </Text>
          <Text style={[styles.privacyText, { color: colors.mutedForeground }]}>
            Entries stay in unencrypted app storage on this device and are not
            sent to a PALE service. Device backups or anyone with device access
            may still expose them.
          </Text>

          <View style={styles.typeRow}>
            {(Object.keys(TYPE_LABELS) as EntryType[]).map((t) => {
              const active = write.type === t;
              const tc = TYPE_COLORS[t];
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() =>
                    setWrite((w) => (w.active ? { ...w, type: t } : w))
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
            value={write.text}
            onChangeText={(text) =>
              setWrite((w) => (w.active ? { ...w, text } : w))
            }
            placeholder="Write freely. Stored locally on this device."
            placeholderTextColor={colors.mutedForeground + "60"}
            style={[
              styles.textArea,
              {
                color: colors.foreground,
                backgroundColor: colors.glassStrong,
                borderColor: colors.luminousBorder,
              },
            ]}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          {error?.operation === "save" && (
            <View
              style={[styles.errorBanner, { borderColor: colors.destructive }]}
            >
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {error.message}
              </Text>
            </View>
          )}

          <View style={styles.writeActions}>
            <TouchableOpacity
              onPress={() => setWrite({ active: false })}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text
                style={[styles.cancelText, { color: colors.mutedForeground }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <MagicalAction
              onPress={handleSave}
              disabled={saving || !write.text.trim()}
              accessibilityRole="button"
              wrapperStyle={styles.saveBtnWrap}
              style={styles.saveBtnFrame}
              contentStyle={styles.saveBtn}
            >
              <Text style={[styles.saveBtnText, { color: colors.foreground }]}>
                {saving ? "Saving…" : "Save"}
              </Text>
            </MagicalAction>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: 24,
              paddingBottom: bottomPad + 40,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* On This Day */}
          {onThisDay && (
            <View style={styles.lookingBackSection}>
              <View style={styles.onThisDayHeader}>
                <View
                  style={[
                    styles.onThisDayPill,
                    {
                      backgroundColor: colors.secondary + "15",
                      borderColor: colors.secondary + "35",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.onThisDayPillText,
                      { color: colors.secondary },
                    ]}
                  >
                    {onThisDay.exact ? "ON THIS DAY" : "LOOKING BACK"}
                  </Text>
                </View>
                <Text style={[styles.sectionLabel, { color: colors.primary }]}>
                  {onThisDay.label}
                </Text>
              </View>
              <Text
                style={[
                  styles.lookingBackNote,
                  { color: colors.mutedForeground },
                ]}
              >
                {onThisDay.note}
              </Text>
              {onThisDay.entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  onDelete={() => handleDelete(e.id)}
                />
              ))}
              <View
                style={[
                  styles.reflectionPrompt,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <Text
                  style={[
                    styles.reflectionPromptText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  How do you feel about this now? Worries are rarely as
                  permanent as they feel in the moment.
                </Text>
              </View>
              <View
                style={[
                  styles.sectionDivider,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>
          )}

          {entries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                A space for your thoughts
              </Text>
              <Text
                style={[styles.emptyBody, { color: colors.mutedForeground }]}
              >
                Write here. Worries, reflections, goals, thoughts. Over time
                you'll be able to look back and see how much has passed.
              </Text>
              <Text
                style={[styles.emptyMoon, { color: colors.mutedForeground }]}
              >
                Each entry records the moon phase and the age of the universe as
                approximate context, not an exact astronomical snapshot.
              </Text>
              <Text
                style={[styles.emptyMoon, { color: colors.mutedForeground }]}
              >
                Entries are stored locally in unencrypted app storage and are
                not sent to a PALE service.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setWrite({ active: true, type: "reflection", text: "" })
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
            <View style={styles.entriesList}>
              {error?.operation === "delete" && (
                <View
                  style={[
                    styles.errorBanner,
                    { borderColor: colors.destructive },
                  ]}
                >
                  <Text
                    style={[styles.errorText, { color: colors.destructive }]}
                  >
                    {error.message}
                  </Text>
                </View>
              )}
              {entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  onDelete={() => handleDelete(e.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadError: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  headerLeft: { gap: 2 },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.2,
  },
  newBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: { paddingTop: 22, gap: 14 },
  lookingBackSection: { gap: 10 },
  onThisDayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  onThisDayPill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  onThisDayPillText: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.8,
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  lookingBackNote: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  reflectionPrompt: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  reflectionPromptText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
  },
  sectionDivider: { height: 1, marginVertical: 6 },
  entriesList: { gap: 14 },
  entryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  entryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typePill: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  typePillText: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
  },
  entryDate: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  moonPhase: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  deleteBtn: { padding: 2 },
  entryText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  universeAge: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 8,
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
  emptyMoon: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    textAlign: "center",
    fontStyle: "italic",
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
  writeContent: { paddingTop: 24, gap: 18 },
  writePrompt: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  privacyText: {
    fontSize: 12,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
  },
  errorBanner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_500Medium",
  },
  typeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  typeChip: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  typeChipText: {
    fontSize: 9,
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
    minHeight: 200,
  },
  writeActions: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  saveBtn: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnWrap: { flex: 1 },
  saveBtnFrame: { borderRadius: 12, width: "100%" },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
});
