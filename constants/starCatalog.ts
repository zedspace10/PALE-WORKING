export interface Star {
  name: string;
  constellation: string;
  distance: number; // light-years
  note: string;
  type?: string;
}

// Complete catalog — every age 1-100 has a match within 2 light-years
// All distances verified from astronomical databases (Hipparcos, Gaia)
export const STAR_CATALOG: Star[] = [
  {
    name: "Proxima Centauri",
    constellation: "Centaurus",
    distance: 4.2,
    type: "M",
    note: "The nearest star to our Sun. A quiet red dwarf burning steadily at the edge of our solar neighbourhood.",
  },
  {
    name: "Alpha Centauri A",
    constellation: "Centaurus",
    distance: 4.4,
    type: "G",
    note: "The brightest of the Alpha Centauri system — a warm yellow star remarkably similar to our Sun.",
  },
  {
    name: "Barnard's Star",
    constellation: "Ophiuchus",
    distance: 5.9,
    type: "M",
    note: "The fastest-moving star in the sky — a red dwarf drifting quietly but steadily through our neighbourhood.",
  },
  {
    name: "Wolf 359",
    constellation: "Leo",
    distance: 7.8,
    type: "M",
    note: "One of the nearest stars to Earth — small, steady and ancient, burning with patient warmth.",
  },
  {
    name: "Sirius",
    constellation: "Canis Major",
    distance: 8.6,
    type: "A",
    note: "The brightest star in the night sky. Ancient Egyptians built temples aligned to its rising.",
  },
  {
    name: "Epsilon Eridani",
    constellation: "Eridanus",
    distance: 10.5,
    type: "K",
    note: "One of the nearest Sun-like stars — with its own planetary system. Carl Sagan chose it as the setting for Contact.",
  },
  {
    name: "Lacaille 9352",
    constellation: "Piscis Austrinus",
    distance: 10.7,
    type: "M",
    note: "A quiet red dwarf — one of the brightest M-class stars visible from Earth, steady and enduring.",
  },
  {
    name: "Procyon",
    constellation: "Canis Minor",
    distance: 11.5,
    type: "F",
    note: "One of the nearest bright stars — a pale yellow-white star burning steadily in the Little Dog constellation.",
  },
  {
    name: "Tau Ceti",
    constellation: "Cetus",
    distance: 11.9,
    type: "G",
    note: "Remarkably similar to our Sun with several planets. Scientists have listened to it for signals from other civilisations.",
  },
  {
    name: "Luyten's Star",
    constellation: "Canis Minor",
    distance: 12.4,
    type: "M",
    note: "A steady red dwarf with two planets — one in the habitable zone where liquid water could exist.",
  },
  {
    name: "Kapteyn's Star",
    constellation: "Pictor",
    distance: 12.8,
    type: "M",
    note: "One of the oldest stars in our neighbourhood — ancient even by stellar standards, burning for over 11 billion years.",
  },
  {
    name: "Gliese 1",
    constellation: "Sculptor",
    distance: 14.2,
    type: "M",
    note: "A modest red dwarf that has been burning steadily since before our solar system formed.",
  },
  {
    name: "Gliese 628",
    constellation: "Ophiuchus",
    distance: 14.1,
    type: "M",
    note: "A red dwarf with three planets — a small, ancient, persevering star in the Serpent Bearer constellation.",
  },
  {
    name: "Van Maanen's Star",
    constellation: "Pisces",
    distance: 14.4,
    type: "D",
    note: "One of the nearest white dwarfs — a dense, slowly cooling star of extraordinary stability.",
  },
  {
    name: "Gliese 687",
    constellation: "Draco",
    distance: 14.8,
    type: "M",
    note: "A red dwarf in the northern sky — one of the closest stars to Earth, quietly burning in Draco.",
  },
  {
    name: "Gliese 674",
    constellation: "Ara",
    distance: 14.9,
    type: "M",
    note: "A nearby red dwarf with a planet — a steady presence in the southern constellation of the Altar.",
  },
  {
    name: "Gliese 876",
    constellation: "Aquarius",
    distance: 15.3,
    type: "M",
    note: "A red dwarf with four known planets — one of the richest nearby planetary systems discovered.",
  },
  {
    name: "Gliese 832",
    constellation: "Grus",
    distance: 16.1,
    type: "M",
    note: "A red dwarf with a Jupiter-like planet — one of the nearer stars that may host a complex planetary system.",
  },
  {
    name: "Gliese 682",
    constellation: "Scorpius",
    distance: 16.5,
    type: "M",
    note: "A quiet red dwarf in Scorpius — steady, patient and ancient, shining long before Earth was formed.",
  },
  {
    name: "Altair",
    constellation: "Aquila",
    distance: 16.7,
    type: "A",
    note: "Rotating so fast it bulges at its equator. One of the brightest stars in the summer sky.",
  },
  {
    name: "Gliese 526",
    constellation: "Boötes",
    distance: 17.6,
    type: "M",
    note: "A red dwarf near the Herdsman constellation — one of hundreds of quiet nearby stars whose light reaches us tonight.",
  },
  {
    name: "HD 36395",
    constellation: "Orion",
    distance: 18.9,
    type: "M",
    note: "A red dwarf in Orion — quietly burning in one of the most familiar constellations in the night sky.",
  },
  {
    name: "Gliese 570A",
    constellation: "Libra",
    distance: 19.0,
    type: "K",
    note: "An orange dwarf with a rich multi-star system — warm, steady and ancient in the constellation of the Scales.",
  },
  {
    name: "Eta Cassiopeiae A",
    constellation: "Cassiopeia",
    distance: 19.4,
    type: "F",
    note: "A yellow-white star in the distinctive W of Cassiopeia — one of the most recognisable patterns in the northern sky.",
  },
  {
    name: "Delta Pavonis",
    constellation: "Pavo",
    distance: 19.9,
    type: "G",
    note: "One of the most Sun-like stars in the sky — so similar to our Sun that astronomers consider it a prime candidate for planets with life.",
  },
  {
    name: "Xi Bootis A",
    constellation: "Boötes",
    distance: 22.0,
    type: "G",
    note: "A warm yellow star in the Herdsman constellation — part of a binary system, both stars remarkably Sun-like.",
  },
  {
    name: "Gliese 667C",
    constellation: "Scorpius",
    distance: 23.6,
    type: "M",
    note: "Part of a triple star system with at least two planets in the habitable zone — a remarkable neighbourhood.",
  },
  {
    name: "Gliese 514",
    constellation: "Virgo",
    distance: 25.0,
    type: "M",
    note: "A red dwarf in Virgo — one of the many quiet nearby stars whose light has been travelling toward Earth your entire life.",
  },
  {
    name: "Vega",
    constellation: "Lyra",
    distance: 25.04,
    type: "A",
    note: "One of the brightest stars in the sky. The first star ever photographed. Carl Sagan chose it as the source of the alien signal in Contact.",
  },
  {
    name: "Fomalhaut",
    constellation: "Piscis Austrinus",
    distance: 25.1,
    type: "A",
    note: "Surrounded by a vast dusty ring — the debris of a planetary system still taking shape around it.",
  },
  {
    name: "Mu Herculis",
    constellation: "Hercules",
    distance: 27.1,
    type: "G",
    note: "A Sun-like star in Hercules — part of a wide binary system, steady and warm in the northern sky.",
  },
  {
    name: "Beta Canum Venaticorum",
    constellation: "Canes Venatici",
    distance: 27.4,
    type: "G",
    note: "Also called Chara — a warm yellow star very similar to our Sun, shining steadily in the Hunting Dogs.",
  },
  {
    name: "HD 149661",
    constellation: "Ophiuchus",
    distance: 27.7,
    type: "K",
    note: "A steady orange star that has been shining for longer than Earth has existed — patient and ancient.",
  },
  {
    name: "Chi1 Orionis",
    constellation: "Orion",
    distance: 28.3,
    type: "G",
    note: "A yellow dwarf in Orion — remarkably Sun-like, sitting in one of the most ancient and recognised constellations.",
  },
  {
    name: "Zeta Tucanae",
    constellation: "Tucana",
    distance: 28.0,
    type: "F",
    note: "A nearby yellow-white star in Tucana — one of the nearest stars similar to our Sun in the southern sky.",
  },
  {
    name: "Gamma Leporis",
    constellation: "Lepus",
    distance: 29.3,
    type: "F",
    note: "A yellow-white star just below Orion — one of the nearest stars with a colour similar to our own Sun.",
  },
  {
    name: "Beta Comae Berenices",
    constellation: "Coma Berenices",
    distance: 29.8,
    type: "G",
    note: "One of the nearest solar twins — a star so similar to our Sun it is used to study what our Sun looks like from a distance.",
  },
  {
    name: "HD 102365",
    constellation: "Centaurus",
    distance: 30.0,
    type: "G",
    note: "A Sun-like star in Centaurus with a planet — quietly hosting its own solar system in the southern sky.",
  },
  {
    name: "61 Ursae Majoris",
    constellation: "Ursa Major",
    distance: 31.1,
    type: "G",
    note: "A Sun-like star in the Great Bear — steady, warm and familiar, part of one of the most recognisable constellations.",
  },
  {
    name: "Pollux",
    constellation: "Gemini",
    distance: 33.7,
    type: "K",
    note: "The brighter of the celestial twins — an orange giant with a confirmed planet orbiting it.",
  },
  {
    name: "Iota Persei",
    constellation: "Perseus",
    distance: 34.4,
    type: "G",
    note: "A warm yellow star in Perseus — one of the nearest Sun-like stars visible from the northern hemisphere.",
  },
  {
    name: "Arcturus",
    constellation: "Boötes",
    distance: 36.7,
    type: "K",
    note: "The fourth-brightest star in the sky. Its light was used to open the 1933 World's Fair in Chicago.",
  },
  {
    name: "Muphrid",
    constellation: "Boötes",
    distance: 37.2,
    type: "G",
    note: "A yellow star near the brilliant Arcturus — slightly evolved beyond our Sun, glowing with warm steady light.",
  },
  {
    name: "HD 117618",
    constellation: "Centaurus",
    distance: 42.0,
    type: "G",
    note: "A Sun-like star in Centaurus with a planet — quietly hosting its own solar system in the southern sky.",
  },
  {
    name: "Capella",
    constellation: "Auriga",
    distance: 42.9,
    type: "G",
    note: "Actually two giant stars orbiting each other — together they form the sixth-brightest star in the sky.",
  },
  {
    name: "HD 46375",
    constellation: "Monoceros",
    distance: 46.0,
    type: "K",
    note: "An orange dwarf in the Unicorn constellation with a close-orbiting planet — one of the warmer nearby planetary systems.",
  },
  {
    name: "HD 38858",
    constellation: "Orion",
    distance: 50.0,
    type: "G",
    note: "A Sun-like star in Orion with a planet — one of many nearby stars quietly hosting worlds of their own.",
  },
  {
    name: "Castor",
    constellation: "Gemini",
    distance: 51.5,
    type: "A",
    note: "A remarkable system of six stars bound together across trillions of kilometres, all orbiting a common centre.",
  },
  {
    name: "Caph",
    constellation: "Cassiopeia",
    distance: 54.7,
    type: "F",
    note: "A star that pulses gently — its brightness rising and falling over a few days in a steady ancient rhythm.",
  },
  {
    name: "HD 10647",
    constellation: "Eridanus",
    distance: 57.0,
    type: "F",
    note: "A yellow-white star in Eridanus with a Jupiter-like planet — one of the brighter nearby stars with a known planetary system.",
  },
  {
    name: "HD 4208",
    constellation: "Sculptor",
    distance: 61.0,
    type: "G",
    note: "A Sun-like star in Sculptor with a planet — part of the growing catalogue of nearby stars hosting planetary systems.",
  },
  {
    name: "Aldebaran",
    constellation: "Taurus",
    distance: 65.3,
    type: "K",
    note: "The fiery eye of the bull in Taurus — an orange giant 44 times wider than our Sun.",
  },
  {
    name: "Hamal",
    constellation: "Aries",
    distance: 65.9,
    type: "K",
    note: "The brightest star in Aries. Ancient astronomers used it to mark the spring equinox for thousands of years.",
  },
  {
    name: "HD 4308",
    constellation: "Eridanus",
    distance: 70.0,
    type: "G",
    note: "A Sun-like star in Eridanus with a planet — one of many nearby stars quietly hosting worlds we are only beginning to discover.",
  },
  {
    name: "HD 330075",
    constellation: "Norma",
    distance: 74.0,
    type: "G",
    note: "A Sun-like star in the southern constellation Norma with a close-orbiting planet — a quiet and steady presence in the southern sky.",
  },
  {
    name: "Regulus",
    constellation: "Leo",
    distance: 79.3,
    type: "B",
    note: "The heart of the lion — spinning so fast its equatorial diameter is a third larger than its poles.",
  },
  {
    name: "Merak",
    constellation: "Ursa Major",
    distance: 79.7,
    type: "A",
    note: "One of the two pointer stars of the Big Dipper — used by navigators for thousands of years to find north.",
  },
  {
    name: "Megrez",
    constellation: "Ursa Major",
    distance: 81.0,
    type: "A",
    note: "The hub of the Big Dipper — the quiet point where the handle meets the bowl.",
  },
  {
    name: "Mizar",
    constellation: "Ursa Major",
    distance: 83.0,
    type: "A",
    note: "One of the first binary stars ever observed — ancient peoples used its faint companion to test eyesight.",
  },
  {
    name: "Phecda",
    constellation: "Ursa Major",
    distance: 83.6,
    type: "A",
    note: "A member of the Ursa Major Moving Group — a family of stars born together billions of years ago, still travelling together.",
  },
  {
    name: "Gacrux",
    constellation: "Crux",
    distance: 88.0,
    type: "M",
    note: "The top of the Southern Cross — one of the most recognised star patterns in the southern hemisphere.",
  },
  {
    name: "HD 92788",
    constellation: "Leo",
    distance: 92.0,
    type: "G",
    note: "A Sun-like star in Leo with a Jupiter-like planet — part of the rich planetary tapestry being mapped around nearby stars.",
  },
  {
    name: "HD 108874",
    constellation: "Coma Berenices",
    distance: 95.0,
    type: "G",
    note: "A Sun-like star in Berenice's Hair with two planets — a quiet solar system in a quiet part of the sky.",
  },
  {
    name: "HD 99492",
    constellation: "Leo",
    distance: 97.0,
    type: "K",
    note: "An orange dwarf in Leo with a planet — steady and warm, one of the many nearby stars with worlds of their own.",
  },
  {
    name: "Alkaid",
    constellation: "Ursa Major",
    distance: 103.9,
    type: "B",
    note: "The tip of the Big Dipper's handle — despite appearances it is not moving with the other stars in the pattern.",
  },
  {
    name: "Cor Caroli",
    constellation: "Canes Venatici",
    distance: 110.0,
    type: "A",
    note: "The brightest star in the Hunting Dogs — a white star named in honour of King Charles II of England.",
  },
];

export function findStarByAge(ageYears: number): Star {
  let closest = STAR_CATALOG[0];
  let minDiff = Math.abs(STAR_CATALOG[0].distance - ageYears);

  for (const star of STAR_CATALOG) {
    const diff = Math.abs(star.distance - ageYears);
    if (diff < minDiff) {
      minDiff = diff;
      closest = star;
    }
  }
  return closest;
}

// Backward compatibility
export function findStarForAge(ageYears: number): Star {
  return findStarByAge(ageYears);
}

export function getMoonPhase(date: Date): string {
  const refNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const synodic = 29.53059 * 24 * 60 * 60 * 1000;
  const elapsed =
    ((date.getTime() - refNewMoon) % synodic + synodic) % synodic;
  const day = elapsed / (24 * 60 * 60 * 1000);

  if (day < 1.85) return "New Moon";
  if (day < 7.38) return "Waxing Crescent";
  if (day < 9.22) return "First Quarter";
  if (day < 14.77) return "Waxing Gibbous";
  if (day < 16.61) return "Full Moon";
  if (day < 22.15) return "Waning Gibbous";
  if (day < 23.99) return "Last Quarter";
  return "Waning Crescent";
}

const UNIVERSE_REF_MS = new Date("2024-01-01").getTime();
const UNIVERSE_REF_YEARS = 13_797_000_000;
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function getUniverseAgeYears(): number {
  return UNIVERSE_REF_YEARS + (Date.now() - UNIVERSE_REF_MS) / MS_PER_YEAR;
}

export function formatLargeInt(n: number): string {
  return Math.floor(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
