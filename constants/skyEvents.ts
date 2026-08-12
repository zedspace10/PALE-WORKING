import { getMoonPhase } from "@/constants/starCatalog";

/**
 * What is worth going outside for tonight.
 *
 * Everything here is computed on device from the date. No network, no new
 * permissions. Meteor showers recur on near identical dates every year, so a
 * static table stays accurate; peak nights drift by a day at most.
 *
 * Peak dates and ZHR figures are from the International Meteor Organization
 * and the American Meteor Society.
 */

export type SkyEventKind = "shower" | "moon" | "season";

export type SkyEvent = {
  id: string;
  kind: SkyEventKind;
  title: string;
  /** One line, written to be read on a lock screen or at the end of Shift. */
  line: string;
  /** Higher wins when several land on the same night. */
  weight: number;
};

type Shower = {
  id: string;
  name: string;
  /** Peak night, as [month (1 to 12), day]. The night of this date into the next. */
  peak: [number, number];
  /** Nights either side of the peak still worth mentioning. */
  window: number;
  /** Zenithal hourly rate at peak, under dark skies. */
  zhr: number;
  parent: string;
  /** True where the radiant strongly favours one hemisphere. */
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

/** Solstices and equinoxes fall within a day of these dates every year. */
const SEASON_MARKERS: { id: string; month: number; day: number; name: string }[] =
  [
    { id: "mar-equinox", month: 3, day: 20, name: "the March equinox" },
    { id: "jun-solstice", month: 6, day: 21, name: "the June solstice" },
    { id: "sep-equinox", month: 9, day: 22, name: "the September equinox" },
    { id: "dec-solstice", month: 12, day: 21, name: "the December solstice" },
  ];

function daysBetween(a: Date, b: Date): number {
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((d1 - d2) / 86_400_000);
}

/** Signed day offset from a month/day in whichever year is nearest. */
function offsetFrom(date: Date, month: number, day: number): number {
  const candidates = [-1, 0, 1].map(
    (y) => new Date(date.getFullYear() + y, month - 1, day)
  );
  let best = daysBetween(date, candidates[0]);
  for (const c of candidates) {
    const d = daysBetween(date, c);
    if (Math.abs(d) < Math.abs(best)) best = d;
  }
  return best;
}

function showerLine(s: Shower, offset: number, lat: number): string {
  const wrongSide =
    (s.favours === "north" && lat < -20) || (s.favours === "south" && lat > 20);

  if (offset === 0) {
    const rate =
      s.zhr >= 100
        ? "up to a hundred an hour"
        : s.zhr >= 50
          ? "up to fifty an hour"
          : s.zhr >= 20
            ? "perhaps twenty an hour"
            : "a handful an hour";
    const base = `${s.name} peak tonight, ${rate} under a dark sky. Dust from ${s.parent}, burning up sixty miles above you.`;
    return wrongSide ? `${base} Rates are lower from your latitude.` : base;
  }

  if (offset < 0) {
    const n = Math.abs(offset);
    return `${s.name} build toward their peak ${n === 1 ? "tomorrow night" : `in ${n} nights`}. Worth a look already.`;
  }

  return `${s.name} are past their peak but still falling. Fewer now, and still worth the cold.`;
}

/**
 * Everything notable tonight, best first. Empty on an ordinary night, which is
 * most of them: callers should treat nothing as a normal outcome.
 *
 * `lat` only adjusts wording for hemisphere. Pass 0 if unknown.
 */
export function getSkyEvents(date: Date = new Date(), lat = 0): SkyEvent[] {
  const events: SkyEvent[] = [];

  for (const s of SHOWERS) {
    const offset = offsetFrom(date, s.peak[0], s.peak[1]);
    if (Math.abs(offset) > s.window) continue;
    events.push({
      id: s.id,
      kind: "shower",
      title: s.name,
      line: showerLine(s, offset, lat),
      // Peak night of a strong shower outranks everything else.
      weight: (offset === 0 ? 100 : 40) + s.zhr / 10,
    });
  }

  const phase = getMoonPhase(date);
  if (phase === "Full Moon") {
    events.push({
      id: "full-moon",
      kind: "moon",
      title: "Full moon",
      line: "The Moon is full tonight, lit by a Sun that set for you hours ago. It will wash out the faintest stars, and it is worth looking at anyway.",
      weight: 30,
    });
  } else if (phase === "New Moon") {
    events.push({
      id: "new-moon",
      kind: "moon",
      title: "New moon",
      line: "No Moon tonight. This is as dark as your sky gets, and the best week of the month for faint things.",
      weight: 35,
    });
  }

  for (const m of SEASON_MARKERS) {
    if (offsetFrom(date, m.month, m.day) !== 0) continue;
    const southern = lat < 0;
    const longest = m.id === "jun-solstice" ? !southern : southern;
    const line = m.id.includes("equinox")
      ? `Today is ${m.name}. Day and night are near enough equal everywhere on Earth, and the planet is side on to the Sun.`
      : `Today is ${m.name}, your ${longest ? "longest" : "shortest"} day of the year. From tonight the balance turns back the other way.`;
    events.push({
      id: m.id,
      kind: "season",
      title: m.name,
      line,
      weight: 50,
    });
  }

  return events.sort((a, b) => b.weight - a.weight);
}

/** The single most notable thing tonight, or null on an ordinary night. */
export function getTonightsEvent(
  date: Date = new Date(),
  lat = 0
): SkyEvent | null {
  return getSkyEvents(date, lat)[0] ?? null;
}
