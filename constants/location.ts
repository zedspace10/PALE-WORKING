export const LOCATION_CACHE_KEY = "pale_location_cache";
export const LOCATION_CACHE_MAX_AGE_MS = 30 * 60 * 1000;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CachedLocation extends Coordinates {
  timestamp: number;
}

export type CachedLocationResult =
  | { ok: true; value: CachedLocation; ageMs: number }
  | {
      ok: false;
      reason:
        | "missing"
        | "malformed"
        | "invalid-coordinates"
        | "invalid-timestamp"
        | "future"
        | "stale";
    };

export function isValidCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Coordinates>;
  return (
    typeof candidate.lat === "number" &&
    Number.isFinite(candidate.lat) &&
    candidate.lat >= -90 &&
    candidate.lat <= 90 &&
    typeof candidate.lng === "number" &&
    Number.isFinite(candidate.lng) &&
    candidate.lng >= -180 &&
    candidate.lng <= 180
  );
}

export function parseCachedLocation(
  raw: string | null,
  nowMs: number,
  maxAgeMs = LOCATION_CACHE_MAX_AGE_MS,
): CachedLocationResult {
  if (raw === null) return { ok: false, reason: "missing" };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "malformed" };
  }

  if (!isValidCoordinates(value)) {
    return { ok: false, reason: "invalid-coordinates" };
  }

  const timestamp = (value as Partial<CachedLocation>).timestamp;
  if (
    typeof timestamp !== "number" ||
    !Number.isFinite(timestamp) ||
    timestamp < 0
  ) {
    return { ok: false, reason: "invalid-timestamp" };
  }

  const ageMs = nowMs - timestamp;
  if (ageMs < -60_000) return { ok: false, reason: "future" };
  if (ageMs > maxAgeMs) return { ok: false, reason: "stale" };

  return {
    ok: true,
    value: { lat: value.lat, lng: value.lng, timestamp },
    ageMs: Math.max(0, ageMs),
  };
}

export function serializeCachedLocation(
  coordinates: Coordinates,
  timestamp: number,
): string {
  if (!isValidCoordinates(coordinates) || !Number.isFinite(timestamp)) {
    throw new Error("Cannot cache an invalid location");
  }
  return JSON.stringify({ ...coordinates, timestamp });
}

export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
