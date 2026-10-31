/**
 * One line for the top of Home after dark: the best thing to look at tonight. Worked out on the
 * phone. With a location already shared it says where; without one it says what, from the Moon's
 * phase and the planets' places around the Sun, which need no location.
 */
import {
  equatorialToHorizontal,
  getMoonIllumination,
  getMoonPosition,
} from "@/constants/astronomy";
import type { Coordinates } from "@/constants/location";
import { compassWords } from "@/constants/notes";
import { getPlanetSkyPlacement, type PlanetId } from "@/constants/planets";
import { getSolarAltitude } from "@/constants/solar";

// Brightest first, so the line names the easiest thing to find.
const PLANETS: [PlanetId, string][] = [
  ["venus", "Venus"],
  ["jupiter", "Jupiter"],
  ["saturn", "Saturn"],
  ["mars", "Mars"],
];

/** Whether it is evening or night: from the Sun if PALE knows where you are, otherwise the clock. */
export function isDarkOut(where: Coordinates | null, now: Date): boolean {
  if (where) return getSolarAltitude(where.lat, where.lng, now) < -6;
  const hour = now.getHours();
  return hour >= 18 || hour < 5;
}

/** "The Moon is up in the south east." or "Saturn is out tonight.", or null in daylight. */
export function eveningLine(
  where: Coordinates | null,
  now: Date,
): string | null {
  if (!isDarkOut(where, now)) return null;

  const lit = getMoonIllumination(now);
  if (where && lit > 0.15) {
    const moon = equatorialToHorizontal(getMoonPosition(now), where, now);
    if (moon.alt > 8) return `The Moon is up in the ${compassWords(moon.az)}.`;
  }

  const hour = now.getHours();
  const evening = hour >= 15 && hour < 24;
  for (const [id, name] of PLANETS) {
    const { placement } = getPlanetSkyPlacement(id, now);
    if (placement === "all-night") return `${name} is out tonight.`;
    if (placement === "evening" && evening)
      return `${name} is in the evening sky.`;
  }
  for (const [id, name] of PLANETS) {
    if (getPlanetSkyPlacement(id, now).placement === "morning") {
      return `${name} rises before dawn.`;
    }
  }
  return "A dark night is a good night to look up.";
}
