import {
  CONTENT_REVIEWED_AT,
  scientificMeta,
  ScientificItem,
  ScientificSourceId,
} from "@/constants/scientificContent";

type ObservatoryEntryBase = {
  id: string;
  location: string;
  locationDetail: string;
  distance: string;
  reflection: string;
};

export type ObservatoryEntry = ObservatoryEntryBase & ScientificItem;

const OBSERVATORY_ENTRIES_BASE: ObservatoryEntryBase[] = [
  {
    id: "andromeda",
    location: "Andromeda Galaxy",
    locationDetail: "Our nearest major galactic neighbour",
    distance: "2.5 million light years",
    reflection:
      "Light reaching Earth from Andromeda began its journey before modern humans existed. Tonight you see the galaxy as it was 2.5 million years ago.",
  },
  {
    id: "voyager",
    location: "Voyager 1",
    locationDetail: "The farthest thing people have made",
    distance: "About 26 billion kilometres from Earth",
    reflection:
      "A machine no heavier than a small car, launched in 1977, is now travelling through interstellar space beyond the heliosphere. It has not yet passed the Solar System's distant Oort Cloud. It carries a golden record with sounds and images from Earth.",
  },
  {
    id: "pillars",
    location: "Pillars of Creation",
    locationDetail: "Eagle Nebula, a stellar nursery",
    distance: "About 6,500 light years",
    reflection:
      "These towering columns of gas and dust are regions of active star formation. The light we see left them roughly 6,500 years ago, so every image is a view into the past.",
  },
  {
    id: "sagittarius-a",
    location: "Sagittarius A*",
    locationDetail: "The black hole at the centre of the Milky Way",
    distance: "26,000 light years",
    reflection:
      "At the heart of our galaxy sits a black hole about four million times the mass of our Sun. Nearby stars orbit it directly; farther out, including our Sun, stars orbit the Milky Way's total distributed mass. The Sun takes roughly 230 million years to circle the galaxy.",
  },
  {
    id: "proxima",
    location: "Proxima Centauri",
    locationDetail: "The nearest star beyond our Sun",
    distance: "4.24 light years",
    reflection:
      "The closest star beyond our own Sun is 4.24 light years away. At Voyager 1's speed, the journey would take about 75,000 years.",
  },
  {
    id: "pale-blue-dot",
    location: "Earth, seen from 6 billion kilometres",
    locationDetail: "The Pale Blue Dot",
    distance: "6 billion kilometres from the Sun",
    reflection:
      "In 1990, as Voyager 1 was leaving the solar system, Carl Sagan convinced NASA to turn its camera back toward Earth. Our planet appeared as less than a single pixel, caught in a ray of scattered sunlight.",
  },
  {
    id: "betelgeuse",
    location: "Betelgeuse",
    locationDetail: "The red supergiant at Orion's shoulder",
    distance: "About 550 to 700 light years",
    reflection:
      "Betelgeuse is a red supergiant so large that, placed where our Sun is, its surface would reach beyond Mars and perhaps towards Jupiter. Its exact size and distance are hard to measure. In 2025 astronomers reported a small companion star orbiting close to it.",
  },
  {
    id: "bootes-void",
    location: "The Boötes Void",
    locationDetail: "A huge, nearly empty region of the cosmic web",
    distance: "700 million light years",
    reflection:
      "The Boötes Void is a vast, unusually underdense region of the cosmic web, about 330 million light years across. It is not completely empty: galaxies have been observed inside it, just far fewer than in denser regions.",
  },
  {
    id: "cosmic-background",
    location: "The Cosmic Microwave Background",
    locationDetail: "Light from 380,000 years after the Big Bang",
    distance: "45.7 billion light years",
    reflection:
      "The faint hiss of cosmic microwave radiation that permeates all of space is the afterglow of the Big Bang, light from 380,000 years after the universe began. It is the oldest light we can observe, and it reaches us from every direction.",
  },
  {
    id: "orion-nebula",
    location: "The Orion Nebula",
    locationDetail: "A stellar nursery visible to the naked eye",
    distance: "1,344 light years",
    reflection:
      "The Orion Nebula is a stellar nursery where hundreds of new stars are being born right now. It is visible to the naked eye on a clear night, a smudge of light below Orion's belt.",
  },
  {
    id: "titan",
    location: "Titan",
    locationDetail: "Saturn's moon, a world with lakes and weather",
    distance: "About 1.4 billion kilometres",
    reflection:
      "Saturn's moon Titan has clouds, rain, rivers, and lakes of liquid methane and ethane on its surface. Beneath its crust of water ice, evidence points to a global subsurface ocean of liquid water.",
  },
  {
    id: "olympus-mons",
    location: "Olympus Mons",
    locationDetail: "The tallest volcano known in the Solar System",
    distance: "On Mars, about 225 million kilometres away on average",
    reflection:
      "Olympus Mons rises about 22 kilometres above the plains of Mars, around two and a half times the height of Everest. Its base is about 600 kilometres wide, enough to cover most of the British Isles.",
  },
  {
    id: "kepler-442b",
    location: "Kepler-442b",
    locationDetail:
      "A planet a little bigger than Earth, in its star's habitable zone",
    distance: "1,200 light years",
    reflection:
      "Kepler-442b is about 1.34 times Earth's radius and orbits an orange K type star in a region where surface liquid water could be possible under suitable atmospheric conditions. Its composition and atmosphere have not been measured, and there is no evidence that it hosts life.",
  },
  {
    id: "europa",
    location: "Europa",
    locationDetail:
      "Jupiter's moon, with strong evidence of an ocean beneath the ice",
    distance: "Between 590 and 970 million kilometres from Earth",
    reflection:
      "Multiple lines of evidence point to a salty global ocean beneath Europa's icy shell, potentially holding more water than Earth's oceans. Tidal flexing can supply heat, making Europa a leading target in the search for habitable environments; no evidence of life there has been found.",
  },
  {
    id: "messier-87",
    location: "Messier 87",
    locationDetail: "The galaxy whose black hole was first photographed",
    distance: "55 million light years",
    reflection:
      "In 2019, humanity took its first photograph of a black hole, the supermassive black hole at the centre of Messier 87. It took years of international work, linking observatories across the world into one telescope as wide as Earth. It showed the dark shadow of the black hole against the glowing gas around it.",
  },
  {
    id: "barnards-star",
    location: "Barnard's Star",
    locationDetail: "The star with the highest known proper motion",
    distance: "5.96 light years",
    reflection:
      "Barnard's Star has the highest measured proper motion against the background sky, enough for its plotted position to shift over a human lifetime. It is too faint to see without optical aid.",
  },
  {
    id: "whirlpool-galaxy",
    location: "The Whirlpool Galaxy",
    locationDetail: "M51, two interacting galaxies",
    distance: "31 million light years",
    reflection:
      "The Whirlpool Galaxy and its companion are interacting, with tidal forces shaping their stars and gas. They may eventually merge. Direct collisions between individual stars are extraordinarily unlikely because the distances between stars are so large.",
  },
  {
    id: "vega",
    location: "Vega",
    locationDetail: "The brightest star in Lyra, our former north star",
    distance: "25 light years",
    reflection:
      "Vega lay near Earth's north celestial pole thousands of years ago and will approach it again roughly twelve thousand years from now. Axial precession traces a cycle of about 26,000 years, so no pole star is permanent.",
  },
  {
    id: "lagoon-nebula",
    location: "The Lagoon Nebula",
    locationDetail: "A glowing cloud of creation in Sagittarius",
    distance: "4,100 light years",
    reflection:
      "The Lagoon Nebula glows pink because the intense radiation of newly formed stars inside it ionises hydrogen gas, causing it to emit light.",
  },
  {
    id: "hercules-corona-borealis",
    location: "Hercules-Corona Borealis Great Wall",
    locationDetail: "A proposed and much disputed giant pattern",
    distance: "10 billion light years",
    reflection:
      "A statistical clustering of gamma ray bursts has been interpreted as a structure spanning several billion light years. Whether it represents one physical object is disputed, and it should not be treated as a confirmed cosmic wall.",
  },
  {
    id: "tau-ceti",
    location: "Tau Ceti",
    locationDetail: "A nearby star like the Sun, with possible planets",
    distance: "11.9 light years",
    reflection:
      "Tau Ceti is a nearby star broadly similar to the Sun. Researchers have reported several planet candidates from subtle changes in its radial velocity, but the candidate list and their properties depend on difficult signal analysis. No life has been detected there.",
  },
  {
    id: "great-red-spot",
    location: "The Great Red Spot",
    locationDetail: "A storm on Jupiter wider than Earth",
    distance: "Between 590 and 970 million kilometres from Earth",
    reflection:
      "The Great Red Spot is a storm on Jupiter that is wider than our whole planet. People have watched it without a break since at least 1831, and it may be far older. In recent decades it has been slowly shrinking.",
  },
  {
    id: "carina-nebula",
    location: "The Carina Nebula",
    locationDetail: "Home to some of the most massive stars known",
    distance: "7,500 light years",
    reflection:
      "The Carina Nebula holds some of the most massive and luminous stars known, including the restless Eta Carinae system. In the 1840s Eta Carinae flared until it was one of the brightest stars in the night sky, then faded from view without a telescope.",
  },
  {
    id: "perseus-cluster",
    location: "The Perseus Galaxy Cluster",
    locationDetail: "Pressure waves in a cluster's hot gas",
    distance: "250 million light years",
    reflection:
      "X-ray observations revealed ripples in the Perseus Cluster's hot gas that researchers interpreted as pressure waves driven by its central black hole. Converted to a pitch, their frequency is about a B flat 57 octaves below middle C, far below human hearing.",
  },
  {
    id: "pleiades",
    location: "The Pleiades",
    locationDetail: "The Seven Sisters, a young star cluster in Taurus",
    distance: "444 light years",
    reflection:
      "The Pleiades are a family of stars born together about 100 million years ago, long after the first dinosaurs walked on Earth. Cultures across the world, from Aboriginal Australia to ancient Greece to Japan, tell stories about them. In Japan they are called Subaru.",
  },
  {
    id: "galactic-center",
    location: "The Centre of the Milky Way",
    locationDetail: "The heart of our galaxy, hidden by dust",
    distance: "26,000 light years",
    reflection:
      "The centre of our galaxy is hidden from optical telescopes by clouds of dust and gas, but visible in infrared and radio waves. Stars there orbit the central black hole in years, not millions of years.",
  },
  {
    id: "cosmic-web",
    location: "The Cosmic Web",
    locationDetail: "The shape of the universe on the largest scales",
    distance: "Spanning the observable universe",
    reflection:
      "At the largest scales, galaxies gather into filaments and sheets separated by vast voids. Images can resemble neural networks or fungal mycelium, but that visual similarity does not mean the systems share a physical mechanism.",
  },
  {
    id: "eridanus-void",
    location: "The Eridanus Supervoid",
    locationDetail: "A proposed supervoid aligned with the CMB Cold Spot",
    distance: "About 3 billion light years",
    reflection:
      "Galaxy surveys have found an underdense region in the direction of the cosmic microwave background Cold Spot. Its size and ability to explain the Cold Spot remain debated; current evidence does not support more exotic explanations.",
  },
  {
    id: "edge-observable",
    location: "The Edge of the Observable Universe",
    locationDetail: "Our present cosmological horizon",
    distance: "46.5 billion light years",
    reflection:
      "Matter whose ancient light reaches us today is now estimated to be about 46.5 billion light years away in comoving distance because space expanded while the light travelled for about 13.8 billion years. This is an observational horizon, not a known physical edge of the universe.",
  },
  {
    id: "alpha-centauri",
    location: "Alpha Centauri",
    locationDetail: "Our nearest stellar system, with three suns",
    distance: "4.37 light years",
    reflection:
      "Alpha Centauri is a system of three stars: Alpha Centauri A and B orbit each other, while Proxima Centauri is a much wider companion and slightly closer to us. From there, our Sun would appear as a modest star in the northern constellation Cassiopeia.",
  },
];

const OBSERVATORY_SOURCE_BY_ID: Partial<
  Record<string, readonly [ScientificSourceId, ...ScientificSourceId[]]>
> = {
  andromeda: ["nasaAndromeda"],
  voyager: ["nasaVoyager"],
  "pale-blue-dot": ["nasaVoyager"],
  pillars: ["nasaNebulae"],
  "sagittarius-a": ["nasaBlackHoles"],
  proxima: ["nasaProxima"],
  betelgeuse: ["nasaBetelgeuse"],
  "bootes-void": ["nasaGalaxies"],
  "cosmic-background": ["nasaCmb"],
  "orion-nebula": ["nasaNebulae"],
  titan: ["nasaTitan"],
  "olympus-mons": ["nasaSolarSystem"],
  "kepler-442b": ["nasaKepler442b"],
  europa: ["nasaEuropa"],
  "messier-87": ["nasaGalaxies", "nasaBlackHoles"],
  "barnards-star": ["nasaBarnard"],
  "whirlpool-galaxy": ["nasaGalaxies"],
  vega: ["nasaStars", "esaGaia"],
  "lagoon-nebula": ["nasaNebulae"],
  "hercules-corona-borealis": ["greatWallPaper"],
  "tau-ceti": ["nasaStars", "nasaExoplanets"],
  "great-red-spot": ["nasaSolarSystem"],
  "carina-nebula": ["nasaNebulae"],
  "perseus-cluster": ["nasaGalaxies"],
  pleiades: ["nasaStars"],
  "eridanus-void": ["eridanusStudy"],
  "edge-observable": ["nasaUniverseOverview"],
  "alpha-centauri": ["nasaAlphaCentauri"],
  "galactic-center": ["nasaMilkyWay", "nasaBlackHoles"],
  "cosmic-web": ["nasaGalaxies"],
};

const DISPUTED_OBSERVATORY_IDS = new Set([
  "hercules-corona-borealis",
  "eridanus-void",
]);

const MODEL_DEPENDENT_OBSERVATORY_IDS = new Set([
  "betelgeuse",
  "europa",
  "tau-ceti",
]);

export const OBSERVATORY_ENTRIES: ObservatoryEntry[] =
  OBSERVATORY_ENTRIES_BASE.map((entry) => ({
    ...entry,
    science:
      entry.id === "voyager"
        ? scientificMeta({
            classification: "dynamic",
            reviewedAt: CONTENT_REVIEWED_AT,
            reviewBy: "2027-09-16",
            sourceIds: ["nasaVoyager"],
            precisionNote:
              "Mission status and distance change; wording is reviewed annually.",
          })
        : scientificMeta({
            classification: DISPUTED_OBSERVATORY_IDS.has(entry.id)
              ? "disputed"
              : MODEL_DEPENDENT_OBSERVATORY_IDS.has(entry.id)
                ? "model-dependent"
                : "estimate",
            reviewedAt: CONTENT_REVIEWED_AT,
            sourceIds:
              OBSERVATORY_SOURCE_BY_ID[entry.id] ??
              (["nasaUniverseOverview"] as const),
            precisionNote:
              "Distances and sizes are rounded; reflective text is interpretation, not measurement.",
          }),
  }));

/**
 * The entry for a given date. The notification scheduler needs this for future
 * dates, so the day-of-year maths cannot read Date.now() directly.
 */
export function getEntryForDate(date: Date): ObservatoryEntry {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return OBSERVATORY_ENTRIES[dayOfYear % OBSERVATORY_ENTRIES.length];
}

export function getTodaysEntry(): ObservatoryEntry {
  return getEntryForDate(new Date());
}
