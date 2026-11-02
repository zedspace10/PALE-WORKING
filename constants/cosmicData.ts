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

/** How home looks from a place: the drawing used by Look back. */
export type LookBackScene =
  | "earth-large"
  | "blue-star"
  | "dot-near-sun"
  | "pixel-in-sunlight"
  | "sun-a-star"
  | "sun-too-faint"
  | "sun-lost"
  | "galaxy-smudge"
  | "first-glow";

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
  /** When the light we see left, matched to what was happening on Earth. "{when}" is filled in with the season and year it set off. */
  lightLeft: string;
  sky: ExploreSkyTarget;
  /** What to say about it in the sky when PALE does not know where the person is. */
  skyWithoutLocation: { chip: string; line: string };
  /** How home would look from here. */
  lookBack: { scene: LookBackScene; line: string };
  /** What to say after holding to travel and letting go, when the person could never get there. */
  neverArrive?: string;
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
}

export interface ShiftStage extends ShiftStageBase, ScientificItem {}

const SHIFT_STAGES_BASE: ShiftStageBase[] = [
  {
    title: "You are here.",
    subtitle: "Earth, a small rocky world going round an ordinary star.",
  },
  {
    title: "The Solar System.",
    subtitle:
      "Eight planets and the Sun. Everyone you have ever met lives on the third one.",
  },
  {
    title: "The Milky Way.",
    subtitle:
      "Our Sun is one of a few hundred billion stars, about halfway out from the centre, in a small spiral arm.",
  },
  {
    title: "The Local Group.",
    subtitle:
      "More than 80 galaxies held together by gravity. The Milky Way and Andromeda are the two biggest.",
  },
  {
    title: "Everything we can see.",
    subtitle:
      "Hundreds of billions of galaxies, perhaps more, out to about 46 billion light years in every direction.",
  },
  {
    title: "Somewhere in all of this is you.",
    subtitle: "",
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
    lightLeft:
      "1.3 seconds ago. The Moon you see is always a little over a second in the past.",
    sky: { kind: "moon" },
    skyWithoutLocation: {
      chip: "",
      line: "Tonight's Sky can show you exactly where to look.",
    },
    lookBack: {
      scene: "earth-large",
      line: "From the Moon, Earth looks nearly four times wider than the full Moon does to us. It never rises or sets. It stays in the same part of the sky and turns.",
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
    lightLeft:
      "About 12 minutes ago. Close enough that what you see is, in effect, now.",
    sky: { kind: "planet", planet: "mars" },
    skyWithoutLocation: { chip: "", line: "" },
    lookBack: {
      scene: "blue-star",
      line: "From Mars, Earth looks like a bright blue star in the evening or morning sky, much as Venus looks to us.",
    },
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
    lightLeft:
      "About 80 minutes ago. The Saturn you see tonight is the Saturn of earlier this evening.",
    sky: { kind: "planet", planet: "saturn" },
    skyWithoutLocation: { chip: "", line: "" },
    lookBack: {
      scene: "dot-near-sun",
      line: "From Saturn, Earth is a tiny point close to the Sun's glare. In 2013 the Cassini spacecraft photographed it from there, and people on Earth went outside to wave.",
    },
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
    lightLeft:
      "Its radio signals take about a day to reach us, and every message we send takes a day to reach it. In November 2026 it reaches a full light day from Earth, the first spacecraft ever to do so.",
    sky: { kind: "too-faint" },
    skyWithoutLocation: {
      chip: "Too faint to see",
      line: "Far too faint to see. It is heading out towards the constellation Ophiuchus.",
    },
    lookBack: {
      scene: "pixel-in-sunlight",
      line: "From Voyager 1, Earth is far smaller than a single pixel, close to the Sun's glare. In 1990 it turned its camera back and photographed Earth from about 6 billion km away.",
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
    lightLeft: "The light reaching Earth tonight left in {when}.",
    sky: { kind: "fixed", ra: 217.43, dec: -62.68 },
    skyWithoutLocation: {
      chip: "Not seen from Britain",
      line: "It never rises from Britain. It sits in the southern sky, close to Alpha Centauri, and is too faint to see without a telescope.",
    },
    noteTo: "proxima",
    lookBack: {
      scene: "sun-a-star",
      line: "From Proxima Centauri, Earth is far too faint to see. The Sun looks like an ordinary bright star in the constellation Cassiopeia.",
    },
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
    lightLeft: "In the 7th century, when Anglo Saxon kingdoms ruled England.",
    sky: { kind: "fixed", ra: 83.82, dec: -5.39 },
    skyWithoutLocation: {
      chip: "Winter evenings",
      line: "From Britain it is best on winter evenings: a small misty patch below Orion's belt.",
    },
    noteTo: "orion",
    lookBack: {
      scene: "sun-too-faint",
      line: "From the Orion Nebula, you would need a telescope to find the Sun at all, and there would be no way to see Earth.",
    },
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
    lightLeft:
      "26,000 years ago, near the coldest part of the last ice age, when people in Europe were already painting caves.",
    sky: { kind: "fixed", ra: 266.42, dec: -29.01 },
    skyWithoutLocation: {
      chip: "Summer evenings",
      line: "From Britain it hangs low in the south on summer evenings, hidden behind dust.",
    },
    noteTo: "centre",
    lookBack: {
      scene: "sun-lost",
      line: "From the centre of the galaxy, the Sun is one of billions of stars, and clouds of dust in between would hide it.",
    },
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
    lightLeft:
      "2.5 million years ago, when early humans were making some of the first stone tools.",
    sky: { kind: "fixed", ra: 10.68, dec: 41.27 },
    skyWithoutLocation: {
      chip: "Autumn evenings",
      line: "From Britain it is high on autumn evenings. From somewhere dark it is a faint smudge.",
    },
    noteTo: "andromeda",
    lookBack: {
      scene: "galaxy-smudge",
      line: "From Andromeda, our whole galaxy looks like a faint smudge, about as faint as Andromeda looks to us.",
    },
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
    lightLeft:
      "13.8 billion years ago, nine billion years before the Earth formed.",
    sky: { kind: "everywhere" },
    skyWithoutLocation: {
      chip: "Everywhere",
      line: "Everywhere. In every direction you look, this is as far as light has had time to come.",
    },
    lookBack: {
      scene: "first-glow",
      line: "Anyone looking our way from there would see this part of space as it was at the very beginning: a warm glow, with no Milky Way, no Sun and no Earth yet.",
    },
    neverArrive:
      "You could hold on forever and never arrive. Space is stretching faster than light can cross it, so the edge keeps moving away.",
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
