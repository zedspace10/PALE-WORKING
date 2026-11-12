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

import { MagicalAction } from "@/components/MagicalSurface";
import { NightlyReminderToggle } from "@/components/NightlyReminderToggle";
import { NoteMilestonesToggle } from "@/components/NoteMilestonesToggle";
import { PictureCredits } from "@/components/PictureCredits";
import { ShareYourNumbers } from "@/components/ShareYourNumbers";
import { StarField } from "@/components/StarField";
import { ThisWeekToggle } from "@/components/ThisWeekToggle";
import { COSMIC_EVENTS } from "@/constants/cosmicData";
import {
  formatApproximateDistance,
  getEventsAfterBirth,
  getPersonalTravelMetrics,
  parseBirthdayInput,
} from "@/constants/personalInsights";
import { requestGuide } from "@/constants/tabGuide";
import {
  bigKmWords,
  discoveryAtBirth,
  GALAXY_NOTE,
  galaxyDistanceKm,
} from "@/constants/youFacts";
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

/** "11,201": commas without relying on the phone's number formatting. */
function withCommas(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** A small heading over each part of the tab. */
function Section({ children }: { children: string }) {
  const colors = useColors();
  return (
    <Text
      style={[styles.section, { color: colors.mutedForeground }]}
      accessibilityRole="header"
    >
      {children}
    </Text>
  );
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
          <Text style={[styles.title, { color: colors.foreground }]}>You</Text>
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
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error}
            </Text>
          ) : null}
          {storageError ? (
            <Text style={[styles.errorText, { color: colors.destructive }]}>
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

          <TouchableOpacity
            onPress={requestGuide}
            style={styles.linkBtn}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              Show me around PALE
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const metrics = getPersonalTravelMetrics(birthday, now);
  const orbitPercent = Math.round(metrics.calendarYearProgressPercent);
  const myEvents = getEventsAfterBirth(COSMIC_EVENTS, birthday);
  const galaxyKm = galaxyDistanceKm(birthday, now);
  const discovery = discoveryAtBirth(birthday);

  const card = {
    backgroundColor: colors.card,
    borderColor: colors.border,
  };

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
        <Text style={[styles.title, { color: colors.foreground }]}>You</Text>

        {/* How far you have come: with Earth around the Sun, and with the Sun around the galaxy. */}
        <Section>Since you were born</Section>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.glassStrong,
              borderColor: colors.luminousBorder,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
            Around the Sun
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {formatApproximateDistance(metrics.approximateOrbitDistanceKm)} km
          </Text>
          <Text style={[styles.note, { color: colors.mutedForeground }]}>
            With Earth, at about 30 km every second.
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
            Around the galaxy
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {bigKmWords(galaxyKm)} km
          </Text>
          <Text style={[styles.note, { color: colors.mutedForeground }]}>
            {GALAXY_NOTE}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: colors.foreground }]}>
                {metrics.completedSolarOrbits}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.mutedForeground }]}
              >
                laps of the Sun
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: colors.foreground }]}>
                {withCommas(metrics.ageDays)}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.mutedForeground }]}
              >
                days
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statNum, { color: colors.foreground }]}>
                {withCommas(metrics.ageHours)}
              </Text>
              <Text
                style={[styles.statLabel, { color: colors.mutedForeground }]}
              >
                hours
              </Text>
            </View>
          </View>
        </View>

        <ShareYourNumbers
          sunKm={metrics.approximateOrbitDistanceKm}
          galaxyKm={galaxyKm}
          trips={metrics.completedSolarOrbits}
        />

        {/* Where Earth is on this lap. */}
        <Section>This year</Section>
        <View style={[styles.card, card]}>
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
          <Text style={[styles.body, { color: colors.foreground }]}>
            Since 1 January, Earth has gone {orbitPercent}% of the way around
            the Sun.
          </Text>
          <Text style={[styles.note, { color: colors.mutedForeground }]}>
            You are {metrics.daysSinceLastBirthday} days into your next trip
            around it.
          </Text>
        </View>

        {/* Atomic age */}
        <Section>What you are made of</Section>
        <View style={[styles.card, card]}>
          <Text style={[styles.body, { color: colors.foreground }]}>
            Most of the hydrogen in your body was made in the first moments
            after the Big Bang. Every glass of water you drink holds hydrogen
            about 13.8 billion years old.
          </Text>
        </View>

        {/* What we knew when you were born, then what has been found since. */}
        {discovery || myEvents.length > 0 ? (
          <Section>In your lifetime</Section>
        ) : null}
        {discovery ? (
          <View style={[styles.card, card]}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
              What we knew when you were born
            </Text>
            <Text style={[styles.midNumber, { color: colors.primary }]}>
              {discovery.number}
            </Text>
            <Text style={[styles.body, { color: colors.foreground }]}>
              {discovery.unit}
            </Text>
            <Text style={[styles.note, { color: colors.mutedForeground }]}>
              {discovery.note}
            </Text>
          </View>
        ) : null}
        {myEvents.length > 0 ? (
          <View style={[styles.card, card, styles.eventsCard]}>
            {myEvents.map((event, i) => (
              <View
                key={event.year}
                style={[
                  styles.eventRow,
                  i > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                  },
                ]}
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
        ) : null}

        <Section>Reminders</Section>
        <NightlyReminderToggle />
        <NoteMilestonesToggle />
        <ThisWeekToggle />

        <View style={styles.links}>
          <TouchableOpacity
            onPress={requestGuide}
            style={styles.linkBtn}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              Show me around PALE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                await clearBirthday();
                setDateInput("");
              } catch {
                // The hook exposes a recoverable storage error beside the form.
              }
            }}
            style={styles.linkBtn}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              Change birthday
            </Text>
          </TouchableOpacity>
        </View>

        <PictureCredits />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { gap: 12 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  section: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 18,
    marginLeft: 4,
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
  errorText: { fontSize: 13, fontFamily: "Inter_400Regular" },
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
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  bigNumber: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 36,
  },
  midNumber: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  statRow: { flexDirection: "row", gap: 12 },
  stat: { flex: 1, gap: 2 },
  statNum: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", borderRadius: 2 },
  eventsCard: { paddingVertical: 6, gap: 0 },
  eventRow: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 14,
  },
  eventYear: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    width: 40,
    paddingTop: 1,
  },
  eventBody: { flex: 1, gap: 3 },
  eventTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  eventDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 18,
  },
  linkBtn: { alignItems: "center", paddingVertical: 10 },
  linkText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
});
