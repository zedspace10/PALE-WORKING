import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { CalmPressable } from "@/components/CalmPressable";
import { type Location } from "@/constants/cosmicData";
import { EXPLORE_ARTWORK } from "@/constants/exploreArtworkAssets";
import type { ExploreSky } from "@/constants/exploreSky";
import { useColors } from "@/hooks/useColors";

interface Props {
  location: Location;
  sky: ExploreSky;
  hasNote: boolean;
  onPress: () => void;
}

/** One rung of the outward list: a small picture, the name, how long its light takes, and tonight. */
export function LocationCard({ location, sky, hasNote, onPress }: Props) {
  const colors = useColors();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <View>
      {location.jump ? (
        <View style={styles.jump}>
          <View style={[styles.jumpLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.jumpText, { color: colors.primary }]}>
            {location.jump}
          </Text>
        </View>
      ) : null}
      <CalmPressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${location.name}. Light takes ${location.light}.${sky.chip ? ` ${sky.chip}.` : ""}${hasNote ? " Your note is on its way." : ""}`}
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
          </Text>
          {sky.chip || hasNote ? (
            <View style={styles.chips}>
              {sky.chip ? <SkyChip sky={sky} /> : null}
              {hasNote ? (
                <View style={[styles.chip, styles.noteChip]}>
                  <Text style={[styles.chipText, { color: "#F3DDB0" }]}>
                    Your note is on its way
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
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

export function SkyChip({ sky }: { sky: ExploreSky }) {
  const colors = useColors();
  const up = sky.tone === "up";
  const everywhere = sky.tone === "everywhere";
  return (
    <View
      style={[
        styles.chip,
        up
          ? { backgroundColor: colors.primary, borderColor: colors.primary }
          : everywhere
            ? { borderColor: "rgba(243,221,176,0.5)" }
            : sky.tone === "later"
              ? { borderColor: colors.primary + "80" }
              : { borderColor: colors.mutedForeground + "59" },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: up
              ? colors.background
              : everywhere
                ? "#F3DDB0"
                : sky.tone === "later"
                  ? colors.primary
                  : colors.mutedForeground,
          },
        ]}
      >
        {sky.chip}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  jump: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 40,
    paddingLeft: 41,
  },
  jumpLine: { width: 2, height: 40 },
  jumpText: { fontSize: 12, lineHeight: 16, fontFamily: "Inter_500Medium" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 84,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: "hidden",
  },
  thumbImage: { width: "100%", height: "100%" },
  copy: { flex: 1, gap: 4, minWidth: 0 },
  name: { fontSize: 16, lineHeight: 21, fontFamily: "Inter_600SemiBold" },
  light: { fontSize: 13, lineHeight: 18, fontFamily: "Inter_400Regular" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 3 },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  noteChip: { borderColor: "rgba(243,221,176,0.45)" },
  chipText: { fontSize: 11, lineHeight: 14, fontFamily: "Inter_600SemiBold" },
});
