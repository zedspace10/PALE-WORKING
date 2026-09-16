import React from "react";
import { Text, StyleSheet } from "react-native";
import { LuminousSurface } from "@/components/MagicalSurface";
import { useColors } from "@/hooks/useColors";
import { DAILY_REFLECTIONS } from "@/constants/cosmicData";

export function ReflectionCard() {
  const colors = useColors();
  const today = new Date();
  const index = today.getDay() % DAILY_REFLECTIONS.length;
  const reflection = DAILY_REFLECTIONS[index];

  return (
    <LuminousSurface contentStyle={styles.container} tone="violet">
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        TODAY · POETIC REFLECTION
      </Text>
      <Text style={[styles.text, { color: colors.foreground }]}>
        {reflection}
      </Text>
    </LuminousSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.5,
  },
  text: {
    fontSize: 17,
    fontFamily: "Inter_400Regular",
    lineHeight: 26,
    fontStyle: "italic",
  },
});
