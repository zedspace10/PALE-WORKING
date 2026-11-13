/**
 * Notes sent to the universe, shared with the Stellara website.
 *
 * A note is a short line, the moment it was sent and the star it is aimed at. It is kept on the
 * phone. Its link puts all three after the # in a stellaraspace.com address, the part browsers
 * never send to any server, so the website can show the note's journey without PALE collecting
 * anything. The format matches the website's own (src/lib/notes.ts in the Stellara repository).
 */
import { equatorialToHorizontal } from "@/constants/astronomy";
import type { Coordinates } from "@/constants/location";
import { heliocentric } from "@/constants/ephemeris";
import type { PlanetId } from "@/constants/planets";

export const NOTES_STORAGE_KEY = "@pale_notes";
export const MAX_NOTE_LINE = 120;
export const C_KM_S = 299_792.458;
const YEAR_MS = 365.25 * 86_400_000;
const WEBSITE = "https://stellaraspace.com";

export type DestinationKind =
  "planet" | "star" | "nebula" | "black-hole" | "galaxy";

export interface Destination {
  id: string;
  name: string;
  /** A short name for the picker. */
  short: string;
  kind: DestinationKind;
  /** Right ascension and declination in degrees. */
  ra: number;
  dec: number;
  ly: number;
  line: string;
  /** For a planet: which one. Its direction and distance depend on when the note is sent. */
  planet?: PlanetId;
}

export const CATEGORIES: { kind: DestinationKind; label: string }[] = [
  { kind: "planet", label: "Planets" },
  { kind: "star", label: "Stars" },
  { kind: "nebula", label: "Nebulae and clusters" },
  { kind: "black-hole", label: "Black holes" },
  { kind: "galaxy", label: "Galaxies" },
];

const planet = (id: PlanetId, name: string, line: string): Destination => ({
  id,
  name,
  short: name,
  kind: "planet",
  planet: id,
  ra: 0,
  dec: 0,
  ly: 0,
  line,
});
const place = (
  id: string,
  kind: DestinationKind,
  name: string,
  short: string,
  raHours: number,
  dec: number,
  ly: number,
  line: string,
): Destination => ({ id, kind, name, short, ra: raHours * 15, dec, ly, line });

// The same places, ids and order as the website (src/lib/notes.ts in the Stellara repository), so
// a link from either opens the same journey. Planets move, so they are worked out when sent.
export const DESTINATIONS: Destination[] = [
  planet(
    "mercury",
    "Mercury",
    "The smallest planet, and the closest to the Sun.",
  ),
  planet("venus", "Venus", "The brightest planet in our sky."),
  planet(
    "mars",
    "Mars",
    "The red planet, home to the tallest volcano we know of.",
  ),
  planet(
    "jupiter",
    "Jupiter",
    "The largest planet, with a storm wider than Earth.",
  ),
  planet("saturn", "Saturn", "The ringed planet. Its rings are mostly ice."),
  planet(
    "uranus",
    "Uranus",
    "An ice giant that rolls around the Sun on its side.",
  ),
  planet(
    "neptune",
    "Neptune",
    "The farthest planet, with the fastest winds we know of.",
  ),
  place(
    "proxima",
    "star",
    "Proxima Centauri",
    "Proxima Centauri",
    14.4953,
    -62.679,
    4.24,
    "The nearest star to the Sun.",
  ),
  place(
    "sirius",
    "star",
    "Sirius",
    "Sirius",
    6.7525,
    -16.716,
    8.6,
    "The brightest star in the night sky.",
  ),
  place(
    "tau-ceti",
    "star",
    "Tau Ceti",
    "Tau Ceti",
    1.7345,
    -15.937,
    11.9,
    "A quiet star much like the Sun.",
  ),
  place(
    "vega",
    "star",
    "Vega",
    "Vega",
    18.6156,
    38.784,
    25,
    "A bright blue white star, once the North Star.",
  ),
  place(
    "trappist",
    "star",
    "TRAPPIST-1",
    "TRAPPIST-1",
    23.1081,
    -5.041,
    40.7,
    "A small star with seven rocky planets.",
  ),
  place(
    "polaris",
    "star",
    "Polaris",
    "Polaris",
    2.5303,
    89.264,
    433,
    "The North Star, almost straight above Earth's north pole.",
  ),
  place(
    "pleiades",
    "nebula",
    "The Pleiades",
    "The Pleiades",
    3.7908,
    24.117,
    444,
    "The Seven Sisters, a cluster of young stars.",
  ),
  place(
    "orion",
    "nebula",
    "The Orion Nebula",
    "Orion Nebula",
    5.5881,
    -5.391,
    1344,
    "A cloud where new stars are being born.",
  ),
  place(
    "eagle",
    "nebula",
    "The Eagle Nebula",
    "Eagle Nebula",
    18.3133,
    -13.817,
    6500,
    "Home of the Pillars of Creation, where stars are forming.",
  ),
  place(
    "gaia-bh1",
    "black-hole",
    "Gaia BH1",
    "Gaia BH1",
    17.4781,
    -0.5811,
    1560,
    "The nearest black hole we know of, circled by a star much like the Sun.",
  ),
  place(
    "cygnus-x1",
    "black-hole",
    "Cygnus X-1",
    "Cygnus X-1",
    19.9727,
    35.2016,
    7200,
    "A black hole 21 times the Sun's mass, pulling gas from a giant blue star.",
  ),
  place(
    "centre",
    "black-hole",
    "Sagittarius A*",
    "Sagittarius A*",
    17.7611,
    -29.008,
    26000,
    "The black hole at the centre of our galaxy, four million times the Sun's mass.",
  ),
  place(
    "m87",
    "black-hole",
    "M87*",
    "M87*",
    12.5137,
    12.3911,
    55e6,
    "The first black hole ever photographed, 6.5 billion times the Sun's mass.",
  ),
  place(
    "lmc",
    "galaxy",
    "The Large Magellanic Cloud",
    "Large Magellanic Cloud",
    5.3929,
    -69.756,
    160000,
    "A small galaxy circling our own, seen from the southern hemisphere.",
  ),
  place(
    "andromeda",
    "galaxy",
    "The Andromeda Galaxy",
    "Andromeda",
    0.7123,
    41.269,
    2.5e6,
    "The nearest big galaxy.",
  ),
  place(
    "triangulum",
    "galaxy",
    "The Triangulum Galaxy",
    "Triangulum",
    1.5641,
    30.6603,
    2.73e6,
    "The third largest galaxy in our Local Group.",
  ),
  place(
    "sombrero",
    "galaxy",
    "The Sombrero Galaxy",
    "Sombrero Galaxy",
    12.6665,
    -11.6231,
    31e6,
    "Seen almost edge on, with a bright core and a dark band of dust.",
  ),
];

export const DEFAULT_DESTINATION = "sirius";

export interface Note {
  id: string;
  text: string;
  sentAt: number;
  to: string;
  /** True once the person has also sent it as real light from the phone's torch. */
  light?: boolean;
}

const LY_KM = 9_460_730_472_580.8;

const AU_KM = 149_597_870.7;
const EPS = (23.4392911 * Math.PI) / 180;

/**
 * A destination as it was at the moment `at`. Stars stay put; for a planet, the note is aimed where
 * the planet will be when the light gets there, from where Earth was at sending. Worked out exactly
 * as the website does, with the same planet table (constants/ephemeris.ts).
 */
export function resolveDestination(d: Destination, at: number): Destination {
  if (!d.planet) return d;
  const earth = heliocentric("earth", at);
  if (!earth) return d;
  let arrive = at;
  let v = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < 3; i++) {
    const p = heliocentric(d.planet, arrive);
    if (!p) return d;
    v = { x: p.x - earth.x, y: p.y - earth.y, z: p.z - earth.z };
    arrive = at + ((Math.hypot(v.x, v.y, v.z) * AU_KM) / C_KM_S) * 1000;
  }
  const km = Math.hypot(v.x, v.y, v.z) * AU_KM;
  const xe = v.x;
  const ye = v.y * Math.cos(EPS) - v.z * Math.sin(EPS);
  const ze = v.y * Math.sin(EPS) + v.z * Math.cos(EPS);
  let ra = (Math.atan2(ye, xe) * 180) / Math.PI;
  if (ra < 0) ra += 360;
  const dec = (Math.atan2(ze, Math.hypot(xe, ye)) * 180) / Math.PI;
  return { ...d, ra, dec, ly: km / LY_KM };
}

/** Where a note is going, as it was when it was sent. */
export function destinationOf(
  note: Pick<Note, "to"> & { sentAt?: number },
): Destination {
  const d =
    DESTINATIONS.find((x) => x.id === note.to) ??
    (DESTINATIONS.find((x) => x.id === DEFAULT_DESTINATION) as Destination);
  return resolveDestination(d, note.sentAt ?? Date.now());
}

/** How long a note's light takes to get there, in seconds. */
export function travelSeconds(dest: Destination): number {
  return (dest.ly * YEAR_MS) / 1000;
}

export function newNote(text: string, to: string, now = Date.now()): Note {
  return {
    id: `${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim().slice(0, MAX_NOTE_LINE),
    sentAt: now,
    to,
  };
}

/**
 * Letting a note go: it leaves the phone, and its milestone reminders go with it. A note cannot
 * be called back; the light it became keeps travelling.
 */
export function withoutNote(notes: Note[], id: string): Note[] {
  return notes.filter((n) => n.id !== id);
}

export const LET_GO_ASK =
  "Let this note go? It will disappear from your phone. The light it became keeps travelling.";
export const LET_GO_DONE =
  "It is gone from your phone. The light keeps travelling.";

export function parseNotes(raw: string | null): Note[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (n): n is Note =>
        n &&
        typeof n.id === "string" &&
        typeof n.text === "string" &&
        typeof n.sentAt === "number" &&
        typeof n.to === "string",
    );
  } catch {
    return [];
  }
}

// ── The link the website reads ──────────────────────────────────────────────
function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function noteLink(note: Note): string {
  const payload = toBase64Url(
    JSON.stringify({ t: note.text, s: note.sentAt, d: note.to }),
  );
  return `${WEBSITE}/note#n=${payload}`;
}

// ── How far it has gone ─────────────────────────────────────────────────────
export function kmTravelled(sentAt: number, now: number): number {
  return Math.max(0, (now - sentAt) / 1000) * C_KM_S;
}

// Voyager 1 is one light day from Earth on 18 November 2026 and moves outwards at about 17 km/s,
// so its distance is worked out for the moment asked rather than fixed.
const VOYAGER_LIGHT_DAY_AT = Date.UTC(2026, 10, 18);
const VOYAGER_KM_S = 16.9;

/** How far Voyager 1 is from Earth at a moment, in light seconds. */
export function voyagerLightSeconds(at: number): number {
  return (
    86_400 + ((at - VOYAGER_LIGHT_DAY_AT) / 1000) * (VOYAGER_KM_S / C_KM_S)
  );
}

/** The landmarks a note passes on its way out, with how many seconds after sending. */
export function marks(now: number): { name: string; seconds: number }[] {
  return [
    { name: "the Moon", seconds: 1.28 },
    { name: "the Sun's distance", seconds: 499 },
    { name: "Jupiter's orbit", seconds: 2600 },
    { name: "Neptune's orbit", seconds: 15000 },
    { name: "Voyager 1", seconds: voyagerLightSeconds(now) },
  ];
}

/** "past the Moon", or "past Voyager 1", or "just leaving Earth". */
export function progressWords(note: Note, now: number): string {
  const seconds = Math.max(0, (now - note.sentAt) / 1000);
  const dest = destinationOf(note);
  if (seconds >= (dest.ly * YEAR_MS) / 1000) return `arrived at ${dest.name}`;
  const passed = marks(now).filter((m) => seconds >= m.seconds);
  return passed.length
    ? `past ${passed[passed.length - 1].name}`
    : "just leaving Earth";
}

export function arrivalWords(dest: Destination): string {
  const seconds = travelSeconds(dest);
  if (seconds < 3600) {
    const m = Math.max(1, Math.round(seconds / 60));
    return `arrives in ${m} ${m === 1 ? "minute" : "minutes"}`;
  }
  if (seconds < 86_400) {
    const h = Math.round(seconds / 3600);
    return `arrives in about ${h} ${h === 1 ? "hour" : "hours"}`;
  }
  if (dest.ly >= 1000) {
    return `arrives in ${Math.round(dest.ly).toLocaleString("en-GB")} years`;
  }
  const years = Math.floor(dest.ly);
  const months = Math.round((dest.ly - years) * 12);
  return `arrives in ${years} years${months ? ` ${months} ${months === 1 ? "month" : "months"}` : ""}`;
}

export function formatKm(km: number): string {
  if (km < 1e9) return `${Math.round(km).toLocaleString("en-GB")} km`;
  if (km < 1e12) return `${(km / 1e9).toFixed(1)} billion km`;
  return `${(km / 1e12).toFixed(1)} trillion km`;
}

// ── Where to point the phone ────────────────────────────────────────────────
const COMPASS = [
  "north",
  "north east",
  "east",
  "south east",
  "south",
  "south west",
  "west",
  "north west",
];

export function compassWords(az: number): string {
  return COMPASS[Math.round((((az % 360) + 360) % 360) / 45) % 8];
}

export type Aim =
  | { kind: "up"; alt: number; az: number; direction: string }
  | { kind: "below"; risesAt: Date | null };

/**
 * Where the star is from here, now: which way to face and how high to point. If it is below the
 * horizon, light aimed at it would go into the ground, so the next time it rises is given instead.
 */
export function aimAt(dest: Destination, where: Coordinates, at: Date): Aim {
  const here = equatorialToHorizontal(
    { ra: dest.ra, dec: dest.dec },
    where,
    at,
  );
  if (here.alt > 5) {
    return {
      kind: "up",
      alt: here.alt,
      az: here.az,
      direction: compassWords(here.az),
    };
  }
  for (let minutes = 10; minutes <= 24 * 60; minutes += 10) {
    const later = new Date(at.getTime() + minutes * 60_000);
    if (
      equatorialToHorizontal({ ra: dest.ra, dec: dest.dec }, where, later).alt >
      5
    ) {
      return { kind: "below", risesAt: later };
    }
  }
  return { kind: "below", risesAt: null };
}

/** "low", "a third of the way up", "high", in words someone can point with. */
export function heightWords(alt: number): string {
  if (alt < 20) return "low, just above the horizon";
  if (alt < 40) return "about a third of the way up the sky";
  if (alt < 60) return "about half way up the sky";
  if (alt < 80) return "high up";
  return "almost straight overhead";
}

// ── Morse code for the torch ────────────────────────────────────────────────
const MORSE: Record<string, string> = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
};

/** The longest stretch of a line the torch will spell out, so a signal lasts under a minute. */
export const MAX_SIGNAL_CHARS = 24;

/** The part of the line the torch spells: letters, digits and spaces, up to the limit. */
export function signalText(line: string): string {
  return line
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SIGNAL_CHARS)
    .trim();
}

export interface Pulse {
  on: boolean;
  ms: number;
  /** Index of the character this pulse belongs to, for showing progress. */
  char: number;
}

/**
 * The torch's on and off timings for a line in international Morse: a dot is one unit, a dash
 * three, with one unit between parts of a letter, three between letters and seven between words.
 */
export function morsePulses(line: string, unitMs = 180): Pulse[] {
  const text = signalText(line);
  const out: Pulse[] = [];
  [...text].forEach((ch, i) => {
    if (ch === " ") {
      // A word gap is seven units; the letter gap before it already gave three.
      out.push({ on: false, ms: unitMs * 4, char: i });
      return;
    }
    const code = MORSE[ch];
    if (!code) return;
    [...code].forEach((symbol, k) => {
      out.push({ on: true, ms: unitMs * (symbol === "." ? 1 : 3), char: i });
      out.push({
        on: false,
        ms: unitMs * (k === code.length - 1 ? 3 : 1),
        char: i,
      });
    });
  });
  return out;
}

export function signalSeconds(line: string, unitMs = 180): number {
  return Math.round(
    morsePulses(line, unitMs).reduce((sum, p) => sum + p.ms, 0) / 1000,
  );
}
