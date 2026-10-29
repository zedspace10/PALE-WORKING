import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
  ScientificSourceId,
} from "@/constants/scientificContent";
import type { ExploreArtworkKey } from "@/constants/exploreArtwork";

interface LocationBase {
  id: string;
  name: string;
  subtitle: string;
  distance: string;
  distanceRaw: string;
  reflection: string;
  scale: string;
  gradientColors: [string, string];
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

const LOCATIONS_BASE: LocationBase[] = [
  {
    id: "moon",
    name: "The Moon",
    subtitle: "Earth's ancient companion",
    distance: "384,400 km",
    distanceRaw: "1.3 light seconds",
    reflection:
      "Twelve people walked on the Moon between 1969 and 1972. Their footprints can persist for very long periods because the Moon has no weather like Earth's, though micrometeorites slowly alter the surface.",
    scale: "3,474 km across, a little narrower than Australia",
    gradientColors: ["#1A1D2E", "#2D324F"],
    artworkKey: "moon",
  },
  {
    id: "mars",
    name: "Mars",
    subtitle: "The red world",
    distance: "225 million km",
    distanceRaw: "12.5 light minutes",
    reflection:
      "Mars formed early in Solar System history and has a day only a little longer than Earth's. Its rust-coloured surface records billions of years of geological change.",
    scale: "6,779 km across, about half as wide as Earth",
    gradientColors: ["#2D1A14", "#5C3020"],
    artworkKey: "mars",
  },
  {
    id: "saturn",
    name: "Saturn",
    subtitle: "The ringed giant",
    distance: "1.4 billion km",
    distanceRaw: "80 light minutes",
    reflection:
      "Saturn's rings are mostly ice, with rock and dust. Their origin and age remain debated; ring material is gradually falling into Saturn, and models suggest the rings could change substantially over hundreds of millions of years.",
    scale: "116,460 km across, about nine Earths side by side",
    gradientColors: ["#2A2510", "#4A4020"],
    artworkKey: "saturn",
  },
  {
    id: "galactic-center",
    name: "The Galactic Centre",
    subtitle: "Heart of the Milky Way",
    distance: "26,000 light years",
    distanceRaw: "26,000 light years",
    reflection:
      "At the centre of our galaxy lies Sagittarius A*, a black hole about four million times the mass of our Sun. Nearby stars orbit it while hot gas in the region varies over time.",
    scale: "The densest region of our galaxy",
    gradientColors: ["#1A0A25", "#3D1550"],
    artworkKey: "galactic-center",
  },
  {
    id: "andromeda",
    name: "Andromeda",
    subtitle: "Our nearest major galactic neighbour",
    distance: "2.5 million light years",
    distanceRaw: "2.5 million light years",
    reflection:
      "The light reaching us from Andromeda left before modern humans existed. The two galaxies are approaching, but current models no longer make a future collision certain.",
    scale: "Perhaps a trillion stars, though counts vary widely",
    gradientColors: ["#0A1530", "#1A2D5A"],
    artworkKey: "andromeda",
  },
  {
    id: "nebula",
    name: "Pillars of Creation",
    subtitle: "Where stars are born",
    distance: "6,500 light years",
    distanceRaw: "6,500 light years",
    reflection:
      "These towering columns of gas and dust are stellar nurseries where new stars are forming. We see them as they were about 6,500 years before the light reached Earth.",
    scale: "About 4 light years tall, some 38 trillion km",
    gradientColors: ["#0D1A25", "#143040"],
    artworkKey: "pillars-of-creation",
  },
  {
    id: "black-hole",
    name: "Sagittarius A*",
    subtitle: "The black hole at the heart of our galaxy",
    distance: "26,000 light years",
    distanceRaw: "26,000 light years",
    reflection:
      "Beyond the event horizon, light cannot return to the outside universe. A distant observer sees an infalling clock appear to slow, while the falling object crosses the horizon in its own finite time.",
    scale: "25 million km across, about eighteen times the width of the Sun",
    gradientColors: ["#06060A", "#0F0F1E"],
    artworkKey: "sagittarius-a-star",
  },
  {
    id: "edge",
    name: "The Observable Edge",
    subtitle: "As far as light can reach",
    distance: "46 billion light years",
    distanceRaw: "46 billion light years",
    reflection:
      "Light from beyond our current observable horizon has not had time to reach us. The horizon is not a physical edge, and what can influence or be observed changes over cosmic time.",
    scale: "The present horizon of the observable universe",
    gradientColors: ["#08051A", "#100838"],
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
  "galactic-center": ["nasaMilkyWay", "nasaBlackHoles"],
  andromeda: ["nasaAndromeda"],
  nebula: ["nasaNebulae"],
  "black-hole": ["nasaBlackHoles"],
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
