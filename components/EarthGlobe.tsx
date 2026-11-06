import React from "react";
import { Image, StyleSheet, View } from "react-native";

/** The disc fills this share of the picture; the rest is the thin blue glow of the atmosphere. */
const DISC_FRACTION = 0.8;

const EARTH = require("@/assets/images/earth-globe.png");

interface Props {
  /** How wide Earth's disc should be, in points. */
  diameter: number;
}

/**
 * Earth, rendered for PALE from real planet maps: Africa and Europe in daylight, clouds, and the
 * atmosphere's glow on the sunlit edge. The picture is centred on the disc, so it can be placed
 * and scaled like a circle of the given diameter.
 */
export function EarthGlobe({ diameter }: Props) {
  const size = diameter / DISC_FRACTION;
  return (
    <View
      style={{ width: diameter, height: diameter }}
      accessible={false}
      pointerEvents="none"
    >
      <Image
        source={EARTH}
        resizeMode="contain"
        style={[
          styles.image,
          {
            width: size,
            height: size,
            left: (diameter - size) / 2,
            top: (diameter - size) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: { position: "absolute" },
});
