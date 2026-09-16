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
  scale: string;
  question: string;
};

export type ObservatoryEntry = ObservatoryEntryBase & ScientificItem;

const OBSERVATORY_ENTRIES_BASE: ObservatoryEntryBase[] = [
  {
    id: "andromeda",
    location: "Andromeda Galaxy",
    locationDetail: "Our nearest major galactic neighbour",
    distance: "2.537 million light years",
    reflection:
      "Light reaching Earth from Andromeda began its journey before modern humans existed. It carries information from a galaxy whose stars predate our species by millions of years.",
    scale:
      "If the universe's age were compressed into one year, the entirety of recorded human history would occupy the last 12 seconds of December 31st.",
    question:
      "What would you do differently if you truly felt how brief and rare your moment here is?",
  },
  {
    id: "voyager",
    location: "Voyager 1",
    locationDetail: "The most distant human-made object",
    distance: "Tens of billions of kilometres from Earth",
    reflection:
      "A machine no heavier than a small car, launched in 1977, is now travelling through interstellar space beyond the heliosphere. It has not yet passed the Solar System's distant Oort Cloud. It carries a golden record with sounds and images from Earth.",
    scale:
      "Voyager has been traveling since 1977 and has barely left our cosmic neighborhood. The nearest star is still more than 1,500 times farther away.",
    question: "What would you want humanity to be remembered for?",
  },
  {
    id: "pillars",
    location: "Pillars of Creation",
    locationDetail: "Eagle Nebula — stellar nursery",
    distance: "6,500 light years",
    reflection:
      "These towering columns of gas and dust are regions of active star formation. The light we see left roughly 6,500 years before it reached Earth, so every image is a view into the past.",
    scale:
      "The tallest Pillar of Creation is four light years tall — roughly the distance from Earth to our nearest star neighbor.",
    question:
      "What is being born in you right now, even if it doesn't look like much yet?",
  },
  {
    id: "sagittarius-a",
    location: "Sagittarius A*",
    locationDetail: "Supermassive black hole at the Milky Way's center",
    distance: "26,000 light years",
    reflection:
      "At the heart of our galaxy sits a black hole about four million times the mass of our Sun. Nearby stars orbit it directly; farther out, including our Sun, stars orbit the Milky Way's total distributed mass. The Sun takes roughly 230 million years to circle the galaxy.",
    scale:
      "The last time our Sun was in the position it is today, the first dinosaurs were only just appearing on Earth.",
    question:
      "What would change about your daily concerns if you felt yourself orbiting something vast?",
  },
  {
    id: "proxima",
    location: "Proxima Centauri",
    locationDetail: "The nearest star beyond our Sun",
    distance: "4.24 light years",
    reflection:
      "The closest star to Earth beyond our own Sun is 4.24 light years away — so near, in cosmic terms, and yet a journey there at Voyager 1's speed would take some 75,000 years. The distances between stars dwarf anything in human experience.",
    scale:
      "If the Sun were the size of a grapefruit and placed in Los Angeles, Proxima Centauri would be another grapefruit in Washington D.C.",
    question:
      "What vast distance in your own life might actually be smaller than it appears?",
  },
  {
    id: "pale-blue-dot",
    location: "Earth — seen from 6 billion kilometers",
    locationDetail: "The Pale Blue Dot",
    distance: "6 billion kilometers from the Sun",
    reflection:
      "In 1990, as Voyager 1 was leaving the solar system, Carl Sagan convinced NASA to turn its camera back toward Earth. Our planet appeared as a fraction of a single pixel — a pale blue dot suspended in a sunbeam. Every empire, every war, every act of love and cruelty in all of human history occupied that point.",
    scale:
      "Earth is a fraction of a pixel in the portrait Voyager 1 took. All of human history fits inside a single point of light.",
    question:
      "Seen from that distance, what would you want the story of your life to add to that blue dot?",
  },
  {
    id: "betelgeuse",
    location: "Betelgeuse",
    locationDetail: "Red supergiant in Orion — nearing supernova",
    distance: "650 light years",
    reflection:
      "Betelgeuse is a red supergiant so large that, if placed at the center of our solar system, its surface would extend beyond Mars and perhaps toward Jupiter; its exact size and distance remain difficult to measure. It is expected to end as a supernova, but astronomers cannot predict when.",
    scale:
      "Betelgeuse has existed for less than 10 million years — far younger than our 4.5-billion-year-old Sun. Yet it has lived so fast and bright it is already dying.",
    question:
      "What would you do if you burned brighter and shorter, rather than dim and long?",
  },
  {
    id: "bootes-void",
    location: "The Boötes Void",
    locationDetail: "A vast near-emptiness in the cosmic web",
    distance: "700 million light years",
    reflection:
      "The Boötes Void is a vast, unusually underdense region of the cosmic web, roughly hundreds of millions of light-years across. It is not completely empty: galaxies have been observed inside it, just far fewer than in denser regions.",
    scale:
      "If our Milky Way were the size of a coin, the Boötes Void would be the length of a football pitch.",
    question:
      "Where in your life might emptiness actually be a form of clarity?",
  },
  {
    id: "cosmic-background",
    location: "The Cosmic Microwave Background",
    locationDetail: "Light from 380,000 years after the Big Bang",
    distance: "45.7 billion light years",
    reflection:
      "The faint hiss of cosmic microwave radiation that permeates all of space is the afterglow of the Big Bang — light from 380,000 years after the universe began. It is the oldest light we can observe, and it surrounds us in every direction, right now, passing through your body as you read this.",
    scale:
      "This light has been traveling for 13.8 billion years. Your entire lifespan, viewed against that journey, is too brief to measure.",
    question:
      "If the universe has been unfolding for 13.8 billion years just to arrive at this moment, what does this moment deserve?",
  },
  {
    id: "orion-nebula",
    location: "The Orion Nebula",
    locationDetail: "A stellar nursery visible to the naked eye",
    distance: "1,344 light years",
    reflection:
      "The Orion Nebula is a stellar nursery where hundreds of new stars are being born right now. It is visible to the naked eye on a clear night — a smudge of light below Orion's belt. You are looking at creation in progress, a cosmic maternity ward 1,344 light years away.",
    scale:
      "The Orion Nebula is 24 light years across. Our entire solar system — the Sun and all its planets — is less than one light day wide.",
    question:
      "What in your life is still in the process of being born, not yet fully formed?",
  },
  {
    id: "titan",
    location: "Titan",
    locationDetail: "Saturn's moon — world with lakes and weather",
    distance: "1.2 billion kilometers",
    reflection:
      "Saturn's moon Titan has clouds, rain, rivers, and lakes of liquid methane and ethane on its surface. Beneath the water-ice crust, evidence points to a global subsurface ocean of liquid water. It is familiar geography made from unfamiliar materials.",
    scale:
      "Titan is larger than Mercury. Its surface lakes contain hydrocarbons rather than water, while evidence points to a separate water-rich ocean beneath its icy crust.",
    question:
      "Where might you be seeing a situation through your own assumptions rather than its actual nature?",
  },
  {
    id: "crab-nebula",
    location: "Crab Nebula",
    locationDetail: "The remnant of a supernova seen in 1054 CE",
    distance: "6,500 light years",
    reflection:
      "In July 1054, Chinese astronomers recorded a 'guest star' so bright it was visible in daylight for 23 days. What they saw was a star dying — a supernova explosion 6,500 light years away. The expanding cloud we see today, the Crab Nebula, is that star's remains. At its center, a pulsar spins 30 times per second.",
    scale:
      "The Crab Nebula is still expanding at 1,500 kilometers per second — and has been since 1054 CE. A thousand years of constant explosion, and it is only 11 light years wide.",
    question:
      "What in your own life might be a kind of explosion — destructive on the surface, but seeding something new?",
  },
  {
    id: "kepler-442b",
    location: "Kepler-442b",
    locationDetail: "A super-Earth-size exoplanet in its star's habitable zone",
    distance: "1,200 light years",
    reflection:
      "Kepler-442b is about 1.34 times Earth's radius and orbits a K-type star in a region where surface liquid water could be possible under suitable atmospheric conditions. Its composition and atmosphere have not been measured, and there is no evidence that it hosts life.",
    scale:
      "A radio wave sent from Earth toward Kepler-442b right now would arrive 1,200 years from today — around the year 3226.",
    question:
      "If there is other life in the universe, what would you want them to know about what it meant to be human?",
  },
  {
    id: "europa",
    location: "Europa",
    locationDetail:
      "Jupiter's moon — strong evidence for an ocean beneath the ice",
    distance: "628 million kilometers",
    reflection:
      "Multiple lines of evidence point to a salty global ocean beneath Europa's icy shell, potentially holding more water than Earth's oceans. Tidal flexing can supply heat, making Europa a leading target in the search for habitable environments; no evidence of life there has been found.",
    scale:
      "Europa's ocean is thought to be 100 kilometers deep. The deepest point in Earth's oceans is 11 kilometers.",
    question:
      "Where might something vital be hidden beneath a cold or uninviting surface in your own life?",
  },
  {
    id: "messier-87",
    location: "Messier 87",
    locationDetail: "The galaxy whose black hole was first photographed",
    distance: "53 million light years",
    reflection:
      "In 2019, humanity took its first photograph of a black hole — the supermassive void at the center of Messier 87. The image took years of international collaboration and the computing power of a planet-sized telescope. For the first time in history, we saw the shadow of an object so dense that not even light can escape.",
    scale:
      "M87's black hole is 6.5 billion times the mass of our Sun. If it replaced our Sun, its event horizon would extend past the orbit of Neptune.",
    question:
      "What would you attempt if you truly believed that collective human effort could make the invisible visible?",
  },
  {
    id: "barnards-star",
    location: "Barnard's Star",
    locationDetail: "The star with the highest known proper motion",
    distance: "5.96 light years",
    reflection:
      "Barnard's Star has the highest measured proper motion against the background sky, enough for its plotted position to shift over a human lifetime. It is too faint to see without optical aid. We are not living in a static universe.",
    scale:
      "Its apparent motion is about ten arcseconds each year. Stellar trajectories are estimates and close approaches change over long timescales.",
    question:
      "What feels permanent in your life that is actually, slowly, moving?",
  },
  {
    id: "whirlpool-galaxy",
    location: "The Whirlpool Galaxy",
    locationDetail: "M51 — two interacting galaxies",
    distance: "31 million light years",
    reflection:
      "The Whirlpool Galaxy and its companion are interacting, with tidal forces shaping their stars and gas. They may eventually merge. Direct collisions between individual stars are extraordinarily unlikely because the distances between stars are so large.",
    scale:
      "Galaxies can pass through one another with very few direct star-to-star collisions. Their gas, dust, and gravitational fields still interact strongly.",
    question:
      "Where in your life might two forces that seem to be in collision actually have enough space to pass through each other?",
  },
  {
    id: "vega",
    location: "Vega",
    locationDetail: "The brightest star in Lyra — our former north star",
    distance: "25 light years",
    reflection:
      "Vega lay near Earth's north celestial pole thousands of years ago and will approach it again roughly twelve thousand years from now. Axial precession traces a cycle of about 26,000 years, so no pole star is permanent.",
    scale:
      "In the time it takes Earth's axis to complete one wobble, countless human civilizations rise and fall. What we consider permanent is measured against a very short ruler.",
    question:
      "What fixed point in your life might be slowly, invisibly shifting?",
  },
  {
    id: "lagoon-nebula",
    location: "The Lagoon Nebula",
    locationDetail: "A glowing cloud of creation in Sagittarius",
    distance: "4,100 light years",
    reflection:
      "The Lagoon Nebula glows pink because the intense radiation of newly-formed stars inside it ionizes hydrogen gas, causing it to emit light. What looks like a serene cloud is actually a violent, radiant process of birth — young stars screaming energy into their surroundings.",
    scale:
      "The Lagoon Nebula is 110 light years wide — so vast that the light we see from its far edge is over 100 years older than the light we see from its near edge.",
    question:
      "What in your life looks serene from the outside but is actually full of energy and transformation?",
  },
  {
    id: "hercules-corona-borealis",
    location: "Hercules-Corona Borealis Great Wall",
    locationDetail: "A proposed, highly contested large-scale pattern",
    distance: "10 billion light years",
    reflection:
      "A statistical clustering of gamma-ray bursts has been interpreted as a structure spanning several billion light-years. Whether it represents one physical object is disputed, and it should not be treated as a confirmed cosmic wall.",
    scale:
      "The reported scale is one reason researchers question whether the clustering represents a coherent physical structure rather than a statistical pattern.",
    question:
      "What assumptions are you making about how things should be that the universe has never agreed to?",
  },
  {
    id: "tau-ceti",
    location: "Tau Ceti",
    locationDetail: "A nearby Sun-like star with reported planet candidates",
    distance: "11.9 light years",
    reflection:
      "Tau Ceti is a nearby star broadly similar to the Sun. Researchers have reported several planet candidates from subtle changes in its radial velocity, but the candidate list and their properties depend on difficult signal analysis. No life has been detected there.",
    scale:
      "A message sent to Tau Ceti today would arrive in 11.9 years. Any reply would reach us 23.8 years from now. Our nearest conversations with the cosmos are measured in decades.",
    question:
      "If someone 12 light years away could observe your life, what would they see?",
  },
  {
    id: "ring-nebula",
    location: "The Ring Nebula",
    locationDetail: "A dying star's final gift",
    distance: "2,300 light years",
    reflection:
      "The Ring Nebula is the glowing material expelled by a Sun-like star as it ran out of fuel. The Sun is expected to pass through a broadly similar planetary-nebula stage in about five billion years, though it would not reproduce this object's exact shape. A hot white dwarf remains at the Ring Nebula's center.",
    scale:
      "The Ring Nebula is about one light year across. The dying star at its center is smaller than Earth, yet what it has released encircles an entire light year of space.",
    question:
      "What would you want your life to release into the world as it comes to its natural end?",
  },
  {
    id: "carina-nebula",
    location: "The Carina Nebula",
    locationDetail: "Home to some of the most massive stars known",
    distance: "7,500 light years",
    reflection:
      "The Carina Nebula contains exceptionally massive and luminous stars, including the unstable Eta Carinae system. Eta Carinae is expected eventually to end in a supernova or related stellar explosion, but its timing and exact outcome are uncertain.",
    scale:
      "Eta Carinae releases as much energy in 6 seconds as our Sun releases in an entire year. Some things simply operate at a different scale.",
    question:
      "Where are you operating at less than your full scale, and what would it look like to not hold back?",
  },
  {
    id: "perseus-cluster",
    location: "The Perseus Galaxy Cluster",
    locationDetail: "Pressure waves in a cluster's hot gas",
    distance: "250 million light years",
    reflection:
      "X-ray observations revealed ripples in the Perseus Cluster's hot gas that researchers interpreted as pressure waves driven by its central black hole. Converted to a pitch, their frequency is about a B-flat 57 octaves below middle C — far below human hearing.",
    scale:
      "The Perseus Cluster contains thousands of galaxies. The sound wave crossing it takes 10 million years per cycle — longer than the entire existence of our genus, Homo.",
    question:
      "What would you hear if you could tune in to the frequencies that your daily noise is drowning out?",
  },
  {
    id: "cat-eye-nebula",
    location: "The Cat's Eye Nebula",
    locationDetail: "A complex planetary nebula",
    distance: "3,300 light years",
    reflection:
      "The Cat's Eye Nebula is one of the most complex planetary nebulae known — concentric shells, jets, and knots of gas expelled by a dying star over thousands of years. Each layer marks a different epoch in the star's death. It is a record written in light, preserved in space.",
    scale:
      "The outermost shell of the Cat's Eye Nebula is about half a light year across — nearly 5 trillion kilometers — yet the whole structure took only a few thousand years to form.",
    question:
      "What layers of your own history, visible or not, have shaped the person looking at the stars tonight?",
  },
  {
    id: "galactic-center",
    location: "The Center of the Milky Way",
    locationDetail: "The heart of our galaxy, hidden by dust",
    distance: "26,000 light years",
    reflection:
      "The center of our galaxy is hidden from optical telescopes by clouds of dust and gas, but visible in infrared and radio waves. Stars there orbit the central black hole in years, not millions of years. Time, gravity, and density are extreme — a place so different from our corner of the galaxy it might as well be another universe.",
    scale:
      "Stars near the galactic center orbit Sagittarius A* at speeds of up to 25 million kilometers per hour. Our own Sun moves at just 800,000 km/h in its orbit.",
    question:
      "What would change about your perspective if you could suddenly see your life from its center, rather than its edge?",
  },
  {
    id: "cosmic-web",
    location: "The Cosmic Web",
    locationDetail: "The large-scale structure of the universe",
    distance: "Spanning the observable universe",
    reflection:
      "At the largest scales, galaxies gather into filaments and sheets separated by vast voids. Images can resemble neural networks or fungal mycelium, but that visual similarity does not mean the systems share a physical mechanism.",
    scale:
      "The cosmic web spans billions of light years. The voids between filaments can be 300 million light years across — and yet, within those filaments, individual human beings are constructing theories that describe the whole.",
    question:
      "What structure in your own life — invisible to you day to day — might be more beautiful than you realize when seen from above?",
  },
  {
    id: "eridanus-void",
    location: "The Eridanus Supervoid",
    locationDetail: "A proposed supervoid aligned with the CMB Cold Spot",
    distance: "1 billion light years",
    reflection:
      "Galaxy surveys have found an underdense region in the direction of the cosmic microwave background Cold Spot. Its size and ability to explain the Cold Spot remain debated; current evidence does not support exotic-universe explanations.",
    scale:
      "If the entire observable universe were a city, the Eridanus Void would be a neighborhood-sized park. The universe has room for absences as grand as its structures.",
    question:
      "What are you avoiding looking at — a void in your own life that might actually be worth exploring?",
  },
  {
    id: "edge-observable",
    location: "The Edge of the Observable Universe",
    locationDetail: "Our present cosmological horizon",
    distance: "46.5 billion light years",
    reflection:
      "Matter whose ancient light reaches us today is now estimated to be about 46.5 billion light-years away in comoving distance because space expanded while the light travelled for about 13.8 billion years. This is an observational horizon, not a known physical edge of the universe.",
    scale:
      "The observable radius is a present-day distance, not a destination a traveller could reach in 46.5 billion years; cosmic expansion changes the horizon throughout the journey.",
    question:
      "What is just beyond the horizon of what you can currently see or understand that might change everything?",
  },
  {
    id: "alpha-centauri",
    location: "Alpha Centauri",
    locationDetail: "Our nearest stellar system — three suns",
    distance: "4.37 light years",
    reflection:
      "Alpha Centauri is a three-star system: Alpha Centauri A and B orbit each other, while Proxima Centauri is a much wider companion and slightly closer to us. From there, our Sun would appear as a modest star in the northern constellation Cassiopeia.",
    scale:
      "Alpha Centauri A is Sun-like but more luminous than our Sun; replacing the Sun with it would materially change Earth's energy balance. The system is about 4.37 light-years away.",
    question:
      "To the universe, you are an unremarkable point of light. To the people who love you, you are a sun. Which of those truths do you live by?",
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
  "crab-nebula": ["nasaNebulae"],
  "kepler-442b": ["nasaKepler442b"],
  europa: ["nasaEuropa"],
  "messier-87": ["nasaGalaxies", "nasaBlackHoles"],
  "barnards-star": ["nasaBarnard"],
  "whirlpool-galaxy": ["nasaGalaxies"],
  vega: ["nasaStars", "esaGaia"],
  "lagoon-nebula": ["nasaNebulae"],
  "hercules-corona-borealis": ["greatWallPaper"],
  "tau-ceti": ["nasaStars", "nasaExoplanets"],
  "ring-nebula": ["nasaRingNebula", "nasaNebulae"],
  "carina-nebula": ["nasaNebulae"],
  "perseus-cluster": ["nasaGalaxies"],
  "cat-eye-nebula": ["nasaNebulae"],
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
  "ring-nebula",
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
