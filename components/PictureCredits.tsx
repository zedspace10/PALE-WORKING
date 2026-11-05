import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  allPictureCredits,
  ILLUSTRATION_NOTE,
} from "@/constants/pictureCredits";
import { useColors } from "@/hooks/useColors";

/** At the foot of the You tab: who took each real photograph in PALE, and where the rest come from. */
export function PictureCredits() {
  const colors = useColors();
  const credits = allPictureCredits();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.heading, { color: colors.mutedForeground }]}>
        Picture credits
      </Text>
      {credits.map((c) => (
        <Text
          key={c.title}
          style={[styles.line, { color: colors.mutedForeground }]}
        >
          {c.title}. {c.credit}. {c.source}. {c.licence}
          {c.licence === "Public domain" ? "." : ", cropped."}
        </Text>
      ))}
      <Text style={[styles.line, { color: colors.mutedForeground }]}>
        {ILLUSTRATION_NOTE}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, marginTop: 8 },
  heading: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_600SemiBold" },
  line: { fontSize: 12, lineHeight: 17, fontFamily: "Inter_400Regular" },
});
