import React from "react";
import { StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  explanation: string;
}

export function IllustrationDisclosure({ explanation }: Props) {
  const colors = useColors();

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Illustrative, not to scale. ${explanation}`}
      style={styles.container}
    >
      <View style={[styles.rule, { backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 24,
  },
  rule: { width: 16, height: 1, opacity: 0.55 },
});
