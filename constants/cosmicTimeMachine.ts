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
    when: "13.8 billion years ago (380,000 years after Big Bang)",
    title: "The First Light",
    description:
      "The universe cools enough for electrons to combine with protons, forming the first hydrogen atoms. For the first time, light can travel freely. This light — the cosmic microwave background — still surrounds us today in every direction.",
    perspective:
      "Right now, ancient microwave radiation from when the universe became transparent is passing through your surroundings. It is the oldest electromagnetic light we can directly observe.",
    color: "#FFB347",
    icon: "sun",
  },
  {
    id: "dark-ages",
    era: "early-universe",
    when: "13.6 billion years ago",
    title: "The Cosmic Dark Ages",
    description:
      "The universe enters a period of darkness — no stars yet, only clouds of hydrogen and helium slowly cooling and drifting. For hundreds of millions of years, the universe is dark and silent.",
    perspective:
      "After the cosmic background light was released, roughly one to two hundred million years passed before the first stars began to shine. Darkness preceded starlight, but not the background radiation still travelling through the universe.",
    color: "#3A3060",
    icon: "moon",
  },
  {
    id: "first-stars",
    era: "stars",
    when: "13.5 billion years ago",
    title: "The First Stars",
    description:
      "The first stars ignite — massive, hot, and short-lived. Their lives and explosions enrich their surroundings with elements heavier than helium. Later generations of stars and compact-object events continue producing and dispersing elements such as carbon, oxygen, iron, and gold.",
    perspective:
      "Many elements in your body were forged by stars or stellar explosions; hydrogen is largely primordial. You are made from matter recycled across cosmic history.",
    color: "#FFF0A0",
    icon: "star",
  },
  {
    id: "first-galaxies",
    era: "stars",
    when: "13.4 billion years ago",
    title: "The First Galaxies",
    description:
      "Gravity gathers stars into the first galaxies. They are small, irregular, and turbulent — nothing like the grand spirals we see today. They collide, merge, and grow over billions of years into the structure of the cosmic web.",
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
    title: "Our Sun is Born",
    description:
      "A cloud of gas and dust — perhaps triggered by a nearby supernova — collapses under gravity. At its center, pressure and temperature become high enough to ignite nuclear fusion. Our Sun begins to shine. Around it, the remaining disk of material will become the planets.",
    perspective:
      "Our Sun is built from the ashes of stars that came before it. We live inside a stellar inheritance.",
    color: "#FFD700",
    icon: "sun",
  },
  {
    id: "earth-forms",
    era: "solar-system",
    when: "4.54 billion years ago",
    title: "Earth Forms",
    description:
      "Dust, rocks, and ice clump together over millions of years, growing larger with each collision. Earth forms as a hot young planet. Leading models propose that one or more major impacts sent mixed material into orbit, where it coalesced into the Moon; the details remain under study.",
    perspective:
      "The Moon preserves evidence from the violent formation of the Earth–Moon system. Its rocks share striking similarities with Earth's mantle, while models still investigate how material from the impactors and young Earth mixed.",
    color: "#7BA9F0",
    icon: "circle",
  },
  // ─── EARTH & LIFE ───
  {
    id: "oceans",
    era: "earth",
    when: "4.4 billion years ago",
    title: "The First Oceans",
    description:
      "Water — delivered by comets and asteroids, or released from volcanic activity — accumulates on Earth's surface. The oceans form. The stage is set for life.",
    perspective:
      "Earth's water has multiple possible sources, including water-rich material incorporated during formation and later delivery by small bodies. The relative contributions remain under study.",
    color: "#3D8FBF",
    icon: "droplet",
  },
  {
    id: "first-life",
    era: "life",
    when: "At least 3.5 billion years ago; possibly earlier",
    title: "The First Life",
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
    title: "The Great Oxygenation",
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
    title: "Complex Cells Emerge",
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
    title: "The First Animals",
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
    title: "The Cambrian Explosion",
    description:
      "Over tens of millions of years, many major animal groups become conspicuous in the fossil record. Eyes, limbs, shells, and new predator-prey relationships spread through increasingly complex marine ecosystems.",
    perspective:
      "The body plan you inhabit — bilateral symmetry, a central nervous system, a head with eyes on it — is a Cambrian design. You are driving a vehicle whose basic architecture is 540 million years old.",
    color: "#A0B890",
    icon: "eye",
  },
  {
    id: "land",
    era: "life",
    when: "Between roughly 470 and 360 million years ago",
    title: "Life Moves to Land",
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
    title: "The Age of Dinosaurs",
    description:
      "After the Permian mass extinction wipes out around 80% of marine species, dinosaurs emerge and come to dominate. They rule Earth for 165 million years — some 27 times longer than our own lineage has existed.",
    perspective:
      "Dinosaurs existed for 165 million years. Our entire human lineage has existed for perhaps 6 million years. We are newcomers, not successors.",
    color: "#8DA060",
    icon: "triangle",
  },
  {
    id: "asteroid",
    era: "life",
    when: "66 million years ago",
    title: "The Asteroid & Mass Extinction",
    description:
      "A roughly 10-kilometer asteroid strikes what is now the Yucatán Peninsula, triggering global environmental disruption. About three-quarters of species go extinct, including all non-avian dinosaurs.",
    perspective:
      "The mammals that survived that impact were small, nocturnal, and probably lived in burrows. You exist because your ancestors were small enough to hide. The event that nearly ended life on Earth is also the reason we are here.",
    color: "#D08040",
    icon: "alert-triangle",
  },
  {
    id: "mammals",
    era: "life",
    when: "66 million years ago",
    title: "The Rise of Mammals",
    description:
      "With the dinosaurs gone, mammals rapidly diversify into the ecological niches left empty. Whales return to the sea. Bats take to the air. Primates develop in the forests. The world fills with warm-blooded, social, curious animals.",
    perspective:
      "The diversity of mammals — from blue whales to bats to humans — all emerged in the 66 million years since the asteroid. Evolution is fast when given empty space.",
    color: "#C09070",
    icon: "heart",
  },
  // ─── HUMANITY ───
  {
    id: "primates",
    era: "humanity",
    when: "6 million years ago",
    title: "Human Ancestors Emerge",
    description:
      "In Africa, the lineage leading to modern humans diverges from the lineage leading to chimpanzees. Early hominins walk upright and have smaller brains than later Homo; whether the earliest species made tools is unresolved.",
    perspective:
      "Chimpanzees and bonobos are our closest living relatives. Comparisons often put shared aligned DNA around 98–99%, but the exact percentage depends on what sequences and differences are counted.",
    color: "#C8A96E",
    icon: "user",
  },
  {
    id: "fire",
    era: "humanity",
    when: "1 million years ago",
    title: "Control of Fire",
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
    title: "Homo Sapiens Appears",
    description:
      "Homo sapiens emerges in Africa. Evidence for symbolic behavior, ornamentation, burial practices, and visual art appears unevenly across later sites and dates, and new discoveries continue to refine that timeline.",
    perspective:
      "Members of our species lived hundreds of thousands of years ago in social and ecological worlds very different from ours. Their inner lives cannot be observed directly, but material evidence records sophisticated behavior and adaptation.",
    color: "#C8A96E",
    icon: "users",
  },
  {
    id: "out-of-africa",
    era: "humanity",
    when: "70,000 years ago",
    title: "The Great Migration",
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
    title: "Settled Societies Expand",
    description:
      "Humans domesticate plants and animals and begin to build permanent settlements. Cities follow, then writing, some 7,000 years later still. What we call 'history' begins — though humanity had existed for 295,000 years before anyone wrote anything down.",
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
    title: "This Moment",
    description:
      "You are here. Your matter includes primordial hydrogen and elements produced by later generations of stars, assembled by billions of years of biological evolution and human history.",
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
    title: "1,000 Years Hence",
    description:
      "If human societies persist for another thousand years, their technologies and institutions may be profoundly different from ours. The details cannot be predicted from current evidence.",
    perspective:
      "A thousand years is long enough for institutions and assumptions to change beyond recognition. Any specific picture of that future is speculation, not forecast.",
    color: "#8B9BB4",
    icon: "arrow-up",
  },
  {
    id: "milky-way-merger",
    era: "future",
    when: "Several billion years from now — uncertain",
    title: "A Possible Andromeda Encounter",
    description:
      "Andromeda is approaching the Milky Way, but newer measurements make a direct collision within the next several billion years uncertain. If a close encounter or merger occurs, it would unfold over billions of years.",
    perspective:
      "If a close encounter or merger occurs, the galaxies' stars could largely pass between one another because their separations are so vast, while gas and gravitational fields interact strongly. Size changes everything.",
    color: "#9088C0",
    icon: "shuffle",
  },
  {
    id: "red-giant",
    era: "future",
    when: "5 billion years from now",
    title: "The Sun Becomes a Red Giant",
    description:
      "Our Sun exhausts its hydrogen fuel and swells into a red giant, engulfing Mercury, Venus, and possibly Earth. The inner solar system becomes uninhabitable. Then the Sun's outer layers drift away, leaving a slowly cooling white dwarf.",
    perspective:
      "Our Sun has powered most life at Earth's surface for billions of years, yet it too will change profoundly. Nothing in the solar system is permanent. All things pass.",
    color: "#FF6B35",
    icon: "sun",
  },
  {
    id: "last-stars",
    era: "future",
    when: "100 trillion years from now",
    title: "The Last Stars",
    description:
      "In standard long-term models, usable gas dwindles and star formation eventually ceases. The timing depends on cosmology and stellar populations; remnants and black holes would dominate an increasingly cold, dark universe.",
    perspective:
      "The era of stars — the era that made us possible — is just a brief, bright chapter in the universe's very long story. We are lucky to have been born in the age of starlight.",
    color: "#303050",
    icon: "moon",
  },
  {
    id: "heat-death",
    era: "future",
    when: "10^100 years from now",
    title: "The Far Future",
    description:
      "If current cosmology remains valid and black-hole evaporation proceeds as predicted, the universe may approach an extremely dilute state near thermodynamic equilibrium. The timescale and ultimate outcome depend on assumptions that cannot yet be tested directly.",
    perspective:
      "Current models allow futures in which usable energy becomes increasingly scarce. The uncertainty does not diminish the rarity of the complex era we can observe now.",
    color: "#202030",
    icon: "pause",
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
  "red-giant": ["nasaStars"],
  "last-stars": ["nasaStars", "nasaUniverseOverview"],
  "heat-death": ["nasaUniverseOverview"],
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
  "early-universe": "Early Universe",
  stars: "First Stars",
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
