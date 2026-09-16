import React, { useRef, useEffect } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const { width: W, height: H } = Dimensions.get("window");

interface Star {
  id: number;
  layer: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
}

const generateStars = (count: number): Star[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    layer: i % 3,
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 1.8 + 0.4,
    baseOpacity: Math.random() * 0.5 + 0.1,
  }));

interface StarFieldProps {
  count?: number;
  containerOpacity?: number;
  drift?: number;
}

export function StarField({
  count = 100,
  containerOpacity = 1,
  drift = 0,
}: StarFieldProps) {
  const reduceMotion = useReducedMotion();
  const starsRef = useRef<Star[]>(generateStars(count));
  const twinkleAnims = useRef(
    starsRef.current.map(() => new Animated.Value(1)),
  ).current;
  const layerAnims = useRef([
    new Animated.Value(0.5),
    new Animated.Value(0.5),
    new Animated.Value(0.5),
  ]).current;

  useEffect(() => {
    if (reduceMotion) {
      twinkleAnims.forEach((animation) => animation.setValue(1));
      return;
    }

    const animations = twinkleAnims.map((anim) => {
      const duration = 2500 + Math.random() * 4000;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.2,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]),
      );
    });
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [reduceMotion, twinkleAnims]);

  useEffect(() => {
    layerAnims.forEach((animation) => {
      animation.stopAnimation();
      animation.setValue(reduceMotion || drift === 0 ? 0.5 : 0);
    });

    if (reduceMotion || drift === 0) return;

    const loops = layerAnims.map((animation, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 9_000 + index * 2_400,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 9_000 + index * 2_400,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());
    return () => loops.forEach((loop) => loop.stop());
  }, [drift, layerAnims, reduceMotion]);

  return (
    <View
      style={[StyleSheet.absoluteFill, { opacity: containerOpacity }]}
      pointerEvents="none"
    >
      {layerAnims.map((motion, layer) => (
        <Animated.View
          key={layer}
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                {
                  translateX: motion.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -drift * (0.55 + layer * 0.2),
                      drift * (0.55 + layer * 0.2),
                    ],
                  }),
                },
                {
                  translateY: motion.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      drift * (0.38 + layer * 0.14),
                      -drift * (0.38 + layer * 0.14),
                    ],
                  }),
                },
              ],
            },
          ]}
        >
          {starsRef.current.map((star, index) =>
            star.layer === layer ? (
              <Animated.View
                key={star.id}
                style={{
                  position: "absolute",
                  left: star.x,
                  top: star.y,
                  width: star.size,
                  height: star.size,
                  borderRadius: star.size / 2,
                  backgroundColor: "#FFFFFF",
                  opacity: twinkleAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [star.baseOpacity * 0.22, star.baseOpacity],
                  }),
                }}
              />
            ) : null,
          )}
        </Animated.View>
      ))}
    </View>
  );
}
