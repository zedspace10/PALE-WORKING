import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { StarField } from "./StarField";

interface MomentLine {
  text: string;
  delay: number;
  style?: "primary" | "muted";
}

function getMomentLines(hour: number, openCount: number): MomentLine[] {
  if (openCount >= 2) {
    return [
      { text: "You came back.", delay: 1200, style: "primary" },
      { text: "The universe noticed.", delay: 3000, style: "muted" },
    ];
  }

  if (hour >= 21 || hour <= 4) {
    return [
      { text: "You're still awake.", delay: 1400, style: "primary" },
      { text: "The universe has been awake", delay: 3200, style: "muted" },
      { text: "for 13.8 billion years.", delay: 900, style: "muted" },
      { text: "You're in good company.", delay: 1200, style: "primary" },
    ];
  }

  if (hour >= 5 && hour <= 8) {
    return [
      { text: "The Sun rose this morning.", delay: 1400, style: "primary" },
      { text: "As it has every morning", delay: 2800, style: "muted" },
      { text: "for 4.6 billion years.", delay: 900, style: "muted" },
      { text: "This one is yours.", delay: 1400, style: "primary" },
    ];
  }

  if (hour >= 11 && hour <= 14) {
    return [
      { text: "Eight minutes and twenty seconds ago", delay: 1200, style: "muted" },
      { text: "a photon left the Sun.", delay: 1000, style: "primary" },
      { text: "It just arrived.", delay: 1800, style: "primary" },
      { text: "The one on your skin right now", delay: 2200, style: "muted" },
      { text: "has been travelling since before", delay: 800, style: "muted" },
      { text: "you had this thought.", delay: 800, style: "muted" },
    ];
  }

  if (hour >= 17 && hour <= 20) {
    return [
      { text: "The stars are becoming visible.", delay: 1400, style: "primary" },
      { text: "They were there last night too.", delay: 2600, style: "muted" },
      { text: "And every night before that.", delay: 900, style: "muted" },
      { text: "For every human life ever lived.", delay: 1000, style: "primary" },
    ];
  }

  return [
    { text: "Right now", delay: 1200, style: "muted" },
    { text: "the universe is 13.8 billion years old.", delay: 1000, style: "primary" },
    { text: "You are here.", delay: 2000, style: "primary" },
  ];
}

interface Props {
  hour: number;
  openCount: number;
  onDismiss: () => void;
}

export function MomentCard({ hour, openCount, onDismiss }: Props) {
  const lines = getMomentLines(hour, openCount);
  const [canDismiss, setCanDismiss] = useState(false);
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  const lineAnims = useRef(
    lines.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(12),
    }))
  ).current;

  useEffect(() => {
    let totalDelay = 0;

    lines.forEach((line, idx) => {
      totalDelay += line.delay;
      const delay = totalDelay;

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
          setTimeout(() => {
            setCanDismiss(true);
            Animated.timing(hintOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }).start();
          }, 1400);
        }
      }, delay);
    });
  }, []);

  const handlePress = () => {
    if (!canDismiss) return;
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
