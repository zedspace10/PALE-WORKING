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

interface DeepTimeEventBase {
  id: string;
  date: string;
  title: string;
  description: string;
  yearsAgo: string;
}

export interface DeepTimeEvent extends DeepTimeEventBase, ScientificItem {}

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
  circleColor: string;
}

export interface ShiftStage extends ShiftStageBase, ScientificItem {}

const SHIFT_STAGES_BASE: ShiftStageBase[] = [
  {
    title: "You are here.",
    subtitle:
      "A pale blue dot.\nOrbiting an ordinary star.\nIn one arm of one galaxy.",
    hint: "EARTH",
    circleColor: "#B8D4E8",
  },
  {
    title: "Our neighbourhood.",
    subtitle:
      "Eight planets.\nOne star.\nEveryone you have ever met\nlives within this circle.",
    hint: "SOLAR SYSTEM",
    circleColor: "#C4B8FF",
  },
  {
    title: "Hundreds of billions of stars.",
    subtitle:
      "Our Sun is one of them.\nLost in one arm.\nUnremarkable.\nEssential.",
    hint: "THE MILKY WAY",
    circleColor: "#9966FF",
  },
  {
    title: "A gathering of nearby galaxies.",
    subtitle:
      "Held together by gravity.\nDrifting as one\nthrough the cosmos.\nThe Milky Way is one\nof the two largest.",
    hint: "LOCAL GROUP",
    circleColor: "#4488FF",
  },
  {
    title: "Everything we can see.",
    subtitle:
      "Hundreds of billions of galaxies, perhaps more.\nAbout forty-six billion light-years\nin every direction.\nStill expanding.",
    hint: "THE OBSERVABLE UNIVERSE",
    circleColor: "#1A1A3E",
  },
  {
    title: "Somewhere in all of this…",
    subtitle: "…there is you.",
    hint: "",
    circleColor: "transparent",
  },
];

export const DAILY_REFLECTIONS = [
  "Every human who has ever lived existed on one small world.",
  "Many of the elements in your body were forged inside ancient stars.",
  "The light entering your eyes tonight may have begun its journey millions of years ago.",
  "Your problems are real. But they are not the entire universe.",
  "The universe made something that could turn around and look back at it.",
  "From the perspective of the cosmos, all of human history is a brief flicker.",
  "You are stardust, contemplating the stars that made you.",
];

const LOCATIONS_BASE: LocationBase[] = [
  {
    id: "moon",
    name: "The Moon",
    subtitle: "Earth's ancient companion",
    distance: "384,400 km",
    distanceRaw: "1.3 light-seconds",
    reflection:
      "Twelve people walked on the Moon between 1969 and 1972. Their footprints can persist for very long periods because the Moon has no weather like Earth's, though micrometeorites slowly alter the surface.",
    scale: "3,474 km across — smaller than Australia",
    gradientColors: ["#1A1D2E", "#2D324F"],
    artworkKey: "moon",
  },
  {
    id: "mars",
    name: "Mars",
    subtitle: "The red world",
    distance: "225 million km",
    distanceRaw: "12.5 light-minutes",
    reflection:
      "Mars formed early in Solar System history and has a day only a little longer than Earth's. Its rust-coloured surface records billions of years of geological change.",
    scale: "6,779 km across — half the size of Earth",
    gradientColors: ["#2D1A14", "#5C3020"],
    artworkKey: "mars",
  },
  {
    id: "saturn",
    name: "Saturn",
    subtitle: "The ringed giant",
    distance: "1.2 billion km",
    distanceRaw: "70 light-minutes",
    reflection:
      "Saturn's rings are mostly ice, with rock and dust. Their origin and age remain debated; ring material is gradually falling into Saturn, and models suggest the rings could change substantially over hundreds of millions of years.",
    scale: "116,460 km across — nine Earths wide",
    gradientColors: ["#2A2510", "#4A4020"],
    artworkKey: "saturn",
  },
  {
    id: "galactic-center",
    name: "The Galactic Center",
    subtitle: "Heart of the Milky Way",
    distance: "26,000 light-years",
    distanceRaw: "26,000 light-years",
    reflection:
      "At the center of our galaxy lies Sagittarius A*, a black hole about four million times the mass of our Sun. Nearby stars orbit it while hot gas in the region varies over time.",
    scale: "The densest region of our galaxy",
    gradientColors: ["#1A0A25", "#3D1550"],
    artworkKey: "galactic-center",
  },
  {
    id: "andromeda",
    name: "Andromeda",
    subtitle: "Our nearest major galactic neighbour",
    distance: "2.5 million light-years",
    distanceRaw: "2.5 million light-years",
    reflection:
      "The light reaching us from Andromeda left before modern humans existed. The two galaxies are approaching, but current models no longer make a future collision certain.",
    scale:
      "Rough estimates often place its stellar population near a trillion, with substantial uncertainty",
    gradientColors: ["#0A1530", "#1A2D5A"],
    artworkKey: "andromeda",
  },
  {
    id: "nebula",
    name: "Pillars of Creation",
    subtitle: "Where stars are born",
    distance: "6,500 light-years",
    distanceRaw: "6,500 light-years",
    reflection:
      "These towering columns of gas and dust are stellar nurseries where new stars are forming. We see them as they were about 6,500 years before the light reached Earth.",
    scale: "About 4 light-years tall — some 38 trillion km high",
    gradientColors: ["#0D1A25", "#143040"],
    artworkKey: "pillars-of-creation",
  },
  {
    id: "black-hole",
    name: "Sagittarius A*",
    subtitle: "A black hole at our center",
    distance: "26,000 light-years",
    distanceRaw: "26,000 light-years",
    reflection:
      "Beyond the event horizon, light cannot return to the outside universe. A distant observer sees an infalling clock appear to slow, while the falling object crosses the horizon in its own finite time.",
    scale: "25 million km across — eighteen times the width of the Sun",
    gradientColors: ["#06060A", "#0F0F1E"],
    artworkKey: "sagittarius-a-star",
  },
  {
    id: "edge",
    name: "The Observable Edge",
    subtitle: "As far as light can reach",
    distance: "46 billion light-years",
    distanceRaw: "46 billion light-years",
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
        "The circle animation is an illustrative perspective device; distances and sizes are not on one physical scale.",
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

// Cosmic calendar: 13.8 billion years compressed into 365 days.
// One day = 37.8 million years. Entries are ordered chronologically.
const DEEP_TIME_CALENDAR_BASE: DeepTimeEventBase[] = [
  {
    id: "big-bang",
    date: "January 1",
    title: "The Big Bang",
    description:
      "The observable universe begins in an extremely hot, dense state. The expansion happened throughout space; the Big Bang was not an explosion from a central point.",
    yearsAgo: "13.8 billion years ago",
  },
  {
    id: "milky-way",
    date: "January 16",
    title: "The Milky Way forms",
    description:
      "Our home galaxy assembles from vast clouds of gas and dark matter, slowly spinning into the shape we know.",
    yearsAgo: "13.2 billion years ago",
  },
  {
    id: "solar-system",
    date: "September 1",
    title: "Our Solar System is born",
    description:
      "A cloud of gas and dust collapses under its own gravity. The Sun ignites, and the planets form from what remains.",
    yearsAgo: "4.6 billion years ago",
  },
  {
    id: "earth",
    date: "September 3",
    title: "Earth forms",
    description:
      "A rocky world takes shape — still molten, bombarded by debris, yet carrying the seeds of everything to come.",
    yearsAgo: "4.5 billion years ago",
  },
  {
    id: "life",
    date: "October 1",
    title: "First life appears",
    description:
      "The earliest evidence of simple microbial life appears in ancient rocks. The exact timing and setting of life's origin remain uncertain.",
    yearsAgo: "At least 3.5 billion years ago; possibly earlier",
  },
  {
    id: "oxygen",
    date: "October 26",
    title: "Oxygen accumulates in the atmosphere",
    description:
      "Oxygen produced by microbes begins accumulating in the atmosphere, profoundly changing Earth's chemistry and the environments available to life.",
    yearsAgo: "2.5 billion years ago",
  },
  {
    id: "multicellular",
    date: "December 16",
    title: "Early animals diversify",
    description:
      "Animal life becomes more diverse in the oceans, long after multicellular organisms had already evolved in other lineages.",
    yearsAgo: "600 million years ago",
  },
  {
    id: "fish",
    date: "December 17",
    title: "First vertebrates",
    description:
      "Early vertebrate lineages appear, beginning branches that eventually lead to fishes, birds, mammals, and humans.",
    yearsAgo: "530 million years ago",
  },
  {
    id: "dinosaurs",
    date: "December 25",
    title: "Age of Dinosaurs",
    description:
      "Dinosaurs emerge and become the dominant large land vertebrates across much of the Mesozoic Era, while many other lineages continue alongside them.",
    yearsAgo: "230 million years ago",
  },
  {
    id: "extinction",
    date: "December 30",
    title: "The great extinction",
    description:
      "An asteroid impact triggers severe global disruption and contributes to a mass extinction, including the loss of all non-avian dinosaurs. Surviving mammal lineages later diversify.",
    yearsAgo: "66 million years ago",
  },
  {
    id: "humans",
    date: "Dec 31, 11:48 PM",
    title: "Modern humans appear",
    description:
      "Homo sapiens emerge. Tool-makers, storytellers, question-askers. The cosmos looks at itself and wonders.",
    yearsAgo: "300,000 years ago",
  },
  {
    id: "civilization",
    date: "Dec 31, 11:59:33 PM",
    title: "Settled societies expand",
    description:
      "Agriculture and permanent settlements spread; cities and writing follow in several regions. Human art and ritual traditions are much older.",
    yearsAgo: "12,000 years ago",
  },
];

const DEEP_TIME_SOURCE_BY_ID: Record<
  string,
  readonly [ScientificSourceId, ...ScientificSourceId[]]
> = {
  "big-bang": ["nasaBigBang", "nasaGlossary"],
  "milky-way": ["nasaMilkyWay", "nasaGalaxies"],
  "solar-system": ["nasaSolarSystemFormation"],
  earth: ["nasaSolarSystemFormation", "nasaMoonFormation"],
  life: ["nasaAstrobiologyStrategy"],
  oxygen: ["nasaAstrobiologyStrategy"],
  multicellular: ["nasaAstrobiologyStrategy"],
  fish: ["smithsonianDeepTime"],
  dinosaurs: ["smithsonianDeepTime"],
  extinction: ["smithsonianDeepTime"],
  humans: ["smithsonianHumanOrigins"],
  civilization: ["smithsonianHumanOrigins"],
};

export const DEEP_TIME_CALENDAR: DeepTimeEvent[] = DEEP_TIME_CALENDAR_BASE.map(
  (event) => ({
    ...event,
    science: scientificMeta({
      classification: "estimate",
      reviewedAt: CONTENT_REVIEWED_AT,
      sourceIds: DEEP_TIME_SOURCE_BY_ID[event.id],
      precisionNote:
        "Cosmic-calendar dates compress rounded scientific estimates into one illustrative year.",
    }),
  }),
);

const COSMIC_EVENTS_BASE: CosmicEventBase[] = [
  {
    year: 1957,
    title: "First satellite in orbit",
    description: "Sputnik showed that we could reach beyond our world.",
  },
  {
    year: 1961,
    title: "First human in space",
    description: "Yuri Gagarin saw Earth as a whole for the first time.",
  },
  {
    year: 1969,
    title: "First steps on the Moon",
    description: "Humanity walked on another world.",
  },
  {
    year: 1977,
    title: "Voyager 1 launched",
    description: "Now in interstellar space — the farthest human-made object.",
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
