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
  ERA_LABELS,
  ERA_ORDER,
  TIME_MACHINE_EVENTS,
  TimeMachineEra,
  TimeMachineEvent,
} from "@/constants/cosmicTimeMachine";
import { useColors } from "@/hooks/useColors";

function EventCard({
  event,
  isLast,
}: {
  event: TimeMachineEvent;
  isLast: boolean;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.eventRow}>
      {/* Timeline line + dot */}
      <View style={styles.timelineCol}>
        <View style={[styles.dot, { backgroundColor: event.color }]} />
        {!isLast && (
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        )}
      </View>

      {/* Card */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
        style={[
          styles.eventCard,
          {
            backgroundColor: colors.card,
            borderColor: expanded ? event.color + "40" : colors.border,
          },
        ]}
      >
        <View style={styles.eventHeader}>
          <Text style={[styles.eventWhen, { color: event.color + "CC" }]}>
            {event.when}
          </Text>
          <Text
            style={[
              styles.chevron,
              { color: colors.mutedForeground },
            ]}
          >
            {expanded ? "−" : "+"}
          </Text>
        </View>
        <Text style={[styles.eventTitle, { color: colors.foreground }]}>
          {event.title}
        </Text>

        {expanded && (
          <View style={styles.expandedBody}>
            <View
              style={[styles.divider, { backgroundColor: event.color + "30" }]}
            />
            <Text
              style={[styles.eventDesc, { color: colors.mutedForeground }]}
            >
              {event.description}
            </Text>
            <View
              style={[
                styles.perspWrap,
                { borderLeftColor: event.color + "60" },
              ]}
            >
              <Text
                style={[styles.perspLabel, { color: event.color + "90" }]}
              >
                PERSPECTIVE
              </Text>
              <Text
                style={[styles.perspText, { color: colors.foreground }]}
              >
                {event.perspective}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function TimeMachineScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [activeEra, setActiveEra] = useState<TimeMachineEra | "all">("all");

  const filteredEvents =
    activeEra === "all"
      ? TIME_MACHINE_EVENTS
      : TIME_MACHINE_EVENTS.filter((e) => e.era === activeEra);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={60} containerOpacity={0.35} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topPad + 20,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 22,
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
            <Feather
              name="arrow-left"
              size={20}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Cosmic Time Machine
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              from the Big Bang to the far future
            </Text>
          </View>
        </View>

        {/* Banner */}
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.bannerText, { color: colors.foreground }]}>
            13.8 billion years of cosmic history — and everything that came
            after. Tap any moment to travel there.
          </Text>
        </View>

        {/* Era filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eraRow}
        >
          {(["all", ...ERA_ORDER] as (TimeMachineEra | "all")[]).map((era) => {
            const label = era === "all" ? "All" : ERA_LABELS[era];
            const active = activeEra === era;
            return (
              <TouchableOpacity
                key={era}
                onPress={() => setActiveEra(era)}
                style={[
                  styles.eraChip,
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
                    styles.eraText,
                    {
                      color: active ? colors.primary : colors.mutedForeground,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Timeline */}
        <View style={styles.timeline}>
          {filteredEvents.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              isLast={idx === filteredEvents.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: 18 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 2,
  },
  backBtn: { paddingTop: 4 },
  titleSection: { flex: 1, gap: 4 },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    lineHeight: 20,
  },
  banner: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  eraRow: {
    gap: 8,
    paddingRight: 22,
  },
  eraChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  eraText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  timeline: { gap: 0 },
  eventRow: {
    flexDirection: "row",
    gap: 14,
  },
  timelineCol: {
    alignItems: "center",
    width: 16,
    paddingTop: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
  line: {
    width: 1,
    flex: 1,
    marginTop: 6,
    marginBottom: -2,
  },
  eventCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    gap: 4,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventWhen: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 8,
  },
  chevron: {
    fontSize: 18,
    fontFamily: "Inter_300Light",
    lineHeight: 20,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    marginTop: 2,
  },
  expandedBody: { gap: 12, marginTop: 8 },
  divider: { height: 1 },
  eventDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  perspWrap: {
    borderLeftWidth: 2,
    paddingLeft: 14,
    gap: 6,
  },
  perspLabel: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  perspText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 23,
    fontStyle: "italic",
  },
});
