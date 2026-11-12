import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { CalmPressable } from "@/components/CalmPressable";
import { GUIDE_STEPS, TAB_BAR_HEIGHT, tabCentre } from "@/constants/tabGuide";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RING = 27;

interface Props {
  onDone: () => void;
}

/**
 * A short walk along the tab bar: one place at a time, lit up, with a line on what is there.
 * Each step opens that place behind the guide, so it can be seen as well as read about.
 */
export function TabGuide({ onDone }: Props) {
  const colors = useColors();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [step, setStep] = useState(0);
  const appear = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const words = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  const current = GUIDE_STEPS[step];
  const last = step === GUIDE_STEPS.length - 1;

  useEffect(() => {
    router.navigate(GUIDE_STEPS[0].route);
    if (reduceMotion) return;
    Animated.timing(appear, {
      toValue: 1,
      duration: 700,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
    // Only once, when the guide opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  const go = (next: number) => {
    if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => undefined);
    router.navigate(GUIDE_STEPS[next].route);
    if (reduceMotion) {
      setStep(next);
      return;
    }
    Animated.timing(words, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setStep(next);
      Animated.timing(words, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    });
  };

  const finish = () => {
    router.navigate("/(tabs)");
    if (reduceMotion) {
      onDone();
      return;
    }
    Animated.timing(appear, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => onDone());
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ w: width, h: height });
  };

  const centre = size ? tabCentre(current.tab, size.w, size.h) : null;
  const shade = size
    ? `M0 0H${size.w}V${size.h}H0Z` +
      (centre
        ? `M${centre.x - RING} ${centre.y}a${RING} ${RING} 0 1 0 ${RING * 2} 0a${RING} ${RING} 0 1 0 ${-RING * 2} 0Z`
        : "")
    : "";

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { opacity: appear }]}
      onLayout={onLayout}
      accessibilityViewIsModal
    >
      {size ? (
        <Svg
          width={size.w}
          height={size.h}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Path d={shade} fill="rgba(3,5,10,0.8)" fillRule="evenodd" />
        </Svg>
      ) : null}

      {centre ? (
        <View
          pointerEvents="none"
          style={[
            styles.ringBox,
            { left: centre.x - RING, top: centre.y - RING },
          ]}
        >
          <View style={[styles.ring, { borderColor: colors.primary }]} />
          {!reduceMotion ? (
            <Animated.View
              style={[
                styles.ring,
                {
                  borderColor: colors.primary,
                  opacity: pulse.interpolate({
                    inputRange: [0, 0.15, 1],
                    outputRange: [0, 0.6, 0],
                  }),
                  transform: [
                    {
                      scale: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.6],
                      }),
                    },
                  ],
                },
              ]}
            />
          ) : null}
        </View>
      ) : null}

      <View style={[styles.cardWrap, { bottom: TAB_BAR_HEIGHT + 28 }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Animated.View style={{ opacity: words }}>
            <Text style={[styles.count, { color: colors.mutedForeground }]}>
              {step + 1} of {GUIDE_STEPS.length}
            </Text>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              {current.title}
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              {current.body}
            </Text>
          </Animated.View>

          <View style={styles.actions}>
            {!last ? (
              <CalmPressable
                onPress={finish}
                style={styles.skip}
                accessibilityRole="button"
                accessibilityLabel="Skip the guide"
              >
                <Text
                  style={[styles.skipText, { color: colors.mutedForeground }]}
                >
                  Skip
                </Text>
              </CalmPressable>
            ) : (
              <View />
            )}
            <CalmPressable
              onPress={() => (last ? finish() : go(step + 1))}
              style={[styles.next, { borderColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel={last ? "Start looking" : "Next"}
              testID="tab-guide-next"
            >
              <Text style={[styles.nextText, { color: colors.foreground }]}>
                {last ? "Start looking" : "Next"}
              </Text>
            </CalmPressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { zIndex: 50 },
  ringBox: {
    position: "absolute",
    width: RING * 2,
    height: RING * 2,
  },
  ring: {
    position: "absolute",
    width: RING * 2,
    height: RING * 2,
    borderRadius: RING,
    borderWidth: 1.5,
  },
  cardWrap: {
    position: "absolute",
    left: 20,
    right: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 18,
  },
  count: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skip: { minHeight: 44, minWidth: 44, justifyContent: "center" },
  skipText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  next: {
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
