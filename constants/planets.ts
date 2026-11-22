/**
 * Planet positions, computed for the current date.
 *
 * Planets move, so their right ascension and declination cannot be stored as
 * constants the way a star's can. This works them out from orbital elements
 * using the standard low precision method, good to roughly a degree. That is
 * far finer than needed to point somebody at a bright dot with the naked eye.
 *
 * No network, no permissions.
 */

import { equatorialToHorizontal } from "@/constants/astronomy";
import type { Coordinates } from "@/constants/location";
import { getSolarAltitude } from "@/constants/solar";

const DEG = Math.PI / 180;
const AU_KM = 149_597_870.7;
const LIGHT_KM_PER_MIN = 17_987_547.48;

type Elements = {
  N: [number, number];
  i: [number, number];
  w: [number, number];
  a: [number, number];
  e: [number, number];
  M: [number, number];
};

export type PlanetId =
  "mercury" | "venus" | "mars" | "jupiter" | "saturn" | "uranus" | "neptune";

const ELEMENTS: Record<PlanetId | "earth", Elements> = {
  mercury: {
    N: [48.3313, 3.24587e-5],
    i: [7.0047, 5.0e-8],
    w: [29.1241, 1.01444e-5],
    a: [0.387098, 0],
    e: [0.205635, 5.59e-10],
    M: [168.6562, 4.0923344368],
  },
  venus: {
    N: [76.6799, 2.4659e-5],
    i: [3.3946, 2.75e-8],
    w: [54.891, 1.38374e-5],
    a: [0.72333, 0],
    e: [0.006773, -1.302e-9],
    M: [48.0052, 1.6021302244],
  },
  earth: {
    N: [0, 0],
    i: [0, 0],
    w: [282.9404, 4.70935e-5],
    a: [1.0, 0],
    e: [0.016709, -1.151e-9],
    M: [356.047, 0.9856002585],
  },
  mars: {
    N: [49.5574, 2.11081e-5],
    i: [1.8497, -1.78e-8],
    w: [286.5016, 2.92961e-5],
    a: [1.523688, 0],
    e: [0.093405, 2.516e-9],
    M: [18.6021, 0.5240207766],
  },
  jupiter: {
    N: [100.4542, 2.76854e-5],
    i: [1.303, -1.557e-7],
    w: [273.8777, 1.64505e-5],
    a: [5.20256, 0],
    e: [0.048498, 4.469e-9],
    M: [19.895, 0.0830853001],
  },
  saturn: {
    N: [113.6634, 2.3898e-5],
    i: [2.4886, -1.081e-7],
    w: [339.3939, 2.97661e-5],
    a: [9.55475, 0],
    e: [0.055546, -9.499e-9],
    M: [316.967, 0.0334442282],
  },
  uranus: {
    N: [74.0005, 1.3978e-5],
    i: [0.7733, 1.9e-8],
    w: [96.6612, 3.0565e-5],
    a: [19.18171, -1.55e-8],
    e: [0.047318, 7.45e-9],
    M: [142.5905, 0.011725806],
  },
  neptune: {
    N: [131.7806, 3.0173e-5],
    i: [1.77, -2.55e-7],
    w: [272.8461, -6.027e-6],
    a: [30.05826, 3.313e-8],
    e: [0.008606, 2.15e-9],
    M: [260.2471, 0.005995147],
  },
};

/** Days since 2000 Jan 0.0 TDT, the epoch these elements use. */
function dayNumber(date: Date): number {
  return date.getTime() / 86_400_000 - 10957.5;
}

const rev = (x: number) => ((x % 360) + 360) % 360;

function heliocentric(el: Elements, d: number) {
  const N = rev(el.N[0] + el.N[1] * d) * DEG;
  const i = (el.i[0] + el.i[1] * d) * DEG;
  const w = rev(el.w[0] + el.w[1] * d) * DEG;
  const a = el.a[0] + el.a[1] * d;
  const e = el.e[0] + el.e[1] * d;
  const M = rev(el.M[0] + el.M[1] * d) * DEG;

  let E = M + e * Math.sin(M) * (1 + e * Math.cos(M));
  for (let k = 0; k < 8; k++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-10) break;
  }

  const xv = a * (Math.cos(E) - e);
  const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E));
  const v = Math.atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);

  return {
    x:
      r *
      (Math.cos(N) * Math.cos(v + w) -
        Math.sin(N) * Math.sin(v + w) * Math.cos(i)),
    y:
      r *
      (Math.sin(N) * Math.cos(v + w) +
        Math.cos(N) * Math.sin(v + w) * Math.cos(i)),
    z: r * Math.sin(v + w) * Math.sin(i),
  };
}

export type PlanetPosition = {
  ra: number;
  dec: number;
  distanceAu: number;
  lightMinutes: number;
};

export function getPlanetPosition(
  planet: PlanetId,
  date: Date = new Date(),
): PlanetPosition {
  const d = dayNumber(date);

  const p = heliocentric(ELEMENTS[planet], d);
  const e = heliocentric(ELEMENTS.earth, d);

  const x = p.x + e.x;
  const y = p.y + e.y;
  const z = p.z;

  const ecl = (23.4393 - 3.563e-7 * d) * DEG;
  const xe = x;
  const ye = y * Math.cos(ecl) - z * Math.sin(ecl);
  const ze = y * Math.sin(ecl) + z * Math.cos(ecl);

  const ra = rev((Math.atan2(ye, xe) / DEG + 360) % 360);
  const dec = Math.atan2(ze, Math.sqrt(xe * xe + ye * ye)) / DEG;
  const distanceAu = Math.sqrt(xe * xe + ye * ye + ze * ze);

  return {
    ra,
    dec,
    distanceAu,
    lightMinutes: (distanceAu * AU_KM) / LIGHT_KM_PER_MIN,
  };
}

/** "43 minutes" or "1 hour 12 minutes", for the light travel line. */
export function formatLightTime(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} minutes`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  const hours = `${h} ${h === 1 ? "hour" : "hours"}`;
  return rem === 0 ? hours : `${hours} ${rem} minutes`;
}

export type SkyPlacement = "evening" | "all-night" | "late" | "morning" | "in-glare";

/**
 * When a planet can be seen tonight. Too close to the Sun, it is lost in the glare. Otherwise this
 * follows the planet's real height through the coming night: up after dark, up all night, rising
 * later in the evening, or only up before dawn. Going by its angle from the Sun alone cannot tell
 * a planet that rises at 10pm from one that rises at 5am, and a planet's height in the sky also
 * depends on how far north it is.
 *
 * With no location, PALE works this out for the middle of the UK at the phone's own time zone,
 * which is close enough for anyone in Britain or northern Europe.
 */
export function getPlanetSkyPlacement(
  planet: PlanetId,
  date: Date = new Date(),
  where: Coordinates | null = null,
): { elongation: number; placement: SkyPlacement } {
  const d = dayNumber(date);
  const p = heliocentric(ELEMENTS[planet], d);
  // The "earth" elements give the Sun as seen from Earth.
  const s = heliocentric(ELEMENTS.earth, d);
  const g = { x: p.x + s.x, y: p.y + s.y, z: p.z };

  const dot = g.x * s.x + g.y * s.y + g.z * s.z;
  const gl = Math.hypot(g.x, g.y, g.z);
  const sl = Math.hypot(s.x, s.y, s.z);
  const elongation =
    Math.acos(Math.max(-1, Math.min(1, dot / (gl * sl)))) / DEG;

  const glare = planet === "mercury" ? 18 : 15;
  if (elongation < glare) return { elongation, placement: "in-glare" };
  return { elongation, placement: nightPlacement(planet, date, where) };
}

function nightPlacement(
  planet: PlanetId,
  date: Date,
  where: Coordinates | null,
): SkyPlacement {
  const place: Coordinates = where ?? {
    lat: 52.5,
    // The phone's time zone gives a rough longitude: each hour is 15 degrees.
    lng: Math.max(-180, Math.min(180, -date.getTimezoneOffset() / 4)),
  };
  // Tonight runs from 3pm to 9am local time. Just after midnight, that is the night under way.
  const start = new Date(date);
  if (start.getHours() < 9) start.setDate(start.getDate() - 1);
  start.setHours(15, 0, 0, 0);
  const step = 20 * 60_000;
  const dark: { t: number; up: boolean }[] = [];
  for (let t = start.getTime(); t <= start.getTime() + 18 * 3_600_000; t += step) {
    const at = new Date(t);
    // Dark enough to see a planet: the Sun at least 6 degrees down.
    if (getSolarAltitude(place.lat, place.lng, at) > -6) continue;
    const pos = getPlanetPosition(planet, at);
    dark.push({ t, up: equatorialToHorizontal(pos, place, at).alt > 5 });
  }
  if (dark.length === 0) return "in-glare";
  const first = dark[0].t;
  const last = dark[dark.length - 1].t;
  const midnight = new Date(start);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  const upIn = (from: number, to: number) =>
    dark.some((x) => x.t >= from && x.t <= to && x.up);
  // The evening: the first two hours of darkness, or until 9.30pm if that is later.
  const eveningEnd = Math.max(first + 2 * 3_600_000, midnight.getTime() - 2.5 * 3_600_000);
  const evening = upIn(first, eveningEnd);
  const lateNight = upIn(eveningEnd, midnight.getTime() + 2 * 3_600_000);
  const smallHours = upIn(midnight.getTime() + 3_600_000, midnight.getTime() + 3 * 3_600_000);
  const dawn = upIn(last - 2 * 3_600_000, last);
  if (evening && (dawn || smallHours)) return "all-night";
  if (evening) return "evening";
  if (lateNight) return "late";
  if (dawn) return "morning";
  return "in-glare";
}
