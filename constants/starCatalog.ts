import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
} from "@/constants/scientificContent";

interface StarBase {
  name: string;
  constellation: string;
  distance: number; // light years
  note: string;
  type?: string;
  /** Visual apparent magnitude. Omitted where this catalogue has not reviewed it. */
  apparentMagnitude?: number;
}

export interface Star extends StarBase, ScientificItem {}

// Distances are in light years, sourced from Gaia DR2/DR3 parallaxes.
// Sorted by distance ascending.
const STAR_CATALOG_BASE: StarBase[] = [
  {
    name: "Proxima Centauri",
    constellation: "Centaurus",
    distance: 4.2,
    type: "M",
    note: "The nearest known star to our Sun, a red dwarf whose flares can suddenly make it much brighter.",
  },
  {
    name: "Alpha Centauri A",
    constellation: "Centaurus",
    distance: 4.4,
    type: "G",
    note: "The brightest of the Alpha Centauri system, a warm yellow star remarkably similar to our Sun.",
  },
  {
    name: "Barnard's Star",
    constellation: "Ophiuchus",
    distance: 5.9,
    type: "M",
    note: "A nearby red dwarf that moves across the sky faster than any other star. It is too faint to see without a telescope.",
  },
  {
    name: "Wolf 359",
    constellation: "Leo",
    distance: 7.8,
    type: "M",
    note: "One of the nearest stars to Earth, a small, young red dwarf that flares without warning, brightening for minutes at a time.",
  },
  {
    name: "Sirius",
    constellation: "Canis Major",
    distance: 8.6,
    type: "A",
    note: "The brightest star in the night sky. In ancient Egypt its first rising before dawn each year marked the start of the Nile flood.",
  },
  {
    name: "Epsilon Eridani",
    constellation: "Eridanus",
    distance: 10.5,
    type: "K",
    note: "One of the nearest stars with a planet of its own. In 1960 it became one of the first two stars ever searched for signals from another civilisation.",
  },
  {
    name: "Lacaille 9352",
    constellation: "Piscis Austrinus",
    distance: 10.7,
    type: "M",
    note: "One of the brightest red dwarfs in our sky, though still too faint for the naked eye. Two planets a little bigger than Earth were found around it in 2020.",
  },
  {
    name: "Procyon",
    constellation: "Canis Minor",
    distance: 11.5,
    type: "F",
    note: "One of the nearest bright stars, a pale yellow white star in Canis Minor, the Little Dog.",
  },
  {
    name: "Tau Ceti",
    constellation: "Cetus",
    distance: 11.9,
    type: "G",
    note: "Remarkably similar to our Sun, with several candidate planets. Scientists have listened to it for signals from other civilisations.",
  },
  {
    name: "Luyten's Star",
    constellation: "Canis Minor",
    distance: 12.4,
    type: "M",
    note: "A red dwarf with at least two planets, one in the zone where liquid water could exist.",
  },
  {
    name: "Kapteyn's Star",
    constellation: "Pictor",
    distance: 12.8,
    type: "M",
    note: "One of the oldest stars near the Sun, about 11 billion years old.",
  },
  {
    name: "Gliese 628",
    constellation: "Ophiuchus",
    distance: 14.1,
    type: "M",
    note: "A red dwarf with three planets, in Ophiuchus, the Serpent Bearer.",
  },
  {
    name: "Gliese 1",
    constellation: "Sculptor",
    distance: 14.2,
    type: "M",
    note: "A red dwarf in Sculptor, probably older than the Sun.",
  },
  {
    name: "Van Maanen's Star",
    constellation: "Pisces",
    distance: 14.4,
    type: "D",
    note: "One of the nearest white dwarfs, a dense, slowly cooling star of extraordinary stability.",
  },
  {
    name: "Gliese 687",
    constellation: "Draco",
    distance: 14.8,
    type: "M",
    note: "A red dwarf in Draco, one of the closest stars to Earth in the northern sky.",
  },
  {
    name: "Gliese 674",
    constellation: "Ara",
    distance: 14.9,
    type: "M",
    note: "A nearby red dwarf with a planet, in Ara, the Altar, in the southern sky.",
  },
  {
    name: "Gliese 876",
    constellation: "Aquarius",
    distance: 15.3,
    type: "M",
    note: "A red dwarf with four known planets, one of the fullest planetary systems near the Sun.",
  },
  {
    name: "Gliese 832",
    constellation: "Grus",
    distance: 16.1,
    type: "M",
    note: "A red dwarf with a giant planet much like Jupiter, in Grus, the Crane.",
  },
  {
    name: "Gliese 682",
    constellation: "Scorpius",
    distance: 16.5,
    type: "M",
    note: "A red dwarf in Scorpius, too faint to see without a telescope.",
  },
  {
    name: "Altair",
    constellation: "Aquila",
    distance: 16.7,
    type: "A",
    note: "It spins so fast that it bulges at its equator. One of the brightest stars in the summer sky.",
  },
  {
    name: "Gliese 526",
    constellation: "Boötes",
    distance: 17.6,
    type: "M",
    note: "A red dwarf in Boötes, the Herdsman, one of the hundreds of small stars close to the Sun.",
  },
  {
    name: "HD 36395",
    constellation: "Orion",
    distance: 18.9,
    type: "M",
    note: "A red dwarf in Orion, too faint to see without a telescope.",
  },
  {
    name: "Gliese 570A",
    constellation: "Libra",
    distance: 19,
    type: "K",
    note: "An orange dwarf in Libra, the Scales, part of a system of four stars.",
  },
  {
    name: "Eta Cassiopeiae A",
    constellation: "Cassiopeia",
    distance: 19.4,
    type: "G",
    note: "A yellow star near the W of Cassiopeia, a little bigger and brighter than the Sun.",
  },
  {
    name: "Delta Pavonis",
    constellation: "Pavo",
    distance: 19.9,
    type: "G",
    note: "One of the nearest stars much like the Sun, high on astronomers' lists of places to look for planets like Earth.",
  },
  {
    name: "Xi Bootis A",
    constellation: "Boötes",
    distance: 22,
    type: "G",
    note: "A warm yellow star in the Herdsman constellation, part of a binary system, circling a cooler orange companion.",
  },
  {
    name: "Gliese 667C",
    constellation: "Scorpius",
    distance: 23.6,
    type: "M",
    note: "Part of a triple star system, with a planet in the zone where liquid water could exist.",
  },
  {
    name: "Gliese 514",
    constellation: "Virgo",
    distance: 25,
    type: "M",
    note: "A red dwarf in Virgo. The light reaching us from it tonight left about 25 years ago.",
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
    note: "Surrounded by a vast ring of dust and ice, debris left over from building its planets.",
  },
  {
    name: "Mu Herculis",
    constellation: "Hercules",
    distance: 27.1,
    type: "G",
    note: "A star a little older and larger than the Sun, in Hercules, with faint companions.",
  },
  {
    name: "Beta Canum Venaticorum",
    constellation: "Canes Venatici",
    distance: 27.4,
    type: "G",
    note: "Also called Chara, a yellow star very similar to our Sun, in Canes Venatici, the Hunting Dogs.",
  },
  {
    name: "Zeta Tucanae",
    constellation: "Tucana",
    distance: 28,
    type: "F",
    note: "A yellow white star in Tucana, one of the nearest stars like the Sun in the southern sky.",
  },
  {
    name: "Chi1 Orionis",
    constellation: "Orion",
    distance: 28.3,
    type: "G",
    note: "A yellow star in Orion, very like the Sun but much younger.",
  },
  {
    name: "Gamma Leporis",
    constellation: "Lepus",
    distance: 29.3,
    type: "F",
    note: "A yellow white star in Lepus, the Hare, just below Orion.",
  },
  {
    name: "Beta Comae Berenices",
    constellation: "Coma Berenices",
    distance: 29.8,
    type: "G",
    note: "A star very like the Sun, slightly bigger and brighter, in Coma Berenices.",
  },
  {
    name: "HD 102365",
    constellation: "Centaurus",
    distance: 30,
    type: "G",
    note: "A star like the Sun in Centaurus, with at least one planet.",
  },
  {
    name: "61 Ursae Majoris",
    constellation: "Ursa Major",
    distance: 31.1,
    type: "G",
    note: "A star like the Sun in Ursa Major, the Great Bear.",
  },
  {
    name: "HD 149661",
    constellation: "Ophiuchus",
    distance: 32.3,
    type: "K",
    note: "An orange dwarf in the Serpent Bearer, covered in starspots that shift its brightness as it turns.",
  },
  {
    name: "Pollux",
    constellation: "Gemini",
    distance: 33.7,
    type: "K",
    note: "The brighter of the celestial twins, an orange giant with a confirmed planet orbiting it.",
  },
  {
    name: "Iota Persei",
    constellation: "Perseus",
    distance: 34.4,
    type: "G",
    note: "A yellow star in Perseus, one of the nearest stars like the Sun that you can see from the north.",
  },
  {
    name: "Arcturus",
    constellation: "Boötes",
    distance: 36.7,
    type: "K",
    note: "The fourth brightest star in the night sky. Its light was used to switch on the 1933 World's Fair in Chicago.",
  },
  {
    name: "Muphrid",
    constellation: "Boötes",
    distance: 37.2,
    type: "G",
    note: "A yellow star near Arcturus, a little older and larger than the Sun.",
  },
  {
    name: "Capella",
    constellation: "Auriga",
    distance: 42.9,
    type: "G",
    note: "Really two giant stars orbiting each other. Together they look like the sixth brightest star in the sky.",
  },
  {
    name: "HD 38858",
    constellation: "Orion",
    distance: 50,
    type: "G",
    note: "A star like the Sun in Orion, just visible to the naked eye under a very dark sky, with a ring of dust around it.",
  },
  {
    name: "Castor",
    constellation: "Gemini",
    distance: 51.5,
    type: "A",
    note: "A system of six stars, in three pairs, all held together by gravity.",
  },
  {
    name: "Caph",
    constellation: "Cassiopeia",
    distance: 54.7,
    type: "F",
    note: "A variable star whose brightness changes on a cycle of a few hours.",
  },
  {
    name: "HD 10647",
    constellation: "Eridanus",
    distance: 57,
    type: "F",
    note: "A yellow white star in Eridanus with a giant planet much like Jupiter.",
  },
  {
    name: "HD 99492",
    constellation: "Leo",
    distance: 59.2,
    type: "K",
    note: "An orange dwarf in Leo with a planet, the fainter half of a wide double star.",
  },
  {
    name: "Aldebaran",
    constellation: "Taurus",
    distance: 65.3,
    type: "K",
    note: "The eye of the bull in Taurus, an orange giant 44 times wider than our Sun.",
  },
  {
    name: "Hamal",
    constellation: "Aries",
    distance: 65.9,
    type: "K",
    note: "The brightest star in Aries. About 2,000 years ago the spring equinox lay in Aries, which is why astronomers still call that point the First Point of Aries.",
  },
  {
    name: "HD 4308",
    constellation: "Tucana",
    distance: 71.9,
    type: "G",
    note: "A star like the Sun in Tucana, the Toucan, with three known planets.",
  },
  {
    name: "Regulus",
    constellation: "Leo",
    distance: 79.3,
    type: "B",
    note: "The heart of the lion, spinning so fast that it is about a third wider at its equator than from pole to pole.",
  },
  {
    name: "Merak",
    constellation: "Ursa Major",
    distance: 79.7,
    type: "A",
    note: "One of the two pointer stars of the Big Dipper, used by navigators for thousands of years to find north.",
  },
  {
    name: "Megrez",
    constellation: "Ursa Major",
    distance: 81,
    type: "A",
    note: "The hub of the Big Dipper, the quiet point where the handle meets the bowl.",
  },
  {
    name: "Mizar",
    constellation: "Ursa Major",
    distance: 83,
    type: "A",
    note: "One of the first double stars seen through a telescope. People once used its faint neighbour, Alcor, as a test of good eyesight.",
  },
  {
    name: "Phecda",
    constellation: "Ursa Major",
    distance: 83.6,
    type: "A",
    note: "A member of the Ursa Major Moving Group, a family of stars born together a few hundred million years ago, still travelling together.",
  },
  {
    name: "Gacrux",
    constellation: "Crux",
    distance: 88,
    type: "M",
    note: "The top of the Southern Cross, one of the best known star patterns in the southern sky.",
  },
  {
    name: "HD 46375",
    constellation: "Monoceros",
    distance: 96.5,
    type: "K",
    note: "An orange star in Monoceros, the Unicorn, with a planet that orbits very close to it.",
  },
  {
    name: "Alkaid",
    constellation: "Ursa Major",
    distance: 103.9,
    type: "B",
    note: "The tip of the Big Dipper's handle. Despite appearances, it is not moving with most of the other stars in the pattern.",
  },
  {
    name: "Cor Caroli",
    constellation: "Canes Venatici",
    distance: 110,
    type: "A",
    note: "The brightest star in the Hunting Dogs, a white star named in the 1600s for the heart of a king, though which King Charles is still argued over.",
  },
  {
    name: "HD 4208",
    constellation: "Sculptor",
    distance: 111.2,
    type: "G",
    note: "A star like the Sun in Sculptor, named Cocibolca, with a giant planet.",
  },
  {
    name: "HD 92788",
    constellation: "Sextans",
    distance: 113.1,
    type: "G",
    note: "A star like the Sun in Sextans, the Sextant, with a giant planet much like Jupiter.",
  },
  {
    name: "HD 117618",
    constellation: "Centaurus",
    distance: 122.9,
    type: "G",
    note: "A star like the Sun in Centaurus, named Dofida, with a planet.",
  },
  {
    name: "HD 330075",
    constellation: "Norma",
    distance: 147.9,
    type: "G",
    note: "A yellow star in Norma, the first star where the HARPS instrument found a planet.",
  },
  {
    name: "HD 108874",
    constellation: "Coma Berenices",
    distance: 194.5,
    type: "G",
    note: "A star like the Sun in Coma Berenices, Berenice's Hair, with two planets.",
  },
];

const STAR_CATALOG_SCIENCE = scientificMeta({
  classification: "estimate",
  reviewedAt: CONTENT_REVIEWED_AT,
  sourceIds: ["esaGaia"],
  precisionNote:
    "Distances are rounded from catalogue measurements and can change as astrometry improves.",
});

const REVIEWED_APPARENT_MAGNITUDES: Record<string, number> = {
  "Proxima Centauri": 11.13,
  "Alpha Centauri A": -0.01,
  "Barnard's Star": 9.54,
  Sirius: -1.46,
  Procyon: 0.34,
  Altair: 0.77,
  Vega: 0.03,
  Fomalhaut: 1.16,
  Arcturus: -0.05,
  Capella: 0.08,
  Castor: 1.58,
  Deneb: 1.25,
  Rigel: 0.13,
  Betelgeuse: 0.5,
  Aldebaran: 0.86,
  Spica: 0.97,
  Antares: 1.06,
  Regulus: 1.35,
  Canopus: -0.74,
  Polaris: 1.98,
};

// Colour words for each spectral type, so the card says what the star looks like before naming
// its type.
const TYPE_WORDS: Record<string, string> = {
  B: "a hot blue white type B star",
  A: "a white type A star",
  F: "a yellow white type F star",
  G: "a yellow type G star, like our Sun",
  K: "an orange type K star",
  M: "a small red type M star",
  D: "a white dwarf",
};

// The app shows this plain, checked line rather than the longer notes above, which are kept as
// reference for each star.
function getCatalogNote(star: StarBase): string {
  const typeDescription = TYPE_WORDS[star.type ?? ""] ?? "a star";
  return `${star.name} is ${typeDescription} in ${star.constellation}, roughly ${star.distance} light years from Earth.`;
}

export const STAR_CATALOG: Star[] = STAR_CATALOG_BASE.map((star) => ({
  ...star,
  note: getCatalogNote(star),
  apparentMagnitude: REVIEWED_APPARENT_MAGNITUDES[star.name],
  id: star.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  science:
    star.name === "Proxima Centauri"
      ? scientificMeta({
          classification: "fact",
          reviewedAt: CONTENT_REVIEWED_AT,
          sourceIds: ["nasaProxima", "esaGaia"],
          conditions: ["Not visible to the unaided eye"],
        })
      : star.name === "Barnard's Star"
        ? scientificMeta({
            classification: "fact",
            reviewedAt: CONTENT_REVIEWED_AT,
            sourceIds: ["nasaBarnard", "esaGaia"],
            conditions: ["Not visible to the unaided eye"],
          })
        : STAR_CATALOG_SCIENCE,
}));

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

export function getMoonPhase(date: Date): string {
  const refNewMoon = new Date("2000-01-06T18:14:00Z").getTime();
  const synodic = 29.53059 * 24 * 60 * 60 * 1000;
  const elapsed =
    (((date.getTime() - refNewMoon) % synodic) + synodic) % synodic;
  // Eight equal slices of the cycle, each centred on its phase, so the night of a full Moon is
  // called full rather than gibbous.
  const slice = Math.round((elapsed / synodic) * 8) % 8;
  return [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent",
  ][slice];
}
