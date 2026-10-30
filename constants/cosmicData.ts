import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
  ScientificSourceId,
} from "@/constants/scientificContent";
import type { ExploreArtworkKey } from "@/constants/exploreArtwork";

/** Where a place sits in the sky, so Explore can say whether it is up tonight. */
export type ExploreSkyTarget =
  | { kind: "moon" }
  | { kind: "planet"; planet: "mars" | "saturn" }
  | { kind: "fixed"; ra: number; dec: number }
  | { kind: "too-faint" }
  | { kind: "everywhere" };

interface LocationBase {
  id: string;
  name: string;
  /** A few words on what it is, shown above the name. */
  subtitle: string;
  distance: string;
  /** How long its light takes to reach us, as words: "1.3 seconds", "26,000 years". */
  light: string;
  /** Light travel time in years, for the personal lines. */
  lightYears: number;
  /** How much further it is than the place before, or empty for the first. */
  jump: string;
  /** One human sized comparison. */
  far: string;
  /** When the light we see left, matched to what was happening on Earth. "{when}" is filled in with the season and year it set off. */
  lightLeft: string;
  /** A short reflective line, kept apart from the science. */
  reflection: string;
  sky: ExploreSkyTarget;
  /** What to say about it in the sky when PALE does not know where the person is. */
  skyWithoutLocation: { chip: string; line: string };
  /** The Notes destination with the same id, when there is one. */
  noteTo?: string;
  artworkKey: ExploreArtworkKey;
}

export interface Location extends LocationBase, ScientificItem {}

interface CosmicEventBase {
  year: number;
  title: string;
  description: string;
}

export interface CosmicEvent extends CosmicEventBase, ScientificItem {
  date: string;
}

interface ShiftStageBase {
  title: string;
  subtitle: string;
  hint: string;
}

export interface ShiftStage extends ShiftStageBase, ScientificItem {}

const SHIFT_STAGES_BASE: ShiftStageBase[] = [
  {
    title: "You are here.",
    subtitle:
      "A pale blue dot.\nOrbiting an ordinary star.\nIn one arm of one galaxy.",
    hint: "EARTH",
  },
  {
    title: "Our neighbourhood.",
    subtitle:
      "Eight planets.\nOne star.\nEveryone you have ever met\nlives in this small neighbourhood.",
    hint: "SOLAR SYSTEM",
  },
  {
    title: "Hundreds of billions of stars.",
    subtitle:
      "Our Sun is one of them.\nLost in one arm.\nUnremarkable.\nEssential.",
    hint: "THE MILKY WAY",
  },
  {
    title: "A gathering of nearby galaxies.",
    subtitle:
      "Held together by gravity.\nDrifting as one\nthrough the cosmos.\nThe Milky Way is one\nof the two largest.",
    hint: "LOCAL GROUP",
  },
  {
    title: "Everything we can see.",
    subtitle:
      "Hundreds of billions of galaxies, perhaps more.\nAbout forty-six billion light years\nin every direction.\nStill expanding.",
    hint: "THE OBSERVABLE UNIVERSE",
  },
  {
    title: "Somewhere in all of this…",
    subtitle: "…there is you.",
    hint: "",
  },
];

// In order outwards from Earth, so scrolling the list is a journey. Each jump is how much further
// light has to travel than for the place before.
const LOCATIONS_BASE: LocationBase[] = [
  {
    id: "moon",
    name: "The Moon",
    subtitle: "Our companion",
    distance: "384,400 km away",
    light: "1.3 seconds",
    lightYears: 1.28 / 31_557_600,
    jump: "",
    far: "The Apollo astronauts took three days to get there.",
    lightLeft:
      "1.3 seconds ago. The Moon you see is always a little over a second in the past.",
    reflection:
      "Every person who has ever lived has looked up at this same Moon.",
    sky: { kind: "moon" },
    skyWithoutLocation: {
      chip: "",
      line: "Tonight's Sky can show you exactly where to look.",
    },
    artworkKey: "moon",
  },
  {
    id: "mars",
    name: "Mars",
    subtitle: "The red world",
    distance: "225 million km away on average",
    light: "12.5 minutes",
    lightYears: 750 / 31_557_600,
    jump: "About 600 times further",
    far: "A photo sent home by a rover takes between 3 and 22 minutes to arrive, depending on where the two planets are.",
    lightLeft:
      "About 12 minutes ago. Close enough that what you see is, in effect, now.",
    reflection:
      "Somewhere on its surface, robots we built are still at work tonight.",
    sky: { kind: "planet", planet: "mars" },
    skyWithoutLocation: { chip: "", line: "" },
    artworkKey: "mars",
  },
  {
    id: "saturn",
    name: "Saturn",
    subtitle: "The ringed giant",
    distance: "1.4 billion km away",
    light: "80 minutes",
    lightYears: 4_770 / 31_557_600,
    jump: "About 6 times further",
    far: "If the Sun were as tall as a front door, Saturn would be a small melon 2 kilometres away.",
    lightLeft:
      "About 80 minutes ago. The Saturn you see tonight is the Saturn of earlier this evening.",
    reflection:
      "Its rings may not last forever. We happen to be here while they are.",
    sky: { kind: "planet", planet: "saturn" },
    skyWithoutLocation: { chip: "", line: "" },
    artworkKey: "saturn",
  },
  {
    id: "voyager",
    name: "Voyager 1",
    subtitle: "The farthest thing we have made",
    distance: "About 26 billion km away",
    light: "about a day",
    lightYears: 1 / 365.25,
    jump: "About 18 times further",
    far: "It has been travelling since 1977 and has covered less than a thousandth of the way to the nearest star.",
    lightLeft:
      "Its radio signals take about a day to reach us, and every message we send takes a day to reach it. In November 2026 it reaches a full light day from Earth, the first spacecraft ever to do so.",
    reflection:
      "It carries a golden record of sounds and pictures from Earth, in case anyone ever finds it.",
    sky: { kind: "too-faint" },
    skyWithoutLocation: {
      chip: "Too faint to see",
      line: "Far too faint to see. It is heading out towards the constellation Ophiuchus.",
    },
    artworkKey: "voyager-1",
  },
  {
    id: "proxima",
    name: "Proxima Centauri",
    subtitle: "The nearest star",
    distance: "4.24 light years away, about 40 trillion km",
    light: "4 years 3 months",
    lightYears: 4.24,
    jump: "About 1,500 times further",
    far: "At Voyager 1's speed, the journey would take about 75,000 years.",
    lightLeft: "The light reaching Earth tonight left in {when}.",
    reflection:
      "The nearest star is a small red one you will never see without a telescope. Most stars are like it.",
    sky: { kind: "fixed", ra: 217.43, dec: -62.68 },
    skyWithoutLocation: {
      chip: "Not seen from Britain",
      line: "It never rises from Britain. It sits in the southern sky, close to Alpha Centauri, and is too faint to see without a telescope.",
    },
    noteTo: "proxima",
    artworkKey: "proxima-centauri",
  },
  {
    id: "orion",
    name: "The Orion Nebula",
    subtitle: "Where stars are being born",
    distance: "1,344 light years away",
    light: "1,344 years",
    lightYears: 1344,
    jump: "About 300 times further",
    far: "It is 24 light years across. Light from one side takes 24 years to reach the other.",
    lightLeft: "In the 7th century, when Anglo Saxon kingdoms ruled England.",
    reflection:
      "Hubble has seen discs of dust around its young stars, where planets may be forming. Our solar system began like this.",
    sky: { kind: "fixed", ra: 83.82, dec: -5.39 },
    skyWithoutLocation: {
      chip: "Winter evenings",
      line: "From Britain it is best on winter evenings: a small misty patch below Orion's belt.",
    },
    noteTo: "orion",
    artworkKey: "orion-nebula",
  },
  {
    id: "galactic-center",
    name: "The Galactic Centre",
    subtitle: "The heart of the Milky Way",
    distance: "26,000 light years away",
    light: "26,000 years",
    lightYears: 26_000,
    jump: "About 20 times further",
    far: "The Sun takes about 230 million years to circle it once. Last time we were here, the first dinosaurs were appearing.",
    lightLeft:
      "26,000 years ago, near the coldest part of the last ice age, when people in Europe were already painting caves.",
    reflection:
      "Every star you can see tonight is circling this point with us.",
    sky: { kind: "fixed", ra: 266.42, dec: -29.01 },
    skyWithoutLocation: {
      chip: "Summer evenings",
      line: "From Britain it hangs low in the south on summer evenings, hidden behind dust.",
    },
    noteTo: "centre",
    artworkKey: "galactic-center",
  },
  {
    id: "andromeda",
    name: "The Andromeda Galaxy",
    subtitle: "Our nearest major galactic neighbour",
    distance: "2.5 million light years away",
    light: "2.5 million years",
    lightYears: 2_500_000,
    jump: "About 100 times further",
    far: "In long photographs it spans about six full Moons across the sky. It is heading our way, though current models no longer make a future collision certain.",
    lightLeft:
      "2.5 million years ago, when early humans were making some of the first stone tools.",
    reflection:
      "It holds around a trillion stars, and from there our whole galaxy is a faint smudge too.",
    sky: { kind: "fixed", ra: 10.68, dec: 41.27 },
    skyWithoutLocation: {
      chip: "Autumn evenings",
      line: "From Britain it is high on autumn evenings. From somewhere dark it is a faint smudge.",
    },
    noteTo: "andromeda",
    artworkKey: "andromeda",
  },
  {
    id: "edge",
    name: "The edge of what we can see",
    subtitle: "The observable universe",
    distance: "46 billion light years away",
    light: "13.8 billion years",
    lightYears: 13.8e9,
    jump: "About 18,000 times further",
    far: "Space has stretched while the light travelled, so the place it left is now 46 billion light years away.",
    lightLeft:
      "13.8 billion years ago, nine billion years before the Earth formed.",
    reflection:
      "It is not a wall. It is only as far as we can see from here, and every place in the universe has its own.",
    sky: { kind: "everywhere" },
    skyWithoutLocation: {
      chip: "Everywhere",
      line: "Everywhere. In every direction you look, this is as far as light has had time to come.",
    },
    artworkKey: "observable-edge",
  },
];

export const SHIFT_STAGES: ShiftStage[] = SHIFT_STAGES_BASE.map(
  (stage, index) => ({
    ...stage,
    id: `shift-stage-${index + 1}`,
    science: scientificMeta({
      classification:
        index === SHIFT_STAGES_BASE.length - 1 ? "poetic" : "estimate",
      reviewedAt: CONTENT_REVIEWED_AT,
      sourceIds: ["nasaUniverseOverview"],
      precisionNote:
        "The sphere animation is an illustrative perspective device; distances and sizes are not on one physical scale.",
    }),
  }),
);

const LOCATION_SOURCES: Record<
  string,
  readonly [ScientificSourceId, ...ScientificSourceId[]]
> = {
  moon: ["nasaMoonPhases", "nasaMoonFormation"],
  mars: ["nasaSolarSystem"],
  saturn: ["nasaSolarSystem"],
  voyager: ["nasaVoyager"],
  proxima: ["nasaProxima"],
  orion: ["nasaNebulae"],
  "galactic-center": ["nasaMilkyWay", "nasaBlackHoles"],
  andromeda: ["nasaAndromeda"],
  edge: ["nasaUniverseOverview"],
};

export const LOCATIONS: Location[] = LOCATIONS_BASE.map((location) => ({
  ...location,
  science: scientificMeta({
    classification:
      location.id === "andromeda" ? "model-dependent" : "estimate",
    reviewedAt: CONTENT_REVIEWED_AT,
    sourceIds: LOCATION_SOURCES[location.id],
    precisionNote:
      "Distances and sizes are rounded; the reflection is interpretive prose.",
  }),
}));

const COSMIC_EVENTS_BASE: CosmicEventBase[] = [
  {
    year: 1957,
    title: "First satellite in orbit",
    description: "Sputnik showed that we could reach beyond our world.",
  },
  {
    year: 1961,
    title: "First human in space",
    description: "Yuri Gagarin circled Earth once, in 108 minutes.",
  },
  {
    year: 1969,
    title: "First steps on the Moon",
    description: "Humanity walked on another world.",
  },
  {
    year: 1977,
    title: "Voyager 1 launched",
    description:
      "Now in interstellar space, and the farthest thing people have ever made.",
  },
  {
    year: 1990,
    title: "Hubble Space Telescope",
    description:
      "Helped reveal the depth and structure of the cosmos in unprecedented detail.",
  },
  {
    year: 1995,
    title: "First planet found around a Sun-like star",
    description: "51 Pegasi b. Other stars have worlds too.",
  },
  {
    year: 2004,
    title: "Mars rovers explore the surface",
    description: "Spirit and Opportunity began exploring Mars robotically.",
  },
  {
    year: 2015,
    title: "Gravitational waves detected",
    description:
      "Detectors measured spacetime ripples from two black holes merging roughly 1.3 billion years earlier.",
  },
  {
    year: 2019,
    title: "First image of a black hole",
    description:
      "The Event Horizon Telescope released the first image of a black hole's shadow.",
  },
  {
    year: 2021,
    title: "James Webb Space Telescope",
    description:
      "The telescope launched to study the early universe, stars, galaxies, and distant worlds.",
  },
  {
    year: 2022,
    title: "Webb detects carbon dioxide on a distant world",
    description:
      "Webb found clear evidence of carbon dioxide in the atmosphere of the hot gas giant WASP-39 b.",
  },
];

const COSMIC_EVENT_DATES: Record<number, string> = {
  1957: "1957-10-04",
  1961: "1961-04-12",
  1969: "1969-07-20",
  1977: "1977-09-05",
  1990: "1990-04-24",
  1995: "1995-10-06",
  2004: "2004-01-04",
  2015: "2015-09-14",
  2019: "2019-04-10",
  2021: "2021-12-25",
  2022: "2022-08-25",
};

const COSMIC_EVENT_SOURCE_BY_YEAR: Record<
  number,
  readonly [ScientificSourceId, ...ScientificSourceId[]]
> = {
  1957: ["nasaHistory"],
  1961: ["nasaHistory"],
  1969: ["nasaHistory"],
  1977: ["nasaVoyager"],
  1990: ["nasaHistory"],
  1995: ["nasaExoplanets"],
  2004: ["nasaHistory"],
  2015: ["ligoFirstDetection"],
  2019: ["ehtFirstImage"],
  2021: ["nasaWebb"],
  2022: ["nasaWebbCarbonDioxide"],
};

export const COSMIC_EVENTS: CosmicEvent[] = COSMIC_EVENTS_BASE.map((event) => ({
  ...event,
  id: event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  date: COSMIC_EVENT_DATES[event.year],
  science:
    event.year === 1977
      ? scientificMeta({
          classification: "dynamic",
          reviewedAt: CONTENT_REVIEWED_AT,
          reviewBy: "2027-09-16",
          sourceIds: ["nasaVoyager"],
        })
      : scientificMeta({
          classification: "fact",
          reviewedAt: CONTENT_REVIEWED_AT,
          sourceIds: COSMIC_EVENT_SOURCE_BY_YEAR[event.year],
        }),
}));
