import { getLocalSiderealTime } from "@/constants/astronomy";
import { isValidCoordinates } from "@/constants/location";

export { getLocalSiderealTime } from "@/constants/astronomy";

export type SolarState =
  | "daylight"
  | "civil-twilight"
  | "nautical-twilight"
  | "astronomical-twilight"
  | "astronomical-darkness";

export const SOLAR_THRESHOLDS = {
  daylight: 0,
  civil: -6,
  nautical: -12,
  astronomical: -18,
} as const;

export const DARK_ALTITUDE = SOLAR_THRESHOLDS.astronomical;

export const SOLAR_STATE_LABELS: Record<SolarState, string> = {
  daylight: "daylight",
  "civil-twilight": "civil twilight",
  "nautical-twilight": "nautical twilight",
  "astronomical-twilight": "astronomical twilight",
  "astronomical-darkness": "astronomical darkness",
};

export function classifySolarAltitude(altitude: number): SolarState {
  if (!Number.isFinite(altitude))
    throw new Error("Solar altitude must be finite");
  if (altitude > SOLAR_THRESHOLDS.daylight) return "daylight";
  if (altitude > SOLAR_THRESHOLDS.civil) return "civil-twilight";
  if (altitude > SOLAR_THRESHOLDS.nautical) return "nautical-twilight";
  if (altitude > SOLAR_THRESHOLDS.astronomical) return "astronomical-twilight";
  return "astronomical-darkness";
}

export function getSolarAltitude(lat: number, lng: number, at: Date): number {
  if (!isValidCoordinates({ lat, lng }) || !Number.isFinite(at.getTime())) {
    throw new Error("Solar altitude requires valid coordinates and date");
  }
  const julianDate = at.getTime() / 86_400_000 + 2_440_587.5;
  const days = julianDate - 2_451_545;
  const meanLongitude = (280.46 + 0.9856474 * days) % 360;
  const anomaly = ((357.528 + 0.9856003 * days) % 360) * (Math.PI / 180);
  const eclipticLongitude =
    (meanLongitude + 1.915 * Math.sin(anomaly) + 0.02 * Math.sin(2 * anomaly)) *
    (Math.PI / 180);
  const obliquity = 23.439 * (Math.PI / 180);
  const rightAscension = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude),
    Math.cos(eclipticLongitude),
  );
  const declination = Math.asin(
    Math.sin(obliquity) * Math.sin(eclipticLongitude),
  );
  const localSiderealTime = getLocalSiderealTime(lng, at);
  const hourAngle =
    ((localSiderealTime - (rightAscension * 180) / Math.PI + 360) % 360) *
    (Math.PI / 180);
  const latitudeRad = (lat * Math.PI) / 180;
  const sinAltitude =
    Math.sin(declination) * Math.sin(latitudeRad) +
    Math.cos(declination) * Math.cos(latitudeRad) * Math.cos(hourAngle);
  return Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * (180 / Math.PI);
}

export type SolarCrossingResult =
  | { kind: "crossing"; at: Date; threshold: number }
  | { kind: "always-above"; threshold: number }
  | { kind: "always-below"; threshold: number }
  | { kind: "no-evening-crossing"; threshold: number };

/** Finds the evening (descending) threshold crossing on the local calendar day. */
export function findEveningSolarCrossing(
  lat: number,
  lng: number,
  day: Date,
  threshold = DARK_ALTITUDE,
): SolarCrossingResult {
  if (!isValidCoordinates({ lat, lng }) || !Number.isFinite(day.getTime())) {
    throw new Error("Solar crossing requires valid coordinates and date");
  }
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const stepMs = 10 * 60 * 1000;
  const samples = Array.from({ length: 145 }, (_, index) => {
    const sampleMs = start.getTime() + index * stepMs;
    return {
      at: sampleMs,
      altitude: getSolarAltitude(lat, lng, new Date(sampleMs)),
    };
  });
  const minimum = Math.min(...samples.map((sample) => sample.altitude));
  const maximum = Math.max(...samples.map((sample) => sample.altitude));
  if (minimum > threshold) return { kind: "always-above", threshold };
  if (maximum <= threshold) return { kind: "always-below", threshold };

  let peakIndex = 0;
  for (let index = 1; index < samples.length; index += 1) {
    if (samples[index].altitude > samples[peakIndex].altitude)
      peakIndex = index;
  }
  let highIndex = -1;
  for (let index = peakIndex + 1; index < samples.length; index += 1) {
    if (
      samples[index - 1].altitude > threshold &&
      samples[index].altitude <= threshold
    ) {
      highIndex = index;
      break;
    }
  }
  if (highIndex < 0) return { kind: "no-evening-crossing", threshold };

  let lowMs = samples[highIndex - 1].at;
  let highMs = samples[highIndex].at;
  while (highMs - lowMs > 30_000) {
    const midpoint = Math.floor((lowMs + highMs) / 2);
    if (getSolarAltitude(lat, lng, new Date(midpoint)) > threshold)
      lowMs = midpoint;
    else highMs = midpoint;
  }
  return { kind: "crossing", at: new Date(highMs), threshold };
}

/** Compatibility helper. Prefer findEveningSolarCrossing when polar states matter. */
export function findDusk(
  lat: number,
  lng: number,
  day: Date,
  targetAltitude = DARK_ALTITUDE,
): Date | null {
  const result = findEveningSolarCrossing(lat, lng, day, targetAltitude);
  return result.kind === "crossing" ? result.at : null;
}
