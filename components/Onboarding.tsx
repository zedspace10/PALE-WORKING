import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarField } from "@/components/StarField";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const ONBOARDED_KEY = "@pale_onboarded";

const PAGES = [
  {
    title: "A calm place to look up.",
    body: "Take a minute away from everything else, and see where you are.",
  },
  {
    title: "Everything here is real.",
    body: "The sky, the distances, the light. All of it is worked out on your phone from the science we have today.",
  },
  {
    title: "Nothing about you leaves this phone.",
    body: "No account and no tracking. Your notes and your birthday stay here, with you.",
  },
];

interface Props {
  onDone: () => void;
}

/**
 * The first time PALE opens: three quiet screens that say what it is, and ask for nothing.
 */
export function Onboarding({ onDone }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const fade = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [page, fade, reduceMotion]);

  const last = page === PAGES.length - 1;
  const next = () => (last ? onDone() : setPage(page + 1));
  const topPad = Platform.OS === "web" ? 24 : insets.top;

  return (
    <View
      style={[styles.wrap, { backgroundColor: colors.background }]}
      accessibilityViewIsModal
    >
      <StarField count={110} containerOpacity={0.9} drift={8} />
      <View style={[styles.top, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.brand, { color: colors.mutedForeground }]}>
          PALE
        </Text>
        {!last ? (
          <TouchableOpacity
            onPress={onDone}
            accessibilityRole="button"
            style={styles.skip}
          >
            <Text style={[styles.skipText, { color: colors.mutedForeground }]}>
              Skip
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.centre}>
        <View style={styles.dotWrap} accessible={false}>
          <View style={styles.halo} />
          <View style={styles.dot} />
        </View>
        <Animated.View style={[styles.words, { opacity: fade }]}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            {PAGES[page].title}
          </Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            {PAGES[page].body}
          </Text>
        </Animated.View>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 28 }]}>
        <View style={styles.pips} accessible={false}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.pip,
                {
                  backgroundColor:
                    i === page ? colors.primary : "rgba(141,235,255,0.25)",
                  width: i === page ? 16 : 5,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={next}
          accessibilityRole="button"
          style={[styles.button, { borderColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>
            {last ? "Begin" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 4,
  },
  skip: { minHeight: 44, minWidth: 44, justifyContent: "center" },
  skipText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 36,
  },
  dotWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  halo: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(141,200,255,0.12)",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#CFE6FF",
  },
  words: { alignItems: "center", gap: 14, maxWidth: 380 },
  title: {
    fontSize: 26,
    lineHeight: 33,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  bottom: { paddingHorizontal: 24, gap: 22, alignItems: "center" },
  pips: { flexDirection: "row", gap: 6, alignItems: "center" },
  pip: { height: 5, borderRadius: 2.5 },
  button: {
    alignSelf: "stretch",
    maxWidth: 520,
    width: "100%",
    minHeight: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
