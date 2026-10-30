import type { ImageSourcePropType } from "react-native";

import type { ExploreArtworkKey } from "@/constants/exploreArtwork";

export const EXPLORE_ARTWORK: Record<ExploreArtworkKey, ImageSourcePropType> = {
  moon: require("@/assets/images/explore/moon.jpg"),
  mars: require("@/assets/images/explore/mars.jpg"),
  saturn: require("@/assets/images/explore/saturn.jpg"),
  "voyager-1": require("@/assets/images/explore/voyager-1.jpg"),
  "proxima-centauri": require("@/assets/images/explore/proxima-centauri.jpg"),
  "orion-nebula": require("@/assets/images/explore/orion-nebula.jpg"),
  "galactic-center": require("@/assets/images/explore/galactic-center.jpg"),
  andromeda: require("@/assets/images/explore/andromeda.jpg"),
  "observable-edge": require("@/assets/images/explore/observable-edge.jpg"),
};
