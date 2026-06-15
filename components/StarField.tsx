import React, { useRef, useEffect } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
}

const generateStars = (count: number): Star[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 1.8 + 0.4,
    baseOpacity: Math.random() * 0.5 + 0.1,
  }));

interface StarFieldProps {
  count?: number;
  containerOpacity?: number;
}

export function StarField({ count = 100, containerOpacity = 1 }: StarFieldProps) {
  const starsRef = useRef<Star[]>(generateStars(count));
  const twinkleAnims = useRef(
    starsRef.current.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
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
        ])
      );
    });
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [twinkleAnims]);

  return (
    <View
      style={[StyleSheet.absoluteFill, { opacity: containerOpacity }]}
      pointerEvents="none"
    >
      {starsRef.current.map((star, i) => (
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
            opacity: twinkleAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [star.baseOpacity * 0.15, star.baseOpacity],
            }),
          }}
        />
      ))}
    </View>
  );
}
