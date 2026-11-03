import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { CalmPressable } from "@/components/CalmPressable";
import type { ThisWeek } from "@/constants/thisWeek";
import { useColors } from "@/hooks/useColors";

const WARM = "#F3DDB0";

/** One quiet row at the top of Explore: this week's picture from Hubble or Webb. */
export function ThisWeekRow({
  pin,
  onPress,
}: {
  pin: ThisWeek;
  onPress: () => void;
}) {
  const colors = useColors();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <CalmPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`This week: ${pin.object}, ${pin.distance}.`}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.cardPressed : colors.card,
          borderColor: pressed ? WARM + "88" : WARM + "40",
        },
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: colors.glass }]}>
        {pin.image && !imageFailed ? (
          <Image
            source={{ uri: pin.image.src }}
            style={styles.thumbImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
            accessible={false}
          />
        ) : null}
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: WARM }]}>This week</Text>
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {pin.object}
        </Text>
        <Text
          style={[styles.distance, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {capitalise(pin.distance)}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </CalmPressable>
  );
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 76,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  thumb: { width: 56, height: 56, borderRadius: 14, overflow: "hidden" },
  thumbImage: { width: "100%", height: "100%" },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  label: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_600SemiBold" },
  name: { fontSize: 16, lineHeight: 21, fontFamily: "Inter_600SemiBold" },
  distance: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_400Regular" },
});
