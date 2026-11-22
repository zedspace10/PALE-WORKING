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
      "Everything else on this timeline grows out of this hot, expanding early universe.",
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
      "Right now, ancient microwave radiation from when the universe became transparent is passing through your surroundings. It is the oldest light we can directly observe.",
    color: "#FFB347",
    icon: "sun",
  },
  {
    id: "dark-ages",
    era: "early-universe",
    when: "Until about 13.6 billion years ago",
    title: "The cosmic dark ages",
    description:
      "After the first light fades, the universe goes dark. There are no stars yet, only clouds of hydrogen and helium slowly cooling and drifting. This lasts a hundred million years or more.",
    perspective:
      "For roughly one to two hundred million years there were no stars at all. The only light was the fading glow left over from the beginning.",
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
      "A cloud of gas and dust collapses under its own gravity. At its centre, pressure and temperature become high enough to ignite nuclear fusion. Our Sun begins to shine. Around it, the remaining disc of material will become the planets.",
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
      "Dust, rock and ice clump together over millions of years, and Earth forms as a hot young planet. The Moon most likely formed from material thrown out when something huge hit the young Earth, though the details are still being worked out.",
    perspective:
      "Rocks brought back from the Moon are strikingly similar to rocks from Earth's mantle. That is one of the main clues to how the Moon formed.",
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
      "Water, delivered by comets and asteroids, or released from volcanic activity, accumulates on Earth's surface. The oceans form.",
    perspective:
      "Earth's water has multiple possible sources, including water held in the rocks Earth formed from and later delivery by small bodies. The relative contributions remain under study.",
    color: "#3D8FBF",
    icon: "droplet",
  },
  {
    id: "first-life",
    era: "life",
    when: "At least 3.5 billion years ago; possibly earlier",
    title: "The first life",
    description:
      "The earliest widely accepted evidence of life appears in ancient rocks. These organisms were simple, each a single cell, although the date and setting of life's origin remain uncertain.",
    perspective:
      "You are distantly related to every living thing on Earth, from oak trees to bacteria.",
    color: "#4CAF50",
    icon: "activity",
  },
  {
    id: "oxygen",
    era: "life",
    when: "2.4 billion years ago",
    title: "The great oxygenation",
    description:
      "Tiny microbes in the sea start making oxygen, and it slowly builds up in the air and the water. It changes Earth's chemistry for good and poisons many microbes that cannot live with it. Whether to call it Earth's first mass extinction is debated.",
    perspective:
      "The oxygen you are breathing was made by living things, first microbes and later plants.",
    color: "#80C080",
    icon: "wind",
  },
  {
    id: "complex-cells",
    era: "life",
    when: "2 billion years ago",
    title: "Complex cells emerge",
    description:
      "One cell takes in a bacterium, and the two never part. The bacterium becomes the mitochondrion, the power supply inside every complex cell. Most cells in your body retain mitochondria descended from that partnership; mature red blood cells are one exception.",
    perspective:
      "Your mitochondria still carry a small set of their own DNA, left over from when their ancestors were free living bacteria.",
    color: "#90D4B0",
    icon: "layers",
  },
  {
    id: "multicellular",
    era: "life",
    when: "600 million years ago",
    title: "The first animals",
    description:
      "The first animals appear in the sea. They have soft bodies, and how they are related to one another is still being worked out.",
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
      "Over tens of millions of years, most of the main kinds of animal show up in the fossil record. Eyes, legs and shells appear, and the seas fill with hunters and hunted.",
    perspective:
      "The basic layout of your body, with two matching sides and a head with eyes at the front, was already around in animals more than 500 million years ago.",
    color: "#A0B890",
    icon: "eye",
  },
  {
    id: "land",
    era: "life",
    when: "Between roughly 470 and 360 million years ago",
    title: "Life moves to land",
    description:
      "Plants spread across bare rock and help turn it into soil. Insects and their relatives follow, and much later some fish grow legs and lungs and walk out of the water.",
    perspective:
      "The bones in your arm match the bones in the fins of the fish that first moved onto land, and many of the same genes build both.",
    color: "#70A860",
    icon: "trending-up",
  },
  {
    id: "dinosaurs",
    era: "life",
    when: "230 million years ago",
    title: "The age of dinosaurs",
    description:
      "After the end Permian extinction wipes out most species in the sea, dinosaurs emerge and come to dominate. They rule Earth for 165 million years, some 27 times longer than our own lineage has existed.",
    perspective:
      "Dinosaurs lasted about 165 million years. The human lineage has been around for about 6 million.",
    color: "#8DA060",
    icon: "triangle",
  },
  {
    id: "asteroid",
    era: "life",
    when: "66 million years ago",
    title: "The asteroid and the mass extinction",
    description:
      "An asteroid about 10 kilometres wide strikes what is now the Yucatán Peninsula, triggering global environmental disruption. About three quarters of species die out, including every dinosaur except the birds.",
    perspective:
      "The mammals that survived the impact were mostly small, and many probably sheltered in burrows. Our ancestors were among them.",
    color: "#D08040",
    icon: "alert-triangle",
  },
  {
    id: "mammals",
    era: "life",
    when: "66 million years ago",
    title: "The rise of mammals",
    description:
      "With the dinosaurs gone, mammals rapidly diversify into the ecological niches left empty. Whales return to the sea. Bats take to the air. Primates develop in the forests. The world fills with warm blooded, social, curious animals.",
    perspective:
      "Blue whales, bats and humans all evolved in the 66 million years since the asteroid.",
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
      "In Africa, our line splits from the line that leads to chimpanzees. Our early relatives walk upright, with smaller brains than later humans. Whether the very first of them made tools is not known.",
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
      "Early humans were using fire by about this time, though when they could light and keep it every day is still argued over. Fire gave warmth, safety and, in time, cooked food.",
    perspective:
      "Every campfire, candle and electric light carries on something early humans were already doing about a million years ago.",
    color: "#E8803A",
    icon: "zap",
  },
  {
    id: "homo-sapiens",
    era: "humanity",
    when: "300,000 years ago",
    title: "Homo sapiens appears",
    description:
      "Our own species appears in Africa. Signs of jewellery, burial and art turn up gradually across later sites, and new finds keep changing the picture.",
    perspective:
      "People like us have been around for about 300,000 years. Writing covers less than the last 2% of that.",
    color: "#C8A96E",
    icon: "users",
  },
  {
    id: "out-of-africa",
    era: "humanity",
    when: "70,000 years ago",
    title: "The great migration",
    description:
      "Groups of modern humans leave Africa more than once. One large wave gave rise to much of the ancestry of people living outside Africa today. Along the way they met, and had children with, Neanderthals, Denisovans and others.",
    perspective:
      "All living humans share deep African ancestry. Later migrations and mixing made our family tree more like a network than a single line.",
    color: "#B89060",
    icon: "map",
  },
  {
    id: "civilization",
    era: "humanity",
    when: "12,000 years ago",
    title: "Settled societies expand",
    description:
      "Humans domesticate plants and animals and begin to build permanent settlements. Cities follow, and writing appears about 5,000 years ago. What we call history begins, though our species had existed for some 295,000 years before anyone wrote anything down.",
    perspective:
      "Farming began about 12,000 years ago. Art and music go back much further.",
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
      "Most of the hydrogen in your body was made in the first moments of the universe. Most of your other atoms were made inside stars.",
    perspective:
      "This is where the timeline reaches today. Everything after this is a forecast.",
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
      "Nobody can say what life will be like a thousand years from now. Our tools, and the way we live, may be almost unrecognisable.",
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
      "Vega was last near the pole about 14,000 years ago, when people everywhere were still hunting and gathering.",
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
      "Today the Moon and the Sun look almost exactly the same size in our sky. That is a coincidence, and it will not last.",
    color: "#C8C8D8",
    icon: "circle",
  },
  {
    id: "milky-way-merger",
    era: "future",
    when: "Several billion years from now, timing uncertain",
    title: "A possible Andromeda encounter",
    description:
      "Andromeda is heading towards the Milky Way. Newer measurements make a direct collision in the next few billion years uncertain. If the two do meet, it will take billions of years to play out.",
    perspective:
      "Even in a merger, the stars would almost never hit each other, because the gaps between them are so large. The gas clouds would collide.",
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
