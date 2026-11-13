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
import Svg, { Circle, Path } from "react-native-svg";

import { MagicalAction } from "@/components/MagicalSurface";
import { PictureCredits } from "@/components/PictureCredits";
import { ShareYourNumbers } from "@/components/ShareYourNumbers";
import { StarField } from "@/components/StarField";
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
  currentLap,
  GALACTIC_YEAR_MYR,
  galaxyDistanceKm,
  KNOWN_TODAY,
  knownWhenBorn,
  ordinal,
  SUN_GALACTIC_KM_S,
  withoutAbout,
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
  return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const ORBIT = 92;

/**
 * This lap, drawn: the Sun in the middle, the whole orbit faint, the part already travelled
 * brighter, and Earth where it is now. The lap starts at the top, on the birthday.
 */
function LapDrawing({ fraction }: { fraction: number }) {
  const colors = useColors();
  const c = ORBIT / 2;
  const r = c - 8;
  const angle = fraction * Math.PI * 2;
  const x = c + r * Math.sin(angle);
  const y = c - r * Math.cos(angle);
  const large = fraction > 0.5 ? 1 : 0;
  return (
    <Svg width={ORBIT} height={ORBIT}>
      <Circle
        cx={c}
        cy={c}
        r={r}
        stroke={colors.mutedForeground}
        strokeOpacity={0.45}
        strokeWidth={1}
        strokeDasharray="1.5 4"
        fill="none"
      />
      {fraction > 0.003 ? (
        <Path
          d={`M${c} ${c - r}A${r} ${r} 0 ${large} 1 ${x} ${y}`}
          stroke={colors.primary}
          strokeWidth={2}
          fill="none"
        />
      ) : null}
      <Circle cx={c} cy={c} r={4} fill="#F5D58A" />
      <Circle cx={x} cy={y} r={4.5} fill={colors.primary} />
    </Svg>
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
  const lap = currentLap(birthday, now);
  const myEvents = getEventsAfterBirth(COSMIC_EVENTS, birthday);
  const galaxyKm = galaxyDistanceKm(birthday, now);
  const thenLine = knownWhenBorn(birthday);
  const laps = metrics.completedSolarOrbits;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={50} containerOpacity={0.25} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 100,
          paddingHorizontal: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>You</Text>

        <Text style={[styles.lead, { color: colors.foreground }]}>
          {laps === 0
            ? "You are on your first trip around the Sun."
            : `You have been around the Sun ${laps} ${laps === 1 ? "time" : "times"}. This is your ${ordinal(lap.number)} lap.`}
        </Text>

        {/* How far: with Earth around the Sun, and with the Sun around the galaxy. */}
        <View style={styles.block}>
          <Text style={[styles.figure, { color: colors.primary }]}>
            {withoutAbout(
              formatApproximateDistance(metrics.approximateOrbitDistanceKm),
            )}{" "}
            km
          </Text>
          <Text style={[styles.body, { color: colors.foreground }]}>
            with Earth, around the Sun, at about 30 km every second.
          </Text>
        </View>

        <View style={[styles.rule, { backgroundColor: colors.border }]} />

        <View style={styles.block}>
          <Text style={[styles.figure, { color: colors.primary }]}>
            {withoutAbout(bigKmWords(galaxyKm))} km
          </Text>
          <Text style={[styles.body, { color: colors.foreground }]}>
            with the Sun, around the middle of the Milky Way, at about{" "}
            {SUN_GALACTIC_KM_S} km every second.
          </Text>
          <Text style={[styles.aside, { color: colors.mutedForeground }]}>
            One lap of the galaxy takes the Sun about {GALACTIC_YEAR_MYR}{" "}
            million years. The last time it was here, the first dinosaurs were
            appearing.
          </Text>
        </View>

        <Text style={[styles.small, { color: colors.mutedForeground }]}>
          {withCommas(metrics.ageDays)} days, or {withCommas(metrics.ageHours)}{" "}
          hours. Every figure here is rounded, and worked out on this phone.
        </Text>

        <ShareYourNumbers
          sunKm={metrics.approximateOrbitDistanceKm}
          galaxyKm={galaxyKm}
          trips={laps}
        />

        {/* This lap, from the last birthday to the next. */}
        <Text
          style={[styles.heading, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          This lap
        </Text>
        <View style={styles.lapRow}>
          <LapDrawing fraction={lap.fraction} />
          <View style={styles.lapText}>
            <Text style={[styles.body, { color: colors.foreground }]}>
              {lap.daysIn} {lap.daysIn === 1 ? "day" : "days"} in, and{" "}
              {lap.daysLeft} to go until your birthday.
            </Text>
            <Text style={[styles.aside, { color: colors.mutedForeground }]}>
              The lap starts at the top, on your birthday. The blue dot is
              Earth today, and the dotted part is still to come.
            </Text>
          </View>
        </View>

        {/* Atomic age */}
        <View style={[styles.quote, { borderLeftColor: colors.primary }]}>
          <Text style={[styles.quoteText, { color: colors.foreground }]}>
            Most of the hydrogen in you was made in the first moments after the
            Big Bang. Every glass of water you drink holds hydrogen about 13.8
            billion years old.
          </Text>
        </View>

        {/* What we knew the year you were born, what has been found since, and today. */}
        <Text
          style={[styles.heading, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          In your lifetime
        </Text>
        <View style={styles.timeline}>
          <View
            style={[styles.timelineLine, { backgroundColor: colors.border }]}
          />
          {[
            {
              key: "born",
              year: String(birthday.getFullYear()),
              title: "You were born",
              text: thenLine,
            },
            ...myEvents.map((e) => ({
              key: `${e.year}-${e.title}`,
              year: String(e.year),
              title: e.title,
              text: e.description,
            })),
            ...(thenLine
              ? [
                  {
                    key: "today",
                    year: "Now",
                    title: "Today",
                    text: KNOWN_TODAY,
                  },
                ]
              : []),
          ].map((item) => (
            <View key={item.key} style={styles.timelineItem}>
              <Text style={[styles.timelineYear, { color: colors.primary }]}>
                {item.year}
              </Text>
              <View
                style={[
                  styles.timelineDot,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                  },
                ]}
              />
              <View style={styles.timelineBody}>
                <Text
                  style={[styles.timelineTitle, { color: colors.foreground }]}
                >
                  {item.title}
                </Text>
                {item.text ? (
                  <Text
                    style={[
                      styles.timelineText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {item.text}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

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

const YEAR_COL = 46;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  lead: {
    fontSize: 21,
    lineHeight: 29,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.3,
    marginTop: 14,
    marginBottom: 30,
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
  block: { gap: 6 },
  figure: {
    fontSize: 38,
    lineHeight: 44,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },
  aside: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  small: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    marginTop: 26,
    marginBottom: 14,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 24,
    width: 48,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    marginTop: 44,
    marginBottom: 16,
  },
  lapRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  lapText: { flex: 1 },
  quote: {
    borderLeftWidth: 2,
    paddingLeft: 18,
    marginTop: 44,
  },
  quoteText: {
    fontSize: 17,
    lineHeight: 27,
    fontFamily: "Inter_400Regular",
  },
  timeline: { position: "relative" },
  timelineLine: {
    position: "absolute",
    left: YEAR_COL + 4,
    top: 8,
    bottom: 8,
    width: 1,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 22,
  },
  timelineYear: {
    width: YEAR_COL,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    paddingTop: 1,
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    marginTop: 5,
    marginRight: 14,
  },
  timelineBody: { flex: 1, gap: 3 },
  timelineTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  timelineText: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 30,
  },
  linkBtn: { alignItems: "center", paddingVertical: 10 },
  linkText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
});
