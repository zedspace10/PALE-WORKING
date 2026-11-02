import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { CalmPressable } from "@/components/CalmPressable";
import { type Location } from "@/constants/cosmicData";
import { EXPLORE_ARTWORK } from "@/constants/exploreArtworkAssets";
import { useColors } from "@/hooks/useColors";

interface Props {
  location: Location;
  /** True when it is above the horizon where the person is, right now. */
  upTonight: boolean;
  onPress: () => void;
}

/** One rung of the outward list: a small picture, the name and how long its light takes. */
export function LocationCard({ location, upTonight, onPress }: Props) {
  const colors = useColors();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View>
      {location.jump ? (
        <View style={styles.jump}>
          <View style={[styles.jumpLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.jumpText, { color: colors.mutedForeground }]}>
            {location.jump}
          </Text>
        </View>
      ) : null}
      <CalmPressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${location.name}. Light takes ${location.light}.${upTonight ? " Up tonight." : ""}`}
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: pressed ? colors.cardPressed : colors.card,
            borderColor: pressed ? colors.primary + "66" : colors.border,
          },
        ]}
      >
        <View style={[styles.thumb, { backgroundColor: colors.glass }]}>
          {!imageFailed ? (
            <Image
              source={EXPLORE_ARTWORK[location.artworkKey]}
              style={styles.thumbImage}
              resizeMode="cover"
              onError={() => setImageFailed(true)}
              accessible={false}
            />
          ) : null}
        </View>
        <View style={styles.copy}>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {location.name}
          </Text>
          <Text style={[styles.light, { color: colors.mutedForeground }]}>
            Light takes {location.light}
            {upTonight ? (
              <Text style={{ color: colors.primary }}>{"  ·  Up tonight"}</Text>
            ) : null}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={18}
          color={colors.mutedForeground}
        />
      </CalmPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  jump: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 36,
    paddingLeft: 41,
  },
  jumpLine: { width: 2, height: 36 },
  jumpText: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_400Regular" },
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
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    overflow: "hidden",
  },
  thumbImage: { width: "100%", height: "100%" },
  copy: { flex: 1, gap: 3, minWidth: 0 },
  name: { fontSize: 16, lineHeight: 21, fontFamily: "Inter_600SemiBold" },
  light: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_400Regular" },
});
