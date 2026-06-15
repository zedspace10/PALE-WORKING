import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { StarField } from "@/components/StarField";
import { findStarByAge } from "@/constants/starCatalog";
import { useBirthday } from "@/hooks/useBirthday";

const GOLD = "#C8A96E";
const WARM_WHITE = "#F5F0E8";

// ── Lookup tables ──────────────────────────────────────────────────────────────

interface StarData {
  spectral: "O" | "B" | "A" | "F" | "G" | "K" | "M";
  ra?: number;
  dec?: number;
}

const STAR_DATA: Record<string, StarData> = {
  "Proxima Centauri": { spectral: "M", ra: 217.4, dec: -62.7 },
  "Alpha Centauri":   { spectral: "G", ra: 219.9, dec: -60.8 },
  "Barnard's Star":   { spectral: "M", ra: 269.5, dec: 4.7 },
  Sirius:             { spectral: "A", ra: 101.3, dec: -16.7 },
  "Epsilon Eridani":  { spectral: "K", ra: 53.2,  dec: -9.5 },
  Procyon:            { spectral: "F", ra: 114.8, dec: 5.2 },
  "Tau Ceti":         { spectral: "G", ra: 26.0,  dec: -15.9 },
  Altair:             { spectral: "A", ra: 297.7, dec: 8.9 },
  Vega:               { spectral: "A", ra: 279.2, dec: 38.8 },
  Fomalhaut:          { spectral: "A", ra: 344.4, dec: -29.6 },
  Pollux:             { spectral: "K", ra: 116.3, dec: 28.0 },
  Arcturus:           { spectral: "K", ra: 213.9, dec: 19.2 },
  Capella:            { spectral: "G", ra: 79.2,  dec: 46.0 },
  Castor:             { spectral: "A", ra: 113.6, dec: 31.9 },
  Caph:               { spectral: "F", ra: 2.3,   dec: 59.1 },
  Aldebaran:          { spectral: "K", ra: 68.9,  dec: 16.5 },
  Hamal:              { spectral: "K", ra: 31.8,  dec: 23.5 },
  Regulus:            { spectral: "B", ra: 152.1, dec: 11.9 },
  Merak:              { spectral: "A", ra: 165.5, dec: 56.4 },
  Megrez:             { spectral: "A", ra: 183.9, dec: 57.0 },
  Mizar:              { spectral: "A", ra: 200.9, dec: 54.9 },
  Phecda:             { spectral: "A", ra: 178.5, dec: 53.7 },
  Gacrux:             { spectral: "M", ra: 187.8, dec: -57.1 },
  Alkaid:             { spectral: "B", ra: 206.9, dec: 49.3 },
  Alhena:             { spectral: "A", ra: 99.4,  dec: 16.4 },
  Dubhe:              { spectral: "K", ra: 165.9, dec: 61.8 },
  Kochab:             { spectral: "K", ra: 222.7, dec: 74.2 },
  Mirach:             { spectral: "M", ra: 17.4,  dec: 35.6 },
  Schedar:            { spectral: "K", ra: 10.1,  dec: 56.5 },
  Spica:              { spectral: "B", ra: 201.3, dec: -11.2 },
  Canopus:            { spectral: "F", ra: 95.9,  dec: -52.7 },
  Polaris:            { spectral: "F", ra: 37.9,  dec: 89.3 },
  Betelgeuse:         { spectral: "M", ra: 88.8,  dec: 7.4 },
  Rigel:              { spectral: "B", ra: 78.6,  dec: -8.2 },
  Deneb:              { spectral: "A", ra: 310.4, dec: 45.3 },
};

const SPECTRAL_COLOR: Record<string, string> = {
  O: "#B0C4FF",
  B: "#B0C4FF",
  A: "#F0F0FF",
  F: "#FFF8E8",
  G: "#FFF3B0",
  K: "#FFD4A0",
  M: "#FFB090",
};

const YEAR_CONTEXT: Record<number, string> = {
  2010: "Smartphones were just becoming part of everyday life.",
  2005: "YouTube had just been founded.",
  2000: "The world had just entered a new millennium.",
  1995: "The internet was just becoming public.",
  1990: "The Hubble Space Telescope had just been launched.",
  1985: "The first mobile phone call had just been made.",
  1980: "Humans had walked on the Moon just 11 years earlier.",
  1975: "The last Apollo mission had recently returned.",
  1969: "Humans had just walked on the Moon for the first time.",
  1961: "The first human had just reached space.",
  1953: "The structure of DNA had just been discovered.",
  1945: "The Second World War had just ended.",
  1939: "The Second World War was just beginning.",
  1929: "The Great Depression was beginning.",
  1920: "Commercial radio broadcasting was just beginning.",
  1903: "No human had yet left the ground in a powered aircraft.",
  1900: "There were no aeroplanes. No antibiotics. No internet.",
  1850: "The photograph had only just been invented.",
  1800: "The Industrial Revolution was transforming the world.",
  1776: "The United States had just declared independence.",
  1700: "Isaac Newton was still alive.",
  1600: "Shakespeare was writing his greatest plays.",
  1500: "Columbus had recently reached the Americas.",
  1400: "The printing press had not yet been invented.",
  1000: "The Viking Age was at its height.",
  500:  "Great civilisations were rising across Asia and Africa.",
  100:  "The Roman Empire was at its peak.",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getSpectral(name: string): StarData["spectral"] {
  return STAR_DATA[name]?.spectral ?? "G";
}

function getStarColor(name: string): string {
  return SPECTRAL_COLOR[getSpectral(name)] ?? "#FFF3B0";
}

function getYearContext(year: number): string {
  const keys = Object.keys(YEAR_CONTEXT).map(Number).sort((a, b) => b - a);
  const closest = keys.reduce((prev, k) =>
    Math.abs(k - year) < Math.abs(prev - year) ? k : prev
  );
  return YEAR_CONTEXT[closest] ?? "";
}

function getSpectralText(spectral: string, name: string): string {
  switch (spectral) {
    case "M":
      return `${name} is a red dwarf — smaller and cooler than our Sun. It burns its fuel so slowly and so carefully that it will be shining long after most other stars have dimmed. In cosmic terms it is steady. Persistent. Quietly extraordinary. It has been burning since before our solar system formed.`;
    case "G":
      return `${name} is remarkably similar to our own Sun. The same warmth. The same steadiness. The same golden light. If it has planets — and it may — the conditions for something extraordinary are not impossible. It has been here long before us and will be here long after.`;
    case "K":
      return `${name} is an orange dwarf — warmer and steadier than most stars. It burns with a patience that our own Sun cannot match. Some astronomers consider stars like this the most welcoming in the galaxy — stable, warm, enduring. ${name} has been burning steadily since before Earth had oceans.`;
    case "F":
      return `${name} burns brighter and more intensely than our Sun. It outshines most of its neighbours. It fills the space around it with more light than our own star could ever produce. What it lacks in patience it makes up for in brilliance. Some stars just burn that way.`;
    case "A":
      return `${name} is a white star — hotter and more luminous than our Sun. Among the brightest things in its region of the galaxy. Pure white light. Intense and clear. It has been shining like this since long before humans had words for stars.`;
    case "B":
    case "O":
      return `${name} is one of the hottest and most luminous stars that exist. Blue-white and blazing. It outshines most things in the galaxy. A star like this is rare. You are here at the same moment it is. That is not nothing.`;
    default:
      return `${name} has been shining steadily through the centuries. Patient and ancient. Present before you arrived. Present still.`;
  }
}

function getLocalSiderealTime(lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525;
  const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  return ((GMST + lng) % 360 + 360) % 360;
}

function getAltitude(ra: number, dec: number, lat: number, lst: number): number {
  const ha = ((lst - ra + 360) % 360) * (Math.PI / 180);
  const decRad = dec * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha);
  return (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;
}

function getDirection(ra: number, dec: number, lat: number, lst: number): string {
  const ha = ((lst - ra + 360) % 360) * (Math.PI / 180);
  const decRad = dec * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(ha);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAlt = Math.cos(altRad);
  const cosAz = cosAlt > 0.0001
    ? (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt)
    : 0;
  let az = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  if (Math.sin(ha) > 0) az = 360 - az;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(az / 45) % 8];
}

function getHeightDesc(alt: number): string {
  if (alt < 20) return "low on the horizon";
  if (alt < 35) return "rising in the sky";
  if (alt < 60) return "in the mid sky";
  if (alt < 80) return "high overhead";
  return "nearly directly overhead";
}

function getRiseTimeStr(ra: number, dec: number, lat: number, date: Date, lng: number): string {
  const cosHa = -Math.tan((lat * Math.PI) / 180) * Math.tan((dec * Math.PI) / 180);
  if (cosHa < -1 || cosHa > 1) return "above your horizon all night";
  const ha = (Math.acos(cosHa) * 180) / Math.PI;
  const riseLST = ((ra - ha) % 360 + 360) % 360;
  const currentLST = getLocalSiderealTime(lng, date);
  const deltaLST = ((riseLST - currentLST) % 360 + 360) % 360;
  const deltaHours = deltaLST / 15.04;
  const riseDate = new Date(date.getTime() + deltaHours * 3600000);
  return riseDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Star visual ────────────────────────────────────────────────────────────────

function StarVisual({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.5,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1.0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={styles.visualCenter}>
      <Animated.View
        style={[styles.glow4, { backgroundColor: color, transform: [{ scale: pulse }] }]}
      />
      <View style={[styles.glow3, { backgroundColor: color }]} />
      <View style={[styles.glow2, { backgroundColor: color }]} />
      <View style={[styles.glow1, { backgroundColor: color }]} />
      <View style={styles.core} />
    </View>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────────

interface OnboardingProps {
  onBirthdaySet: () => void;
}

function OnboardingScreen({ onBirthdaySet }: OnboardingProps) {
  const { saveBirthday } = useBirthday();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const line1 = useRef(new Animated.Value(0)).current;
  const line2 = useRef(new Animated.Value(0)).current;
  const line3 = useRef(new Animated.Value(0)).current;
  const line4 = useRef(new Animated.Value(0)).current;
  const line5 = useRef(new Animated.Value(0)).current;
  const inputFade = useRef(new Animated.Value(0)).current;
  const revealPulse = useRef(new Animated.Value(0)).current;
  const revealText = useRef(new Animated.Value(0)).current;

  const [showInput, setShowInput] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [revealName, setRevealName] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fade = (val: Animated.Value, delay: number) =>
      Animated.timing(val, { toValue: 1, duration: 800, delay, useNativeDriver: true });

    Animated.sequence([
      fade(line1, 1500),
      fade(line2, 2000),
      fade(line3, 2000),
      fade(line4, 2000),
      fade(line5, 2000),
    ]).start(() => {
      setTimeout(() => {
        setShowInput(true);
        Animated.timing(inputFade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      }, 2000);
    });
  }, [line1, line2, line3, line4, line5, inputFade]);

  const handleSave = async () => {
    const parts = dateInput.trim().split("/");
    if (parts.length !== 3) { setError("DD/MM/YYYY"); return; }
    const [d, m, y] = parts.map(Number);
    if (!m || !d || !y || y < 1900 || y > new Date().getFullYear()) {
      setError("Enter a valid date");
      return;
    }
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime()) || date >= new Date()) {
      setError("Enter a valid past date");
      return;
    }
    setError("");
    setIsTransitioning(true);
    const ageYears = (Date.now() - date.getTime()) / (365.25 * 86400000);
    const star = findStarByAge(Math.round(ageYears));
    const name = star?.name ?? "your star";
    setRevealName(name);
    await saveBirthday(date);
    setIsTransitioning(false);
    setShowReveal(true);

    Animated.sequence([
      Animated.timing(revealPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(revealText, { toValue: 1, duration: 800, delay: 400, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        onBirthdaySet();
      }, 2000);
    });
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <StarField count={100} containerOpacity={showReveal ? 0.15 : 0.5} />

      {isTransitioning ? (
        <View style={styles.transitionWrap}>
          <Text style={styles.transitionText}>finding your star</Text>
        </View>
      ) : showReveal ? (
        <View style={styles.revealWrap}>
          <Animated.View
            style={[styles.revealStar, { opacity: revealPulse, transform: [{ scale: revealPulse }] }]}
          />
          <Animated.View style={{ opacity: revealText, alignItems: "center", gap: 8 }}>
            <Text style={styles.revealName}>{revealName}.</Text>
            <Text style={styles.revealSub}>This is your star.</Text>
          </Animated.View>
        </View>
      ) : (
        <View style={styles.onboardContent}>
          <Animated.Text style={[styles.onboardLine, { opacity: line1 }]}>
            Every person has a star.
          </Animated.Text>
          <Animated.Text style={[styles.onboardLine, { opacity: line2 }]}>
            A real star.
          </Animated.Text>
          <Animated.Text style={[styles.onboardLine, { opacity: line3 }]}>
            Whose light is travelling toward Earth right now.
          </Animated.Text>
          <Animated.Text style={[styles.onboardLine, { opacity: line4 }]}>
            That light left the year you were born.
          </Animated.Text>
          <Animated.Text style={[styles.onboardLine, { opacity: line5, color: "#C8A96E" }]}>
            It is arriving at Earth right now.
          </Animated.Text>

          {showInput && (
            <Animated.View style={[styles.inputBlock, { opacity: inputFade }]}>
              <Text style={styles.inputQuestion}>To find yours — when were you born?</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={dateInput}
                  onChangeText={setDateInput}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="rgba(200,169,110,0.35)"
                  style={styles.input}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
              </View>
              {error ? <Text style={styles.inputError}>{error}</Text> : null}
              <TouchableOpacity onPress={handleSave} style={styles.revealBtn} activeOpacity={0.8}>
                <Text style={styles.revealBtnText}>REVEAL MY STAR</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

// ── Main star screen ───────────────────────────────────────────────────────────

interface VisibilityState {
  checked: boolean;
  visible: boolean;
  direction: string;
  height: string;
  riseTime: string;
}

export default function StarScreen() {
  const insets = useSafeAreaInsets();
  const { birthday, loading } = useBirthday();
  const [onboarded, setOnboarded] = useState(false);
  const [starError, setStarError] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityState>({
    checked: false,
    visible: false,
    direction: "N",
    height: "",
    riseTime: "",
  });

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const hasBirthday = !!birthday;

  const ageYears = birthday
    ? (Date.now() - birthday.getTime()) / (365.25 * 86400000)
    : 0;
  const star = birthday ? findStarByAge(Math.round(ageYears)) : null;
  const birthYear = birthday ? birthday.getFullYear() : 0;
  const currentYear = new Date().getFullYear();
  const departureYear = star ? currentYear - star.distance : 0;
  const spectral = star ? getSpectral(star.name) : "G";
  const starColor = star ? getStarColor(star.name) : GOLD;
  const starData = star ? STAR_DATA[star.name] : undefined;

  useEffect(() => {
    if (!star || !starData?.ra || starData?.dec === undefined) return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude: lat, longitude: lng } = loc.coords;
      const now = new Date();
      const lst = getLocalSiderealTime(lng, now);
      const alt = getAltitude(starData.ra!, starData.dec!, lat, lst);
      const visible = alt > 10;
      const direction = visible ? getDirection(starData.ra!, starData.dec!, lat, lst) : "";
      const height = visible ? getHeightDesc(alt) : "";
      const riseTime = !visible ? getRiseTimeStr(starData.ra!, starData.dec!, lat, now, lng) : "";
      setVisibility({ checked: true, visible, direction, height, riseTime });
    })();
  }, [star?.name]);

  const handleShare = async () => {
    if (!star) return;
    await Share.share({
      message: `My star is ${star.name} — ${Math.round(star.distance)} light-years away. Light that left it in ${birthYear} is arriving at Earth right now. Find yours on PALE.`,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: topPad }]}>
        <StarField count={80} containerOpacity={0.3} />
      </View>
    );
  }

  if (!hasBirthday && !onboarded) {
    return <OnboardingScreen onBirthdaySet={() => setOnboarded(true)} />;
  }

  if (starError || !star) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <StarField count={60} containerOpacity={0.3} />
        <Text style={{ color: GOLD, fontSize: 14, textAlign: "center", lineHeight: 24, letterSpacing: 1 }}>
          The stars are aligning.{"\n"}Pull down to try again.
        </Text>
      </View>
    );
  }

  const yearContextText = getYearContext(departureYear);
  const spectralText = getSpectralText(spectral, star.name);

  return (
    <View style={[styles.container]}>
      <StarField count={100} containerOpacity={0.4} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#000000" }}
        contentContainerStyle={[
          styles.scroll,
          { backgroundColor: "#000000", paddingTop: topPad + 24, paddingBottom: bottomPad + 100 },
        ]}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <StarVisual color={starColor} />
          <Text style={styles.starName}>{star.name}</Text>
          <Text style={styles.constellation}>in {star.constellation}</Text>
        </View>

        {/* Personal truth card */}
        <View style={styles.truthCard}>
          <Text style={styles.truthMain}>
            Light that left {star.name} in {birthYear} is arriving at Earth right now.
          </Text>
          <Text style={styles.truthSub}>
            It left the star the year you were born. It has been travelling through space your entire life. It is arriving right now.
          </Text>
        </View>

        {/* Section 1 — The Distance */}
        <View style={styles.section}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>THE DISTANCE</Text>
          <Text style={styles.sectionText}>
            {star.name} is {star.distance} light-years away.
          </Text>
          <Text style={[styles.sectionText, styles.gap]}>
            A light-year is the distance light travels in one year — approximately
            9.46 trillion kilometres.
          </Text>
          <Text style={[styles.sectionText, styles.gap]}>
            If you could travel at the speed of light — the fastest anything in
            the universe can move — you would arrive at {star.name} in{" "}
            {star.distance} years.
          </Text>
          <Text style={[styles.sectionText, styles.gap]}>
            The universe operates on timescales that make a human life feel like
            a single breath.{"\n"}And yet — here you are. Breathing. Connected
            to something {star.distance} light-years away by nothing more than
            the fact that you were born.
          </Text>
        </View>

        {/* Section 2 — The Star Itself */}
        <View style={styles.section}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>THE STAR ITSELF</Text>
          <Text style={styles.sectionText}>{spectralText}</Text>
        </View>

        {/* Section 3 — When This Light Left */}
        <View style={styles.section}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>WHEN THIS LIGHT LEFT</Text>
          <Text style={styles.sectionText}>
            The light you can see from {star.name} tonight left that star in{" "}
            {departureYear} —{" "}
            {birthYear === Math.round(departureYear)
              ? "the year you were born"
              : `${Math.abs(birthYear - Math.round(departureYear))} year${Math.abs(birthYear - Math.round(departureYear)) === 1 ? "" : "s"} after you were born`}.
          </Text>
          {yearContextText ? (
            <Text style={[styles.sectionText, styles.gap]}>{yearContextText}</Text>
          ) : null}
          <Text style={[styles.sectionText, styles.gap]}>
            {star.name} was simply shining. As it had been for billions of years.
            As it continues to do right now.
          </Text>
        </View>

        {/* Section 4 — Tonight */}
        <View style={styles.section}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>TONIGHT</Text>
          {!starData?.ra ? (
            <Text style={styles.sectionText}>
              Step outside and look up. {star.name} is somewhere above the
              horizon — patient, steady, travelling toward you as it always has.
            </Text>
          ) : !visibility.checked ? (
            <Text style={[styles.sectionText, { opacity: 0.4 }]}>
              Locating your star…
            </Text>
          ) : visibility.visible ? (
            <>
              <Text style={styles.sectionText}>
                {star.name} is above your horizon right now.
              </Text>
              <Text style={[styles.sectionText, styles.gap]}>
                Look {visibility.direction} — {visibility.height}.
              </Text>
              <Text style={[styles.sectionText, styles.gap]}>
                The light you will see left {star.name} {star.distance} years
                ago. You are not seeing it as it is. You are seeing it as it
                was — the universe showing you a message sent before you were
                born.
              </Text>
              <Text style={styles.goOutside}>
                Go outside. Look {visibility.direction}. It is there.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.sectionText}>
                {star.name} is on the other side of the Earth right now. The
                planet is between you and your star tonight.
              </Text>
              <Text style={[styles.sectionText, styles.gap]}>
                It will rise above your horizon at approximately{" "}
                {visibility.riseTime}.
              </Text>
              <Text style={[styles.sectionText, styles.gap]}>
                The light is still travelling toward you. It does not stop when
                you cannot see it.
              </Text>
            </>
          )}
        </View>

        {/* Section 5 — Your Connection */}
        <View style={styles.section}>
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>YOUR CONNECTION</Text>
          <Text style={styles.sectionText}>
            {star.name} has no way of knowing you exist.
          </Text>
          <Text style={[styles.sectionText, styles.gap]}>
            The light now arriving at Earth left {star.name} in {birthYear} —
            the year you were born. It has been travelling through space your
            entire life — through interstellar space, through the outer reaches
            of our solar system, toward the small blue planet where you are
            reading this.
          </Text>
          <Text style={[styles.sectionText, styles.gap]}>
            You did not choose this star. The universe arranged it before you
            arrived.
          </Text>

          <View style={{ marginTop: 36, alignItems: "center", gap: 6 }}>
            <Text style={styles.closingGold}>{star.name}.</Text>
            <Text style={styles.closingGold}>{star.distance} light-years.</Text>
            <Text style={styles.closingGold}>Right now.</Text>
          </View>
        </View>

        {/* Share */}
        <View style={styles.shareSection}>
          <View style={styles.shareDiv} />
          <TouchableOpacity onPress={handleShare} activeOpacity={0.6}>
            <Text style={styles.shareText}>Share your star</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scroll: {
    paddingHorizontal: 24,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    paddingBottom: 8,
    gap: 14,
  },
  visualCenter: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  glow4: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.04,
  },
  glow3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
  },
  glow2: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.3,
  },
  glow1: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.6,
    backgroundColor: "#ffffff",
  },
  core: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    opacity: 1,
  },
  starName: {
    color: GOLD,
    fontSize: 26,
    letterSpacing: 5,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  constellation: {
    color: WARM_WHITE,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: "Inter_400Regular",
    opacity: 0.5,
    textAlign: "center",
  },

  // Truth card
  truthCard: {
    backgroundColor: "rgba(200,170,100,0.05)",
    borderWidth: 1,
    borderColor: "rgba(200,170,100,0.2)",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 0,
    marginTop: 20,
    marginBottom: 8,
    gap: 12,
    alignItems: "center",
  },
  truthMain: {
    color: WARM_WHITE,
    fontSize: 15,
    lineHeight: 28,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  truthSub: {
    color: WARM_WHITE,
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    opacity: 0.5,
    textAlign: "center",
  },

  // Sections
  section: {
    paddingTop: 32,
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(200,170,100,0.12)",
    marginBottom: 20,
  },
  sectionTitle: {
    color: GOLD,
    fontSize: 10,
    letterSpacing: 4,
    fontFamily: "Inter_600SemiBold",
    opacity: 0.55,
    marginBottom: 12,
  },
  sectionText: {
    color: WARM_WHITE,
    fontSize: 14,
    lineHeight: 27,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  gap: {
    marginTop: 16,
  },
  goOutside: {
    color: GOLD,
    fontSize: 14,
    letterSpacing: 3,
    fontFamily: "Inter_600SemiBold",
    marginTop: 20,
  },
  closingGold: {
    color: GOLD,
    fontSize: 17,
    letterSpacing: 4,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },

  // Share
  shareSection: {
    marginTop: 48,
    alignItems: "center",
    gap: 16,
  },
  shareDiv: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(200,170,100,0.2)",
  },
  shareText: {
    color: "rgba(200,169,110,0.45)",
    fontSize: 12,
    letterSpacing: 2,
    fontFamily: "Inter_400Regular",
  },

  // Onboarding
  onboardContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 36,
    gap: 28,
  },
  onboardLine: {
    color: WARM_WHITE,
    fontSize: 18,
    lineHeight: 30,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  inputBlock: {
    marginTop: 16,
    gap: 16,
    alignItems: "center",
  },
  inputQuestion: {
    color: "rgba(245,240,232,0.6)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "rgba(200,169,110,0.4)",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "100%",
    backgroundColor: "rgba(200,169,110,0.04)",
  },
  input: {
    color: WARM_WHITE,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
    textAlign: "center",
  },
  inputError: {
    color: "rgba(255,120,80,0.8)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  revealBtn: {
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  revealBtnText: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: "Inter_600SemiBold",
  },

  // Transition loading
  transitionWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  transitionText: {
    color: GOLD,
    fontSize: 11,
    letterSpacing: 3,
    opacity: 0.6,
    fontFamily: "Inter_400Regular",
  },

  // Reveal
  revealWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    backgroundColor: "#000000",
  },
  revealStar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C8A96E",
    opacity: 0.9,
  },
  revealName: {
    color: GOLD,
    fontSize: 28,
    letterSpacing: 4,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  revealSub: {
    color: "rgba(245,240,232,0.6)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    textAlign: "center",
  },
});
