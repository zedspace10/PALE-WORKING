export type LibraryThinker =
  | "Carl Sagan"
  | "Marcus Aurelius"
  | "Seneca"
  | "Alan Watts"
  | "Viktor Frankl"
  | "Richard Feynman";

export type LibraryTopic =
  | "cosmos"
  | "time"
  | "meaning"
  | "stoicism"
  | "impermanence"
  | "humanity"
  | "existence"
  | "wonder";

export type LibraryEntry = {
  id: string;
  text: string;
  author: LibraryThinker;
  authorTitle: string;
  topic: LibraryTopic;
};

export const LIBRARY_ENTRIES: LibraryEntry[] = [
  // Carl Sagan
  {
    id: "sagan-1",
    text: "For small creatures such as we, the vastness is bearable only through love.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "cosmos",
  },
  {
    id: "sagan-2",
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "cosmos",
  },
  {
    id: "sagan-3",
    text: "Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "humanity",
  },
  {
    id: "sagan-4",
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "wonder",
  },
  {
    id: "sagan-5",
    text: "We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "existence",
  },
  {
    id: "sagan-6",
    text: "Every one of us is, in the cosmic perspective, precious. If a human disagrees with you, let him live. In a hundred billion galaxies, you will not find another.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "humanity",
  },
  {
    id: "sagan-7",
    text: "The brain is like a muscle. When it is in use, we feel very good. Understanding is joyful.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "wonder",
  },
  {
    id: "sagan-8",
    text: "Our planet is a lonely speck in the great enveloping cosmic dark. In our obscurity, in all this vastness, there is no hint that help will come from elsewhere to save us from ourselves.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "humanity",
  },
  {
    id: "sagan-9",
    text: "We have also arranged things so that almost no one understands science and technology. This is a prescription for disaster.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "humanity",
  },
  {
    id: "sagan-10",
    text: "The universe is under no obligation to make sense to you.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "existence",
  },
  {
    id: "sagan-11",
    text: "Extinction is the rule. Survival is the exception.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "impermanence",
  },
  {
    id: "sagan-12",
    text: "We are star-stuff harvesting sunlight.",
    author: "Carl Sagan",
    authorTitle: "Astronomer, 1934–1996",
    topic: "cosmos",
  },

  // Marcus Aurelius
  {
    id: "aurelius-1",
    text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "cosmos",
  },
  {
    id: "aurelius-2",
    text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "stoicism",
  },
  {
    id: "aurelius-3",
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "stoicism",
  },
  {
    id: "aurelius-4",
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "meaning",
  },
  {
    id: "aurelius-5",
    text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "meaning",
  },
  {
    id: "aurelius-6",
    text: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "existence",
  },
  {
    id: "aurelius-7",
    text: "The first rule is to keep an untroubled spirit. The second is to look things in the face and know them for what they are.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "stoicism",
  },
  {
    id: "aurelius-8",
    text: "If someone is able to show me that what I think or do is not right, I will happily change.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "stoicism",
  },
  {
    id: "aurelius-9",
    text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "existence",
  },
  {
    id: "aurelius-10",
    text: "Loss is nothing else but change, and change is nature's delight.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "impermanence",
  },
  {
    id: "aurelius-11",
    text: "How much time he gains who does not look to see what his neighbour says or does or thinks, but only at what he himself does.",
    author: "Marcus Aurelius",
    authorTitle: "Roman Emperor and Philosopher, 121–180 CE",
    topic: "meaning",
  },

  // Seneca
  {
    id: "seneca-1",
    text: "It is not that I'm so brave, but that you are so busy.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "time",
  },
  {
    id: "seneca-2",
    text: "Life is long if you know how to use it.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "time",
  },
  {
    id: "seneca-3",
    text: "Retire into yourself as much as you can. Associate with those who will make a better man of you.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "meaning",
  },
  {
    id: "seneca-4",
    text: "Begin at once to live, and count each separate day as a separate life.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "time",
  },
  {
    id: "seneca-5",
    text: "We suffer more in imagination than in reality.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "stoicism",
  },
  {
    id: "seneca-6",
    text: "You act like mortals in all that you fear, and like immortals in all that you desire.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "impermanence",
  },
  {
    id: "seneca-7",
    text: "As long as you live, keep learning how to live.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "meaning",
  },
  {
    id: "seneca-8",
    text: "The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "time",
  },
  {
    id: "seneca-9",
    text: "No person has the power to have everything they want, but it is in their power not to want what they don't have.",
    author: "Seneca",
    authorTitle: "Stoic Philosopher, 4 BCE–65 CE",
    topic: "stoicism",
  },

  // Alan Watts
  {
    id: "watts-1",
    text: "You are the universe experiencing itself.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "existence",
  },
  {
    id: "watts-2",
    text: "The meaning of life is just to be alive. It is so plain and so obvious and so simple. And yet, everybody rushes around in a great panic as if it were necessary to achieve something beyond themselves.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "meaning",
  },
  {
    id: "watts-3",
    text: "No valid plans for the future can be made by those who have no capacity for living now.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "time",
  },
  {
    id: "watts-4",
    text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "impermanence",
  },
  {
    id: "watts-5",
    text: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "cosmos",
  },
  {
    id: "watts-6",
    text: "This is the real secret of life — to be completely engaged with what you are doing in the here and now.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "time",
  },
  {
    id: "watts-7",
    text: "Things are as they are. Looking out into it from here is simply looking at yourself.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "existence",
  },
  {
    id: "watts-8",
    text: "The more you try to control, the more out of control things become.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "stoicism",
  },
  {
    id: "watts-9",
    text: "Muddy water is best cleared by leaving it alone.",
    author: "Alan Watts",
    authorTitle: "Philosopher, 1915–1973",
    topic: "stoicism",
  },

  // Viktor Frankl
  {
    id: "frankl-1",
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "meaning",
  },
  {
    id: "frankl-2",
    text: "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude in any given set of circumstances.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "stoicism",
  },
  {
    id: "frankl-3",
    text: "Those who have a 'why' to live, can bear with almost any 'how'.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "meaning",
  },
  {
    id: "frankl-4",
    text: "The way in which a man accepts his fate and all the suffering it entails, the way in which he takes up his cross, gives him ample opportunity to add a deeper meaning to his life.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "meaning",
  },
  {
    id: "frankl-5",
    text: "Man does not simply exist but always decides what his existence will be, what he will become in the next moment.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "existence",
  },
  {
    id: "frankl-6",
    text: "Ultimately, man should not ask what the meaning of his life is, but rather must recognize that it is he who is asked.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "meaning",
  },
  {
    id: "frankl-7",
    text: "Life is never made unbearable by circumstances, but only by lack of meaning and purpose.",
    author: "Viktor Frankl",
    authorTitle: "Psychiatrist & Holocaust Survivor, 1905–1997",
    topic: "meaning",
  },

  // Richard Feynman
  {
    id: "feynman-1",
    text: "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    author: "Richard Feynman",
    authorTitle: "Physicist & Nobel Laureate, 1918–1988",
    topic: "existence",
  },
  {
    id: "feynman-2",
    text: "I would rather have questions that can't be answered than answers that can't be questioned.",
    author: "Richard Feynman",
    authorTitle: "Physicist & Nobel Laureate, 1918–1988",
    topic: "wonder",
  },
  {
    id: "feynman-3",
    text: "The beauty of a flower is available to everybody. Science doesn't subtract from it; it adds to it.",
    author: "Richard Feynman",
    authorTitle: "Physicist & Nobel Laureate, 1918–1988",
    topic: "wonder",
  },
  {
    id: "feynman-4",
    text: "Poets say science takes away from the beauty of the stars — mere globs of gas atoms. I too can see the stars on a desert night and feel them. But do I see less or more?",
    author: "Richard Feynman",
    authorTitle: "Physicist & Nobel Laureate, 1918–1988",
    topic: "cosmos",
  },
  {
    id: "feynman-5",
    text: "Physics is like sex: sure, it may give some practical results, but that's not why we do it.",
    author: "Richard Feynman",
    authorTitle: "Physicist & Nobel Laureate, 1918–1988",
    topic: "wonder",
  },
];

export const LIBRARY_AUTHORS: LibraryThinker[] = [
  "Carl Sagan",
  "Marcus Aurelius",
  "Seneca",
  "Alan Watts",
  "Viktor Frankl",
  "Richard Feynman",
];

export const TOPIC_LABELS: Record<LibraryTopic, string> = {
  cosmos: "Cosmos",
  time: "Time",
  meaning: "Meaning",
  stoicism: "Stoicism",
  impermanence: "Impermanence",
  humanity: "Humanity",
  existence: "Existence",
  wonder: "Wonder",
};

export function getEntriesByAuthor(author: LibraryThinker): LibraryEntry[] {
  return LIBRARY_ENTRIES.filter((e) => e.author === author);
}

export function getEntriesByTopic(topic: LibraryTopic): LibraryEntry[] {
  return LIBRARY_ENTRIES.filter((e) => e.topic === topic);
}

export function getRandomEntry(): LibraryEntry {
  return LIBRARY_ENTRIES[Math.floor(Math.random() * LIBRARY_ENTRIES.length)];
}
