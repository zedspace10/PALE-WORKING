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
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

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
  date: Date = new Date()
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
