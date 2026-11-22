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
    locationDetail: "The nearest big galaxy to ours",
    distance: "2.5 million light years",
    reflection:
      "The light reaching your eyes from Andromeda tonight set off 2.5 million years ago, before there were any modern humans to see it.",
  },
  {
    id: "voyager",
    location: "Voyager 1",
    locationDetail: "The farthest thing people have made",
    distance: "About 26 billion kilometres from Earth",
    reflection:
      "About the weight of a small car, launched in 1977. It has left the bubble of the Sun's wind, but has not yet reached the Oort Cloud, the distant edge of the Solar System. On 18 November 2026 it became a full light day away. It carries a golden record of sounds and pictures from Earth.",
  },
  {
    id: "pillars",
    location: "Pillars of Creation",
    locationDetail: "Eagle Nebula, where stars are forming",
    distance: "About 6,500 light years",
    reflection:
      "Columns of gas and dust light years tall, with new stars forming inside them. The light in every picture of them left about 6,500 years ago.",
  },
  {
    id: "sagittarius-a",
    location: "Sagittarius A*",
    locationDetail: "The black hole at the centre of the Milky Way",
    distance: "26,000 light years",
    reflection:
      "A black hole about four million times the mass of the Sun. The stars closest to it circle it in a few years. The Sun is far too far out to feel it much: it circles the whole galaxy instead, once every 230 million years or so.",
  },
  {
    id: "proxima",
    location: "Proxima Centauri",
    locationDetail: "The nearest star beyond the Sun",
    distance: "4.24 light years",
    reflection:
      "Its light takes 4.24 years to reach us. At Voyager 1's speed, getting there would take about 75,000 years.",
  },
  {
    id: "pale-blue-dot",
    location: "Earth, seen from 6 billion kilometres",
    locationDetail: "The Pale Blue Dot",
    distance: "6 billion kilometres from the Sun",
    reflection:
      "In 1990, as Voyager 1 headed out of the Solar System, Carl Sagan persuaded NASA to turn its camera back towards home. Earth came out smaller than a single pixel, sitting in a ray of scattered sunlight.",
  },
  {
    id: "betelgeuse",
    location: "Betelgeuse",
    locationDetail: "The red giant at Orion's shoulder",
    distance: "About 550 to 700 light years",
    reflection:
      "Put Betelgeuse where the Sun is and its surface would reach past Mars, maybe towards Jupiter. Its exact size and distance are hard to pin down. In 2025, astronomers reported a small star circling close to it.",
  },
  {
    id: "bootes-void",
    location: "The Boötes Void",
    locationDetail: "A huge, nearly empty stretch of space",
    distance: "700 million light years",
    reflection:
      "About 330 million light years across, with far fewer galaxies than it should have. Not quite empty: a few dozen have been found inside it.",
  },
  {
    id: "cosmic-background",
    location: "The Cosmic Microwave Background",
    locationDetail: "Light from 380,000 years after the Big Bang",
    distance: "45.7 billion light years",
    reflection:
      "The oldest light there is. It was released when the universe was 380,000 years old, and it still reaches us from every direction, as a faint glow of microwaves.",
  },
  {
    id: "orion-nebula",
    location: "The Orion Nebula",
    locationDetail: "A star nursery you can see without a telescope",
    distance: "1,344 light years",
    reflection:
      "Hundreds of new stars are forming here. On a clear night it shows as a soft smudge just below Orion's Belt.",
  },
  {
    id: "titan",
    location: "Titan",
    locationDetail: "Saturn's moon, with lakes and weather",
    distance: "About 1.4 billion kilometres",
    reflection:
      "Titan has clouds, rain, rivers and lakes, but they are made of methane and ethane. Under its icy crust there is probably an ocean of liquid water.",
  },
  {
    id: "olympus-mons",
    location: "Olympus Mons",
    locationDetail: "The tallest volcano known in the Solar System",
    distance: "On Mars, about 225 million kilometres away on average",
    reflection:
      "It stands about 22 km high, two and a half times the height of Everest. Its base is about 600 km wide, roughly the area of the British Isles.",
  },
  {
    id: "kepler-442b",
    location: "Kepler-442b",
    locationDetail:
      "A planet a little bigger than Earth",
    distance: "1,200 light years",
    reflection:
      "About a third wider than Earth, circling an orange star at a distance where water could be liquid. Nobody yet knows what it is made of, or whether it has any air.",
  },
  {
    id: "europa",
    location: "Europa",
    locationDetail:
      "Jupiter's moon, with an ocean under the ice",
    distance: "Between 590 and 970 million kilometres from Earth",
    reflection:
      "Under its icy shell there is very likely a salty ocean, holding more water than all of Earth's seas. Jupiter's pull flexes the moon and keeps it warm inside. No sign of life has been found there.",
  },
  {
    id: "messier-87",
    location: "Messier 87",
    locationDetail: "The galaxy whose black hole was first photographed",
    distance: "55 million light years",
    reflection:
      "In 2019, observatories all over the world worked together as one telescope the size of Earth. They captured the dark shadow of the black hole at the centre of this galaxy, against the glowing gas around it.",
  },
  {
    id: "barnards-star",
    location: "Barnard's Star",
    locationDetail: "The fastest moving star in our sky",
    distance: "5.96 light years",
    reflection:
      "No star moves across our sky faster. Its position shifts by about the width of the Moon in a lifetime. It is too faint to see without a telescope.",
  },
  {
    id: "whirlpool-galaxy",
    location: "The Whirlpool Galaxy",
    locationDetail: "M51, two galaxies pulling at each other",
    distance: "31 million light years",
    reflection:
      "The Whirlpool and its small companion are tugging on each other's stars and gas, and may one day merge. Even then, the stars themselves would almost never collide: there is that much space between them.",
  },
  {
    id: "vega",
    location: "Vega",
    locationDetail: "The bright star in Lyra, once our North Star",
    distance: "25 light years",
    reflection:
      "Earth's axis slowly wobbles, once every 26,000 years. Vega was near the North Pole of the sky about 14,000 years ago, and will be again in about 12,000 years.",
  },
  {
    id: "lagoon-nebula",
    location: "The Lagoon Nebula",
    locationDetail: "A glowing cloud where stars are forming",
    distance: "4,100 light years",
    reflection:
      "It glows pink because light from the young stars inside it makes the hydrogen gas shine.",
  },
  {
    id: "hercules-corona-borealis",
    location: "Hercules-Corona Borealis Great Wall",
    locationDetail: "A proposed giant structure, still disputed",
    distance: "10 billion light years",
    reflection:
      "A cluster of gamma ray bursts in one part of the sky has been read as a structure billions of light years long. Many astronomers doubt it is one real object.",
  },
  {
    id: "tau-ceti",
    location: "Tau Ceti",
    locationDetail: "A nearby star much like the Sun",
    distance: "11.9 light years",
    reflection:
      "A quiet star similar to ours, 11.9 light years away. Several possible planets have been reported around it, but they are hard to confirm. No sign of life has been found.",
  },
  {
    id: "great-red-spot",
    location: "The Great Red Spot",
    locationDetail: "A storm on Jupiter wider than Earth",
    distance: "Between 590 and 970 million kilometres from Earth",
    reflection:
      "A storm wider than our whole planet. People have watched it without a break since at least 1831. It has been slowly shrinking for decades.",
  },
  {
    id: "carina-nebula",
    location: "The Carina Nebula",
    locationDetail: "Home to some of the biggest stars known",
    distance: "7,500 light years",
    reflection:
      "Some of the most massive stars known live here, including Eta Carinae. In the 1840s it flared up to become one of the brightest stars in the sky, then faded out of sight.",
  },
  {
    id: "perseus-cluster",
    location: "The Perseus Galaxy Cluster",
    locationDetail: "A cluster of galaxies with a sound in its gas",
    distance: "250 million light years",
    reflection:
      "X-ray telescopes found ripples in the cluster's hot gas, pushed out by its central black hole. As a note, they would be a B flat about 57 octaves below middle C.",
  },
  {
    id: "pleiades",
    location: "The Pleiades",
    locationDetail: "The Seven Sisters, a young cluster in Taurus",
    distance: "444 light years",
    reflection:
      "A family of stars born together about 100 million years ago, long after the first dinosaurs. People all over the world have told stories about them. In Japan they are called Subaru.",
  },
  {
    id: "galactic-center",
    location: "The centre of the Milky Way",
    locationDetail: "The heart of our galaxy, hidden by dust",
    distance: "26,000 light years",
    reflection:
      "Dust hides the centre of our galaxy from ordinary telescopes, but infrared and radio light get through. Stars there race round the central black hole in years.",
  },
  {
    id: "cosmic-web",
    location: "The Cosmic Web",
    locationDetail: "The shape of the universe on the largest scales",
    distance: "Spanning the observable universe",
    reflection:
      "Galaxies are not spread out evenly. They gather along long threads and sheets, with huge empty spaces in between.",
  },
  {
    id: "eridanus-void",
    location: "The Eridanus Supervoid",
    locationDetail: "A possible giant void, still debated",
    distance: "About 3 billion light years",
    reflection:
      "Surveys have found fewer galaxies than expected in the direction of a cold patch in the oldest light. How big this region is, and whether it explains the cold patch, is still argued over.",
  },
  {
    id: "edge-observable",
    location: "The edge of the observable universe",
    locationDetail: "As far as we can see",
    distance: "46.5 billion light years",
    reflection:
      "The oldest light reaching us set off about 13.8 billion years ago. Space has stretched while it travelled, so where it came from is now about 46.5 billion light years away. This is the edge of what we can see, not the edge of the universe.",
  },
  {
    id: "alpha-centauri",
    location: "Alpha Centauri",
    locationDetail: "Our nearest neighbours, three stars",
    distance: "4.37 light years",
    reflection:
      "Three stars: Alpha Centauri A and B circle each other, and little Proxima, slightly closer to us, circles them both from far out. From there, our Sun would look like an ordinary star in Cassiopeia.",
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
