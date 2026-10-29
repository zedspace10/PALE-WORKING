import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { CardArtwork } from "@/components/CardArtwork";
import { HomeHeroStars, HomeLocationSphere } from "@/components/HomeHeroScene";
import { MagicalAction } from "@/components/MagicalSurface";
import { StarField } from "@/components/StarField";
import { NightlyReminderToggle } from "@/components/NightlyReminderToggle";
import { areNotificationsEnabled } from "@/constants/notifications";
import { getTodaysEntry } from "@/constants/observatory";
import { formatUniverseAgeEstimate } from "@/constants/personalInsights";
import { calmSpace, calmSurface, calmTypography } from "@/constants/ui";
import { useBirthday } from "@/hooks/useBirthday";
import { useColors } from "@/hooks/useColors";
import { useHomeHeroMotionActive } from "@/hooks/useHomeHeroMotionActive";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

// The quiet invitation on the Observatory card is shown for a person's first few openings of
// the card only, and never once the reminder is on.
const REMINDER_HINT_KEY = "@pale_reminder_hint_views";
const REMINDER_HINT_LIMIT = 3;

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
  const ambientMotionActive = useHomeHeroMotionActive(reduceMotion);
  const scrollRef = useRef<ScrollView>(null);
  useResetScrollOnFocus(scrollRef);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [obsExpanded, setObsExpanded] = useState(false);
  const [reminderOn, setReminderOn] = useState<boolean | null>(null);
  const [hintViews, setHintViews] = useState(REMINDER_HINT_LIMIT);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      areNotificationsEnabled()
        .then((on) => alive && setReminderOn(on))
        .catch(() => undefined);
      AsyncStorage.getItem(REMINDER_HINT_KEY)
        .then((raw) => alive && setHintViews(Number(raw) || 0))
        .catch(() => undefined);
      return () => {
        alive = false;
      };
    }, []),
  );

  const showReminderHint =
    reminderOn === false && hintViews < REMINDER_HINT_LIMIT;

  const toggleObservatory = () => {
    const opening = !obsExpanded;
    setObsExpanded(opening);
    if (opening && showReminderHint) {
      const next = hintViews + 1;
      setHintViews(next);
      AsyncStorage.setItem(REMINDER_HINT_KEY, String(next)).catch(
        () => undefined,
      );
    }
    if (!opening) {
      // The reminder may have been switched on inside the card.
      areNotificationsEnabled()
        .then(setReminderOn)
        .catch(() => undefined);
    }
  };
  const userDays = birthday
    ? Math.max(0, Math.floor((Date.now() - birthday.getTime()) / 86_400_000))
    : null;

  // Animations
  const youAreHereOpacity = useRef(new Animated.Value(0)).current;
  const counterOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      youAreHereOpacity.setValue(1);
      counterOpacity.setValue(1);
      return;
    }

    // "You are here." fades in after 1s
    const fadeIn = Animated.sequence([
      Animated.delay(250),
      Animated.timing(youAreHereOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.delay(120),
      Animated.timing(counterOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);
    fadeIn.start();

    return () => fadeIn.stop();
  }, [counterOpacity, reduceMotion, youAreHereOpacity]);

  const universeDisplay = formatUniverseAgeEstimate();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={58} containerOpacity={0.3} drift={10} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: the pale blue dot. It scrolls with the page, so the cards below always have room. */}
        <View style={[styles.hero, { paddingTop: topPad + 34 }]}>
          {/* The Dot */}
          <HomeHeroStars active={ambientMotionActive} />
          <HomeLocationSphere
            active={ambientMotionActive}
            testID="home-location-sphere"
          />

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
            <Text
              style={[styles.counterLabel, { color: colors.mutedForeground }]}
            >
              since the universe began
            </Text>
            {userDays !== null ? (
              <>
                <Text
                  style={[styles.counterSub, { color: colors.primaryStrong }]}
                >
                  {formatBig(userDays)}
                </Text>
                <Text
                  style={[
                    styles.counterLabel,
                    { color: colors.mutedForeground },
                  ]}
                >
                  days since you were born
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

        <View
          style={[styles.content, { paddingHorizontal: 20, paddingTop: 12 }]}
        >
          {/* The Observatory: today's entry */}
          <CalmPressable
            onPress={toggleObservatory}
            accessibilityRole="button"
            accessibilityState={{ expanded: obsExpanded }}
            style={[
              styles.obsCard,
              {
                backgroundColor: colors.card,
                borderColor: obsExpanded
                  ? colors.primary + "66"
                  : colors.border,
              },
            ]}
          >
            <CardArtwork name="observatory" />
            <View style={styles.obsHeader}>
              <View style={styles.obsHeaderLeft}>
                <Text
                  style={[styles.cardLabel, { color: colors.mutedForeground }]}
                >
                  The Observatory
                </Text>
                <Text style={[styles.obsTitle, { color: colors.foreground }]}>
                  {todaysEntry.location}
                </Text>
                <Text
                  style={[styles.obsSub, { color: colors.mutedForeground }]}
                >
                  {todaysEntry.locationDetail}
                </Text>
                {showReminderHint && !obsExpanded ? (
                  <Text style={[styles.obsHint, { color: colors.primary }]}>
                    Get a new one each evening, as it gets dark
                  </Text>
                ) : null}
              </View>
              <View style={[styles.obsLive, { backgroundColor: colors.glow }]}>
                <Feather
                  name={obsExpanded ? "chevron-up" : "chevron-down"}
                  size={15}
                  color={colors.primaryStrong}
                />
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

                <NightlyReminderToggle variant="row" />
              </View>
            )}
          </CalmPressable>

          {/* Nav Cards */}
          <View style={styles.navRow}>
            <MagicalAction
              onPress={() => router.push("/(tabs)/shift")}
              accessibilityRole="button"
              variant="secondary"
              wrapperStyle={styles.navCardWrap}
              style={styles.navCardFrame}
              contentStyle={styles.navCard}
            >
              <CardArtwork name="shift" />
              <View style={styles.navCardCopy}>
                <Text style={[styles.navLabel, { color: colors.foreground }]}>
                  Shift
                </Text>
                <Text
                  style={[styles.navSub, { color: colors.mutedForeground }]}
                >
                  a minute to the edge of everything
                </Text>
              </View>
            </MagicalAction>

            <MagicalAction
              onPress={() => router.push("/(tabs)/deeptime")}
              accessibilityRole="button"
              variant="quiet"
              wrapperStyle={styles.navCardWrap}
              style={styles.navCardFrame}
              contentStyle={styles.navCard}
            >
              <CardArtwork name="timeMachine" />
              <View style={styles.navCardCopy}>
                <Text style={[styles.navLabel, { color: colors.foreground }]}>
                  Time Machine
                </Text>
                <Text
                  style={[styles.navSub, { color: colors.mutedForeground }]}
                >
                  the story of everything
                </Text>
              </View>
            </MagicalAction>
          </View>

          <MagicalAction
            onPress={() => router.push("/tonight-sky")}
            accessibilityRole="button"
            style={styles.navCardFrame}
            contentStyle={[styles.navCard, styles.universeCard]}
          >
            <CardArtwork name="tonightsSky" />
            <View style={styles.universeCopy}>
              <Text style={[styles.navLabel, { color: colors.foreground }]}>
                Tonight's Sky
              </Text>
              <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
                What you can see from where you are
              </Text>
            </View>
          </MagicalAction>

          <CalmPressable
            onPress={() => router.push("/(tabs)/notes")}
            accessibilityRole="button"
            accessibilityLabel="Send a note to the universe"
            style={[
              styles.obsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>
              Notes
            </Text>
            <Text style={[styles.obsTitle, { color: colors.foreground }]}>
              Send a note to the universe
            </Text>
            <Text style={[styles.obsSub, { color: colors.mutedForeground }]}>
              Follow it out to the stars, and send it as real light
            </Text>
          </CalmPressable>
        </View>
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
    overflow: "hidden",
    paddingBottom: 30,
    paddingHorizontal: 24,
    position: "relative",
    width: "100%",
  },
  youAreHere: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3.2,
    textAlign: "center",
    color: "#F7F4FF",
    zIndex: 1,
  },
  counters: {
    alignItems: "center",
    alignSelf: "stretch",
    gap: 5,
    marginTop: 7,
    zIndex: 1,
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
    position: "relative",
  },
  obsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  obsHeaderLeft: { flex: 1, gap: 4 },
  cardLabel: {
    ...calmTypography.meta,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  obsTitle: {
    ...calmTypography.title,
  },
  obsSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  obsHint: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
    marginTop: 6,
  },
  obsLive: {
    alignItems: "center",
    borderRadius: calmSpace.radius.pill,
    height: calmSpace.touchTarget,
    justifyContent: "center",
    marginLeft: 12,
    width: calmSpace.touchTarget,
  },
  obsBody: { gap: 12, marginTop: 16, position: "relative", zIndex: 1 },
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
  navCardWrap: { flex: 1 },
  navCardFrame: {
    borderRadius: calmSpace.radius.large,
  },
  navCard: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    padding: 18,
    minHeight: 142,
  },
  universeCard: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    minHeight: 108,
  },
  navCardCopy: {
    gap: 4,
    position: "relative",
    zIndex: 1,
  },
  universeCopy: {
    gap: 3,
    maxWidth: "78%",
    position: "relative",
    zIndex: 1,
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
