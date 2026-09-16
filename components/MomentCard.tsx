import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";

import { getMomentLines } from "@/constants/momentContent";
import { SolarState } from "@/constants/solar";
import { StarField } from "./StarField";

interface Props {
  hour: number;
  openCount: number;
  solarState: SolarState | null;
  onDismiss: () => void;
}

export function MomentCard({ hour, openCount, solarState, onDismiss }: Props) {
  const lines = useMemo(
    () => getMomentLines(hour, openCount, solarState),
    [hour, openCount, solarState],
  );
  const [, setCanDismiss] = useState(false);
  const dismissing = useRef(false);
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  const lineAnims = useRef(
    lines.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    })),
  ).current;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let totalDelay = 0;

    lines.forEach((line, idx) => {
      totalDelay += line.delay;
      const delay = totalDelay;

      timers.push(
        setTimeout(() => {
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          Animated.parallel([
            Animated.timing(lineAnims[idx].opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(lineAnims[idx].translateY, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();

          if (idx === lines.length - 1) {
            timers.push(
              setTimeout(() => {
                setCanDismiss(true);
                Animated.timing(hintOpacity, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
                }).start();
              }, 1400),
            );
          }
        }, delay),
      );
    });

    // Clear any pending line animations if the card is dismissed early.
    return () => timers.forEach(clearTimeout);
  }, [hintOpacity, lineAnims, lines]);

  const handlePress = () => {
    // Tappable at any point, not just once the lines have finished.
    if (dismissing.current) return;
    dismissing.current = true;

    Animated.timing(cardOpacity, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  return (
    <Animated.View style={[styles.container, { opacity: cardOpacity }]}>
      {/* Tap-to-dismiss covers everything */}
      <Pressable onPress={handlePress} style={StyleSheet.absoluteFill} />

      {/* Stars */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <StarField count={120} containerOpacity={0.45} />
      </View>

      {/* Text lines */}
      <View style={styles.content} pointerEvents="none">
        {lines.map((line, idx) => (
          <Animated.Text
            key={idx}
            style={[
              styles.line,
              line.style === "primary" ? styles.primary : styles.muted,
              {
                opacity: lineAnims[idx].opacity,
                transform: [{ translateY: lineAnims[idx].translateY }],
              },
            ]}
          >
            {line.text}
          </Animated.Text>
        ))}
      </View>

      {/* Hint */}
      <Animated.Text
        style={[styles.hint, { opacity: hintOpacity }]}
        pointerEvents="none"
      >
        tap anywhere to continue
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  content: {
    paddingHorizontal: 44,
    gap: 10,
    alignItems: "center",
  },
  line: {
    textAlign: "center",
    lineHeight: 32,
  },
  primary: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: "#F5F0E8",
    letterSpacing: 0.3,
  },
  muted: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#6B6B7E",
    letterSpacing: 0.2,
  },
  hint: {
    position: "absolute",
    bottom: 60,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "#3A3A4A",
    letterSpacing: 2.5,
  },
});
