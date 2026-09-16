export const EXPLORE_ARTWORK_KEYS = [
  "moon",
  "mars",
  "saturn",
  "galactic-center",
  "andromeda",
  "pillars-of-creation",
  "sagittarius-a-star",
  "observable-edge",
] as const;

export type ExploreArtworkKey = (typeof EXPLORE_ARTWORK_KEYS)[number];

const EXPLORE_ARTWORK_KEY_SET = new Set<string>(EXPLORE_ARTWORK_KEYS);

export function isExploreArtworkKey(value: string): value is ExploreArtworkKey {
  return EXPLORE_ARTWORK_KEY_SET.has(value);
}
