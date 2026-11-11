/**
 * The last screen of the Shift: home again, after everything we can see.
 */

// Earth's average speed around the Sun.
const EARTH_KM_S = 29.78;

export const WELCOME_TITLE = "Welcome home.";

export const WELCOME_LINE =
  "Of everything you just saw, this is the only place we know of with life.";

/** "While you were out there, Earth carried you about 1,790 km around the Sun." */
export function travelledWhileAway(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds < 5) return null;
  const km = Math.round((seconds * EARTH_KM_S) / 10) * 10;
  const words = String(km).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `While you were out there, Earth carried you about ${words} km around the Sun.`;
}
