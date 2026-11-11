import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import { EarthGlobe } from "@/components/EarthGlobe";
import { useColors } from "@/hooks/useColors";

export const SHIFT_ENTRY_DIAMETER = 220;
const DIAMETER = SHIFT_ENTRY_DIAMETER;

/** Where Earth should travel to as the Shift begins, relative to where it sits now. */
export interface EarthGlide {
  dx: number;
  dy: number;
  scale: number;
}

interface Props {
  /** Called with the centre of Earth on screen (window coordinates), when it can be measured. */
  onPress: (centre: { x: number; y: number } | null) => void;
  reduceMotion: boolean;
  /** Only pulse while the screen is in front, to save battery. */
  active: boolean;
  /** 0 at rest, 1 once Earth has reached the start of the journey. */
  glide: Animated.Value;
  glideTo: EarthGlide | null;
  /** True while the Shift is starting, so a second tap does nothing. */
  leaving: boolean;
}

/**
 * Earth is the way in: tap it to leave. A ring of light leaves it every few seconds, like the
 * pale blue dot on Home, and a short line underneath says what happens. Once tapped, the words
 * fade and Earth itself moves gently to where the journey starts, so nothing on screen jumps.
 */
export function ShiftEarthButton({
  onPress,
  reduceMotion,
  active,
  glide,
  glideTo,
  leaving,
}: Props) {
  const colors = useColors();
  const ripple = useRef(new Animated.Value(0)).current;
  const globeRef = useRef<View>(null);

  useEffect(() => {
    if (reduceMotion || !active || leaving) {
      ripple.stopAnimation();
      ripple.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ripple, {
          toValue: 1,
          duration: 3200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ripple, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(600),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ripple, reduceMotion, active, leaving]);

  const press = () => {
    if (leaving) return;
    const node = globeRef.current;
    if (!node || typeof node.measureInWindow !== "function") {
      onPress(null);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      onPress(
        Number.isFinite(x) && width > 0
          ? { x: x + width / 2, y: y + height / 2 }
          : null,
      );
    });
  };

  // The words go first, quickly, so Earth travels on its own.
  const wordsOpacity = glide.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [1, 0, 0],
  });
  const travel = glideTo
    ? [
        {
          translateX: glide.interpolate({
            inputRange: [0, 1],
            outputRange: [0, glideTo.dx],
          }),
        },
        {
          translateY: glide.interpolate({
            inputRange: [0, 1],
            outputRange: [0, glideTo.dy],
          }),
        },
        {
          scale: glide.interpolate({
            inputRange: [0, 1],
            outputRange: [1, glideTo.scale],
          }),
        },
      ]
    : [];

  return (
    <View style={styles.wrap}>
      <CalmPressable
        onPress={press}
        disabled={leaving}
        accessibilityRole="button"
        accessibilityLabel="Begin the Shift"
        accessibilityHint="About a minute, from Earth to everything we can see"
        pressedScale={reduceMotion ? 1 : 0.98}
        style={styles.earthArea}
        testID="shift-entry-earth"
      >
        {!reduceMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ring,
              {
                borderColor: colors.primary,
                opacity: ripple.interpolate({
                  inputRange: [0, 0.1, 1],
                  outputRange: [0, 0.6, 0],
                }),
                transform: [
                  {
                    scale: ripple.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.45],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}
        <Animated.View
          ref={globeRef}
          collapsable={false}
          style={{ transform: travel }}
        >
          <EarthGlobe diameter={DIAMETER} />
        </Animated.View>
      </CalmPressable>

      <Animated.Text
        style={[
          styles.youAreHere,
          { color: colors.foreground, opacity: wordsOpacity },
        ]}
      >
        You are here.
      </Animated.Text>
      <Animated.Text
        style={[
          styles.hint,
          { color: colors.mutedForeground, opacity: wordsOpacity },
        ]}
      >
        Tap Earth to begin
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  earthArea: {
    width: DIAMETER + 60,
    height: DIAMETER + 60,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: DIAMETER / 2,
    borderWidth: 1.5,
  },
  youAreHere: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 3,
    marginTop: 18,
  },
  hint: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginTop: 14,
  },
});
