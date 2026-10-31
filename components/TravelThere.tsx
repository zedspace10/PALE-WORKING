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
import Svg, { Line } from "react-native-svg";

import { StarField } from "@/components/StarField";
import type { Location } from "@/constants/cosmicData";
import {
  heldToCover,
  heldWords,
  lightCovered,
  lightSeconds,
  passedOnTheWay,
  rateWords,
  travelledDistance,
  travelSummary,
} from "@/constants/exploreSky";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  place: Location;
  visible: boolean;
  onClose: () => void;
}

// Streaks of starlight around the centre, the same every time.
const STREAKS = Array.from({ length: 48 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const inner = 112 + ((i * 53) % 40);
  const length = 20 + ((i * 29) % 40);
  return {
    x1: 180 + Math.cos(a) * inner,
    y1: 180 + Math.sin(a) * inner,
    x2: 180 + Math.cos(a) * (inner + length),
    y2: 180 + Math.sin(a) * (inner + length),
    o: 0.35 + ((i * 17) % 50) / 100,
  };
});

/**
 * Hold to travel there at the speed of light. The person's own waiting does what numbers cannot:
 * the Moon arrives in a breath, Mars would take twelve minutes of holding on, the stars years.
 */
export function TravelThere({ place, visible, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const [holding, setHolding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const glow = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  const target = lightSeconds(place);
  const covered = lightCovered(elapsed);
  const arrived = !place.neverArrive && covered >= target;
  const passed = passedOnTheWay(place, covered);

  useEffect(() => {
    if (!visible) {
      setHolding(false);
      setElapsed(0);
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
      drift.setValue(0);
      Animated.loop(
        Animated.timing(drift, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      drift.stopAnimation();
    }
  }, [holding, reduceMotion, glow, drift]);

  const stop = (seconds: number) => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setElapsed(seconds);
    setHolding(false);
    setSummary(travelSummary(place, seconds));
  };

  const begin = () => {
    setSummary(null);
    setElapsed(0);
    setHolding(true);
    startedAt.current = Date.now();
    timer.current = setInterval(() => {
      const seconds = (Date.now() - startedAt.current) / 1000;
      setElapsed(seconds);
      if (!place.neverArrive && lightCovered(seconds) >= target) {
        stop(heldToCover(target));
      }
    }, 50);
  };

  const end = () => {
    if (!timer.current) return;
    stop((Date.now() - startedAt.current) / 1000);
  };

  const size = Math.min(width, 420);
  const streakScale = useMemo(
    () =>
      drift.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.35],
      }),
    [drift],
  );

  const name = place.name.replace(/^The /, "the ");
  const topPad = Platform.OS === "web" ? 24 : insets.top + 12;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.wrap, { backgroundColor: colors.background }]}>
        <StarField count={60} containerOpacity={0.45} />
        <Pressable
          onPressIn={begin}
          onPressOut={end}
          disabled={arrived}
          accessibilityRole="button"
          accessibilityLabel={`Press and hold to travel towards ${name} at the speed of light`}
          style={styles.pad}
        >
          <View style={[styles.top, { paddingTop: topPad }]}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              Travelling to {name} at the speed of light
            </Text>
          </View>

          <View style={[styles.centre, { width: size, height: size }]}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                { opacity: glow, transform: [{ scale: streakScale }] },
              ]}
              pointerEvents="none"
            >
              <Svg width={size} height={size} viewBox="0 0 360 360">
                {STREAKS.map((s, i) => (
                  <Line
                    key={i}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="#CFEFFF"
                    strokeOpacity={s.o}
                    strokeWidth={1}
                    strokeLinecap="round"
                  />
                ))}
              </Svg>
            </Animated.View>
            <View style={styles.readout}>
              <Text
                style={[styles.km, { color: colors.foreground }]}
                accessibilityLiveRegion="polite"
              >
                {travelledDistance(covered)}
              </Text>
              <Text style={[styles.held, { color: colors.mutedForeground }]}>
                {elapsed > 0
                  ? `Held for ${heldWords(elapsed)}`
                  : "Not moving yet"}
              </Text>
              {elapsed > 0 ? (
                <Text style={[styles.passed, { color: colors.primary }]}>
                  {arrived
                    ? "You're there."
                    : passed
                      ? `Past ${passed}`
                      : "Leaving Earth"}
                </Text>
              ) : null}
              {elapsed > 0 && !arrived ? (
                <Text style={[styles.rate, { color: colors.mutedForeground }]}>
                  {rateWords(elapsed)}
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
                  : "Press and hold anywhere. The first seconds are real. After that, time speeds up the longer you hold."}
              </Text>
            )}
          </View>
        </Pressable>
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          style={[
            styles.close,
            {
              borderColor: colors.primary + "66",
              bottom: insets.bottom + 24,
              opacity: holding ? 0 : 1,
            },
          ]}
          disabled={holding}
        >
          <Text style={[styles.closeText, { color: colors.foreground }]}>
            Back to {name}
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
  centre: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  readout: { alignItems: "center", gap: 6, paddingHorizontal: 24 },
  km: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.6,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  held: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "Inter_500Medium",
    fontVariant: ["tabular-nums"],
  },
  passed: { fontSize: 14, lineHeight: 20, fontFamily: "Inter_600SemiBold" },
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
