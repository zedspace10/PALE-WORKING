import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import {
  LIBRARY_AUTHORS,
  LIBRARY_ENTRIES,
  LibraryThinker,
  getEntriesByAuthor,
} from "@/constants/library";
import { useColors } from "@/hooks/useColors";

const AUTHOR_SHORT: Record<LibraryThinker, string> = {
  "Carl Sagan": "Sagan",
  "Marcus Aurelius": "Aurelius",
  "Seneca": "Seneca",
  "Alan Watts": "Watts",
  "Viktor Frankl": "Frankl",
  "Richard Feynman": "Feynman",
};

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [selectedAuthor, setSelectedAuthor] = useState<LibraryThinker | "All">(
    "All"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const entries =
    selectedAuthor === "All"
      ? LIBRARY_ENTRIES
      : getEntriesByAuthor(selectedAuthor);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.25} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 24,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              The Library
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              perspective through the ages
            </Text>
          </View>
        </View>

        {/* Author filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {(["All", ...LIBRARY_AUTHORS] as (LibraryThinker | "All")[]).map(
            (a) => {
              const label = a === "All" ? "All" : AUTHOR_SHORT[a];
              const active = selectedAuthor === a;
              return (
                <TouchableOpacity
                  key={a}
                  onPress={() => setSelectedAuthor(a)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: active
                        ? colors.primary + "18"
                        : colors.card,
                      borderColor: active
                        ? colors.primary + "55"
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: active
                          ? colors.primary
                          : colors.mutedForeground,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>

        {/* Count */}
        <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
          {entries.length} {entries.length === 1 ? "passage" : "passages"}
        </Text>

        {/* Entries */}
        {entries.map((entry) => {
          const expanded = expandedId === entry.id;
          return (
            <TouchableOpacity
              key={entry.id}
              onPress={() => setExpandedId(expanded ? null : entry.id)}
              activeOpacity={0.8}
              style={[
                styles.entryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: expanded
                    ? colors.primary + "35"
                    : colors.border,
                },
              ]}
            >
              <Text
                style={[styles.quoteText, { color: colors.foreground }]}
                numberOfLines={expanded ? undefined : 3}
              >
                {entry.text}
              </Text>
              <View style={styles.entryFooter}>
                <View>
                  <Text
                    style={[styles.authorName, { color: colors.primary }]}
                  >
                    {entry.author}
                  </Text>
                  <Text
                    style={[
                      styles.authorTitle,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {entry.authorTitle}
                  </Text>
                </View>
                <View
                  style={[
                    styles.topicBadge,
                    { borderColor: colors.border, backgroundColor: "transparent" },
                  ]}
                >
                  <Text
                    style={[
                      styles.topicText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {entry.topic}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: 14 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 4,
  },
  backBtn: {
    paddingTop: 6,
  },
  titleSection: { flex: 1, gap: 4 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    letterSpacing: 0.3,
  },
  filterRow: {
    gap: 8,
    paddingVertical: 4,
    paddingRight: 24,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  countLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 2,
  },
  entryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    fontStyle: "italic",
    letterSpacing: 0.1,
  },
  entryFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  authorName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  authorTitle: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  topicBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  topicText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
