import type { ImageSourcePropType } from "react-native";

import type { ExploreArtworkKey } from "@/constants/exploreArtwork";

export const EXPLORE_ARTWORK: Record<ExploreArtworkKey, ImageSourcePropType> = {
  moon: require("@/assets/images/explore/moon.jpg"),
  mars: require("@/assets/images/explore/mars.jpg"),
  saturn: require("@/assets/images/explore/saturn.jpg"),
  "galactic-center": require("@/assets/images/explore/galactic-center.jpg"),
  andromeda: require("@/assets/images/explore/andromeda.jpg"),
  "pillars-of-creation": require("@/assets/images/explore/pillars-of-creation.jpg"),
  "sagittarius-a-star": require("@/assets/images/explore/sagittarius-a-star.jpg"),
  "observable-edge": require("@/assets/images/explore/observable-edge.jpg"),
};
