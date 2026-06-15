export type ObservatoryEntry = {
  id: string;
  location: string;
  locationDetail: string;
  distance: string;
  reflection: string;
  quote: string;
  quoteAuthor: string;
  scale: string;
  question: string;
};

export const OBSERVATORY_ENTRIES: ObservatoryEntry[] = [
  {
    id: "andromeda",
    location: "Andromeda Galaxy",
    locationDetail: "Our nearest galactic neighbor",
    distance: "2.537 million light years",
    reflection:
      "The light reaching your eyes from Andromeda tonight began its journey before modern humans walked the Earth. Every photon is a message from a civilization of stars that predates our species by millions of years.",
    quote:
      "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    quoteAuthor: "Carl Sagan",
    scale:
      "If the universe's age were compressed into one year, the entirety of recorded human history would occupy the last 14 seconds of December 31st.",
    question:
      "What would you do differently if you truly felt how brief and rare your moment here is?",
  },
  {
    id: "voyager",
    location: "Voyager 1",
    locationDetail: "The most distant human-made object",
    distance: "23 billion kilometers from Earth",
    reflection:
      "A machine no heavier than a small car, launched in 1977, is now drifting through interstellar space — the first human artifact to leave the solar system. It carries a golden record with the sounds of Earth, still traveling outward at 17 kilometers per second.",
    quote:
      "Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.",
    quoteAuthor: "Carl Sagan",
    scale:
      "Voyager has been traveling for nearly 50 years and has barely left our cosmic neighborhood. The nearest star is still 2,000 times farther away.",
    question: "What would you want humanity to be remembered for?",
  },
  {
    id: "pillars",
    location: "Pillars of Creation",
    locationDetail: "Eagle Nebula — stellar nursery",
    distance: "6,500 light years",
    reflection:
      "These towering columns of gas and dust, each one taller than our entire solar system is wide, are giving birth to new stars. The light we see left before the ancient Egyptians built their first monuments. The pillars themselves may already be gone — destroyed by a supernova we haven't seen yet.",
    quote:
      "Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.",
    quoteAuthor: "Carl Sagan",
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
      "At the heart of our galaxy sits a black hole four million times the mass of our Sun. Every star in the Milky Way — every one of the 300 billion — orbits around this invisible point of gravity. Our Sun completes one orbit every 225 million years.",
    quote:
      "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars.",
    quoteAuthor: "Carl Sagan",
    scale:
      "The last time our Sun was in the position it is today, dinosaurs had not yet appeared on Earth.",
    question:
      "What would change about your daily concerns if you felt yourself orbiting something vast?",
  },
  {
    id: "proxima",
    location: "Proxima Centauri",
    locationDetail: "The nearest star beyond our Sun",
    distance: "4.24 light years",
    reflection:
      "The closest star to Earth beyond our own Sun is 4.24 light years away — so near, in cosmic terms, and yet a journey there at the speed of our fastest spacecraft would take 73,000 years. The distances between stars dwarf anything in human experience.",
    quote:
      "Somewhere, something incredible is waiting to be known.",
    quoteAuthor: "Carl Sagan",
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
    quote:
      "Our planet is a lonely speck in the great enveloping cosmic dark. In our obscurity, in all this vastness, there is no hint that help will come from elsewhere to save us from ourselves.",
    quoteAuthor: "Carl Sagan",
    scale:
      "Earth is a fraction of a pixel in the portrait Voyager 1 took. All of human history fits inside a single point of light.",
    question:
      "Seen from that distance, what would you want the story of your life to add to that blue dot?",
  },
  {
    id: "betelgeuse",
    location: "Betelgeuse",
    locationDetail: "Red supergiant in Orion — nearing supernova",
    distance: "700 light years",
    reflection:
      "Betelgeuse is so massive that if placed at the center of our solar system, its surface would extend past the orbit of Jupiter. It is in the final stages of its life and will one day explode in a supernova visible in daylight. That explosion may have already happened — the light simply hasn't reached us yet.",
    quote:
      "We are the universe experiencing itself.",
    quoteAuthor: "Alan Watts",
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
      "The Boötes Void is a region of space 330 million light years across containing almost no galaxies. Where thousands of galaxies should exist, there is nearly nothing. Scientists still debate why. It is a reminder that the universe contains absences as profound as its presences.",
    quote:
      "In the middle of difficulty lies opportunity.",
    quoteAuthor: "Marcus Aurelius",
    scale:
      "If our Milky Way were the size of a coin, the Boötes Void would be the size of a continent.",
    question: "Where in your life might emptiness actually be a form of clarity?",
  },
  {
    id: "cosmic-background",
    location: "The Cosmic Microwave Background",
    locationDetail: "Light from 380,000 years after the Big Bang",
    distance: "45.7 billion light years",
    reflection:
      "The faint hiss of cosmic microwave radiation that permeates all of space is the afterglow of the Big Bang — light from 380,000 years after the universe began. It is the oldest light we can observe, and it surrounds us in every direction, right now, passing through your body as you read this.",
    quote:
      "The present moment always will have been.",
    quoteAuthor: "Marcus Aurelius",
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
    quote:
      "The beauty of things must be that they end.",
    quoteAuthor: "Carl Sagan",
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
      "Saturn's moon Titan has lakes, rivers, rain, and a thick atmosphere — but they are made of liquid methane, not water. Beneath its orange haze lies a world where it rains hydrocarbons and the 'rocks' are made of ice. It reminds us that our intuitions about what a world should look like are shaped entirely by one very particular world.",
    quote:
      "We do not see things as they are, we see things as we are.",
    quoteAuthor: "Seneca",
    scale:
      "Titan is larger than the planet Mercury. It could hold liquid — just not water. Life as we know it would find it deadly. Life as we don't know it might find it home.",
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
    quote:
      "The obstacle is the way.",
    quoteAuthor: "Marcus Aurelius",
    scale:
      "The Crab Nebula is still expanding at 1,500 kilometers per second — and has been since 1054 CE. A thousand years of constant explosion, and it is only 11 light years wide.",
    question:
      "What in your own life might be a kind of explosion — destructive on the surface, but seeding something new?",
  },
  {
    id: "kepler-442b",
    location: "Kepler-442b",
    locationDetail: "One of the most Earth-like planets known",
    distance: "1,200 light years",
    reflection:
      "Kepler-442b orbits in the habitable zone of its star, receives slightly more sunlight than Earth, and is about 1.3 times Earth's size. It is one of the best candidates for a world that might harbor life. If it does, those beings are 1,200 light years away — close enough to receive radio waves we transmitted before the Norman Conquest, but too far for us to ever reach.",
    quote:
      "Two possibilities exist: either we are alone in the universe, or we are not. Both are equally terrifying.",
    quoteAuthor: "Carl Sagan",
    scale:
      "A radio wave sent from Earth toward Kepler-442b right now would arrive 1,200 years from today — around the year 3225.",
    question:
      "If there is other life in the universe, what would you want them to know about what it meant to be human?",
  },
  {
    id: "europa",
    location: "Europa",
    locationDetail: "Jupiter's moon — a global ocean beneath the ice",
    distance: "628 million kilometers",
    reflection:
      "Beneath Europa's icy shell lies a global ocean of liquid water — more water than all of Earth's oceans combined. It has been liquid for billions of years, warmed by Jupiter's gravitational pull. Of all the places in our solar system, many scientists believe Europa is the most likely to harbor life right now.",
    quote:
      "Not all those who wander are lost.",
    quoteAuthor: "Carl Sagan",
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
    quote:
      "Science is not only a discipline of reason but also one of romance and passion.",
    quoteAuthor: "Carl Sagan",
    scale:
      "M87's black hole is 6.5 billion times the mass of our Sun. If it replaced our Sun, its event horizon would extend past the orbit of Neptune.",
    question:
      "What would you attempt if you truly believed that collective human effort could make the invisible visible?",
  },
  {
    id: "barnards-star",
    location: "Barnard's Star",
    locationDetail: "The fastest-moving star in our sky",
    distance: "5.96 light years",
    reflection:
      "Barnard's Star moves across our sky faster than any other star — fast enough that over a human lifetime, its position visibly shifts. In 10,000 years, it will be the closest star to Earth. We are not living in a static universe. Everything is in motion, always.",
    quote:
      "Impermanence is not something to be sad about. It's to be noted.",
    quoteAuthor: "Marcus Aurelius",
    scale:
      "Even at its great speed, Barnard's Star will take 10,000 years to become our nearest stellar neighbor. Motion at cosmic scales is imperceptible to any single human life.",
    question:
      "What feels permanent in your life that is actually, slowly, moving?",
  },
  {
    id: "whirlpool-galaxy",
    location: "The Whirlpool Galaxy",
    locationDetail: "M51 — two galaxies in collision",
    distance: "31 million light years",
    reflection:
      "The Whirlpool Galaxy and its companion are in the process of merging — a cosmic collision that began hundreds of millions of years ago and will continue for hundreds of millions more. When galaxies collide, individual stars almost never touch. The vast spaces between them mean the merger is one of gravity and gas and time, not destruction.",
    quote:
      "The quieter you become, the more you are able to hear.",
    quoteAuthor: "Alan Watts",
    scale:
      "Two galaxies containing hundreds of billions of stars each can pass through one another and individual stars will never collide. Scale changes everything.",
    question:
      "Where in your life might two forces that seem to be in collision actually have enough space to pass through each other?",
  },
  {
    id: "vega",
    location: "Vega",
    locationDetail: "The brightest star in Lyra — our former north star",
    distance: "25 light years",
    reflection:
      "Vega was Earth's north star 12,000 years ago and will be again in 14,000 years. Because Earth's axis wobbles slowly over 26,000 years, the star we navigate by is always changing. The fixed point in the sky is not fixed — it only appears so within a single human lifetime.",
    quote:
      "Life is long if you know how to use it.",
    quoteAuthor: "Seneca",
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
    quote:
      "The most beautiful thing we can experience is the mysterious.",
    quoteAuthor: "Carl Sagan",
    scale:
      "The Lagoon Nebula is 110 light years wide — so vast that the light we see from its far edge is over 100 years older than the light we see from its near edge.",
    question:
      "What in your life looks serene from the outside but is actually full of energy and transformation?",
  },
  {
    id: "hercules-corona-borealis",
    location: "Hercules-Corona Borealis Great Wall",
    locationDetail: "The largest known structure in the universe",
    distance: "10 billion light years",
    reflection:
      "The Hercules-Corona Borealis Great Wall is a massive concentration of galaxies stretching 10 billion light years across — so large that it challenges our models of how the universe formed. The universe is lumpy in ways we don't fully understand, and this structure is one of those mysteries.",
    quote:
      "The universe is not required to be in perfect harmony with human ambition.",
    quoteAuthor: "Carl Sagan",
    scale:
      "At 10 billion light years across, this structure spans more than two-thirds the observable universe. If it were scaled down so the observable universe were the size of Earth, the Great Wall would be the size of Africa.",
    question:
      "What assumptions are you making about how things should be that the universe has never agreed to?",
  },
  {
    id: "tau-ceti",
    location: "Tau Ceti",
    locationDetail: "A Sun-like star that may have Earth-like planets",
    distance: "11.9 light years",
    reflection:
      "Tau Ceti is one of our nearest stellar neighbors and remarkably similar to our Sun. It appears to have at least four planets, and two of them orbit in or near the habitable zone. Any civilization there could detect our Sun with basic optical technology. We might be visible to them, if they are looking.",
    quote:
      "We are all connected; to each other, biologically. To the Earth, chemically. To the rest of the universe, atomically.",
    quoteAuthor: "Neil deGrasse Tyson",
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
      "The Ring Nebula is what our Sun will become in about five billion years — the outer layers gently expelled into space, glowing with the energy of the dying star at its center. It is not violent. It is a slow, beautiful release. The star that made it is now a white dwarf the size of Earth, slowly cooling.",
    quote:
      "Death is nothing to us, since when we exist, death is not yet present, and when death is present, then we do not exist.",
    quoteAuthor: "Seneca",
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
      "The Carina Nebula is one of the largest and brightest nebulae in our sky, containing some of the most massive and luminous stars known — including Eta Carinae, a star 150 times the mass of our Sun that could explode as a supernova at any time. It is a region of extremes: creation, destruction, and everything in between.",
    quote:
      "The greatest battles of life are fought out every day in the silent chambers of the soul.",
    quoteAuthor: "Viktor Frankl",
    scale:
      "Eta Carinae releases as much energy in 6 seconds as our Sun releases in an entire year. Some things simply operate at a different scale.",
    question:
      "Where are you operating at less than your full scale, and what would it look like to not hold back?",
  },
  {
    id: "perseus-cluster",
    location: "The Perseus Galaxy Cluster",
    locationDetail: "A cluster of thousands of galaxies making sound",
    distance: "250 million light years",
    reflection:
      "In 2003, NASA detected actual sound waves emanating from the Perseus Cluster — pressure waves in the hot gas between galaxies, caused by a central black hole. The note is a B-flat, 57 octaves below middle C, so low that a single wave takes 10 million years to complete. The universe has been singing since before Earth existed.",
    quote:
      "If you only have a hammer, you tend to see every problem as a nail.",
    quoteAuthor: "Alan Watts",
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
    quote:
      "The soul that sees beauty may sometimes walk alone.",
    quoteAuthor: "Marcus Aurelius",
    scale:
      "The outermost shell of the Cat's Eye Nebula is about half a light year across — nearly 3 trillion kilometers — yet the whole structure took only a few thousand years to form.",
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
    quote:
      "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    quoteAuthor: "Marcus Aurelius",
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
      "At the largest scales, the universe is not random. Galaxies gather into filaments and sheets, separated by vast voids, forming a structure that looks remarkably like a neural network — or the mycelium of a forest. The same patterns appear at the scale of the cosmos as at the scale of the brain. Scale changes; structure persists.",
    quote:
      "You are not a drop in the ocean. You are the entire ocean in a drop.",
    quoteAuthor: "Alan Watts",
    scale:
      "The cosmic web spans billions of light years. The voids between filaments can be 300 million light years across — and yet, within those filaments, individual human beings are constructing theories that describe the whole.",
    question:
      "What structure in your own life — invisible to you day to day — might be more beautiful than you realize when seen from above?",
  },
  {
    id: "eridanus-void",
    location: "The Eridanus Supervoid",
    locationDetail: "The largest known void in the universe",
    distance: "1 billion light years",
    reflection:
      "The Eridanus Supervoid is a region of space roughly a billion light years across that contains far fewer galaxies than the surrounding universe. It corresponds to a cold spot in the cosmic microwave background — a scar from the earliest moments of creation, or possibly something stranger. Some physicists believe it might be a window into another universe.",
    quote:
      "The mind that opens to a new idea never returns to its original size.",
    quoteAuthor: "Carl Sagan",
    scale:
      "If the entire observable universe were a city, the Eridanus Void would be a neighborhood-sized park. The universe has room for absences as grand as its structures.",
    question:
      "What are you avoiding looking at — a void in your own life that might actually be worth exploring?",
  },
  {
    id: "edge-observable",
    location: "The Edge of the Observable Universe",
    locationDetail: "The boundary of what light has had time to reach us",
    distance: "46.5 billion light years",
    reflection:
      "The observable universe extends 46.5 billion light years in every direction — not because that's where the universe ends, but because that's as far as light has had time to travel since the Big Bang. Beyond this horizon lies more universe, forever hidden from us. We live inside a cosmic bubble of knowability, surrounded by an infinite unknown.",
    quote:
      "For small creatures such as we, the vastness is bearable only through love.",
    quoteAuthor: "Carl Sagan",
    scale:
      "At the speed of light, it would take 46.5 billion years to reach the edge of what we can observe. A human lifetime is, at most, 100 years.",
    question:
      "What is just beyond the horizon of what you can currently see or understand that might change everything?",
  },
  {
    id: "alpha-centauri",
    location: "Alpha Centauri",
    locationDetail: "Our nearest stellar system — three suns",
    distance: "4.37 light years",
    reflection:
      "Alpha Centauri is actually three stars: two Sun-like stars orbiting each other, and Proxima Centauri, a dim red dwarf slightly closer to us. From a planet around Alpha Centauri A, our Sun would appear as an unremarkable star in the southern sky — one of many. We are someone else's background star.",
    quote:
      "We are all just walking each other home.",
    quoteAuthor: "Alan Watts",
    scale:
      "Alpha Centauri A is so similar to our Sun that if you replaced our Sun with it, you might not notice the difference. Yet it is 4.37 light years — 40 trillion kilometers — away.",
    question:
      "To the universe, you are an unremarkable point of light. To the people who love you, you are a sun. Which of those truths do you live by?",
  },
];

export function getTodaysEntry(): ObservatoryEntry {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return OBSERVATORY_ENTRIES[dayOfYear % OBSERVATORY_ENTRIES.length];
}
