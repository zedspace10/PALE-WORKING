import {
  CachedLocationResult,
  Coordinates,
  isValidCoordinates,
} from "@/constants/location";

export type SkyLocationResolution =
  | { status: "denied" }
  | { status: "unavailable" }
  | { status: "ready-current"; coordinates: Coordinates }
  | { status: "ready-cached"; coordinates: Coordinates };

export function resolveSkyLocation(
  permission: "granted" | "denied",
  live: unknown,
  cache: CachedLocationResult,
): SkyLocationResolution {
  if (permission === "denied") return { status: "denied" };
  if (isValidCoordinates(live)) {
    return { status: "ready-current", coordinates: live };
  }
  if (cache.ok) {
    return {
      status: "ready-cached",
      coordinates: { lat: cache.value.lat, lng: cache.value.lng },
    };
  }
  return { status: "unavailable" };
}
