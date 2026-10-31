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
  passedMarker,
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

// Rings that slowly widen while you hold, like ripples going back through time.
const RINGS = [60, 92, 124, 156];

/**
 * Hold to travel back in time, from now to the beginning, passing the moments of the Time Machine
 * on the way. Time speeds up the longer you hold, so 13.8 billion years takes about half a minute.
 */
export function TravelBack({ visible, birthday, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const [holding, setHolding] = useState(false);
  const [held, setHeld] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const glow = useRef(new Animated.Value(0)).current;
  const swell = useRef(new Animated.Value(0)).current;

  const markers = useMemo(
    () => timeMarkers(new Date(), birthday),
    [birthday, visible], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const years = yearsBack(held);
  const atBeginning = years >= UNIVERSE_AGE_YEARS;
  const passed = passedMarker(markers, years);

  useEffect(() => {
    if (!visible) {
      setHolding(false);
      setHeld(0);
      setSummary(null);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [visible]);

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
    setHeld(seconds);
    setHolding(false);
    setSummary(timeSummary(markers, seconds));
  };

  const begin = () => {
    setSummary(null);
    setHeld(0);
    setHolding(true);
    startedAt.current = Date.now();
    const end = heldToGoBack(UNIVERSE_AGE_YEARS);
    timer.current = setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000;
      if (seconds >= end) stop(end);
      else setHeld(seconds);
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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <StarField count={60} containerOpacity={0.6} />
        <Pressable
          onPressIn={begin}
          onPressOut={release}
          disabled={atBeginning}
          accessibilityRole="button"
          accessibilityLabel="Press and hold to travel back in time"
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
                    stroke="#F3DDB0"
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
                <Text style={[styles.passed, { color: "#F3DDB0" }]}>
                  {atBeginning
                    ? "The beginning."
                    : passed
                      ? `Past ${passed.name}`
                      : "Going back"}
                </Text>
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
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          disabled={holding}
          style={[
            styles.close,
            {
              borderColor: colors.primary + "66",
              bottom: insets.bottom + 24,
              opacity: holding ? 0 : 1,
            },
          ]}
        >
          <Text style={[styles.closeText, { color: colors.foreground }]}>
            Back to the Time Machine
          </Text>
        </TouchableOpacity>
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
  readout: { alignItems: "center", gap: 6, paddingHorizontal: 32 },
  when: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  passed: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  rate: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 4,
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
  close: {
    position: "absolute",
    left: 24,
    right: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  closeText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
