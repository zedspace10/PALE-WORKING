import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import { getTodaysEntry } from "@/constants/observatory";
import {
  findStarByAge,
  formatLargeInt,
  getUniverseAgeYears,
} from "@/constants/starCatalog";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const SECS_PER_YEAR = MS_PER_YEAR / 1000;
const { height: SCREEN_H } = Dimensions.get("window");

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const todaysEntry = getTodaysEntry();

function formatBig(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { birthday } = useBirthday();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [universeAgeSecs, setUniverseAgeSecs] = useState(() => {
    const yrs = getUniverseAgeYears();
    return yrs * SECS_PER_YEAR;
  });
  const [userSeconds, setUserSeconds] = useState<number | null>(
    birthday ? Math.floor((Date.now() - birthday.getTime()) / 1000) : null
  );
  const [obsExpanded, setObsExpanded] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const yrs = getUniverseAgeYears();
      setUniverseAgeSecs(yrs * SECS_PER_YEAR);
      if (birthday) {
        setUserSeconds(Math.floor((Date.now() - birthday.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [birthday]);

  const ageYears = birthday
    ? (Date.now() - birthday.getTime()) / MS_PER_YEAR
    : null;
  const star = ageYears ? findStarByAge(Math.floor(ageYears)) : null;

  // Animations
  const dotScale = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(0.6)).current;
  const youAreHereOpacity = useRef(new Animated.Value(0)).current;
  const counterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Dot pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dotScale, {
            toValue: 1.3,
            duration: 3000,
            easing: easeInOut,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1.0,
            duration: 3000,
            easing: easeInOut,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dotScale, {
            toValue: 1.0,
            duration: 3000,
            easing: easeInOut,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0.6,
            duration: 3000,
            easing: easeInOut,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();

    // "You are here." fades in after 1s
    const fadeIn = Animated.sequence([
      Animated.delay(1000),
      Animated.timing(youAreHereOpacity, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.timing(counterOpacity, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    ]);
    fadeIn.start();

    return () => {
      pulse.stop();
      fadeIn.stop();
    };
  }, [dotScale, dotOpacity, youAreHereOpacity, counterOpacity]);

  const universeAgeYears = universeAgeSecs / SECS_PER_YEAR;
  const universeDisplay = formatBig(universeAgeYears);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={80} containerOpacity={0.35} />

      {/* ── Hero: Pale Blue Dot ── */}
      <View
        style={[
          styles.hero,
          { paddingTop: topPad + 24, height: Math.min(SCREEN_H * 0.38, 300) },
        ]}
      >
        {/* The Dot */}
        <View style={styles.dotWrap}>
          <Animated.View
            style={[
              styles.dotGlow,
              { transform: [{ scale: dotScale }], opacity: dotOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { transform: [{ scale: dotScale }], opacity: dotOpacity },
            ]}
          />
        </View>

        {/* "You are here." */}
        <Animated.Text
          style={[
            styles.youAreHere,
            { color: colors.foreground, opacity: youAreHereOpacity },
          ]}
        >
          You are here.
        </Animated.Text>

        {/* Counters */}
        <Animated.View style={[styles.counters, { opacity: counterOpacity }]}>
          <Text style={[styles.counterMain, { color: colors.primary }]}>
            {universeDisplay}
          </Text>
          <Text
            style={[styles.counterLabel, { color: colors.mutedForeground }]}
          >
            years since the universe began
          </Text>
          {userSeconds !== null ? (
            <>
              <Text
                style={[styles.counterSub, { color: colors.primary }]}
              >
                {formatBig(userSeconds)}
              </Text>
              <Text
                style={[
                  styles.counterLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                seconds you have been here
              </Text>
            </>
          ) : (
            <TouchableOpacity onPress={() => router.push("/(tabs)/you")}>
              <Text
                style={[
                  styles.counterPrompt,
                  { color: colors.mutedForeground },
                ]}
              >
                Set your birthday to see your seconds →
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: bottomPad + 100,
            paddingHorizontal: 20,
            paddingTop: 12,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Observatory — Today's Entry */}
        <TouchableOpacity
          onPress={() => setObsExpanded(!obsExpanded)}
          activeOpacity={0.85}
          style={[
            styles.obsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary + "30",
            },
          ]}
        >
          <View style={styles.obsHeader}>
            <View style={styles.obsHeaderLeft}>
              <Text
                style={[styles.cardLabel, { color: colors.mutedForeground }]}
              >
                THE OBSERVATORY
              </Text>
              <Text style={[styles.obsTitle, { color: colors.foreground }]}>
                {todaysEntry.location}
              </Text>
              <Text
                style={[styles.obsSub, { color: colors.mutedForeground }]}
              >
                {todaysEntry.locationDetail}
              </Text>
            </View>
            <View
              style={[
                styles.obsLive,
                { borderColor: colors.primary + "40" },
              ]}
            >
              <Feather name="radio" size={11} color={colors.primary} />
            </View>
          </View>

          {obsExpanded && (
            <View style={styles.obsBody}>
              <View
                style={[
                  styles.obsDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <Text
                style={[styles.obsText, { color: colors.foreground }]}
              >
                {todaysEntry.reflection}
              </Text>
              <View style={styles.obsMeta}>
                <Text
                  style={[
                    styles.obsMetaText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {todaysEntry.distance}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Your Star Card — only if birthday set */}
        {star && birthday && (
          <View
            style={[
              styles.starCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary + "55",
              },
            ]}
          >
            <View style={styles.starCardHeader}>
              <Text
                style={[styles.cardLabel, { color: colors.mutedForeground }]}
              >
                YOUR STAR
              </Text>
              <Animated.View
                style={[
                  styles.starDot,
                  {
                    backgroundColor: colors.primary,
                    transform: [{ scale: dotScale }],
                    opacity: dotOpacity,
                  },
                ]}
              />
            </View>
            <Text style={[styles.starName, { color: colors.primary }]}>
              {star.name}
            </Text>
            <Text style={[styles.starDesc, { color: colors.foreground }]}>
              Light that left {star.name} in {birthday.getFullYear()} is
              arriving at Earth right now.
            </Text>
            <Text
              style={[styles.starDist, { color: colors.mutedForeground }]}
            >
              {star.distance} light years away · {star.constellation}
            </Text>
          </View>
        )}

        {/* Nav Cards */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/shift")}
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, { color: colors.primary }]}>◎</Text>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Shift
            </Text>
            <Text
              style={[styles.navSub, { color: colors.mutedForeground }]}
            >
              perspective journey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/star")}
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, { color: colors.primary }]}>✦</Text>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Your Star
            </Text>
            <Text
              style={[styles.navSub, { color: colors.mutedForeground }]}
            >
              your cosmic connection
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/deeptime")}
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, { color: colors.primary }]}>⟳</Text>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Time Machine
            </Text>
            <Text
              style={[styles.navSub, { color: colors.mutedForeground }]}
            >
              13.8 billion years
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/journal")}
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
            activeOpacity={0.8}
          >
            <Text style={[styles.navIcon, { color: colors.primary }]}>◑</Text>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Journal
            </Text>
            <Text
              style={[styles.navSub, { color: colors.mutedForeground }]}
            >
              on this day
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/tonight-sky")}
          style={[
            styles.navCard,
            styles.universeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary + "30",
            },
          ]}
          activeOpacity={0.8}
        >
          <Text style={[styles.navIcon, { color: colors.primary }]}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Tonight's Sky
            </Text>
            <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
              What's above you right now
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 28,
  },
  dotWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#B8D4E8",
  },
  dotGlow: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#B8D4E8",
    opacity: 0.15,
  },
  youAreHere: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 4,
    textAlign: "center",
    color: "#F5F0E8",
  },
  counters: {
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  counterMain: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0,
    fontVariant: ["tabular-nums"],
  },
  counterSub: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0,
    fontVariant: ["tabular-nums"],
    marginTop: 10,
  },
  counterLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  counterPrompt: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    marginTop: 10,
    textDecorationLine: "none",
  },

  // Cards
  content: { gap: 14 },

  obsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 0,
  },
  obsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  obsHeaderLeft: { flex: 1, gap: 4 },
  cardLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.5,
  },
  obsTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  obsSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  obsLive: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginLeft: 12,
  },
  obsBody: { gap: 12, marginTop: 16 },
  obsDivider: { height: 1, opacity: 0.4 },
  obsText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  obsMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  obsMetaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  obsRead: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },

  // Your Star Card
  starCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 20,
    gap: 6,
  },
  starCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  starDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  starName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  starDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  starDist: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    marginTop: 2,
  },

  // Nav cards
  navRow: { flexDirection: "row", gap: 14 },
  navCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 4,
    minHeight: 90,
    justifyContent: "center",
  },
  universeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 0,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  navSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
});
