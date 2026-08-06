/**
 * Solar position maths.
 *
 * getLocalSiderealTime and getSolarAltitude are lifted verbatim from
 * app/tonight-sky.tsx so the screen and the notification scheduler agree on
 * what "dark" means. tonight-sky.tsx should import them from here rather than
 * keeping its own copies.
 */

export function getLocalSiderealTime(lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525;
  const GMST =
    280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T;
  return (((GMST + lng) % 360) + 360) % 360;
}

export function getSolarAltitude(lat: number, lng: number, date: Date): number {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const n = JD - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  const lam =
    (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const eps = 23.439 * (Math.PI / 180);
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
  const lst = getLocalSiderealTime(lng, date);
  const ha = ((lst - (ra * 180) / Math.PI + 360) % 360) * (Math.PI / 180);
  const latRad = (lat * Math.PI) / 180;
  const sinAlt =
    Math.sin(dec) * Math.sin(latRad) +
    Math.cos(dec) * Math.cos(latRad) * Math.cos(ha);
  return (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;
}

/** Sun altitude at which tonight-sky.tsx considers the sky dark. */
export const DARK_ALTITUDE = -6;

/**
 * The moment on a given local day when the Sun sinks past `targetAltitude`.
 *
 * Returns null when there is no such crossing — polar summer where the Sun
 * never sets far enough, or polar winter where it never rose above the
 * threshold to begin with. Callers must handle null rather than assume a time.
 *
 * `day` may be any instant during the local day of interest; only its local
 * calendar date is used.
 */
export function findDusk(
  lat: number,
  lng: number,
  day: Date,
  targetAltitude: number = DARK_ALTITUDE
): Date | null {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);

  const STEP_MS = 10 * 60 * 1000;
  const STEPS = 144; // 24 hours

  // Coarse scan of the local day.
  const alts: number[] = [];
  for (let i = 0; i <= STEPS; i++) {
    alts.push(
      getSolarAltitude(lat, lng, new Date(start.getTime() + i * STEP_MS))
    );
  }

  // Highest point of the day, so we search the descending limb only.
  let peak = 0;
  for (let i = 1; i < alts.length; i++) if (alts[i] > alts[peak]) peak = i;

  if (alts[peak] <= targetAltitude) return null; // never light enough to darken

  let hi = -1;
  for (let i = peak; i < alts.length; i++) {
    if (alts[i] <= targetAltitude) {
      hi = i;
      break;
    }
  }
  if (hi === -1) return null; // never gets dark on this day

  // Bisect the bracketing 10 minute window down to ~30 seconds.
  let lo = hi - 1;
  let loMs = start.getTime() + lo * STEP_MS;
  let hiMs = start.getTime() + hi * STEP_MS;
  while (hiMs - loMs > 30_000) {
    const midMs = Math.floor((loMs + hiMs) / 2);
    if (getSolarAltitude(lat, lng, new Date(midMs)) > targetAltitude) {
      loMs = midMs;
    } else {
      hiMs = midMs;
    }
  }

  return new Date(hiMs);
}
