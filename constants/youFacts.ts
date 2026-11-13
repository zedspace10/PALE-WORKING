/**
 * More of the You tab, all worked out on the phone from the birthday. Only measurements:
 * how far, how fast, how many. Nothing here says anything about the person beyond the date.
 */

/** The Sun's speed around the centre of the Milky Way, in km/s (estimates run about 220 to 250). */
export const SUN_GALACTIC_KM_S = 230;
/** How long the Sun takes to go once around the galaxy, in millions of years (about 225 to 250). */
export const GALACTIC_YEAR_MYR = 230;

export function galaxyDistanceKm(birthday: Date, now: Date): number {
  return (
    (Math.max(0, now.getTime() - birthday.getTime()) / 1000) * SUN_GALACTIC_KM_S
  );
}

/** "about 218 billion", "about 7.3 billion", "about 610 million". */
export function bigKmWords(km: number): string {
  if (km >= 100e9) return `about ${Math.round(km / 1e9)} billion`;
  if (km >= 1e9) return `about ${(km / 1e9).toFixed(1)} billion`;
  return `about ${Math.round(km / 1e6)} million`;
}

export const GALAXY_NOTE = `The Sun moves at about ${SUN_GALACTIC_KM_S} km every second. One lap of the galaxy takes about ${GALACTIC_YEAR_MYR} million years, and the last time the Sun was here, the first dinosaurs were appearing.`;

/**
 * Planets around other stars, by the end of each year: NASA Exoplanet Archive counts by year of
 * discovery, added up (via gravityfinder.com, November 2026). They agree with NASA passing 5,000
 * in March 2022 and 6,000 in September 2025.
 */
export const EXOPLANETS_KNOWN_BY_END_OF: Record<number, number> = {
  1992: 2,
  1993: 2,
  1994: 3,
  1995: 4,
  1996: 10,
  1997: 11,
  1998: 17,
  1999: 30,
  2000: 46,
  2001: 58,
  2002: 87,
  2003: 109,
  2004: 136,
  2005: 172,
  2006: 204,
  2007: 256,
  2008: 318,
  2009: 405,
  2010: 498,
  2011: 640,
  2012: 784,
  2013: 912,
  2014: 1784,
  2015: 1939,
  2016: 3443,
  2017: 3595,
  2018: 3903,
  2019: 4099,
  2020: 4333,
  2021: 4897,
  2022: 5265,
  2023: 5588,
  2024: 5848,
  2025: 6094,
};
export const EXOPLANETS_NOW_WORDS = "more than 6,000";

export interface DiscoveryCard {
  number: string;
  unit: string;
  note: string;
}

/** What we knew of planets around other stars when you were born, against today. */
export function discoveryAtBirth(birthday: Date): DiscoveryCard | null {
  const year = birthday.getFullYear();
  const today = `Today we know of ${EXOPLANETS_NOW_WORDS}, and the count keeps growing.`;
  if (year <= 1992) {
    return {
      number: "None",
      unit: "planets around other stars were known when you were born",
      note:
        year === 1992
          ? `The first were found in 1992, the year you were born. ${today}`
          : `The first were found in 1992. ${today}`,
    };
  }
  const known = EXOPLANETS_KNOWN_BY_END_OF[year - 1];
  if (known === undefined || known >= 5000) return null;
  const number =
    known < 100
      ? String(known)
      : `about ${String(Math.round(known / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  return {
    number,
    unit: "planets around other stars were known when you were born",
    note: today,
  };
}

export interface Lap {
  /** Which trip around the Sun this is: 31 for someone who has had 30 birthdays. */
  number: number;
  daysIn: number;
  daysLeft: number;
  /** 0 to 1, how far round this lap Earth has carried you. */
  fraction: number;
}

/** This lap of the Sun, counted from the last birthday to the next. */
export function currentLap(birthday: Date, now: Date): Lap {
  const at = (year: number) =>
    new Date(year, birthday.getMonth(), birthday.getDate());
  let last = at(now.getFullYear());
  if (last.getTime() > now.getTime()) last = at(now.getFullYear() - 1);
  const next = at(last.getFullYear() + 1);
  const day = 86_400_000;
  const span = next.getTime() - last.getTime();
  return {
    number: Math.max(1, last.getFullYear() - birthday.getFullYear() + 1),
    daysIn: Math.floor((now.getTime() - last.getTime()) / day),
    daysLeft: Math.ceil((next.getTime() - now.getTime()) / day),
    fraction: Math.min(1, Math.max(0, (now.getTime() - last.getTime()) / span)),
  };
}

/** "28.8 billion" from "about 28.8 billion": the page says once that every figure is rounded. */
export function withoutAbout(words: string): string {
  return words.replace(/^about /, "");
}

/** "1st", "2nd", "31st". */
export function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const end = teen
    ? "th"
    : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ??
      "th");
  return `${n}${end}`;
}

/** The first line of the lifetime timeline: what was known of other worlds the year you were born. */
export function knownWhenBorn(birthday: Date): string | null {
  const year = birthday.getFullYear();
  if (year < 1992) return "Nobody had yet found a planet around another star.";
  if (year === 1992)
    return "The first planets around another star were found that year.";
  const known = EXOPLANETS_KNOWN_BY_END_OF[year - 1];
  if (known === undefined || known >= 5000) return null;
  const words =
    known < 100
      ? String(known)
      : `about ${String(Math.round(known / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  return `We knew of ${words} planets around other stars.`;
}

export const KNOWN_TODAY = `We know of ${EXOPLANETS_NOW_WORDS} planets around other stars, and the count keeps growing.`;
