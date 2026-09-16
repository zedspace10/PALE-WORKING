import type { TextStyle, ViewStyle } from "react-native";

export const calmSpace = {
  radius: {
    small: 12,
    medium: 18,
    large: 24,
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
    fontSize: 34,
    lineHeight: 39,
    letterSpacing: -1.1,
  } satisfies TextStyle,
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.6,
  } satisfies TextStyle,
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
  } satisfies TextStyle,
  button: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
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
