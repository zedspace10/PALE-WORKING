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

export const NOTES_STORAGE_KEY = "@pale_notes";
export const MAX_NOTE_LINE = 120;
export const C_KM_S = 299_792.458;
const YEAR_MS = 365.25 * 86_400_000;
const WEBSITE = "https://stellaraspace.com";

export interface Destination {
  id: string;
  name: string;
  /** Right ascension and declination in degrees. */
  ra: number;
  dec: number;
  ly: number;
  line: string;
}

// The same stars, in the same order, as the website, so a link from either opens the same journey.
export const DESTINATIONS: Destination[] = [
  {
    id: "proxima",
    name: "Proxima Centauri",
    ra: 14.4953 * 15,
    dec: -62.679,
    ly: 4.24,
    line: "The nearest star to the Sun.",
  },
  {
    id: "sirius",
    name: "Sirius",
    ra: 6.7525 * 15,
    dec: -16.716,
    ly: 8.6,
    line: "The brightest star in the night sky.",
  },
  {
    id: "tau-ceti",
    name: "Tau Ceti",
    ra: 1.7345 * 15,
    dec: -15.937,
    ly: 11.9,
    line: "A quiet star much like the Sun.",
  },
  {
    id: "vega",
    name: "Vega",
    ra: 18.6156 * 15,
    dec: 38.784,
    ly: 25,
    line: "A bright blue white star, once the North Star.",
  },
  {
    id: "trappist",
    name: "TRAPPIST-1",
    ra: 23.1081 * 15,
    dec: -5.041,
    ly: 40.7,
    line: "A small star with seven rocky planets.",
  },
  {
    id: "pleiades",
    name: "The Pleiades",
    ra: 3.7908 * 15,
    dec: 24.117,
    ly: 444,
    line: "The Seven Sisters, a cluster of young stars.",
  },
  {
    id: "orion",
    name: "The Orion Nebula",
    ra: 5.5881 * 15,
    dec: -5.391,
    ly: 1344,
    line: "A cloud where new stars are being born.",
  },
  {
    id: "centre",
    name: "The centre of the Milky Way",
    ra: 17.7611 * 15,
    dec: -29.008,
    ly: 26000,
    line: "The heart of our galaxy.",
  },
  {
    id: "andromeda",
    name: "The Andromeda Galaxy",
    ra: 0.7123 * 15,
    dec: 41.269,
    ly: 2.5e6,
    line: "The nearest big galaxy.",
  },
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

export function destinationOf(note: Pick<Note, "to">): Destination {
  return (
    DESTINATIONS.find((d) => d.id === note.to) ??
    (DESTINATIONS.find((d) => d.id === DEFAULT_DESTINATION) as Destination)
  );
}

export function newNote(text: string, to: string, now = Date.now()): Note {
  return {
    id: `${now.toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    text: text.trim().slice(0, MAX_NOTE_LINE),
    sentAt: now,
    to,
  };
}

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

const MARKS: { name: string; seconds: number }[] = [
  { name: "the Moon", seconds: 1.28 },
  { name: "the Sun's distance", seconds: 499 },
  { name: "Jupiter's orbit", seconds: 2600 },
  { name: "Neptune's orbit", seconds: 15000 },
  { name: "Voyager 1", seconds: 85000 },
];

/** "past the Moon", or "past Voyager 1", or "just leaving Earth". */
export function progressWords(note: Note, now: number): string {
  const seconds = Math.max(0, (now - note.sentAt) / 1000);
  const dest = destinationOf(note);
  if (seconds >= (dest.ly * YEAR_MS) / 1000) return `arrived at ${dest.name}`;
  const passed = MARKS.filter((m) => seconds >= m.seconds);
  return passed.length
    ? `past ${passed[passed.length - 1].name}`
    : "just leaving Earth";
}

export function arrivalWords(dest: Destination): string {
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
