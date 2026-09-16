import { getMoonPhaseFraction } from "@/constants/astronomy";

export type SkyEventKind = "shower" | "moon" | "season";

export interface Estimate<T> {
  value: T;
  accuracy: "approximate" | "typical-window" | "sourced-instant";
  note: string;
}

export type SkyEvent = {
  id: string;
  kind: SkyEventKind;
  title: string;
  line: string;
  weight: number;
  estimate: Estimate<Date | string>;
};

export type Shower = {
  id: string;
  name: string;
  /** Typical annual peak date, not a year-specific prediction. */
  peak: [number, number];
  window: number;
  /** Ideal-condition zenithal hourly rate, not a personal viewing forecast. */
  zhr: number;
  parent: string;
  favours?: "north" | "south";
};

export const SHOWERS: Shower[] = [
  {
    id: "quadrantids",
    name: "The Quadrantids",
    peak: [1, 3],
    window: 1,
    zhr: 110,
    parent: "asteroid 2003 EH1",
    favours: "north",
  },
  {
    id: "lyrids",
    name: "The Lyrids",
    peak: [4, 22],
    window: 2,
    zhr: 18,
    parent: "comet Thatcher",
    favours: "north",
  },
  {
    id: "eta-aquariids",
    name: "The Eta Aquariids",
    peak: [5, 5],
    window: 2,
    zhr: 50,
    parent: "Halley's Comet",
    favours: "south",
  },
  {
    id: "delta-aquariids",
    name: "The Delta Aquariids",
    peak: [7, 30],
    window: 3,
    zhr: 25,
    parent: "comet 96P/Machholz",
    favours: "south",
  },
  {
    id: "perseids",
    name: "The Perseids",
    peak: [8, 12],
    window: 2,
    zhr: 100,
    parent: "comet Swift-Tuttle",
    favours: "north",
  },
  {
    id: "draconids",
    name: "The Draconids",
    peak: [10, 8],
    window: 1,
    zhr: 10,
    parent: "comet Giacobini-Zinner",
    favours: "north",
  },
  {
    id: "orionids",
    name: "The Orionids",
    peak: [10, 21],
    window: 2,
    zhr: 20,
    parent: "Halley's Comet",
  },
  {
    id: "leonids",
    name: "The Leonids",
    peak: [11, 17],
    window: 1,
    zhr: 15,
    parent: "comet Tempel-Tuttle",
  },
  {
    id: "geminids",
    name: "The Geminids",
    peak: [12, 13],
    window: 2,
    zhr: 150,
    parent: "asteroid 3200 Phaethon",
  },
  {
    id: "ursids",
    name: "The Ursids",
    peak: [12, 21],
    window: 1,
    zhr: 10,
    parent: "comet 8P/Tuttle",
    favours: "north",
  },
];

const SEASONAL_INSTANTS_UTC: Record<number, Record<string, string>> = {
  2025: {
    "mar-equinox": "2025-03-20T09:01:00Z",
    "jun-solstice": "2025-06-21T02:42:00Z",
    "sep-equinox": "2025-09-22T18:19:00Z",
    "dec-solstice": "2025-12-21T15:03:00Z",
  },
  2026: {
    "mar-equinox": "2026-03-20T14:46:00Z",
    "jun-solstice": "2026-06-21T08:24:00Z",
    "sep-equinox": "2026-09-23T00:05:00Z",
    "dec-solstice": "2026-12-21T20:50:00Z",
  },
  2027: {
    "mar-equinox": "2027-03-20T20:25:00Z",
    "jun-solstice": "2027-06-21T14:11:00Z",
    "sep-equinox": "2027-09-23T06:02:00Z",
    "dec-solstice": "2027-12-22T02:42:00Z",
  },
  2028: {
    "mar-equinox": "2028-03-20T02:17:00Z",
    "jun-solstice": "2028-06-20T20:02:00Z",
    "sep-equinox": "2028-09-22T11:45:00Z",
    "dec-solstice": "2028-12-21T08:20:00Z",
  },
  2029: {
    "mar-equinox": "2029-03-20T08:01:00Z",
    "jun-solstice": "2029-06-21T01:48:00Z",
    "sep-equinox": "2029-09-22T17:37:00Z",
    "dec-solstice": "2029-12-21T14:14:00Z",
  },
  2030: {
    "mar-equinox": "2030-03-20T13:51:00Z",
    "jun-solstice": "2030-06-21T07:31:00Z",
    "sep-equinox": "2030-09-22T23:27:00Z",
    "dec-solstice": "2030-12-21T20:09:00Z",
  },
};

export const SEASONAL_DATA_REVIEW_BY = "2030-12-31";

const SEASON_NAMES: Record<string, string> = {
  "mar-equinox": "the March equinox",
  "jun-solstice": "the June solstice",
  "sep-equinox": "the September equinox",
  "dec-solstice": "the December solstice",
};

function localCalendarDay(date: Date): number {
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000
  );
}

function daysBetweenLocalDates(a: Date, b: Date): number {
  return Math.round(localCalendarDay(a) - localCalendarDay(b));
}

function offsetFromRecurringDate(
  date: Date,
  month: number,
  day: number,
): number {
  const candidates = [-1, 0, 1].map(
    (yearOffset) =>
      new Date(date.getFullYear() + yearOffset, month - 1, day, 12),
  );
  return candidates
    .map((candidate) => daysBetweenLocalDates(date, candidate))
    .sort((a, b) => Math.abs(a) - Math.abs(b))[0];
}

function idealRate(zhr: number): string {
  if (zhr >= 100) return "up to roughly one hundred meteors an hour";
  if (zhr >= 50) return "up to roughly fifty meteors an hour";
  if (zhr >= 20) return "up to roughly twenty meteors an hour";
  return "up to roughly ten meteors an hour";
}

function showerLine(shower: Shower, offset: number, lat?: number): string {
  const lessFavourable =
    typeof lat === "number" &&
    ((shower.favours === "north" && lat < -20) ||
      (shower.favours === "south" && lat > 20));
  const timing =
    offset === 0
      ? "is near its typical annual peak window"
      : offset < 0
        ? `is approaching its typical peak window in ${Math.abs(offset)} ${Math.abs(offset) === 1 ? "night" : "nights"}`
        : "is just past its typical annual peak window";
  const latitude = lessFavourable
    ? " Your latitude is less favourable for this shower."
    : "";
  return `${shower.name} ${timing}. Published zenithal rates reach ${idealRate(shower.zhr)} under ideal dark-sky conditions; your actual rate may be much lower.${latitude} Its meteors come from debris associated with ${shower.parent}.`;
}

export interface ApproximateMoonPhase {
  fraction: number;
  illumination: number;
  label:
    | "near new Moon"
    | "crescent Moon"
    | "near quarter Moon"
    | "gibbous Moon"
    | "appears nearly full";
}

export function getApproximateMoonPhase(date: Date): ApproximateMoonPhase {
  const fraction = getMoonPhaseFraction(date);
  const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * fraction));
  const distanceFromNew = Math.min(fraction, 1 - fraction);
  const distanceFromFull = Math.abs(fraction - 0.5);
  const distanceFromQuarter = Math.min(
    Math.abs(fraction - 0.25),
    Math.abs(fraction - 0.75),
  );
  const label =
    distanceFromNew <= 1.5 / 29.53059
      ? "near new Moon"
      : distanceFromFull <= 1.5 / 29.53059
        ? "appears nearly full"
        : distanceFromQuarter <= 1.25 / 29.53059
          ? "near quarter Moon"
          : illumination < 0.5
            ? "crescent Moon"
            : "gibbous Moon";
  return { fraction, illumination, label };
}

export function validateSeasonalData(now: Date): string[] {
  if (now.getTime() > Date.parse(`${SEASONAL_DATA_REVIEW_BY}T23:59:59Z`)) {
    return [`seasonal-instants expired on ${SEASONAL_DATA_REVIEW_BY}`];
  }
  return [];
}

function getSeasonalEvents(date: Date, lat?: number): SkyEvent[] {
  const yearData = SEASONAL_INSTANTS_UTC[date.getFullYear()];
  if (!yearData) return [];
  return Object.entries(yearData).flatMap(([id, iso]) => {
    const instant = new Date(iso);
    if (Math.abs(date.getTime() - instant.getTime()) > 24 * 60 * 60 * 1000)
      return [];
    const southern = typeof lat === "number" ? lat < 0 : null;
    const isEquinox = id.includes("equinox");
    const northernLongest = id === "jun-solstice";
    const localLongest =
      southern === null ? null : southern ? !northernLongest : northernLongest;
    const detail = isEquinox
      ? "Around an equinox, day and night are close in length but not exactly equal everywhere."
      : localLongest === null
        ? "This is a seasonal turning point; its daylight effect depends on your hemisphere and latitude."
        : `This marks the ${localLongest ? "longest" : "shortest"} daylight period of the year for your hemisphere.`;
    return [
      {
        id,
        kind: "season" as const,
        title: SEASON_NAMES[id],
        line: `${SEASON_NAMES[id]} occurs around ${instant.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}. ${detail}`,
        weight: 50,
        estimate: {
          value: instant,
          accuracy: "sourced-instant" as const,
          note: "Year-specific UTC instant; displayed in the device time zone.",
        },
      },
    ];
  });
}

export function getSkyEvents(
  date: Date = new Date(),
  lat?: number,
): SkyEvent[] {
  const events: SkyEvent[] = [];
  for (const shower of SHOWERS) {
    const offset = offsetFromRecurringDate(
      date,
      shower.peak[0],
      shower.peak[1],
    );
    if (Math.abs(offset) > shower.window) continue;
    events.push({
      id: shower.id,
      kind: "shower",
      title: shower.name,
      line: showerLine(shower, offset, lat),
      weight: (offset === 0 ? 100 : 40) + shower.zhr / 10,
      estimate: {
        value: `${shower.peak[0]}-${shower.peak[1]}`,
        accuracy: "typical-window",
        note: "Recurring typical window, not a year-specific peak forecast.",
      },
    });
  }

  const moon = getApproximateMoonPhase(date);
  if (moon.label === "appears nearly full" || moon.label === "near new Moon") {
    const nearNew = moon.label === "near new Moon";
    events.push({
      id: nearNew ? "near-new-moon" : "near-full-moon",
      kind: "moon",
      title: nearNew ? "Near new Moon" : "Nearly full Moon",
      line: nearNew
        ? "The Moon is near its new phase. It may spend much of the night below the horizon, but local timing and twilight still affect darkness."
        : "The Moon appears nearly full and can wash out fainter stars while it is above the horizon.",
      weight: nearNew ? 35 : 30,
      estimate: {
        value: moon.label,
        accuracy: "approximate",
        note: "Approximate phase window from a mean synodic month, not an exact ephemeris.",
      },
    });
  }

  events.push(...getSeasonalEvents(date, lat));
  return events.sort((a, b) => b.weight - a.weight);
}

export function getTonightsEvent(
  date: Date = new Date(),
  lat?: number,
): SkyEvent | null {
  return getSkyEvents(date, lat)[0] ?? null;
}
