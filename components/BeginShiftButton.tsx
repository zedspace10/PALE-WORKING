import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import { useColors } from "@/hooks/useColors";

interface Props {
  onPress: () => void;
  reduceMotion: boolean;
  /** Only breathe while the screen is in front, to save battery. */
  active: boolean;
}

/**
 * The one thing to do on the Shift screen: a bright pill with a play mark, and how long it takes
 * underneath. A ring of light leaves it every few seconds, like the pale blue dot on Home.
 */
export function BeginShiftButton({ onPress, reduceMotion, active }: Props) {
  const colors = useColors();
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion || !active) {
      glow.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 2600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow, reduceMotion, active]);

  return (
    <View style={styles.wrap}>
      <View style={styles.buttonArea}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              borderColor: colors.primary,
              opacity: glow.interpolate({
                inputRange: [0, 0.15, 1],
                outputRange: [0, 0.7, 0],
              }),
              transform: [
                {
                  scaleX: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
                {
                  scaleY: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.32],
                  }),
                },
              ],
            },
          ]}
        />
        <CalmPressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel="Begin the Shift"
          accessibilityHint="About a minute, from Earth to everything we can see"
          pressedScale={reduceMotion ? 1 : 0.97}
          style={[styles.button, { borderColor: colors.primary + "99" }]}
        >
          <LinearGradient
            colors={["#14384A", "#0C2231"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.play, { backgroundColor: colors.primary }]}>
            <Feather
              name="play"
              size={18}
              color={colors.primaryForeground}
              style={styles.playIcon}
            />
          </View>
          <Text style={[styles.label, { color: colors.primaryStrong }]}>
            Begin the Shift
          </Text>
        </CalmPressable>
      </View>
      <Text style={[styles.caption, { color: colors.mutedForeground }]}>
        About a minute, from Earth to everything we can see
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 14, width: "100%" },
  buttonArea: {
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 84,
  },
  ring: {
    position: "absolute",
    width: 248,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
  },
  button: {
    width: 248,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 24,
    gap: 14,
  },
  play: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  // The play triangle looks off centre unless nudged right a touch.
  playIcon: { marginLeft: 3 },
  label: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
