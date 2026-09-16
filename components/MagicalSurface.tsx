import { LinearGradient } from "expo-linear-gradient";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import { calmSpace, calmSurface } from "@/constants/ui";
import { useColors } from "@/hooks/useColors";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type GlowTone = "cyan" | "violet" | "neutral";

interface LuminousSurfaceProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  tone?: GlowTone;
}

interface MagicalActionProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "quiet";
}

function glowForTone(tone: GlowTone, colors: ReturnType<typeof useColors>) {
  if (tone === "violet") return colors.violetGlow;
  if (tone === "neutral") return "rgba(255,255,255,0.035)";
  return colors.glow;
}

export function LuminousSurface({
  children,
  contentStyle,
  style,
  tone = "cyan",
}: LuminousSurfaceProps) {
  const colors = useColors();
  const glow = glowForTone(tone, colors);

  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: colors.glass,
          borderColor:
            tone === "neutral" ? colors.border : colors.luminousBorder,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[glow, "rgba(5,7,12,0)", "rgba(5,7,12,0)"]}
        locations={[0, 0.58, 1]}
        pointerEvents="none"
        style={styles.lightWash}
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

export function MagicalAction({
  children,
  contentStyle,
  wrapperStyle,
  style,
  variant = "primary",
  disabled,
  ...props
}: MagicalActionProps) {
  const colors = useColors();
  const reduceMotion = useReducedMotion();
  const isPrimary = variant === "primary";
  const isQuiet = variant === "quiet";

  return (
    <CalmPressable
      {...props}
      disabled={disabled}
      pressedScale={reduceMotion ? 1 : 0.982}
      wrapperStyle={wrapperStyle}
      style={[
        styles.action,
        {
          backgroundColor: isQuiet ? "transparent" : colors.glassStrong,
          borderColor: isPrimary
            ? colors.luminousBorder
            : variant === "secondary"
              ? colors.violet + "88"
              : colors.border,
          opacity: disabled ? 0.48 : 1,
        },
        style,
      ]}
    >
      {isPrimary ? (
        <LinearGradient
          colors={[colors.glow, colors.violetGlow, "rgba(5,7,12,0)"]}
          locations={[0, 0.55, 1]}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={[styles.actionContent, contentStyle]}>{children}</View>
    </CalmPressable>
  );
}

const styles = StyleSheet.create({
  surface: {
    ...calmSurface,
    position: "relative",
  },
  lightWash: {
    bottom: "26%",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  action: {
    borderRadius: calmSpace.radius.medium,
    borderWidth: 1,
    minHeight: calmSpace.touchTarget,
    overflow: "hidden",
    position: "relative",
  },
  actionContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: calmSpace.touchTarget,
    position: "relative",
    zIndex: 1,
  },
});
