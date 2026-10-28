import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NightlyReminderToggle } from "@/components/NightlyReminderToggle";
import { MagicalAction } from "@/components/MagicalSurface";
import { StarField } from "@/components/StarField";
import { COSMIC_EVENTS } from "@/constants/cosmicData";
import {
  formatApproximateDistance,
  getEventsAfterBirth,
  getPersonalTravelMetrics,
  parseBirthdayInput,
} from "@/constants/personalInsights";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

// Adds the slashes as someone types a date, so "14061995" becomes "14/06/1995".
function formatBirthdayTyping(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function YouScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    birthday,
    loading,
    error: storageError,
    saveBirthday,
    clearBirthday,
  } = useBirthday();
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  useResetScrollOnFocus(scrollRef);

  const topPad = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleSave = async () => {
    const result = parseBirthdayInput(dateInput, new Date());
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    await saveBirthday(result.date).catch(() => undefined);
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      />
    );
  }

  if (!birthday) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StarField count={50} containerOpacity={0.3} />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingTop: topPad + 20,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 28,
            gap: 20,
          }}
        >
          <Text style={[styles.title, { color: colors.foreground }]}>
            Your Place
          </Text>
          <Text style={[styles.onboardText, { color: colors.mutedForeground }]}>
            Add your birthday to see how far you have travelled around the Sun
            since you were born, and what we have discovered about the universe
            in your lifetime. It stays on this phone.
          </Text>
          <View
            style={[
              styles.inputWrap,
              {
                borderColor: colors.luminousBorder,
                backgroundColor: colors.glassStrong,
              },
            ]}
          >
            <TextInput
              value={dateInput}
              onChangeText={(text) => setDateInput(formatBirthdayTyping(text))}
              maxLength={10}
              accessibilityLabel="Your birthday, as day, month and year"
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.mutedForeground + "80"}
              style={[styles.input, { color: colors.foreground }]}
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
          {error ? (
            <Text
              style={{
                color: colors.destructive,
                fontSize: 13,
                fontFamily: "Inter_400Regular",
              }}
            >
              {error}
            </Text>
          ) : null}
          {storageError ? (
            <Text
              style={{
                color: colors.destructive,
                fontSize: 13,
                fontFamily: "Inter_400Regular",
              }}
            >
              {storageError}
            </Text>
          ) : null}
          <MagicalAction
            onPress={handleSave}
            accessibilityRole="button"
            contentStyle={styles.saveBtn}
          >
            <Text style={[styles.saveBtnText, { color: colors.foreground }]}>
              Show me
            </Text>
          </MagicalAction>
        </ScrollView>
      </View>
    );
  }

  const metrics = getPersonalTravelMetrics(birthday, now);
  const orbitPercent = Math.round(metrics.calendarYearProgressPercent);
  const myEvents = getEventsAfterBirth(COSMIC_EVENTS, birthday);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={50} containerOpacity={0.25} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: topPad + 20,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Your Place
          </Text>
          <Text style={[styles.titleSub, { color: colors.mutedForeground }]}>
            in the cosmos
          </Text>
        </View>

        {/* Distance travelled, in real time */}
        <View
          style={[
            styles.bigCard,
            {
              backgroundColor: colors.glassStrong,
              borderColor: colors.luminousBorder,
            },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            Around the Sun
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {formatApproximateDistance(metrics.approximateOrbitDistanceKm)}
          </Text>
          <Text style={[styles.bigUnit, { color: colors.foreground }]}>
            kilometres travelled with Earth since you were born
          </Text>
          <Text style={[styles.bigNote, { color: colors.mutedForeground }]}>
            Earth moves about 30 km every second. Add the Sun's own journey
            around the galaxy and it is far more.
          </Text>
        </View>

        {/* Orbits */}
        <View
          style={[
            styles.bigCard,
            {
              backgroundColor: colors.glassStrong,
              borderColor: colors.violet + "88",
            },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            Trips around the Sun
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {metrics.completedSolarOrbits}
          </Text>
          <Text style={[styles.bigNote, { color: colors.mutedForeground }]}>
            {metrics.daysSinceLastBirthday} days into the next one
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.row}>
          <View
            style={[
              styles.halfCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {Math.round(metrics.ageDays).toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              days
            </Text>
          </View>
          <View
            style={[
              styles.halfCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {Math.round(metrics.ageHours).toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
              hours lived
            </Text>
          </View>
        </View>

        {/* Atomic age */}
        <View
          style={[
            styles.quoteCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderLeftColor: colors.primary + "60",
            },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            What you are made of
          </Text>
          <Text style={[styles.quoteText, { color: colors.foreground }]}>
            Most of the hydrogen in your body was made in the first moments
            after the Big Bang. Much of the rest, like the carbon in your cells
            and the iron in your blood, was made inside stars that lived and
            died before the Sun was born.
          </Text>
          <Text style={[styles.quoteNote, { color: colors.primary }]}>
            You are ancient.
          </Text>
        </View>

        {/* Orbit progress */}
        <View
          style={[
            styles.orbitCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            This year
          </Text>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${orbitPercent}%` as any,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.orbitPct, { color: colors.primary }]}>
            Since 1 January, Earth has gone {orbitPercent}% of the way around
            the Sun
          </Text>
        </View>

        {/* Cosmic events */}
        {myEvents.length > 0 && (
          <View style={styles.eventsSection}>
            <Text
              style={[styles.cardEyebrow, { color: colors.mutedForeground }]}
            >
              Discovered in your lifetime
            </Text>
            {myEvents.map((event) => (
              <View
                key={event.year}
                style={[styles.eventRow, { borderColor: colors.border }]}
              >
                <Text style={[styles.eventYear, { color: colors.primary }]}>
                  {event.year}
                </Text>
                <View style={styles.eventBody}>
                  <Text
                    style={[styles.eventTitle, { color: colors.foreground }]}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={[
                      styles.eventDesc,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {event.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <NightlyReminderToggle />

        <TouchableOpacity
          onPress={async () => {
            try {
              await clearBirthday();
              setDateInput("");
            } catch {
              // The hook exposes a recoverable storage error beside the form.
            }
          }}
          style={styles.resetBtn}
        >
          <Text style={[styles.resetText, { color: colors.mutedForeground }]}>
            Change birthday
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { gap: 14 },
  sectionHeader: { gap: 2 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  titleSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  onboardText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  saveBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "100%",
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  bigCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 6,
  },
  cardEyebrow: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  bigNumber: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  bigUnit: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  bigNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    marginTop: 4,
  },
  row: { flexDirection: "row", gap: 12 },
  halfCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 5,
  },
  statNum: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  quoteCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderLeftWidth: 2,
    padding: 18,
    gap: 10,
  },
  quoteText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  quoteNote: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  orbitCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2 },
  orbitPct: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  eventsSection: { gap: 12 },
  eventRow: {
    flexDirection: "row",
    gap: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  eventYear: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    width: 40,
    paddingTop: 1,
  },
  eventBody: { flex: 1, gap: 2 },
  eventTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  eventDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  resetBtn: { alignItems: "center", paddingVertical: 8 },
  resetText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
});
