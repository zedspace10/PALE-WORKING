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

export interface TimeMachineEvent {
  id: string;
  era: TimeMachineEra;
  when: string;
  title: string;
  description: string;
  perspective: string;
  color: string;
  icon: string;
}

export const TIME_MACHINE_EVENTS: TimeMachineEvent[] = [
  // ─── DISTANT PAST ───
  {
    id: "big-bang",
    era: "distant-past",
    when: "13.8 billion years ago",
    title: "The Big Bang",
    description:
      "The universe begins as a point of infinite density. In the first second, the four fundamental forces separate. Within three minutes, the first protons and neutrons form. The universe is a hot, dense plasma of energy.",
    perspective:
      "Every atom in your body, every photon of light you have ever seen, every thought you have ever had — all of it began in this single moment. You are the universe, 13.8 billion years later, remembering its own birth.",
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
      "Right now, passing through your body, is ancient light from when the universe first became transparent. You are bathed in the oldest light that exists.",
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
      "Before the first star ignited, the universe was dark for longer than the current age of our Solar System. Darkness preceded all light. Something preceded all things.",
    color: "#3A3060",
    icon: "moon",
  },
  {
    id: "first-stars",
    era: "stars",
    when: "13.5 billion years ago",
    title: "The First Stars",
    description:
      "The first stars ignite — massive, hot, and short-lived. They burn for only a few million years before exploding as supernovae, seeding the universe with the first heavy elements: carbon, oxygen, iron, gold. Without their deaths, life would be impossible.",
    perspective:
      "Every heavy element in your body was forged inside a star and flung across the cosmos when that star died. You are made of stellar shrapnel. You are the universe recycling itself into something that can feel.",
    color: "#FFF0A0",
    icon: "star",
  },
  {
    id: "first-galaxies",
    era: "stars",
    when: "13 billion years ago",
    title: "The First Galaxies",
    description:
      "Gravity gathers stars into the first galaxies. They are small, irregular, and turbulent — nothing like the grand spirals we see today. They collide, merge, and grow over billions of years into the structure of the cosmic web.",
    perspective:
      "The Milky Way you see on a clear night assembled itself from thousands of smaller galaxies over billions of years. Our galaxy is made of the wreckage of ancient collisions.",
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
      "Our Sun is a second or third generation star. The solar system we live in is built from the recycled remains of stars that lived and died before our Sun was born. We live inside a stellar inheritance.",
    color: "#FFD700",
    icon: "sun",
  },
  {
    id: "earth-forms",
    era: "solar-system",
    when: "4.54 billion years ago",
    title: "Earth Forms",
    description:
      "Dust, rocks, and ice clump together over millions of years, growing larger with each collision. Earth forms as a molten sphere, bombarded by asteroids. Around this time, a Mars-sized body strikes Earth, and the debris coalesces into the Moon.",
    perspective:
      "The Moon formed from Earth's own material, flung into orbit by a catastrophic collision. Every time you see the Moon, you are looking at a piece of Earth that broke off 4.5 billion years ago.",
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
      "The water in your body may have arrived from outer space, carried on ancient comets. You are partly made of cosmic delivery.",
    color: "#3D8FBF",
    icon: "droplet",
  },
  {
    id: "first-life",
    era: "life",
    when: "3.8 billion years ago",
    title: "The First Life",
    description:
      "Simple single-celled organisms emerge in the oceans. They have no nucleus, no complex machinery — just a membrane, some chemistry, and the ability to reproduce. They are the ancestors of every living thing that has ever existed.",
    perspective:
      "You share ancestors with every organism alive today — every tree, every bacterium, every whale. Life on Earth is one unbroken thread stretching back nearly four billion years.",
    color: "#4CAF50",
    icon: "activity",
  },
  {
    id: "oxygen",
    era: "life",
    when: "2.4 billion years ago",
    title: "The Great Oxygenation",
    description:
      "Cyanobacteria evolve photosynthesis and begin pumping oxygen into the atmosphere. For most life at the time, oxygen is a deadly poison. This is Earth's first mass extinction — and also the event that makes complex animal life possible.",
    perspective:
      "The air you are breathing right now was created by ancient bacteria, whose 'pollution' killed most life on Earth — and made your existence possible. Catastrophe and creation are often the same event.",
    color: "#80C080",
    icon: "wind",
  },
  {
    id: "complex-cells",
    era: "life",
    when: "2 billion years ago",
    title: "Complex Cells Emerge",
    description:
      "One bacterium engulfs another — but instead of digesting it, they form a partnership. This is the origin of the eukaryotic cell: the kind of cell that makes up every complex organism, including you. Every cell in your body contains the descendants of that ancient merger.",
    perspective:
      "Cooperation is so ancient and so fundamental that it is literally built into every cell of your body. You are, at the cellular level, a community of organisms that decided to work together.",
    color: "#90D4B0",
    icon: "layers",
  },
  {
    id: "multicellular",
    era: "life",
    when: "600 million years ago",
    title: "The First Animals",
    description:
      "For most of Earth's history, all life is single-celled. Then, in the oceans, cells begin to cooperate in new ways — forming the first multicellular organisms. The ancestors of all animals emerge.",
    perspective:
      "For 3.2 billion years, all life on Earth was microscopic. Animals are a very recent experiment.",
    color: "#80B0D0",
    icon: "feather",
  },
  {
    id: "cambrian",
    era: "life",
    when: "540 million years ago",
    title: "The Cambrian Explosion",
    description:
      "In a geological instant — about 20 million years — most of the major animal body plans appear in the fossil record. Eyes, legs, shells, predators. The ocean fills with complex life. The arms race of evolution accelerates.",
    perspective:
      "The body plan you inhabit — bilateral symmetry, a central nervous system, eyes facing forward — is a Cambrian design. You are driving a vehicle whose basic architecture is 540 million years old.",
    color: "#A0B890",
    icon: "eye",
  },
  {
    id: "land",
    era: "life",
    when: "430 million years ago",
    title: "Life Moves to Land",
    description:
      "Plants colonize land, transforming bare rock into living soil. Animals follow — first arthropods, then vertebrates. Fish develop limbs and begin to breathe air. The continents, previously barren, begin to green.",
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
      "After the Permian mass extinction wipes out 96% of marine species, dinosaurs emerge and come to dominate. They rule Earth for 165 million years — more than 30 times longer than our genus has existed.",
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
      "A 10-kilometer asteroid strikes what is now the Yucatan Peninsula, releasing the energy of a billion nuclear bombs. The Cretaceous ends. Three-quarters of all species go extinct — including all non-avian dinosaurs.",
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
      "In Africa, the lineage that will lead to modern humans splits from the ancestors of chimpanzees. These early hominins walk upright but have small brains and make no tools. They are one species among many.",
    perspective:
      "Chimpanzees are our closest living relatives, sharing 98.7% of our DNA. The difference between us and them took six million years of small changes to accumulate.",
    color: "#C8A96E",
    icon: "user",
  },
  {
    id: "fire",
    era: "humanity",
    when: "1 million years ago",
    title: "Control of Fire",
    description:
      "Homo erectus learns to control fire — for warmth, for protection, and for cooking. Cooking food dramatically increases the energy available to the brain. Brain size begins to grow rapidly. The relationship between humans and fire begins.",
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
      "Anatomically modern humans appear in Africa. They are genetically identical to us. They paint caves, create jewelry, bury their dead with ceremony, and begin to speak complex language. They are us.",
    perspective:
      "Humans identical to you existed 300,000 years ago — with the same capacity for love, fear, curiosity, and grief. They lived and died without knowing what electricity was, without writing, without any of the structures we call civilization. The same person; a different world.",
    color: "#C8A96E",
    icon: "users",
  },
  {
    id: "out-of-africa",
    era: "humanity",
    when: "70,000 years ago",
    title: "The Great Migration",
    description:
      "A small group of humans — perhaps just a few thousand — leaves Africa and begins to spread across the world. Over tens of thousands of years, they reach Asia, Europe, and eventually the Americas and Australia. Every human alive today descends from these migrants.",
    perspective:
      "Every person alive today is descended from the same small group of African humans who left 70,000 years ago. Your family tree, if you go back far enough, includes everyone. Every human is a cousin.",
    color: "#B89060",
    icon: "map",
  },
  {
    id: "civilization",
    era: "humanity",
    when: "10,000 years ago",
    title: "Civilization Begins",
    description:
      "Humans domesticate plants and animals and begin to build permanent settlements. Writing, mathematics, cities, laws, and trade emerge. What we call 'history' begins — though humanity had existed for 290,000 years before anyone wrote anything down.",
    perspective:
      "Everything we call 'civilization' — cities, writing, philosophy, science, art, religion — is 10,000 years old in a 4.5-billion-year-old world. The entire recorded human story fits in the last 0.0002% of Earth's existence.",
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
      "You are here. A being made of atoms forged in stellar explosions, assembled by 3.8 billion years of evolution, speaking a language that emerged in the last geological eyeblink, reading these words on a device that is 70 years old.",
    perspective:
      "You exist at a vanishingly unlikely intersection of time, chemistry, evolution, and chance. The probability of this exact moment — you, reading this, on this world — is so small it cannot be calculated. And yet here it is.",
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
      "If civilization continues, humans 1,000 years from now will have access to technology as incomprehensible to us as smartphones would be to medieval peasants. They will look back at our era the way we look back at the age of horses and swords.",
    perspective:
      "Everything we regard as permanent — our institutions, our knowledge, our sense of what is normal — will be as quaint to humans of 3000 CE as the Roman Empire is to us. Our certainties are temporary.",
    color: "#8B9BB4",
    icon: "arrow-up",
  },
  {
    id: "red-giant",
    era: "future",
    when: "5 billion years from now",
    title: "The Sun Becomes a Red Giant",
    description:
      "Our Sun exhausts its hydrogen fuel and swells into a red giant, engulfing Mercury, Venus, and possibly Earth. The inner solar system becomes uninhabitable. Then the Sun's outer layers drift away, leaving a slowly cooling white dwarf.",
    perspective:
      "Our Sun, this star that has powered all life on Earth for 4.5 billion years, will one day consume the world we live on. Nothing in the solar system is permanent. All things pass.",
    color: "#FF6B35",
    icon: "sun",
  },
  {
    id: "milky-way-merger",
    era: "future",
    when: "4 billion years from now",
    title: "Andromeda Collision",
    description:
      "The Andromeda galaxy, currently 2.5 million light years away, is falling toward us at 110 kilometers per second. In about 4 billion years, the two galaxies will begin to merge. Over billions of years, they will combine into a new elliptical galaxy.",
    perspective:
      "Two galaxies containing hundreds of billions of stars will pass through each other, and almost no stars will collide — the distances between them are too vast. The merger is a collision of gravity, not of objects. Size changes everything.",
    color: "#9088C0",
    icon: "shuffle",
  },
  {
    id: "last-stars",
    era: "future",
    when: "100 trillion years from now",
    title: "The Last Stars",
    description:
      "Star formation eventually ceases as gas clouds are consumed. The last stars flicker out. The universe becomes cold and dark, populated only by black holes, neutron stars, and dead stellar remnants slowly cooling toward absolute zero.",
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
      "Over incomprehensible spans of time, even black holes evaporate. The universe approaches maximum entropy — thermodynamic equilibrium. No more gradients of energy. No more change. The universe reaches its final state.",
    perspective:
      "We exist in a moment of tremendous complexity and possibility in a universe that will, eventually, grow quiet. This impermanence is not a reason for despair. It is the reason that now — this exact moment — is irreplaceable.",
    color: "#202030",
    icon: "pause",
  },
];

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
