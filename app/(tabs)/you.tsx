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
import {
  formatApproximateDistance,
  getPersonalTravelMetrics,
  parseBirthdayInput,
} from "@/constants/personalInsights";
import { requestGuide } from "@/constants/tabGuide";
import {
  bigKmWords,
  currentLap,
  EXOPLANETS_NOW_WORDS,
  galaxyDistanceKm,
  knownWhenBorn,
  ordinal,
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

const ORBIT = 232;

/**
 * This lap, drawn: the Sun in the middle, the whole orbit faint, the part already travelled
 * brighter, and Earth where it is now. The lap starts at the top, on the birthday.
 */
function LapDrawing({ fraction, startLabel }: { fraction: number; startLabel: string }) {
  const colors = useColors();
  const c = ORBIT / 2;
  const r = c - 14;
  const angle = fraction * Math.PI * 2;
  const x = c + r * Math.sin(angle);
  const y = c - r * Math.cos(angle);
  const large = fraction > 0.5 ? 1 : 0;
  return (
    <View style={styles.lapWrap}>
      <Text style={[styles.lapStart, { color: colors.mutedForeground }]}>
        {startLabel}
      </Text>
      <Svg width={ORBIT} height={ORBIT}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={colors.mutedForeground}
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="1.5 5"
          fill="none"
        />
        <Path
          d={`M${c} ${c - r - 7}V${c - r + 7}`}
          stroke={colors.mutedForeground}
          strokeOpacity={0.7}
          strokeWidth={1}
        />
        {fraction > 0.003 ? (
          <Path
            d={`M${c} ${c - r}A${r} ${r} 0 ${large} 1 ${x} ${y}`}
            stroke={colors.primary}
            strokeWidth={2}
            fill="none"
          />
        ) : null}
        <Circle cx={c} cy={c} r={7} fill="#F5D58A" />
        <Circle cx={x} cy={y} r={5.5} fill={colors.primary} />
      </Svg>
    </View>
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
  const [showCredits, setShowCredits] = useState(false);
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
  const galaxyKm = galaxyDistanceKm(birthday, now);
  const thenLine = knownWhenBorn(birthday);
  const laps = metrics.completedSolarOrbits;
  const bornOn = birthday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const birthdayDay = birthday.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
  const sunKm = withoutAbout(
    formatApproximateDistance(metrics.approximateOrbitDistanceKm),
  );
  const milkyWayKm = withoutAbout(bigKmWords(galaxyKm));
  const strong = { color: colors.primary, fontFamily: "Inter_600SemiBold" };
  const then = thenLine ? thenLine.replace(" that year", "") : null;

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

        <LapDrawing fraction={lap.fraction} startLabel={birthdayDay} />
        <Text style={[styles.lapCaption, { color: colors.mutedForeground }]}>
          {lap.daysIn} {lap.daysIn === 1 ? "day" : "days"} into your{" "}
          {ordinal(lap.number)} lap.
        </Text>

        <Text style={[styles.lead, { color: colors.foreground }]}>
          {laps === 0
            ? `Since ${bornOn}, you have been on your first trip around the Sun.`
            : `Since ${bornOn}, you have been around the Sun ${laps} ${laps === 1 ? "time" : "times"}.`}
        </Text>

        <Text style={[styles.para, { color: colors.mutedForeground }]}>
          That is about{" "}
          <Text style={strong}>{sunKm} km</Text> with Earth, and about{" "}
          <Text style={strong}>{milkyWayKm} km</Text>{" "}
          {"around the middle of the Milky Way"} with the Sun.
        </Text>

        {then ? (
          <Text style={[styles.para, { color: colors.mutedForeground }]}>
            The year you were born,{" "}
            {then.charAt(0).toLowerCase() + then.slice(1)} Today we know of{" "}
            {EXOPLANETS_NOW_WORDS}.
          </Text>
        ) : null}

        <Text style={[styles.closing, { color: colors.mutedForeground }]}>
          Most of the hydrogen in you was made in the first few minutes after
          the Big Bang. It is about 13.8 billion years old.
        </Text>

        <ShareYourNumbers
          sunKm={metrics.approximateOrbitDistanceKm}
          galaxyKm={galaxyKm}
          trips={laps}
        />

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
          <TouchableOpacity
            onPress={() => setShowCredits((v) => !v)}
            style={styles.linkBtn}
            accessibilityRole="button"
            accessibilityState={{ expanded: showCredits }}
          >
            <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
              Picture credits
            </Text>
          </TouchableOpacity>
        </View>

        {showCredits ? <PictureCredits /> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.4,
  },
  lapWrap: { alignItems: "center", marginTop: 18, marginBottom: 22 },
  lapStart: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  lapCaption: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: -6,
    marginBottom: 34,
  },
  lead: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Inter_500Medium",
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  para: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginBottom: 14,
  },
  closing: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
    marginTop: 18,
    paddingTop: 22,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(160,170,185,0.25)",
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
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 20,
    marginTop: 30,
  },
  linkBtn: { alignItems: "center", paddingVertical: 10 },
  linkText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
});
