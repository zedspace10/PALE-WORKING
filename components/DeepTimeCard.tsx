import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { type DeepTimeEvent } from "@/constants/cosmicData";

interface Props {
  event: DeepTimeEvent;
  isLast?: boolean;
}

export function DeepTimeCard({ event, isLast = false }: Props) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View
          style={[styles.dot, { backgroundColor: colors.primary }]}
        />
        {!isLast && (
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        )}
      </View>
      <View style={[styles.card, { borderColor: colors.border }]}>
        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          {event.date}
        </Text>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {event.title}
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          {event.description}
        </Text>
        <Text style={[styles.yearsAgo, { color: colors.accent }]}>
          {event.yearsAgo}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 14,
    paddingRight: 20,
  },
  timeline: {
    alignItems: "center",
    width: 12,
    paddingTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  line: {
    width: 1,
    flex: 1,
    marginTop: 6,
    marginBottom: -12,
  },
  card: {
    flex: 1,
    paddingBottom: 24,
    gap: 5,
    borderBottomWidth: 0,
  },
  date: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
  },
  yearsAgo: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
});
