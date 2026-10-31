/**
 * Hold to travel back in time, from now to the beginning. Time runs faster the longer you hold,
 * so the whole 13.8 billion years takes about half a minute, passing the moments of the Time
 * Machine on the way. The point is the contrast: everything that has ever happened fits inside the
 * time it takes to hold your finger down.
 */

const YEAR_MS = 365.25 * 86_400_000;
export const UNIVERSE_AGE_YEARS = 13.8e9;

// Years of history per held second at the start, and how fast that grows.
const START_RATE = 1;
const GROWTH = 0.66;

export interface TimeMarker {
  yearsAgo: number;
  name: string;
}

/** The moments passed on the way back, nearest first. Dated ones are worked out from today. */
export function timeMarkers(now: Date, birthday: Date | null): TimeMarker[] {
  const since = (iso: string) =>
    (now.getTime() - new Date(iso).getTime()) / YEAR_MS;
  const markers: TimeMarker[] = [
    {
      yearsAgo: since("1969-07-20T20:17:00Z"),
      name: "the first steps on the Moon",
    },
    { yearsAgo: 5_200, name: "the first writing" },
    { yearsAgo: 12_000, name: "the first farms and villages" },
    { yearsAgo: 70_000, name: "our ancestors spreading out of Africa" },
    { yearsAgo: 300_000, name: "the first of our species" },
    { yearsAgo: 1_000_000, name: "early humans using fire" },
    {
      yearsAgo: 6_000_000,
      name: "our ancestors parting from the chimpanzees'",
    },
    { yearsAgo: 66_000_000, name: "the asteroid that ended the dinosaurs" },
    { yearsAgo: 230_000_000, name: "the first dinosaurs" },
    { yearsAgo: 470_000_000, name: "the first plants on land" },
    { yearsAgo: 600_000_000, name: "the first animals" },
    { yearsAgo: 2_000_000_000, name: "the first complex cells" },
    { yearsAgo: 2_400_000_000, name: "oxygen filling the air" },
    { yearsAgo: 3_500_000_000, name: "the first life" },
    { yearsAgo: 4_400_000_000, name: "the first oceans" },
    { yearsAgo: 4_540_000_000, name: "the Earth forming" },
    { yearsAgo: 4_600_000_000, name: "the Sun's first light" },
    { yearsAgo: 13_400_000_000, name: "the first galaxies" },
    { yearsAgo: 13_500_000_000, name: "the first stars" },
  ];
  if (birthday && birthday.getTime() < now.getTime()) {
    markers.push({
      yearsAgo: (now.getTime() - birthday.getTime()) / YEAR_MS,
      name: "the day you were born",
    });
  }
  return markers.sort((a, b) => a.yearsAgo - b.yearsAgo);
}

/** Years travelled back after holding for `held` seconds. */
export function yearsBack(held: number): number {
  if (held <= 0) return 0;
  return (START_RATE * (Math.exp(GROWTH * held) - 1)) / GROWTH;
}

/** Years of history each held second is worth, after holding for `held` seconds. */
export function historyRate(held: number): number {
  return START_RATE * Math.exp(GROWTH * Math.max(0, held));
}

/** How long someone has to hold to go back this many years. */
export function heldToGoBack(years: number): number {
  return Math.log(1 + (years * GROWTH) / START_RATE) / GROWTH;
}

const STEPS: [number, string][] = [
  [1e9, "a billion years"],
  [1e8, "a hundred million years"],
  [1e7, "ten million years"],
  [1e6, "a million years"],
  [1e5, "a hundred thousand years"],
  [1e4, "ten thousand years"],
  [1e3, "a thousand years"],
  [100, "a century"],
  [10, "ten years"],
  [1, "a year"],
];

/** "Each second you hold is now a thousand years of history." */
export function historyRateWords(held: number): string {
  const rate = historyRate(held);
  let best = STEPS[STEPS.length - 1];
  for (const step of STEPS) {
    if (Math.abs(Math.log(rate / step[0])) < Math.abs(Math.log(rate / best[0])))
      best = step;
  }
  return `Each second you hold is now ${best[1]} of history.`;
}

/** "3 weeks ago", "57 years ago", "4.5 billion years ago". */
export function yearsAgoWords(years: number): string {
  if (years < 1 / 365.25) return "Now";
  if (years < 1 / 12)
    return `${Math.max(1, Math.round(years * 365.25))} days ago`;
  if (years < 1) return `${Math.max(1, Math.round(years * 12))} months ago`;
  if (years < 10) return `${years.toFixed(1)} years ago`;
  if (years < 1e6)
    return `${Math.round(years).toLocaleString("en-GB")} years ago`;
  if (years < 1e9)
    return `${(years / 1e6).toLocaleString("en-GB", { maximumFractionDigits: 1 })} million years ago`;
  return `${(years / 1e9).toLocaleString("en-GB", { maximumFractionDigits: 1 })} billion years ago`;
}

/** The furthest moment passed so far, or null near the start. */
export function passedMarker(
  markers: TimeMarker[],
  years: number,
): TimeMarker | null {
  let passed: TimeMarker | null = null;
  for (const m of markers) if (years >= m.yearsAgo) passed = m;
  return passed;
}

function heldPhrase(held: number): string {
  const s = Math.round(held);
  return `${s} ${s === 1 ? "second" : "seconds"}`;
}

/** What to say on letting go, or on reaching the beginning. */
export function timeSummary(markers: TimeMarker[], held: number): string {
  const years = yearsBack(held);
  if (years >= UNIVERSE_AGE_YEARS) {
    return `You held on for ${heldPhrase(held)} and went back 13.8 billion years, to the beginning. Everything that has ever happened fits inside that half a minute.`;
  }
  const passed = passedMarker(markers, years);
  const went = `You held on for ${heldPhrase(held)} and went back ${yearsAgoWords(years).replace(/ ago$/, "")}`;
  return passed
    ? `${went}, past ${passed.name}. The beginning is still ${yearsAgoWords(UNIVERSE_AGE_YEARS - years).replace(/ ago$/, "")} further back.`
    : `${went}. Keep holding next time, and you can reach the beginning.`;
}
