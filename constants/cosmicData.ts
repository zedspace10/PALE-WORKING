export interface Location {
  id: string;
  name: string;
  subtitle: string;
  distance: string;
  distanceRaw: string;
  reflection: string;
  scale: string;
  gradientColors: [string, string];
}

export interface DeepTimeEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  yearsAgo: string;
}

export interface CosmicEvent {
  year: number;
  title: string;
  description: string;
}

export const SHIFT_STAGES = [
  {
    title: "You are here.",
    subtitle: "A pale blue dot.\nOrbiting an ordinary star.\nIn one arm of one galaxy.",
    hint: "EARTH",
    circleColor: "#B8D4E8",
  },
  {
    title: "Our neighbourhood.",
    subtitle: "Eight planets.\nOne star.\nEveryone you have ever met\nlives within this circle.",
    hint: "SOLAR SYSTEM",
    circleColor: "#FFF3B0",
  },
  {
    title: "Four hundred billion stars.",
    subtitle: "Our Sun is one of them.\nLost in one arm.\nUnremarkable.\nEssential.",
    hint: "THE MILKY WAY",
    circleColor: "#9966FF",
  },
  {
    title: "Fifty-four galaxies.",
    subtitle: "Held together by gravity.\nDrifting as one\nthrough the cosmos.\nThe Milky Way is one\nof the smaller ones.",
    hint: "LOCAL GROUP",
    circleColor: "#4488FF",
  },
  {
    title: "Everything we can see.",
    subtitle: "Two trillion galaxies.\nNinety-three billion light-years\nin every direction.\nStill expanding.",
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
  "The atoms in your body were forged inside ancient stars.",
  "The light entering your eyes tonight may have begun its journey millions of years ago.",
  "Your problems are real. But they are not the entire universe.",
  "We are a way for the cosmos to know itself.",
  "From the perspective of the cosmos, all of human history is a brief flicker.",
  "You are stardust, contemplating the stars that made you.",
];

export const LOCATIONS: Location[] = [
  {
    id: "moon",
    name: "The Moon",
    subtitle: "Earth's ancient companion",
    distance: "384,400 km",
    distanceRaw: "1.3 light-seconds",
    reflection:
      "Every human who left our world passed through this barren landscape. Footprints remain there still — untouched, in silence, waiting for visitors who have not yet come.",
    scale: "3,474 km across — smaller than Australia",
    gradientColors: ["#1A1D2E", "#2D324F"],
  },
  {
    id: "mars",
    name: "Mars",
    subtitle: "The red world",
    distance: "225 million km",
    distanceRaw: "12.5 light-minutes",
    reflection:
      "Mars has watched sunrises for four billion years. Long before life stirred on Earth, it observed the same Sun rise over silent, rust-colored plains.",
    scale: "6,779 km across — half the size of Earth",
    gradientColors: ["#2D1A14", "#5C3020"],
  },
  {
    id: "saturn",
    name: "Saturn",
    subtitle: "The ringed giant",
    distance: "1.2 billion km",
    distanceRaw: "70 light-minutes",
    reflection:
      "The rings are made of ice and rock — remnants of moons torn apart by gravity. They will vanish in a hundred million years, as if they were never there.",
    scale: "116,460 km across — nine Earths wide",
    gradientColors: ["#2A2510", "#4A4020"],
  },
  {
    id: "galactic-center",
    name: "The Galactic Center",
    subtitle: "Heart of the Milky Way",
    distance: "26,000 light-years",
    distanceRaw: "26,000 light-years",
    reflection:
      "At the center of our galaxy lies a black hole four million times the mass of our Sun. It has been there since before Earth existed, patient and still.",
    scale: "The densest region of our galaxy",
    gradientColors: ["#1A0A25", "#3D1550"],
  },
  {
    id: "andromeda",
    name: "Andromeda",
    subtitle: "Our nearest galactic neighbor",
    distance: "2.5 million light-years",
    distanceRaw: "2.5 million light-years",
    reflection:
      "The light you see from Andromeda tonight left before modern humans existed. In four billion years, it will collide with the Milky Way — a slow, magnificent merging.",
    scale: "Twice the size of our galaxy — one trillion stars",
    gradientColors: ["#0A1530", "#1A2D5A"],
  },
  {
    id: "nebula",
    name: "Pillars of Creation",
    subtitle: "Where stars are born",
    distance: "6,500 light-years",
    distanceRaw: "6,500 light-years",
    reflection:
      "These towering columns of gas and dust are stellar nurseries — the birthplaces of suns. Some may already be destroyed; we just haven't seen the light yet.",
    scale: "5 light-years tall — 30 trillion km high",
    gradientColors: ["#0D1A25", "#143040"],
  },
  {
    id: "black-hole",
    name: "Sagittarius A*",
    subtitle: "A black hole at our center",
    distance: "26,000 light-years",
    distanceRaw: "26,000 light-years",
    reflection:
      "Not even light escapes. Where matter crosses the event horizon, time itself slows to a stop — a place where the known laws of physics cease to hold.",
    scale: "44 million km across — three times the Sun",
    gradientColors: ["#06060A", "#0F0F1E"],
  },
  {
    id: "edge",
    name: "The Observable Edge",
    subtitle: "As far as light can reach",
    distance: "46 billion light-years",
    distanceRaw: "46 billion light-years",
    reflection:
      "Beyond this horizon, the universe continues — but its light hasn't had time to reach us. We live inside a bubble of everything we can ever know.",
    scale: "The absolute limit of human knowledge",
    gradientColors: ["#08051A", "#100838"],
  },
];

export const DEEP_TIME_CALENDAR: DeepTimeEvent[] = [
  {
    id: "big-bang",
    date: "January 1",
    title: "The Big Bang",
    description:
      "The universe begins. All of space, time, matter, and energy emerges from a single point of infinite density.",
    yearsAgo: "13.8 billion years ago",
  },
  {
    id: "milky-way",
    date: "January 22",
    title: "The Milky Way forms",
    description:
      "Our home galaxy assembles from vast clouds of gas and dark matter, slowly spinning into the shape we know.",
    yearsAgo: "13.2 billion years ago",
  },
  {
    id: "solar-system",
    date: "March 16",
    title: "Our Solar System is born",
    description:
      "A cloud of gas and dust collapses under its own gravity. The Sun ignites, and the planets form from what remains.",
    yearsAgo: "4.6 billion years ago",
  },
  {
    id: "earth",
    date: "May 4",
    title: "Earth forms",
    description:
      "A rocky world takes shape — still molten, bombarded by debris, yet carrying the seeds of everything to come.",
    yearsAgo: "4.5 billion years ago",
  },
  {
    id: "life",
    date: "February 28",
    title: "First life appears",
    description:
      "Simple microbes emerge in ancient oceans. The universe becomes aware of itself, faintly, for the first time.",
    yearsAgo: "3.8 billion years ago",
  },
  {
    id: "oxygen",
    date: "July 9",
    title: "Oxygen fills the atmosphere",
    description:
      "Cyanobacteria transform the world. A catastrophe for most life at the time — and the birth of everything that follows.",
    yearsAgo: "2.5 billion years ago",
  },
  {
    id: "multicellular",
    date: "October 2",
    title: "Multicellular life emerges",
    description:
      "For the first time, many cells cooperate as one organism. Complexity becomes possible.",
    yearsAgo: "600 million years ago",
  },
  {
    id: "fish",
    date: "November 19",
    title: "First vertebrates",
    description:
      "Life acquires backbones. The ancestors of every fish, bird, mammal, and human yet to come.",
    yearsAgo: "530 million years ago",
  },
  {
    id: "dinosaurs",
    date: "December 13",
    title: "Age of Dinosaurs",
    description:
      "Reptiles dominate the land. They will reign for 165 million years — the longest dynasty in Earth's history.",
    yearsAgo: "250 million years ago",
  },
  {
    id: "extinction",
    date: "December 26",
    title: "The great extinction",
    description:
      "An asteroid ends the age of dinosaurs. Mammals survive in the darkness. Our chapter begins.",
    yearsAgo: "66 million years ago",
  },
  {
    id: "humans",
    date: "Dec 31, 11:52 PM",
    title: "Modern humans appear",
    description:
      "Homo sapiens emerge. Tool-makers, storytellers, question-askers. The cosmos looks at itself and wonders.",
    yearsAgo: "200,000 years ago",
  },
  {
    id: "civilization",
    date: "Dec 31, 11:59:46 PM",
    title: "Civilization begins",
    description:
      "Cities, writing, agriculture. In the final 14 seconds of the year, all of recorded human history unfolds.",
    yearsAgo: "12,000 years ago",
  },
];

export const COSMIC_EVENTS: CosmicEvent[] = [
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
    description: "Revealed the depth and beauty of the cosmos in full.",
  },
  {
    year: 1995,
    title: "First exoplanet confirmed",
    description: "Other stars have worlds too.",
  },
  {
    year: 2004,
    title: "Mars rovers explore the surface",
    description: "We walked another planet's surface, by proxy.",
  },
  {
    year: 2016,
    title: "Gravitational waves detected",
    description: "We heard two black holes collide, a billion years ago.",
  },
  {
    year: 2019,
    title: "First image of a black hole",
    description: "We finally saw the unseeable.",
  },
  {
    year: 2021,
    title: "James Webb Space Telescope",
    description: "Peering 13 billion years back in time.",
  },
  {
    year: 2023,
    title: "Water detected on an exoplanet",
    description: "The ingredients for life, found elsewhere.",
  },
];
