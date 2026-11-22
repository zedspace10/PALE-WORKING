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
  EXOPLANETS_NOW_WORDS,
  GALACTIC_YEAR_MYR,
  galaxyDistanceKm,
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
  const bornOn = birthday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const sunKm = withoutAbout(
    formatApproximateDistance(metrics.approximateOrbitDistanceKm),
  );
  const milkyWayKm = withoutAbout(bigKmWords(galaxyKm));
  const strong = { color: colors.primary, fontFamily: "Inter_600SemiBold" };

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
            ? `Since ${bornOn}, you have been on your first trip around the Sun.`
            : `Since ${bornOn}, you have been around the Sun ${laps} ${laps === 1 ? "time" : "times"}.`}
        </Text>

        <Text style={[styles.para, { color: colors.foreground }]}>
          In that time, Earth has carried you about{" "}
          <Text style={strong}>{sunKm} km</Text> around the Sun, at about 30 km
          every second.
        </Text>
        <Text style={[styles.para, { color: colors.foreground }]}>
          The Sun has carried all of us about{" "}
          <Text style={strong}>{milkyWayKm} km</Text>{" "}
          {"around the middle of the Milky Way"}, at about {SUN_GALACTIC_KM_S}{" "}
          km every second. One lap of
          the galaxy takes it about {GALACTIC_YEAR_MYR} million years. The last
          time it was where it is now, the first dinosaurs were appearing.
        </Text>

        <Text style={[styles.small, { color: colors.mutedForeground }]}>
          That is {withCommas(metrics.ageDays)} days, or{" "}
          {withCommas(metrics.ageHours)} hours. Every figure here is rounded,
          and worked out on this phone.
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
          Your {ordinal(lap.number)} lap
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
              Earth today.
            </Text>
          </View>
        </View>

        {/* What we knew the year you were born, and what has been found since. */}
        <Text
          style={[styles.heading, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          In your lifetime
        </Text>
        {thenLine ? (
          <Text style={[styles.para, { color: colors.foreground }]}>
            The year you were born,{" "}
            {thenLine.replace(" that year", "").charAt(0).toLowerCase() +
              thenLine.replace(" that year", "").slice(1)}{" "}
            Today we know of {EXOPLANETS_NOW_WORDS}.
          </Text>
        ) : null}
        {myEvents.length > 0 ? (
          <Text style={[styles.subhead, { color: colors.mutedForeground }]}>
            Since then
          </Text>
        ) : null}
        {myEvents.map((e) => (
          <View key={`${e.year}-${e.title}`} style={styles.event}>
            <Text style={[styles.eventYear, { color: colors.mutedForeground }]}>
              {e.year}
            </Text>
            <Text style={[styles.eventText, { color: colors.foreground }]}>
              <Text style={{ fontFamily: "Inter_600SemiBold" }}>{e.title}. </Text>
              <Text style={{ color: colors.mutedForeground }}>
                {e.description}
              </Text>
            </Text>
          </View>
        ))}

        <Text style={[styles.closing, { color: colors.foreground }]}>
          Most of the hydrogen in you was made in the first few minutes after
          the Big Bang. Every glass of water you drink holds hydrogen about 13.8
          billion years old.
        </Text>

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

const YEAR_COL = 44;

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  lead: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.3,
    marginTop: 14,
    marginBottom: 18,
  },
  para: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
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
    marginTop: 4,
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
    marginTop: 40,
    marginBottom: 14,
  },
  subhead: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginTop: 8,
    marginBottom: 10,
  },
  lapRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  lapText: { flex: 1 },
  event: {
    flexDirection: "row",
    paddingVertical: 9,
  },
  eventYear: {
    width: YEAR_COL,
    fontSize: 13,
    lineHeight: 21,
    fontFamily: "Inter_500Medium",
  },
  eventText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
  },
  closing: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginTop: 36,
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
