import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  /** Days since the person was born, or null when no birthday is set. */
  days: number | null;
  reduceMotion: boolean;
  onSetBirthday: () => void;
}

/**
 * The opening of PALE: one faint blue point in a field of stars, the way Earth looked to Voyager 1.
 * No globe and no big numbers; two quiet sentences underneath.
 */
export function PaleDotHero({ days, reduceMotion, onSetBirthday }: Props) {
  const colors = useColors();
  const breath = useRef(new Animated.Value(reduceMotion ? 1 : 0.6)).current;
  const words = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      breath.setValue(1);
      words.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0.6,
          duration: 3200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const show = Animated.sequence([
      Animated.delay(600),
      Animated.timing(words, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]);
    loop.start();
    show.start();
    return () => {
      loop.stop();
      show.stop();
    };
  }, [breath, words, reduceMotion]);

  return (
    <View style={styles.wrap}>
      <View
        style={styles.sky}
        accessible
        accessibilityRole="image"
        accessibilityLabel="Earth, a single pale blue point of light. You are here."
      >
        <Animated.View style={[styles.haloOuter, { opacity: breath }]} />
        <Animated.View style={[styles.halo, { opacity: breath }]} />
        <View style={styles.dot} />
        <Text style={[styles.here, { color: colors.mutedForeground }]}>
          You are here
        </Text>
      </View>

      <Animated.View style={[styles.words, { opacity: words }]}>
        <Text style={[styles.line, { color: colors.foreground }]}>
          {"The universe is about\n13.8 billion years old."}
        </Text>
        {days !== null ? (
          <Text style={[styles.line, { color: colors.foreground }]}>
            {"You have been part of it\nfor "}
            <Text style={{ color: colors.primaryStrong }}>
              {days.toLocaleString("en-GB")} days
            </Text>
            .
          </Text>
        ) : (
          <TouchableOpacity
            onPress={onSetBirthday}
            accessibilityRole="button"
            style={styles.prompt}
          >
            <Text
              style={[styles.promptText, { color: colors.mutedForeground }]}
            >
              Add your birthday to see your part of it
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
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", alignSelf: "stretch", gap: 6 },
  sky: {
    height: 120,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  haloOuter: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(141,200,255,0.05)",
  },
  halo: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(141,200,255,0.12)",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#CFE6FF",
    shadowColor: "#8DC8FF",
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  here: {
    position: "absolute",
    top: 60 + 16,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },
  words: { alignItems: "center", gap: 8, maxWidth: 360 },
  line: {
    fontSize: 19,
    lineHeight: 28,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  prompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
    marginTop: 4,
  },
  promptText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
