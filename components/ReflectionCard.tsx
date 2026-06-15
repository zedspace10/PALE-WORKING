import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";
import { DAILY_REFLECTIONS } from "@/constants/cosmicData";

export function ReflectionCard() {
  const colors = useColors();
  const today = new Date();
  const index = today.getDay() % DAILY_REFLECTIONS.length;
  const reflection = DAILY_REFLECTIONS[index];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        TODAY
      </Text>
      <Text style={[styles.text, { color: colors.foreground }]}>
        {reflection}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
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
