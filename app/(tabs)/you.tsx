import React, { useEffect, useState } from "react";
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

import { StarField } from "@/components/StarField";
import { COSMIC_EVENTS } from "@/constants/cosmicData";
import { findStarByAge, formatLargeInt } from "@/constants/starCatalog";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";

const EARTH_SPEED_KM_S = 107_000 / 3600;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const MS_PER_SECOND = 1000;

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function YouScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { birthday, loading, saveBirthday, clearBirthday } = useBirthday();
  const [dateInput, setDateInput] = useState("");
  const [error, setError] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSave = () => {
    const parts = dateInput.trim().split("/");
    if (parts.length !== 3) {
      setError("Enter your birthday as DD/MM/YYYY");
      return;
    }
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
    saveBirthday(date);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]} />
    );
  }

  if (!birthday) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StarField count={50} containerOpacity={0.3} />
        <ScrollView
          contentContainerStyle={{
            paddingTop: topPad + 60,
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 28,
            gap: 20,
          }}
        >
          <Text style={[styles.title, { color: colors.foreground }]}>
            Your Place
          </Text>
          <Text style={[styles.onboardText, { color: colors.mutedForeground }]}>
            Enter your birthday to discover the star that is yours, your
            distance through space since birth, how many heartbeats, and which
            cosmic milestones happened in your lifetime.
          </Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <TextInput
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={colors.mutedForeground + "80"}
              style={[styles.input, { color: colors.foreground }]}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
          {error ? (
            <Text style={{ color: colors.destructive, fontSize: 13, fontFamily: "Inter_400Regular" }}>
              {error}
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>
              REVEAL MY PLACE
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const ageMs = now.getTime() - birthday.getTime();
  const ageSeconds = ageMs / 1000;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const ageYears = ageDays / 365.25;
  const ageHours = ageDays * 24;
  const heartbeats = ageHours * 60 * 72;
  const breaths = ageHours * 60 * 15;
  const distanceKm = ageSeconds * EARTH_SPEED_KM_S;
  const birthYear = birthday.getFullYear();
  const dayOfYear = getDayOfYear(now);
  const orbitPercent = Math.round((dayOfYear / 365) * 100);
  const myEvents = COSMIC_EVENTS.filter((e) => e.year > birthYear);
  const star = findStarByAge(Math.floor(ageYears));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={50} containerOpacity={0.25} />
      <ScrollView
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

        {/* Distance travelled — real time */}
        <View
          style={[
            styles.bigCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            DISTANCE TRAVELLED SINCE BIRTH
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {formatLargeInt(distanceKm)}
          </Text>
          <Text style={[styles.bigUnit, { color: colors.foreground }]}>
            kilometres through space
          </Text>
          <Text style={[styles.bigNote, { color: colors.mutedForeground }]}>
            Earth moves at 107,000 km/h — updates every second
          </Text>
        </View>

        {/* Orbits */}
        <View
          style={[
            styles.bigCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            ORBITS AROUND THE SUN
          </Text>
          <Text style={[styles.bigNumber, { color: colors.primary }]}>
            {ageYears.toFixed(1)}
          </Text>
          <Text style={[styles.bigNote, { color: colors.mutedForeground }]}>
            completed since you first arrived
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
              {formatLargeInt(heartbeats)}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.mutedForeground }]}
            >
              heartbeats
            </Text>
          </View>
          <View
            style={[
              styles.halfCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statNum, { color: colors.foreground }]}>
              {Math.round(ageDays).toLocaleString()}
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.mutedForeground }]}
            >
              days
            </Text>
          </View>
        </View>

        {/* Atomic age */}
        <View
          style={[
            styles.quoteCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: colors.primary + "60" },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            ATOMIC AGE
          </Text>
          <Text style={[styles.quoteText, { color: colors.foreground }]}>
            The hydrogen atoms in your body formed 13.8 billion years ago —
            before Earth, before the Sun, before the Milky Way existed.
          </Text>
          <Text style={[styles.quoteNote, { color: colors.primary }]}>
            You are ancient.
          </Text>
        </View>

        {/* Your Star */}
        <View
          style={[
            styles.starCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>
            YOUR STAR
          </Text>
          <Text style={[styles.starName, { color: colors.primary }]}>
            {star.name}
          </Text>
          <Text style={[styles.starSub, { color: colors.secondary }]}>
            in {star.constellation} — {star.distance} light years
          </Text>
          <Text style={[styles.starTruth, { color: colors.mutedForeground }]}>
            Light from this star that left the year you were born is arriving
            at Earth right now.
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
            EARTH'S CURRENT ORBIT PROGRESS
          </Text>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.border }]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${orbitPercent}%` as any, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={[styles.orbitPct, { color: colors.primary }]}>
            {orbitPercent}% of this orbit completed
          </Text>
        </View>

        {/* Cosmic events */}
        {myEvents.length > 0 && (
          <View style={styles.eventsSection}>
            <Text
              style={[styles.cardEyebrow, { color: colors.mutedForeground }]}
            >
              COSMIC MILESTONES IN YOUR LIFETIME
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
                    style={[styles.eventDesc, { color: colors.mutedForeground }]}
                  >
                    {event.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            clearBirthday();
            setDateInput("");
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  bigCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    gap: 6,
  },
  cardEyebrow: {
    fontSize: 9,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
    marginBottom: 4,
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
    borderRadius: 14,
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
    borderRadius: 14,
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
  starCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    gap: 7,
  },
  starName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  starSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  starTruth: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
    marginTop: 2,
  },
  orbitCard: {
    borderRadius: 14,
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
