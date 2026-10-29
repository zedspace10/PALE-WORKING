import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
  ScientificSourceId,
} from "@/constants/scientificContent";

export type TimeMachineEra =
  | "distant-past"
  | "early-universe"
  | "stars"
  | "solar-system"
  | "earth"
  | "life"
  | "humanity"
  | "now"
  | "future";

interface TimeMachineEventBase {
  id: string;
  era: TimeMachineEra;
  when: string;
  title: string;
  description: string;
  perspective: string;
  color: string;
  icon: string;
}

export interface TimeMachineEvent
  extends TimeMachineEventBase, ScientificItem {}

const TIME_MACHINE_EVENTS_BASE: TimeMachineEventBase[] = [
  {
    id: "big-bang",
    era: "distant-past",
    when: "13.8 billion years ago",
    title: "The Big Bang",
    description:
      "The observable universe begins in an extremely hot, dense state and space expands everywhere, without a central point. Protons and neutrons appear in the first second; during the next few minutes, some combine into the first light atomic nuclei.",
    perspective:
      "The cosmic history that eventually produced your atoms, your world, and your thoughts begins in this hot, expanding early universe. You are part of a story roughly 13.8 billion years long.",
    color: "#FF6B35",
    icon: "zap",
  },
  {
    id: "cmb",
    era: "distant-past",
    when: "380,000 years after the Big Bang",
    title: "The first light",
    description:
      "The universe cools enough for electrons to combine with protons, forming the first hydrogen atoms. For the first time, light can travel freely. This light, the cosmic microwave background, still surrounds us today in every direction.",
    perspective:
      "Right now, ancient microwave radiation from when the universe became transparent is passing through your surroundings. It is the oldest electromagnetic light we can directly observe.",
    color: "#FFB347",
    icon: "sun",
  },
  {
    id: "dark-ages",
    era: "early-universe",
    when: "13.6 billion years ago",
    title: "The cosmic dark ages",
    description:
      "The universe enters a period of darkness. No stars yet, only clouds of hydrogen and helium slowly cooling and drifting. For a hundred million years or more, the universe is dark and silent.",
    perspective:
      "After the cosmic background light was released, roughly one to two hundred million years passed before the first stars began to shine. Darkness preceded starlight, but not the background radiation still travelling through the universe.",
    color: "#3A3060",
    icon: "moon",
  },
  {
    id: "first-stars",
    era: "stars",
    when: "13.5 billion years ago",
    title: "The first stars",
    description:
      "The first stars ignite: huge, hot and brilliant. Their light floods the young universe and begins to clear the fog of hydrogen gas between them, so that light can travel across space again.",
    perspective:
      "Webb is now finding galaxies whose light left them when the universe was only a few hundred million years old. Some of the oldest starlight is still arriving.",
    color: "#FFF0A0",
    icon: "star",
  },
  {
    id: "first-galaxies",
    era: "stars",
    when: "13.4 billion years ago",
    title: "The first galaxies",
    description:
      "Gravity gathers stars into the first galaxies. They are small, irregular, and turbulent, nothing like the grand spirals we see today. They collide, merge, and grow over billions of years into the structure of the cosmic web.",
    perspective:
      "The Milky Way assembled through gas accretion, star formation, and mergers over billions of years. Our galaxy still carries evidence of those earlier interactions.",
    color: "#A0C0F0",
    icon: "disc",
  },
  // ─── SOLAR SYSTEM ───
  {
    id: "sun-born",
    era: "solar-system",
    when: "4.6 billion years ago",
    title: "Our Sun is born",
    description:
      "A cloud of gas and dust collapses under its own gravity. At its centre, pressure and temperature become high enough to ignite nuclear fusion. Our Sun begins to shine. Around it, the remaining disk of material will become the planets.",
    perspective:
      "The same Sun has been shining for about 4.6 billion years. Its light reached the first life on Earth, and it reaches you today.",
    color: "#FFD700",
    icon: "sun",
  },
  {
    id: "earth-forms",
    era: "solar-system",
    when: "4.54 billion years ago",
    title: "Earth forms",
    description:
      "Dust, rocks, and ice clump together over millions of years, growing larger with each collision. Earth forms as a hot young planet. Leading models propose that one or more major impacts sent mixed material into orbit, where it coalesced into the Moon; the details remain under study.",
    perspective:
      "The Moon preserves evidence from the violent formation of Earth and the Moon. Its rocks share striking similarities with Earth's mantle, while models still investigate how material from the impactors and young Earth mixed.",
    color: "#7BA9F0",
    icon: "circle",
  },
  // ─── EARTH & LIFE ───
  {
    id: "oceans",
    era: "earth",
    when: "4.4 billion years ago",
    title: "The first oceans",
    description:
      "Water, delivered by comets and asteroids, or released from volcanic activity, accumulates on Earth's surface. The oceans form. The stage is set for life.",
    perspective:
      "Earth's water has multiple possible sources, including water-rich material incorporated during formation and later delivery by small bodies. The relative contributions remain under study.",
    color: "#3D8FBF",
    icon: "droplet",
  },
  {
    id: "first-life",
    era: "life",
    when: "At least 3.5 billion years ago; possibly earlier",
    title: "The first life",
    description:
      "The earliest widely accepted evidence of life appears in ancient rocks. These organisms were simple and single-celled, although the date and setting of life's origin remain uncertain.",
    perspective:
      "Humans share deep common ancestry with all known life on Earth. Evolution connects us to trees, bacteria, whales, and lineages that disappeared long before our species arose.",
    color: "#4CAF50",
    icon: "activity",
  },
  {
    id: "oxygen",
    era: "life",
    when: "2.4 billion years ago",
    title: "The great oxygenation",
    description:
      "Oxygen produced by photosynthetic microbes begins accumulating in the atmosphere and oceans. It transforms Earth's chemistry, harms many anaerobic organisms, and helps create conditions later used by complex life; calling it Earth's first mass extinction is debated.",
    perspective:
      "The oxygen you are breathing ultimately traces back to photosynthetic life. A gas that was hazardous to many anaerobic organisms later became central to most complex ecosystems.",
    color: "#80C080",
    icon: "wind",
  },
  {
    id: "complex-cells",
    era: "life",
    when: "2 billion years ago",
    title: "Complex cells emerge",
    description:
      "An ancestral cell forms a lasting partnership with a bacterium that becomes the mitochondrion. This is a key step in eukaryotic evolution. Most cells in your body retain mitochondria descended from that ancient partnership; mature red blood cells are one exception.",
    perspective:
      "The ancient partnership behind mitochondria remains built into most of your cells. At the cellular level, your body carries evidence of organisms whose lineages became interdependent.",
    color: "#90D4B0",
    icon: "layers",
  },
  {
    id: "multicellular",
    era: "life",
    when: "600 million years ago",
    title: "The first animals",
    description:
      "Animals appear in the oceans after multicellular life had already evolved in other lineages. Their early forms were soft-bodied, and the exact relationships among them remain an active area of research.",
    perspective:
      "Animals are a recent branch on a much older tree of life, preceded by billions of years of microbial evolution and earlier multicellular lineages.",
    color: "#80B0D0",
    icon: "feather",
  },
  {
    id: "cambrian",
    era: "life",
    when: "540 million years ago",
    title: "The Cambrian explosion",
    description:
      "Over tens of millions of years, many major animal groups become conspicuous in the fossil record. Eyes, limbs, shells, and new predator-prey relationships spread through increasingly complex marine ecosystems.",
    perspective:
      "The body plan you live in (two matching sides, a central nervous system, a head with eyes) is a Cambrian design. You are driving a vehicle whose basic architecture is 540 million years old.",
    color: "#A0B890",
    icon: "eye",
  },
  {
    id: "land",
    era: "life",
    when: "Between roughly 470 and 360 million years ago",
    title: "Life moves to land",
    description:
      "Plants spread across land and help transform bare surfaces into soils. Arthropods follow, and much later some vertebrate lineages evolve limbs and adaptations for moving and breathing on land.",
    perspective:
      "Your arms are modified fish fins. The developmental genes that build your limbs are the same ones that built the first fins to crawl onto land. The ocean is still in you.",
    color: "#70A860",
    icon: "trending-up",
  },
  {
    id: "dinosaurs",
    era: "life",
    when: "230 million years ago",
    title: "The age of dinosaurs",
    description:
      "After the Permian mass extinction wipes out around 80% of marine species, dinosaurs emerge and come to dominate. They rule Earth for 165 million years, some 27 times longer than our own lineage has existed.",
    perspective:
      "Dinosaurs existed for 165 million years. Our entire human lineage has existed for perhaps 6 million years. We are newcomers, not successors.",
    color: "#8DA060",
    icon: "triangle",
  },
  {
    id: "asteroid",
    era: "life",
    when: "66 million years ago",
    title: "The asteroid and the mass extinction",
    description:
      "An asteroid about 10 kilometres wide strikes what is now the Yucatán Peninsula, triggering global environmental disruption. About three-quarters of species go extinct, including all non-avian dinosaurs.",
    perspective:
      "The mammals that survived that impact were small, nocturnal, and probably lived in burrows. You exist because your ancestors were small enough to hide. The event that ended the age of dinosaurs is also part of the reason we are here.",
    color: "#D08040",
    icon: "alert-triangle",
  },
  {
    id: "mammals",
    era: "life",
    when: "66 million years ago",
    title: "The rise of mammals",
    description:
      "With the dinosaurs gone, mammals rapidly diversify into the ecological niches left empty. Whales return to the sea. Bats take to the air. Primates develop in the forests. The world fills with warm-blooded, social, curious animals.",
    perspective:
      "The diversity of mammals, from blue whales to bats to humans, all emerged in the 66 million years since the asteroid. Evolution is fast when given empty space.",
    color: "#C09070",
    icon: "heart",
  },
  // ─── HUMANITY ───
  {
    id: "primates",
    era: "humanity",
    when: "6 million years ago",
    title: "Human ancestors emerge",
    description:
      "In Africa, the lineage leading to modern humans diverges from the lineage leading to chimpanzees. Early hominins walk upright and have smaller brains than later Homo; whether the earliest species made tools is unresolved.",
    perspective:
      "Chimpanzees and bonobos are our closest living relatives. Comparisons often put shared aligned DNA around 98 to 99%, but the exact percentage depends on what sequences and differences are counted.",
    color: "#C8A96E",
    icon: "user",
  },
  {
    id: "fire",
    era: "humanity",
    when: "1 million years ago",
    title: "Control of fire",
    description:
      "Evidence suggests early humans were using fire by this broad period, although the timing of habitual control is debated. Fire offered warmth, protection, and eventually cooking; cooking may have influenced human evolution, but it is not a single proven cause of brain growth.",
    perspective:
      "Every campfire, every candle, every electric light carries forward a relationship with fire that began a million years ago. The light you read by is a very long tradition.",
    color: "#E8803A",
    icon: "zap",
  },
  {
    id: "homo-sapiens",
    era: "humanity",
    when: "300,000 years ago",
    title: "Homo sapiens appears",
    description:
      "Homo sapiens emerges in Africa. Evidence for symbolic behaviour, ornamentation, burial practices, and visual art appears unevenly across later sites and dates, and new discoveries continue to refine that timeline.",
    perspective:
      "Members of our species lived hundreds of thousands of years ago in social and ecological worlds very different from ours. Their inner lives cannot be observed directly, but material evidence records sophisticated behaviour and adaptation.",
    color: "#C8A96E",
    icon: "users",
  },
  {
    id: "out-of-africa",
    era: "humanity",
    when: "70,000 years ago",
    title: "The great migration",
    description:
      "Several dispersals of Homo sapiens leave Africa, with a major expansion contributing much of the ancestry of present-day populations outside Africa. Those groups mixed with Neanderthals, Denisovans, and other human populations along the way.",
    perspective:
      "All living humans share deep African ancestry, while later migrations and interbreeding made population history a branching network rather than one simple journey. Every human is a cousin.",
    color: "#B89060",
    icon: "map",
  },
  {
    id: "civilization",
    era: "humanity",
    when: "12,000 years ago",
    title: "Settled societies expand",
    description:
      "Humans domesticate plants and animals and begin to build permanent settlements. Cities follow, and writing appears about 5,000 years ago. What we call 'history' begins, though our species had existed for some 295,000 years before anyone wrote anything down.",
    perspective:
      "Agriculture and permanent settlements expanded within roughly the last 12,000 years; cities and writing came later in several regions. Art, symbolic expression, and ritual traditions reach much further into human prehistory.",
    color: "#C8A060",
    icon: "book",
  },
  // ─── NOW ───
  {
    id: "now",
    era: "now",
    when: "Right now",
    title: "This moment",
    description:
      "You are here. Most of the hydrogen in your body dates from the first moments of the universe, shaped by billions of years of evolution and all of human history.",
    perspective:
      "This exact moment depends on an immense chain of contingencies across cosmic and biological history. It is here nonetheless.",
    color: "#C8A96E",
    icon: "radio",
  },
  // ─── FUTURE ───
  {
    id: "near-future",
    era: "future",
    when: "1,000 years from now",
    title: "A thousand years from now",
    description:
      "If human societies persist for another thousand years, their technologies and institutions may be profoundly different from ours. The details cannot be predicted from current evidence.",
    perspective:
      "A thousand years is long enough for institutions and assumptions to change beyond recognition. Any specific picture of that future is speculation, not forecast.",
    color: "#8B9BB4",
    icon: "arrow-up",
  },
  {
    id: "vega-pole-star",
    era: "future",
    when: "About 12,000 years from now",
    title: "Vega becomes the North Star",
    description:
      "Earth's axis slowly wobbles, tracing a circle in the sky every 26,000 years. In about 12,000 years it will point close to Vega, which will take over from Polaris as the star that marks north.",
    perspective:
      "Vega was last near the pole about 14,000 years ago, when people in many parts of the world were still hunting and gathering. The sky's fixed point is only fixed on a human timescale.",
    color: "#A8C8FF",
    icon: "navigation",
  },
  {
    id: "last-total-eclipse",
    era: "future",
    when: "Several hundred million years from now",
    title: "The last total solar eclipse",
    description:
      "The Moon is drifting away from Earth by about 3.8 centimetres a year. One day it will look too small to cover the Sun completely, and total eclipses will end. Estimates put that several hundred million years from now.",
    perspective:
      "Today the Moon and the Sun look almost exactly the same size in our sky. It is a coincidence of this moment, and we happen to live inside it.",
    color: "#C8C8D8",
    icon: "circle",
  },
  {
    id: "milky-way-merger",
    era: "future",
    when: "Several billion years from now, timing uncertain",
    title: "A possible Andromeda encounter",
    description:
      "Andromeda is approaching the Milky Way, but newer measurements make a direct collision within the next several billion years uncertain. If a close encounter or merger occurs, it would unfold over billions of years.",
    perspective:
      "If a close encounter or merger occurs, the galaxies' stars could largely pass between one another because their separations are so vast, while gas and gravitational fields interact strongly. Size changes everything.",
    color: "#9088C0",
    icon: "shuffle",
  },
];

const TIME_MACHINE_SOURCE_BY_ID: Record<
  string,
  readonly [ScientificSourceId, ...ScientificSourceId[]]
> = {
  "big-bang": ["nasaBigBang", "nasaGlossary"],
  cmb: ["nasaCmb"],
  "dark-ages": ["nasaUniverseOverview"],
  "first-stars": ["nasaStars", "nasaUniverseOverview"],
  "first-galaxies": ["nasaGalaxies", "nasaUniverseOverview"],
  "sun-born": ["nasaSolarSystemFormation"],
  "earth-forms": ["nasaMoonFormation", "nasaSolarSystemFormation"],
  oceans: ["nasaAstrobiologyStrategy"],
  "first-life": ["nasaAstrobiologyStrategy"],
  oxygen: ["nasaAstrobiologyStrategy"],
  "complex-cells": ["nasaAstrobiologyStrategy"],
  multicellular: ["nasaAstrobiologyStrategy"],
  cambrian: ["smithsonianDeepTime", "nasaAstrobiologyStrategy"],
  land: ["smithsonianDeepTime"],
  dinosaurs: ["smithsonianDeepTime"],
  asteroid: ["smithsonianDeepTime"],
  mammals: ["smithsonianDeepTime"],
  primates: ["smithsonianHumanOrigins"],
  fire: ["smithsonianHumanOrigins"],
  "homo-sapiens": ["smithsonianHumanOrigins"],
  "out-of-africa": ["smithsonianHumanOrigins"],
  civilization: ["smithsonianHumanOrigins"],
  now: ["nasaUniverseOverview", "nasaAstrobiologyStrategy"],
  "near-future": ["nasaUniverseOverview"],
  "milky-way-merger": ["nasaAndromeda"],
  "vega-pole-star": ["nasaStars"],
  "last-total-eclipse": ["nasaMoonFacts"],
};

export const TIME_MACHINE_EVENTS: TimeMachineEvent[] =
  TIME_MACHINE_EVENTS_BASE.map((event) => ({
    ...event,
    science: scientificMeta({
      classification: event.era === "future" ? "model-dependent" : "estimate",
      reviewedAt: CONTENT_REVIEWED_AT,
      sourceIds: TIME_MACHINE_SOURCE_BY_ID[event.id] ?? [
        "nasaUniverseOverview",
      ],
      precisionNote:
        "Dates this far in the past or future are rounded and can change as evidence and models improve.",
    }),
  }));

export const ERA_LABELS: Record<TimeMachineEra, string> = {
  "distant-past": "Origins",
  "early-universe": "Early universe",
  stars: "First stars",
  "solar-system": "Solar System",
  earth: "Earth",
  life: "Life",
  humanity: "Humanity",
  now: "Now",
  future: "Future",
};

export const ERA_ORDER: TimeMachineEra[] = [
  "distant-past",
  "early-universe",
  "stars",
  "solar-system",
  "earth",
  "life",
  "humanity",
  "now",
  "future",
];
