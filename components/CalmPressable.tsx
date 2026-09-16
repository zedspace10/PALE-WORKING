import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { calmSpace } from "@/constants/ui";
import { motionDuration } from "@/constants/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CalmPressableProps extends PressableProps {
  wrapperStyle?: StyleProp<ViewStyle>;
  pressedScale?: number;
}

export function CalmPressable({
  children,
  onPressIn,
  onPressOut,
  wrapperStyle,
  pressedScale = 0.985,
  ...props
}: CalmPressableProps) {
  const reduceMotion = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    if (reduceMotion) {
      scale.setValue(1);
      return;
    }

    Animated.timing(scale, {
      toValue: value,
      duration: motionDuration(reduceMotion, calmSpace.motion.quick),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        {...props}
        onPressIn={(event) => {
          animateTo(pressedScale);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          animateTo(1);
          onPressOut?.(event);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
