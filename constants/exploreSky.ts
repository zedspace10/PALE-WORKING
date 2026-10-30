/**
 * What Explore says about each place in tonight's sky, and the personal lines that tie a place to
 * the person: a note they sent there, or their age when its light left.
 *
 * Everything here is worked out on the phone. A location is only used if the person has already
 * shared one in Tonight's Sky or Notes; Explore never asks for it.
 */
import type { Location } from "@/constants/cosmicData";
import {
  equatorialToHorizontal,
  getMoonIllumination,
  getMoonPosition,
} from "@/constants/astronomy";
import type { Coordinates } from "@/constants/location";
import {
  compassWords,
  destinationOf,
  formatKm,
  kmTravelled,
  type Note,
} from "@/constants/notes";
import { getPlanetSkyPlacement } from "@/constants/planets";
import { getSolarAltitude } from "@/constants/solar";
import { getMoonPhase } from "@/constants/starCatalog";

export type SkyTone = "up" | "later" | "not" | "everywhere";

export interface ExploreSky {
  /** A short tag for the list, or empty when there is nothing useful to say. */
  chip: string;
  tone: SkyTone;
  /** A sentence for the place page. */
  line: string;
}

const YEAR_MS = 365.25 * 86_400_000;

/** How high something is, in words someone can point with. */
export function heightPhrase(alt: number): string {
  if (alt < 20) return "low in the sky";
  if (alt < 40) return "part way up";
  if (alt < 60) return "half way up";
  if (alt < 80) return "high up";
  return "almost overhead";
}

/**
 * The moment to describe: now if it is already dark, otherwise 9pm tonight (or now, if that has
 * passed), so a daytime visit still answers "can I see it tonight?".
 */
export function tonightMoment(where: Coordinates, now: Date): Date {
  if (getSolarAltitude(where.lat, where.lng, now) < -6) return now;
  const nine = new Date(now);
  nine.setHours(21, 0, 0, 0);
  return nine.getTime() > now.getTime() ? nine : now;
}

function timeWords(at: Date): string {
  return at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Where something with these coordinates is tonight, or when it rises. */
function fixedSky(
  ra: number,
  dec: number,
  where: Coordinates,
  now: Date,
): ExploreSky {
  // Anything further south than this never clears the horizon from here.
  if (dec < where.lat - 90 + 5) {
    return {
      chip: "Never rises here",
      tone: "not",
      line: "It never rises from where you are. It belongs to skies further south.",
    };
  }
  const at = tonightMoment(where, now);
  const evening = at.getTime() !== now.getTime();
  const here = equatorialToHorizontal({ ra, dec }, where, at);
  if (here.alt > 10) {
    return {
      chip: "Up tonight",
      tone: "up",
      line: `${evening ? "Tonight around 9pm, look" : "Look"} ${compassWords(here.az)}, ${heightPhrase(here.alt)}.`,
    };
  }
  for (let minutes = 10; minutes <= 9 * 60; minutes += 10) {
    const later = new Date(at.getTime() + minutes * 60_000);
    const sky = equatorialToHorizontal({ ra, dec }, where, later);
    if (sky.alt > 10 && getSolarAltitude(where.lat, where.lng, later) < -6) {
      return {
        chip: `Up after ${timeWords(later)}`,
        tone: "later",
        line: `It is below the horizon this evening and climbs into view around ${timeWords(later)}, in the ${compassWords(sky.az)}.`,
      };
    }
  }
  return {
    chip: "Not up tonight",
    tone: "not",
    line: "It is below the horizon for the dark hours tonight. It comes round at a different time of year.",
  };
}

function moonSky(where: Coordinates | null, now: Date): ExploreSky {
  // "Waxing Gibbous" becomes "Waxing gibbous", and "Full Moon" keeps its capital M.
  const phase = getMoonPhase(now).toLowerCase().replace("moon", "Moon");
  const lit = Math.round(getMoonIllumination(now) * 100);
  const phaseLine = `A ${phase.includes("Moon") ? phase : `${phase} Moon`}, ${lit}% lit.`;
  if (!where) {
    return {
      chip: capitalise(phase),
      tone: "later",
      line: `${phaseLine} Tonight's Sky can show you exactly where to look.`,
    };
  }
  const at = tonightMoment(where, now);
  const evening = at.getTime() !== now.getTime();
  const here = equatorialToHorizontal(getMoonPosition(at), where, at);
  if (here.alt > 5) {
    return {
      chip: "Up tonight",
      tone: "up",
      line: `${phaseLine} ${evening ? "Tonight around 9pm, look" : "Look"} ${compassWords(here.az)}, ${heightPhrase(here.alt)}.`,
    };
  }
  for (let minutes = 10; minutes <= 9 * 60; minutes += 10) {
    const later = new Date(at.getTime() + minutes * 60_000);
    const sky = equatorialToHorizontal(getMoonPosition(later), where, later);
    if (sky.alt > 5) {
      return {
        chip: `Rises ${timeWords(later)}`,
        tone: "later",
        line: `${phaseLine} It rises around ${timeWords(later)}, in the ${compassWords(sky.az)}.`,
      };
    }
  }
  return {
    chip: "Not up tonight",
    tone: "not",
    line: `${phaseLine} It is not up during the dark hours tonight; look for it in the daytime sky instead.`,
  };
}

const PLACEMENT: Record<
  ReturnType<typeof getPlanetSkyPlacement>["placement"],
  ExploreSky
> = {
  evening: {
    chip: "Evening sky",
    tone: "up",
    line: "In the evening sky. Look west after sunset for a steady point that does not twinkle.",
  },
  morning: {
    chip: "Before dawn",
    tone: "later",
    line: "Not up this evening. It rises before dawn, in the east, a steady point that does not twinkle.",
  },
  "all-night": {
    chip: "Up tonight",
    tone: "up",
    line: "Up for most of the night, highest around midnight in the south. A steady point that does not twinkle.",
  },
  "in-glare": {
    chip: "Near the Sun",
    tone: "not",
    line: "Too close to the Sun to see right now. It comes back into view in a few weeks.",
  },
};

export function skyFor(
  place: Location,
  where: Coordinates | null,
  now: Date,
): ExploreSky {
  const sky = place.sky;
  switch (sky.kind) {
    case "everywhere":
      return { ...place.skyWithoutLocation, tone: "everywhere" };
    case "too-faint":
      return { ...place.skyWithoutLocation, tone: "not" };
    case "moon":
      return moonSky(where, now);
    case "planet":
      return PLACEMENT[getPlanetSkyPlacement(sky.planet, now).placement];
    case "fixed":
      return where
        ? fixedSky(sky.ra, sky.dec, where, now)
        : { ...place.skyWithoutLocation, tone: "later" };
  }
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const SEASONS = [
  "the winter of",
  "the winter of",
  "the spring of",
  "the spring of",
  "the spring of",
  "the summer of",
  "the summer of",
  "the summer of",
  "the autumn of",
  "the autumn of",
  "the autumn of",
  "the winter of",
];

/** "the summer of 2022": when light arriving now left, for places a few years away. */
export function departureWords(lightYears: number, now: Date): string {
  const left = new Date(now.getTime() - lightYears * YEAR_MS);
  return `${SEASONS[left.getMonth()]} ${left.getFullYear()}`;
}

/** The place's "when this light left" line, with any date filled in. */
export function lightLeftFor(place: Location, now: Date): string {
  return place.lightLeft.replace(
    "{when}",
    departureWords(place.lightYears, now),
  );
}

/** The newest note the person sent to this place, if any. */
export function noteFor(place: Location, notes: Note[]): Note | null {
  if (!place.noteTo) return null;
  const sent = notes
    .filter((n) => n.to === place.noteTo)
    .sort((a, b) => b.sentAt - a.sentAt);
  return sent[0] ?? null;
}

/** "Your note ... has travelled 26 billion km. It arrives in 2031." */
export function noteLine(note: Note, now: number): string {
  const dest = destinationOf(note);
  const arrival = note.sentAt + dest.ly * YEAR_MS;
  const when =
    dest.ly < 100_000
      ? `It arrives in the year ${new Date(arrival).getFullYear().toLocaleString("en-GB", { useGrouping: false })}.`
      : `It arrives in about ${(dest.ly / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 1 })} million years.`;
  return `Your note “${note.text}” has travelled ${formatKm(kmTravelled(note.sentAt, now))} so far. ${when}`;
}

/** "The light you would see from it tonight left when you were 28", when that makes sense. */
export function birthdayLine(
  place: Location,
  birthday: Date | null,
  now: Date,
): string | null {
  if (!birthday) return null;
  if (place.lightYears < 1) return null;
  // Light that left before the person was born says nothing about their age. (Checked in years
  // first: far places are further back than a Date can reach.)
  const ageYears = (now.getTime() - birthday.getTime()) / YEAR_MS;
  if (place.lightYears >= ageYears) return null;
  const left = new Date(now.getTime() - place.lightYears * YEAR_MS);
  let age = left.getFullYear() - birthday.getFullYear();
  const hadBirthday =
    left.getMonth() > birthday.getMonth() ||
    (left.getMonth() === birthday.getMonth() &&
      left.getDate() >= birthday.getDate());
  if (!hadBirthday) age -= 1;
  return age < 1
    ? "The light you would see from it tonight left when you were a baby."
    : `The light you would see from it tonight left when you were ${age}.`;
}
