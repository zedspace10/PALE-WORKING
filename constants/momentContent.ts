import {
  getMoonIllumination,
  getMoonPhaseFraction,
} from "@/constants/astronomy";
import { voyagerLightSeconds } from "@/constants/notes";
import { SOLAR_STATE_LABELS, SolarState } from "@/constants/solar";

export interface MomentLine {
  text: string;
  delay: number;
  style?: "primary" | "muted";
}

export interface MomentContext {
  /** When PALE was last opened, if it has been before. */
  lastVisitAt?: number | null;
  birthday?: Date | null;
}

const C_KM_S = 299_792.458;
// Earth's average speed around the Sun.
const EARTH_KM_S = 29.78;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const YEAR_MS = 365.25 * DAY_MS;

// Well known stars, by how many light years away they are, for the birthday line.
const LANDMARK_STARS: { name: string; ly: number }[] = [
  { name: "Proxima Centauri, the nearest star", ly: 4.24 },
  { name: "Sirius, the brightest star in the night sky", ly: 8.6 },
  { name: "Altair", ly: 16.7 },
  { name: "Vega", ly: 25 },
  { name: "Arcturus", ly: 36.7 },
  { name: "Capella", ly: 42.9 },
  { name: "Aldebaran, the eye of Taurus", ly: 65 },
  { name: "Regulus", ly: 79 },
];

/** "7.7 million km", "640,000 km", "1.2 billion km". */
function kmWords(km: number): string {
  if (km >= 1e9) return `${(km / 1e9).toFixed(1)} billion km`;
  if (km >= 1e6) {
    const m = km / 1e6;
    return `${m < 10 ? m.toFixed(1) : Math.round(m)} million km`;
  }
  return `${Math.round(km / 10_000) * 10_000} km`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
}

// What the Sun is doing where the person last was. Said only when it has been worked out from a
// real location; otherwise the line is left out rather than guessed.
function localSolarLines(solarState: SolarState | null): MomentLine[] {
  if (!solarState) return [];
  const text =
    solarState === "daylight"
      ? "Where you are, the Sun is up."
      : `Where you are, it is ${SOLAR_STATE_LABELS[solarState]}.`;
  return [{ text, delay: 1600, style: "muted" }];
}

function greeting(hour: number, solarState: SolarState | null): string {
  if (hour >= 5 && hour <= 11) return "Good morning.";
  if (hour >= 12 && hour <= 16) return "Good afternoon.";
  if (hour >= 17 && hour <= 21) return "Good evening.";
  // Late at night, unless the Sun has not set at all (summer near the poles).
  return solarState === "daylight" ? "Hello again." : "Still up?";
}

/**
 * Every fact here is worked out for this moment, so it is true today and different tomorrow.
 * Which one is said depends on the day, so the opening changes from one day to the next.
 */
export function momentFacts(now: Date, context: MomentContext = {}): string[] {
  const t = now.getTime();
  const hour = now.getHours();
  const facts: string[] = [];

  const since = context.lastVisitAt ? t - context.lastVisitAt : 0;
  if (since >= 6 * HOUR_MS && since <= 120 * DAY_MS) {
    facts.push(
      `Since you last opened PALE, Earth has carried you ${kmWords((since / 1000) * EARTH_KM_S)} around the Sun.`,
    );
  }

  if (context.birthday) {
    const years = (t - context.birthday.getTime()) / YEAR_MS;
    const passed = LANDMARK_STARS.filter((s) => s.ly <= years).pop();
    if (years >= 1 && passed) {
      facts.push(
        `The light that left Earth on the day you were born is now ${Math.floor(years)} light years away, past ${passed.name}.`,
      );
    }
  }

  const lit = Math.round(getMoonIllumination(now) * 100);
  if (lit >= 97) facts.push("The Moon is full today.");
  else if (lit >= 3) {
    const waxing = getMoonPhaseFraction(now) < 0.5;
    facts.push(
      `The Moon is ${lit}% lit today, and ${waxing ? "growing" : "shrinking"} each night.`,
    );
  }

  const voyagerKm = voyagerLightSeconds(t) * C_KM_S;
  facts.push(
    `Voyager 1 is now about ${kmWords(voyagerKm)} from Earth, and about 61,000 km further from the Sun every hour.`,
  );

  if (hour >= 9 && hour <= 16) {
    facts.push(
      "Sunlight takes about eight minutes to reach Earth. The Sun you see is about eight minutes old.",
    );
  } else {
    facts.push(
      "The light from the Andromeda Galaxy reaching Earth tonight set off about 2.5 million years ago.",
    );
  }

  facts.push(
    "Every second, Earth travels about 30 km on its way around the Sun.",
  );
  return facts;
}

/** The day of the year, used to turn the facts over one day at a time. */
function dayNumber(now: Date): number {
  return Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      DAY_MS,
  );
}

/**
 * The opening card, once a day: a greeting for the time of day, what the Sun is doing where you
 * are (only if that is known), and one true thing about this moment.
 */
export function getMomentLines(
  now: Date,
  solarState: SolarState | null,
  context: MomentContext = {},
): MomentLine[] {
  const facts = momentFacts(now, context);
  // After a gap, the distance travelled since the last visit always comes first.
  const fact =
    facts[0]?.startsWith("Since you last") || facts.length === 1
      ? facts[0]
      : facts[dayNumber(now) % facts.length];
  return [
    {
      text: greeting(now.getHours(), solarState),
      delay: 1200,
      style: "primary",
    },
    ...localSolarLines(solarState),
    { text: fact, delay: 1400, style: "muted" },
  ];
}
