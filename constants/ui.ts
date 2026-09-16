import type { TextStyle, ViewStyle } from "react-native";

export const calmSpace = {
  radius: {
    small: 14,
    medium: 20,
    large: 28,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
  },
  touchTarget: 44,
  motion: {
    quick: 180,
    enter: 520,
    ambient: 3600,
  },
} as const;

export const calmTypography = {
  display: {
    fontFamily: "Inter_700Bold",
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -1.45,
  } satisfies TextStyle,
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.8,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    lineHeight: 23,
    letterSpacing: -0.45,
  } satisfies TextStyle,
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 23,
  } satisfies TextStyle,
  button: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.15,
  } satisfies TextStyle,
  meta: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.2,
  } satisfies TextStyle,
} as const;

export const calmSurface = {
  borderRadius: calmSpace.radius.medium,
  borderWidth: 1,
  overflow: "hidden",
} satisfies ViewStyle;
