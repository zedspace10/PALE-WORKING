import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CalmPressable } from "@/components/CalmPressable";
import { StarField } from "@/components/StarField";
import { NightlyReminderToggle } from "@/components/NightlyReminderToggle";
import { SourceDisclosure } from "@/components/SourceDisclosure";
import { getTodaysEntry } from "@/constants/observatory";
import { formatUniverseAgeEstimate } from "@/constants/personalInsights";
import { calmSpace, calmSurface, calmTypography } from "@/constants/ui";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

function formatBig(n: number): string {
  return Math.floor(n).toLocaleString("en-US");
}

export default function HomeScreen() {
  const colors = useColors();
  const todaysEntry = getTodaysEntry();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { birthday } = useBirthday();
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef<ScrollView>(null);
  useResetScrollOnFocus(scrollRef);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [obsExpanded, setObsExpanded] = useState(false);
  const userDays = birthday
    ? Math.max(0, Math.floor((Date.now() - birthday.getTime()) / 86_400_000))
    : null;

  // Animations
  const dotScale = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(0.6)).current;
  const youAreHereOpacity = useRef(new Animated.Value(0)).current;
  const counterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      dotScale.setValue(1);
      dotOpacity.setValue(0.9);
      youAreHereOpacity.setValue(1);
      counterOpacity.setValue(1);
      return;
    }

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
      ]),
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
  }, [counterOpacity, dotOpacity, dotScale, reduceMotion, youAreHereOpacity]);

  const universeDisplay = formatUniverseAgeEstimate();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={80} containerOpacity={0.35} />

      {/* ── Hero: Pale Blue Dot ── */}
      <View style={[styles.hero, { paddingTop: topPad + 34 }]}>
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
          <Text style={[styles.counterMain, { color: colors.foreground }]}>
            {universeDisplay}
          </Text>
          {userDays !== null ? (
            <>
              <Text
                style={[styles.counterSub, { color: colors.primaryStrong }]}
              >
                about {formatBig(userDays)}
              </Text>
              <Text
                style={[styles.counterLabel, { color: colors.mutedForeground }]}
              >
                days since your birth date
              </Text>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/you")}
              accessibilityRole="button"
              style={styles.promptButton}
            >
              <Text
                style={[
                  styles.counterPrompt,
                  { color: colors.mutedForeground },
                ]}
              >
                Set your birthday to see your place in time
              </Text>
              <Feather
                name="arrow-right"
                size={14}
                color={colors.primaryStrong}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        ref={scrollRef}
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
        <CalmPressable
          onPress={() => setObsExpanded(!obsExpanded)}
          accessibilityRole="button"
          accessibilityState={{ expanded: obsExpanded }}
          style={[
            styles.obsCard,
            {
              backgroundColor: colors.card,
              borderColor: obsExpanded ? colors.primary + "66" : colors.border,
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
              <Text style={[styles.obsSub, { color: colors.mutedForeground }]}>
                {todaysEntry.locationDetail}
              </Text>
            </View>
            <View style={[styles.obsLive, { backgroundColor: colors.glow }]}>
              <Feather
                name={obsExpanded ? "chevron-up" : "radio"}
                size={15}
                color={colors.primaryStrong}
              />
            </View>
          </View>

          {obsExpanded && (
            <View style={styles.obsBody}>
              <View
                style={[styles.obsDivider, { backgroundColor: colors.border }]}
              />
              <Text style={[styles.obsText, { color: colors.foreground }]}>
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

              <SourceDisclosure science={todaysEntry.science} />

              <NightlyReminderToggle variant="row" />
            </View>
          )}
        </CalmPressable>

        {/* Nav Cards */}
        <View style={styles.navRow}>
          <CalmPressable
            onPress={() => router.push("/(tabs)/shift")}
            accessibilityRole="button"
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
          >
            <View style={[styles.navIcon, { backgroundColor: colors.glow }]}>
              <Feather
                name="maximize-2"
                size={18}
                color={colors.primaryStrong}
              />
            </View>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Shift
            </Text>
            <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
              perspective journey
            </Text>
          </CalmPressable>

          <CalmPressable
            onPress={() => router.push("/(tabs)/deeptime")}
            accessibilityRole="button"
            style={[
              styles.navCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                flex: 1,
              },
            ]}
          >
            <View style={[styles.navIcon, { backgroundColor: colors.glow }]}>
              <Feather name="clock" size={18} color={colors.primaryStrong} />
            </View>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Time Machine
            </Text>
            <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
              13.8 billion years
            </Text>
          </CalmPressable>
        </View>

        <CalmPressable
          onPress={() => router.push("/tonight-sky")}
          accessibilityRole="button"
          style={[
            styles.navCard,
            styles.universeCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.navIcon, { backgroundColor: colors.glow }]}>
            <Feather name="star" size={18} color={colors.primaryStrong} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navLabel, { color: colors.foreground }]}>
              Tonight's Sky
            </Text>
            <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
              Location-aware, condition-qualified guidance
            </Text>
          </View>
        </CalmPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    alignItems: "center",
    gap: 10,
    paddingBottom: 30,
    paddingHorizontal: 24,
    width: "100%",
  },
  dotWrap: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#B8D4E8",
  },
  dotGlow: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#B8D4E8",
    opacity: 0.15,
  },
  youAreHere: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3.2,
    textAlign: "center",
    color: "#F7F4FF",
  },
  counters: {
    alignItems: "center",
    alignSelf: "stretch",
    gap: 5,
    marginTop: 7,
  },
  counterMain: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.7,
    lineHeight: 34,
    maxWidth: 420,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  counterSub: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0,
    fontVariant: ["tabular-nums"],
    marginTop: 10,
  },
  counterQualifier: {
    ...calmTypography.meta,
    textAlign: "center",
    textTransform: "lowercase",
  },
  counterLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  counterPrompt: {
    ...calmTypography.button,
    textDecorationLine: "none",
  },
  promptButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
    minHeight: calmSpace.touchTarget,
  },

  // Cards
  content: {
    alignSelf: "center",
    gap: 14,
    maxWidth: 760,
    width: "100%",
  },

  obsCard: {
    ...calmSurface,
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
    ...calmTypography.meta,
  },
  obsTitle: {
    ...calmTypography.title,
  },
  obsSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  obsLive: {
    alignItems: "center",
    borderRadius: calmSpace.radius.pill,
    height: calmSpace.touchTarget,
    justifyContent: "center",
    marginLeft: 12,
    width: calmSpace.touchTarget,
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

  // Nav cards
  navRow: { flexDirection: "row", gap: 14 },
  navCard: {
    ...calmSurface,
    padding: 18,
    gap: 6,
    minHeight: 132,
    justifyContent: "flex-start",
  },
  universeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 92,
  },
  navIcon: {
    alignItems: "center",
    borderRadius: calmSpace.radius.small,
    height: 38,
    justifyContent: "center",
    marginBottom: 7,
    width: 38,
  },
  navLabel: {
    ...calmTypography.cardTitle,
  },
  navSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
});
