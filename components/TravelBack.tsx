import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { StarField } from "@/components/StarField";
import {
  UNIVERSE_AGE_YEARS,
  heldToGoBack,
  historyRateWords,
  journeyDepth,
  passedMarkers,
  timeMarkers,
  timeSummary,
  yearsAgoWords,
  yearsBack,
} from "@/constants/timeJourney";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  visible: boolean;
  birthday: Date | null;
  onClose: () => void;
}

const WARM = "#F3DDB0";
// Rings that slowly widen while you hold, like ripples going back through time.
const RINGS = [60, 92, 124, 156];

/** A faint colour for each stretch of the past, rising from the bottom of the screen. */
function eraGlow(years: number): string {
  if (years >= UNIVERSE_AGE_YEARS) return "rgba(255,214,150,0.42)"; // the beginning
  if (years >= 13.3e9) return "rgba(150,120,255,0.26)"; // the first stars and galaxies
  if (years >= 4.6e9) return "rgba(70,60,140,0.22)"; // before the Sun
  if (years >= 3.6e9) return "rgba(220,110,60,0.24)"; // a young, hot Earth
  if (years >= 6e6) return "rgba(60,170,140,0.18)"; // life
  if (years >= 1) return "rgba(90,150,255,0.16)"; // people
  return "rgba(0,0,0,0)";
}

/**
 * Hold to travel back in time, from now to the beginning, passing the moments of the Time Machine
 * on the way. Time speeds up the longer you hold, so 13.8 billion years takes a little over twenty
 * seconds. Letting go pauses; holding again carries on from there.
 */
export function TravelBack({ visible, birthday, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const [holding, setHolding] = useState(false);
  const [held, setHeld] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const startedAt = useRef(0);
  const heldBefore = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const passedCount = useRef(0);
  const glow = useRef(new Animated.Value(0)).current;
  const swell = useRef(new Animated.Value(0)).current;

  const markers = useMemo(
    () => timeMarkers(new Date(), birthday),
    [birthday, visible], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const years = yearsBack(held);
  const atBeginning = years >= UNIVERSE_AGE_YEARS;
  const passed = passedMarkers(markers, years);
  const depth = journeyDepth(years);

  const reset = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    heldBefore.current = 0;
    passedCount.current = 0;
    setHolding(false);
    setHeld(0);
    setSummary(null);
  };

  useEffect(() => {
    if (!visible) reset();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [visible]);

  // A light tap each time another moment is passed.
  useEffect(() => {
    if (passed.length > passedCount.current && Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => undefined);
    }
    passedCount.current = passed.length;
  }, [passed.length]);

  useEffect(() => {
    Animated.timing(glow, {
      toValue: holding ? 1 : 0,
      duration: reduceMotion ? 0 : 900,
      useNativeDriver: true,
    }).start();
    if (holding && !reduceMotion) {
      swell.setValue(0);
      Animated.loop(
        Animated.timing(swell, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      swell.stopAnimation();
    }
  }, [holding, reduceMotion, glow, swell]);

  const stop = (seconds: number) => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    heldBefore.current = seconds;
    setHeld(seconds);
    setHolding(false);
    setSummary(timeSummary(markers, seconds));
  };

  const begin = () => {
    if (atBeginning) return;
    setSummary(null);
    setHolding(true);
    startedAt.current = Date.now() - heldBefore.current * 1000;
    const end = heldToGoBack(UNIVERSE_AGE_YEARS);
    timer.current = setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000;
      if (seconds >= end) {
        stop(end);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          ).catch(() => undefined);
        }
      } else setHeld(seconds);
    }, 50);
  };

  const release = () => {
    if (!timer.current) return;
    stop((Date.now() - startedAt.current) / 1000);
  };

  const size = Math.min(width, 420);
  const scale = swell.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });
  const topPad = Platform.OS === "web" ? 24 : insets.top + 12;
  const gaugeTop = topPad + 48;
  const gaugeHeight = Math.max(200, height * 0.5);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", eraGlow(years)]}
          locations={[0.35, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <StarField count={60} containerOpacity={years >= 13.5e9 ? 0.2 : 0.6} />

        {/* How deep into the past: now at the top, the beginning at the bottom */}
        <View
          pointerEvents="none"
          style={[styles.gauge, { top: gaugeTop, height: gaugeHeight }]}
          accessible={false}
        >
          <View
            style={[styles.gaugeLine, { backgroundColor: colors.border }]}
          />
          {markers.map((m) => (
            <View
              key={m.name}
              style={[
                styles.tick,
                {
                  top: journeyDepth(m.yearsAgo) * gaugeHeight,
                  backgroundColor:
                    years >= m.yearsAgo ? WARM : colors.mutedForeground + "66",
                },
              ]}
            />
          ))}
          <View
            style={[
              styles.gaugeDot,
              { top: depth * gaugeHeight - 5, backgroundColor: WARM },
            ]}
          />
        </View>

        <Pressable
          onPressIn={begin}
          onPressOut={release}
          disabled={atBeginning}
          accessibilityRole="button"
          accessibilityLabel={
            held > 0
              ? "Press and hold to keep going back in time"
              : "Press and hold to travel back in time"
          }
          style={styles.pad}
        >
          <View style={[styles.top, { paddingTop: topPad }]}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              Travelling back in time
            </Text>
          </View>

          <View style={[styles.centre, { width: size, height: size }]}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: glow, transform: [{ scale }] },
              ]}
              pointerEvents="none"
            >
              <Svg width={size} height={size} viewBox="0 0 360 360">
                {RINGS.map((r, i) => (
                  <Circle
                    key={r}
                    cx={180}
                    cy={180}
                    r={r}
                    fill="none"
                    stroke={WARM}
                    strokeOpacity={0.28 - i * 0.05}
                    strokeWidth={1}
                  />
                ))}
              </Svg>
            </Animated.View>
            <View style={styles.readout}>
              <Text
                style={[styles.when, { color: colors.foreground }]}
                accessibilityLiveRegion="polite"
              >
                {atBeginning
                  ? "13.8 billion years ago"
                  : held > 0
                    ? yearsAgoWords(years)
                    : "Now"}
              </Text>
              {held > 0 ? (
                <View style={styles.trail}>
                  <Text style={[styles.passed, { color: WARM }]}>
                    {atBeginning
                      ? "The beginning."
                      : passed[0]
                        ? `Past ${passed[0].name}`
                        : "Going back"}
                  </Text>
                  {!atBeginning
                    ? passed.slice(1, 3).map((m, i) => (
                        <Text
                          key={m.name}
                          style={[
                            styles.trailItem,
                            {
                              color: colors.mutedForeground,
                              opacity: 0.75 - i * 0.3,
                            },
                          ]}
                        >
                          {m.name}
                        </Text>
                      ))
                    : null}
                </View>
              ) : null}
              {holding ? (
                <Text style={[styles.rate, { color: colors.mutedForeground }]}>
                  {historyRateWords(held)}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
            {summary ? (
              <Text style={[styles.summary, { color: colors.foreground }]}>
                {summary}
              </Text>
            ) : (
              <Text style={[styles.hint, { color: colors.mutedForeground }]}>
                {holding
                  ? "Keep holding."
                  : "Press and hold anywhere to go back in time. The longer you hold, the faster it goes."}
              </Text>
            )}
          </View>
        </Pressable>

        <View
          style={[
            styles.buttons,
            { bottom: insets.bottom + 24, opacity: holding ? 0 : 1 },
          ]}
          pointerEvents={holding ? "none" : "auto"}
        >
          {held > 0 ? (
            <TouchableOpacity
              onPress={reset}
              accessibilityRole="button"
              style={[styles.button, { borderColor: colors.border }]}
            >
              <Text style={[styles.buttonText, { color: colors.foreground }]}>
                Start again
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            style={[styles.button, { borderColor: colors.primary + "66" }]}
          >
            <Text style={[styles.buttonText, { color: colors.foreground }]}>
              {held > 0 ? "Done" : "Back to the Time Machine"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  pad: { flex: 1, alignItems: "center" },
  top: { alignSelf: "stretch", paddingHorizontal: 24 },
  eyebrow: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_600SemiBold" },
  centre: { marginTop: 12, alignItems: "center", justifyContent: "center" },
  readout: { alignItems: "center", gap: 6, paddingHorizontal: 40 },
  when: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  trail: { alignItems: "center", gap: 4 },
  passed: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  trailItem: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  rate: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 6,
  },
  bottom: {
    flex: 1,
    alignSelf: "stretch",
    maxWidth: 560,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    marginBottom: 76,
  },
  summary: { fontSize: 17, lineHeight: 27, fontFamily: "Inter_400Regular" },
  hint: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  gauge: { position: "absolute", right: 18, width: 14, alignItems: "center" },
  gaugeLine: { position: "absolute", top: 0, bottom: 0, width: 1 },
  tick: { position: "absolute", width: 7, height: 1 },
  gaugeDot: { position: "absolute", width: 10, height: 10, borderRadius: 5 },
  buttons: {
    position: "absolute",
    left: 24,
    right: 24,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  buttonText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
