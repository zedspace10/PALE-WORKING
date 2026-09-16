export type ScientificClassification =
  "fact" | "estimate" | "model-dependent" | "disputed" | "dynamic" | "poetic";

export interface ScientificSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
}

export const SCIENTIFIC_SOURCES = {
  nasaUniverseOverview: {
    id: "nasa-universe-overview",
    title: "Universe Overview",
    url: "https://science.nasa.gov/universe/overview/",
    publisher: "NASA Science",
  },
  nasaBigBang: {
    id: "nasa-big-bang-qa",
    title: "Big Bang Q&A",
    url: "https://science.nasa.gov/mission/webb/big-bang-q-and-a/",
    publisher: "NASA Science",
  },
  nasaGlossary: {
    id: "nasa-universe-glossary",
    title: "Universe Glossary",
    url: "https://science.nasa.gov/universe/glossary/",
    publisher: "NASA Science",
  },
  nasaUniverseAge: {
    id: "nasa-universe-age",
    title: "What is the Universe?",
    url: "https://science.nasa.gov/exoplanets/what-is-the-universe/",
    publisher: "NASA Science",
  },
  nasaMoonPhases: {
    id: "nasa-moon-phases",
    title: "Moon Phases",
    url: "https://science.nasa.gov/moon/moon-phases/",
    publisher: "NASA Science",
  },
  nasaMoonFacts: {
    id: "nasa-moon-facts",
    title: "Moon Facts",
    url: "https://science.nasa.gov/moon/facts/",
    publisher: "NASA Science",
  },
  nasaProxima: {
    id: "nasa-proxima-centauri",
    title: "Proxima Centauri",
    url: "https://science.nasa.gov/asset/hubble/proxima-centauri/",
    publisher: "NASA Science",
  },
  nasaBarnard: {
    id: "nasa-barnards-star",
    title: "Barnard's Star",
    url: "https://astrobiology.nasa.gov/news/barnards-star/",
    publisher: "NASA Astrobiology",
  },
  nasaVoyager: {
    id: "nasa-voyager-faq",
    title: "Voyager Frequently Asked Questions",
    url: "https://science.nasa.gov/mission/voyager/frequently-asked-questions/",
    publisher: "NASA Science",
  },
  nasaDoubleCluster: {
    id: "nasa-double-cluster",
    title: "Double Cluster in Perseus",
    url: "https://science.nasa.gov/image-detail/double-cluster-in-perseus/",
    publisher: "NASA Science",
  },
  nasaBarycenter: {
    id: "nasa-barycenter",
    title: "What Is a Barycenter?",
    url: "https://spaceplace.nasa.gov/barycenter/en/",
    publisher: "NASA Space Place",
  },
  nasaAndromeda: {
    id: "nasa-andromeda-future",
    title: "Hubble Casts Doubt on Galactic Collision",
    url: "https://science.nasa.gov/missions/hubble/apocalypse-when-hubble-casts-doubt-on-certainty-of-galactic-collision/",
    publisher: "NASA Science",
  },
  nasaSolarSystem: {
    id: "nasa-solar-system",
    title: "Our Solar System",
    url: "https://science.nasa.gov/solar-system/",
    publisher: "NASA Science",
  },
  nasaSolarSystemFormation: {
    id: "nasa-solar-system-formation",
    title: "Solar System: Facts and Formation",
    url: "https://science.nasa.gov/solar-system/solar-system-facts/",
    publisher: "NASA Science",
  },
  nasaMoonFormation: {
    id: "nasa-moon-formation",
    title: "Moon Formation",
    url: "https://science.nasa.gov/moon/formation/",
    publisher: "NASA Science",
  },
  nasaStars: {
    id: "nasa-stars",
    title: "Stars",
    url: "https://science.nasa.gov/universe/stars/",
    publisher: "NASA Science",
  },
  nasaNebulae: {
    id: "nasa-nebulae",
    title: "Hubble's Nebulae",
    url: "https://science.nasa.gov/mission/hubble/science/universe-uncovered/hubble-nebulae/",
    publisher: "NASA Science",
  },
  nasaGalaxies: {
    id: "nasa-galaxies",
    title: "Galaxies",
    url: "https://science.nasa.gov/universe/galaxies/",
    publisher: "NASA Science",
  },
  nasaExoplanets: {
    id: "nasa-exoplanets",
    title: "Exoplanets",
    url: "https://science.nasa.gov/exoplanets/",
    publisher: "NASA Science",
  },
  nasaKepler442b: {
    id: "nasa-kepler-442b",
    title: "Kepler-442 b",
    url: "https://science.nasa.gov/exoplanet-catalog/kepler-442-b/",
    publisher: "NASA Science",
  },
  nasaTitan: {
    id: "nasa-titan-facts",
    title: "Titan Facts",
    url: "https://science.nasa.gov/saturn/moons/titan/facts/",
    publisher: "NASA Science",
  },
  nasaEuropa: {
    id: "nasa-europa-facts",
    title: "Europa Facts",
    url: "https://science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/",
    publisher: "NASA Science",
  },
  nasaRingNebula: {
    id: "nasa-ring-nebula",
    title: "Messier 57: The Ring Nebula",
    url: "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-57/",
    publisher: "NASA Science",
  },
  nasaMilkyWay: {
    id: "nasa-milky-way",
    title: "The Milky Way Galaxy",
    url: "https://science.nasa.gov/universe/galaxies/our-milky-way-galaxy/",
    publisher: "NASA Science",
  },
  nasaBetelgeuse: {
    id: "nasa-betelgeuse",
    title: "What Is Betelgeuse?",
    url: "https://science.nasa.gov/universe/what-is-betelgeuse-inside-the-strange-volatile-star/",
    publisher: "NASA Science",
  },
  nasaAlphaCentauri: {
    id: "nasa-alpha-centauri",
    title: "Alpha Centauri in Centaurus",
    url: "https://science.nasa.gov/resource/alpha-centauri-in-the-constellation-of-centaurus-the-centaur/",
    publisher: "NASA Science",
  },
  nasaCmb: {
    id: "nasa-cosmic-background",
    title: "Cosmic Microwave Background",
    url: "https://science.nasa.gov/universe/cosmology/cosmic-microwave-background/",
    publisher: "NASA Science",
  },
  nasaBlackHoles: {
    id: "nasa-black-holes",
    title: "Black Holes",
    url: "https://science.nasa.gov/universe/black-holes/",
    publisher: "NASA Science",
  },
  greatWallPaper: {
    id: "great-wall-paper",
    title: "Possible Structure at Redshift Two",
    url: "https://arxiv.org/abs/1311.1104",
    publisher: "Monthly Notices of the Royal Astronomical Society",
  },
  eridanusStudy: {
    id: "eridanus-supervoid-study",
    title: "Detection of a Supervoid Aligned with the CMB Cold Spot",
    url: "https://academic.oup.com/mnras/article/450/1/288/992031",
    publisher: "Monthly Notices of the Royal Astronomical Society",
  },
  noaaTwilight: {
    id: "noaa-twilight",
    title: "Solar Calculation Glossary",
    url: "https://gml.noaa.gov/grad/solcalc/glossary.html",
    publisher: "NOAA Global Monitoring Laboratory",
  },
  esaGaia: {
    id: "esa-gaia-catalogue",
    title: "Gaia Data Release 3",
    url: "https://www.cosmos.esa.int/web/gaia/dr3",
    publisher: "European Space Agency",
  },
  smithsonianHumanOrigins: {
    id: "smithsonian-human-origins",
    title: "Human Evolution Research",
    url: "https://humanorigins.si.edu/research",
    publisher: "Smithsonian Institution",
  },
  smithsonianDeepTime: {
    id: "smithsonian-deep-time",
    title: "David H. Koch Hall of Fossils – Deep Time",
    url: "https://naturalhistory.si.edu/exhibits/david-h-koch-hall-fossils-deep-time",
    publisher: "Smithsonian National Museum of Natural History",
  },
  nasaAstrobiologyStrategy: {
    id: "nasa-astrobiology-strategy",
    title: "NASA Astrobiology Strategy",
    url: "https://astrobiology.nasa.gov/uploads/filer_public/01/28/01283266-e401-4dcb-8e05-3918b21edb79/nasa_astrobiology_strategy_2015_151008.pdf",
    publisher: "NASA Astrobiology",
  },
  nasaHistory: {
    id: "nasa-history",
    title: "NASA History",
    url: "https://www.nasa.gov/history/",
    publisher: "NASA",
  },
  ligoFirstDetection: {
    id: "ligo-first-detection",
    title: "Observation of Gravitational Waves from a Binary Black Hole Merger",
    url: "https://www.ligo.org/science/Publication-GW150914/",
    publisher: "LIGO Scientific Collaboration",
  },
  ehtFirstImage: {
    id: "eht-first-image",
    title: "Astronomers Capture First Image of a Black Hole",
    url: "https://eventhorizontelescope.org/press-release-april-10-2019-astronomers-capture-first-image-black-hole",
    publisher: "Event Horizon Telescope Collaboration",
  },
  nasaWebb: {
    id: "nasa-webb",
    title: "James Webb Space Telescope",
    url: "https://science.nasa.gov/mission/webb/",
    publisher: "NASA Science",
  },
  nasaWebbCarbonDioxide: {
    id: "nasa-webb-carbon-dioxide",
    title: "Webb Detects Carbon Dioxide in an Exoplanet Atmosphere",
    url: "https://science.nasa.gov/missions/webb/nasas-webb-detects-carbon-dioxide-in-exoplanet-atmosphere/",
    publisher: "NASA Science",
  },
} as const satisfies Record<string, ScientificSource>;

export type ScientificSourceId = keyof typeof SCIENTIFIC_SOURCES;

interface ScientificMetaBase {
  sourceIds: readonly [ScientificSourceId, ...ScientificSourceId[]];
  reviewedAt: string;
  precisionNote?: string;
  conditions?: readonly string[];
}

export type ScientificContentMeta =
  | (ScientificMetaBase & {
      classification: "dynamic";
      reviewBy: string;
    })
  | (ScientificMetaBase & {
      classification: Exclude<ScientificClassification, "dynamic">;
      reviewBy?: string;
    });

export interface ScientificItem {
  id: string;
  science: ScientificContentMeta;
}

export interface CanonicalClaim {
  itemId: string;
  subject: string;
  property: string;
  value: string;
}

export const CONTENT_REVIEWED_AT = "2026-09-16";

export function scientificMeta(
  meta: ScientificContentMeta,
): ScientificContentMeta {
  return meta;
}

export function getScientificSources(
  meta: ScientificContentMeta,
): ScientificSource[] {
  return meta.sourceIds.map((id) => SCIENTIFIC_SOURCES[id]);
}

export function getSourceAccessibilityLabel(source: ScientificSource): string {
  return `Open source: ${source.title}, ${source.publisher}`;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function validateScientificItems(
  collectionName: string,
  items: readonly ScientificItem[],
  now: Date = new Date(),
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const today = now.toISOString().slice(0, 10);

  for (const item of items) {
    const prefix = `${collectionName}:${item.id || "<missing-id>"}`;
    if (!item.id.trim()) errors.push(`${prefix} is missing a stable id`);
    if (ids.has(item.id)) errors.push(`${prefix} duplicates a stable id`);
    ids.add(item.id);

    const meta = item.science;
    if (!meta) {
      errors.push(`${prefix} is missing scientific metadata`);
      continue;
    }
    if (!isIsoDate(meta.reviewedAt)) {
      errors.push(`${prefix} has an invalid reviewedAt date`);
    }
    if (!meta.sourceIds.length) {
      errors.push(`${prefix} has no primary source`);
    }
    for (const sourceId of meta.sourceIds) {
      if (!SCIENTIFIC_SOURCES[sourceId]) {
        errors.push(`${prefix} references unknown source ${sourceId}`);
      }
    }
    if (meta.classification === "dynamic") {
      if (!isIsoDate(meta.reviewBy)) {
        errors.push(`${prefix} has an invalid reviewBy date`);
      } else if (meta.reviewBy < today) {
        errors.push(`${prefix} expired on ${meta.reviewBy}`);
      }
    }
  }

  return errors;
}

export function validateCanonicalClaims(
  claims: readonly CanonicalClaim[],
): string[] {
  const errors: string[] = [];
  const canonical = new Map<string, CanonicalClaim>();

  for (const claim of claims) {
    const key = `${claim.subject}:${claim.property}`;
    const existing = canonical.get(key);
    if (existing && existing.value !== claim.value) {
      errors.push(
        `${claim.itemId} contradicts ${existing.itemId} for ${key}: ${claim.value} != ${existing.value}`,
      );
      continue;
    }
    canonical.set(key, claim);
  }

  return errors;
}
