import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import { EarthGlobe } from "@/components/EarthGlobe";
import { useColors } from "@/hooks/useColors";

const DIAMETER = 220;

interface Props {
  onPress: () => void;
  reduceMotion: boolean;
  /** Only pulse while the screen is in front, to save battery. */
  active: boolean;
}

/**
 * Earth is the way in: tap it to leave. A ring of light leaves it every few seconds, like the
 * pale blue dot on Home, and a short line underneath says what happens.
 */
export function ShiftEarthButton({ onPress, reduceMotion, active }: Props) {
  const colors = useColors();
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion || !active) {
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
  }, [ripple, reduceMotion, active]);

  return (
    <View style={styles.wrap}>
      <CalmPressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Begin the Shift"
        accessibilityHint="About a minute, from Earth to everything we can see"
        pressedScale={reduceMotion ? 1 : 0.97}
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
        <EarthGlobe diameter={DIAMETER} />
      </CalmPressable>

      <Text style={[styles.youAreHere, { color: colors.foreground }]}>
        You are here.
      </Text>
      <Text style={[styles.hint, { color: colors.mutedForeground }]}>
        Tap Earth to begin
      </Text>
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
