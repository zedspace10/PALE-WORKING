import type { AppStateStatus } from "react-native";

/**
 * Gentle background motion (the pulsing dot, the pulse rings on Shift) only runs while its screen
 * is in front, the app is open, and the person has not asked for reduced motion.
 */
export function shouldRunHomeHeroMotion(
  reduceMotion: boolean,
  isFocused: boolean,
  appState: AppStateStatus,
) {
  return !reduceMotion && isFocused && appState === "active";
}
