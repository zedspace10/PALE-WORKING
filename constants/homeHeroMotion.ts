import type { AppStateStatus } from "react-native";

export type HomeHeroStarLayer = 0 | 1 | 2;

export interface HomeHeroStar {
  id: string;
  layer: HomeHeroStarLayer;
  opacity: number;
  size: number;
  x: number;
  y: number;
}

export interface HomeHeroLayerConfig {
  color: string;
  count: number;
  driftX: number;
  driftY: number;
  duration: number;
  layer: HomeHeroStarLayer;
}

export const HOME_HERO_STATIC_PROGRESS = 0.5;

export const HOME_HERO_LAYER_CONFIG: readonly HomeHeroLayerConfig[] = [
  {
    layer: 0,
    count: 12,
    color: "#8F83D6",
    driftX: 12,
    driftY: -8,
    duration: 30_000,
  },
  {
    layer: 1,
    count: 14,
    color: "#B7B4E8",
    driftX: -16,
    driftY: 10,
    duration: 24_000,
  },
  {
    layer: 2,
    count: 13,
    color: "#D7E8FF",
    driftX: 21,
    driftY: -13,
    duration: 19_000,
  },
] as const;

function seededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function createHomeHeroStars(seed = 0x50414c45): HomeHeroStar[] {
  const random = seededRandom(seed);

  return HOME_HERO_LAYER_CONFIG.flatMap((config) =>
    Array.from({ length: config.count }, (_, index) => ({
      id: `${config.layer}-${index}`,
      layer: config.layer,
      x: 3 + random() * 94,
      y: 4 + random() * 92,
      size: 0.8 + random() * (config.layer === 2 ? 1.3 : 0.9),
      opacity: 0.15 + random() * (config.layer === 2 ? 0.23 : 0.18),
    })),
  );
}

export const HOME_HERO_STARS = createHomeHeroStars();

export function shouldRunHomeHeroMotion(
  reduceMotion: boolean,
  isFocused: boolean,
  appState: AppStateStatus,
) {
  return !reduceMotion && isFocused && appState === "active";
}
