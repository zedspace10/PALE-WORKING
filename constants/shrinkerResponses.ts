export type ShrinkerCategory =
  | "work"
  | "relationship"
  | "future"
  | "failure"
  | "money"
  | "health"
  | "loss"
  | "general";

export interface PerspectiveResponse {
  cosmicAngle: string;
  humanAngle: string;
  closing: string;
}

const CATEGORY_KEYWORDS: Record<ShrinkerCategory, string[]> = {
  work: [
    "interview",
    "job",
    "career",
    "work",
    "boss",
    "fired",
    "hire",
    "hired",
    "promoted",
    "promotion",
    "colleague",
    "office",
    "deadline",
    "presentation",
    "unemployed",
    "salary",
    "layoff",
  ],
  relationship: [
    "friend",
    "partner",
    "relationship",
    "argument",
    "fight",
    "broke up",
    "breakup",
    "family",
    "parent",
    "lonely",
    "love",
    "dating",
    "divorce",
    "marriage",
    "conflict",
    "angry",
    "upset",
  ],
  future: [
    "future",
    "uncertain",
    "don't know",
    "scared",
    "anxious",
    "afraid",
    "what if",
    "tomorrow",
    "direction",
    "purpose",
    "meaning",
    "lost",
    "confused",
    "path",
  ],
  failure: [
    "fail",
    "failed",
    "failure",
    "mistake",
    "regret",
    "wrong",
    "embarrassed",
    "shame",
    "messed up",
    "shouldn't",
    "stupid",
    "ruined",
    "worse",
  ],
  money: [
    "money",
    "debt",
    "afford",
    "financial",
    "broke",
    "rent",
    "bills",
    "loan",
    "savings",
    "expense",
    "cost",
    "pay",
  ],
  health: [
    "sick",
    "ill",
    "health",
    "diagnosis",
    "pain",
    "hospital",
    "doctor",
    "condition",
    "tired",
    "exhausted",
    "disease",
    "injury",
  ],
  loss: [
    "died",
    "death",
    "grief",
    "lost",
    "miss",
    "gone",
    "passed away",
    "mourning",
    "funeral",
    "end",
    "over",
  ],
  general: [],
};

const RESPONSES: Record<ShrinkerCategory, PerspectiveResponse[]> = {
  work: [
    {
      cosmicAngle:
        "The Sun has been rising over this planet for 4.6 billion years. It rose before your interview, and it will rise after — indifferent, steady, unhurried. The cosmic calendar that holds all of human civilization fits into the last 14 seconds of a year that began with the Big Bang.",
      humanAngle:
        "Nearly every person who has shaped history — every leader, inventor, artist — has stood where you stand now, uncertain and nervous before something that mattered. That nervousness is not weakness. It is evidence that you care, and caring is the beginning of doing something well.",
      closing:
        "Whatever happens tomorrow will become part of who you are becoming. The outcome is one moment. The person you are growing into is the whole story.",
    },
    {
      cosmicAngle:
        "You are on a rock travelling at 107,000 km/h around a star that is itself moving through the Milky Way at 828,000 km/h. The universe has been expanding for 13.8 billion years without stopping for any worry, any career, or any outcome. And yet here you are — one of the rarest things in all of that: a mind that can think about all of this.",
      humanAngle:
        "Work can feel like everything when we are inside it. But even the most consequential careers are quiet and forgotten within a few generations. What endures is the quality of presence, kindness, and attention you bring — to your work, and to the people around it.",
      closing:
        "Your worth was never measured by your productivity. It was given to you when the universe decided to become conscious — and put you in the room.",
    },
  ],
  relationship: [
    {
      cosmicAngle:
        "The light from the nearest star beyond our Sun takes 4.2 years to reach us. When that light left its source, whatever is happening between you and this person did not yet exist. And long after it is resolved — in whatever form — that same light will still be crossing the void. The universe holds grief and connection with equal patience.",
      humanAngle:
        "Human relationships are the most complex phenomenon on Earth. That they sometimes fracture, wound, and confuse is not a sign of failure — it is a sign of how deeply they matter. Every difficult relationship reveals something true about what you value and how much you are capable of feeling.",
      closing:
        "The fact that this hurts means you are someone who lets things matter. That is not a flaw. That is a kind of courage.",
    },
    {
      cosmicAngle:
        "Andromeda and the Milky Way have been approaching each other for billions of years. In four billion years, they will collide — slowly, magnificently, without destruction. Most stars will simply find new orbits. Conflict, even on a cosmic scale, does not always mean ending. It often means rearranging.",
      humanAngle:
        "Philosophers across every civilization have written about loss and rupture in relationships. Marcus Aurelius, who ruled an empire, wrote privately about the pain of human misunderstanding. We have never found a way to love without the risk of being hurt. That risk is the price of connection — and most of us still agree it is worth paying.",
      closing:
        "Give yourself time. Clarity rarely arrives on the same day as the pain.",
    },
  ],
  future: [
    {
      cosmicAngle:
        "The observable universe is 93 billion light-years across — and we can only see as far as light has traveled in 13.8 billion years. Beyond that horizon, the universe continues in ways we cannot know. Uncertainty is not a human failure. It is the fundamental condition of existence at every scale.",
      humanAngle:
        "Every person who ever lived has stood at a moment they could not see past. Every era of history felt like the edge of something unknown. What looks like an abyss from here almost always becomes, in retrospect, a beginning. The future is not something that happens to you — it is something you build by moving into it, one day at a time.",
      closing:
        "Not knowing the path is not the same as being lost. You are allowed to move forward without seeing the destination.",
    },
    {
      cosmicAngle:
        "Stars are born inside clouds of gas and dust where nothing seems to be happening. For millions of years, the conditions build quietly — invisible, uncertain — until suddenly, ignition. The most luminous things in the universe began in periods of profound stillness and uncertainty.",
      humanAngle:
        "The Stoics believed that anxiety about the future is suffering twice — once in anticipation, and once if the fear ever arrives. Most fears, they noted, never arrive at all. What you are feeling is not evidence of something wrong. It is your mind trying to protect you from a future that is not yet real.",
      closing:
        "The present moment is where your life actually lives. This worry is about a future that may never happen. For now, you are here, and that is enough.",
    },
  ],
  failure: [
    {
      cosmicAngle:
        "The Sun spent its first ten million years in total failure — it could not sustain nuclear fusion. The conditions were not right. Then they were, and it has been burning steadily for 4.6 billion years. The universe does not mark moments of failure. It only marks what eventually becomes.",
      humanAngle:
        "Every scientific paper in history contains failed experiments. Every artist has work they destroyed or never showed. Every person you admire has a private archive of moments they regret. Regret is evidence that you have a conscience and the capacity to learn — not that you are beyond recovery.",
      closing:
        "What you did or didn't do belongs to the past, which is the one thing in the universe that cannot be changed. What you do with this moment is still entirely open.",
    },
    {
      cosmicAngle:
        "In the cosmic calendar, all of recorded human history — every triumph, every failure, every regret — fits into the last 14 seconds of December 31st. The universe has no record of your worst moment. It has been busy for 13.8 billion years and has noticed very few of ours.",
      humanAngle:
        "Viktor Frankl, who survived the worst conditions imaginable, wrote that we cannot always choose our circumstances, but we can always choose our response to them. Whatever happened, this moment — right now — is a new circumstance. And you are the one who chooses what comes next.",
      closing:
        "You are not the mistake. You are the one who is still here, thinking about how to do better. Those are two very different things.",
    },
  ],
  money: [
    {
      cosmicAngle:
        "Currency, debt, and economic systems are inventions that are less than ten thousand years old — a fraction of a second in the cosmic calendar. They feel absolute and permanent because we live inside them. But they are one of the youngest things on Earth, and they have always changed.",
      humanAngle:
        "Financial stress is one of the most physically and psychologically real forms of suffering — it is not trivial, and it deserves to be taken seriously. What matters is that it is a situation, not a sentence. Situations have pathways through them even when those pathways are not yet visible.",
      closing:
        "You are not your bank balance. You are the mind navigating it. That distinction matters more than it might feel like right now.",
    },
  ],
  health: [
    {
      cosmicAngle:
        "The atoms that make up your body were forged inside stars that lived and died billions of years ago. You are the universe arranged into a form that breathes and thinks and feels. That arrangement is remarkable — and it is resilient in ways that often surprise us.",
      humanAngle:
        "Illness and pain have been part of human experience since before recorded history. Every generation has faced it. What has also been part of every generation is the capacity to endure, to heal, to adapt, and to find meaning even in the most difficult conditions. You are not alone in this — not across time, and not right now.",
      closing:
        "Your body is doing something incredibly complex. So is your mind, in trying to hold all of this. Be patient with both.",
    },
  ],
  loss: [
    {
      cosmicAngle:
        "Every atom in the universe has existed since the Big Bang. Nothing that has ever existed has been destroyed — only transformed. The people, things, and moments we lose do not vanish from the fabric of reality. They become part of what was, and what was is permanent in a way that nothing else is.",
      humanAngle:
        "Grief is the measure of love. The depth of what you feel is proportional to what you valued — which means your grief is a kind of tribute. Every tradition, every culture, every philosophy has tried to make sense of loss. None has eliminated it. Most have concluded that love is still worth the cost.",
      closing:
        "You are allowed to feel all of this for as long as it takes. There is no schedule for the heart.",
    },
  ],
  general: [
    {
      cosmicAngle:
        "You are on a planet orbiting a star that is one of two hundred billion in the Milky Way, which is one of two trillion galaxies in the observable universe. And yet the thing you are carrying feels enormous — because it is enormous, to you, and that is exactly where your life is lived.",
      humanAngle:
        "Marcus Aurelius wrote: 'You have power over your mind, not outside events. Realize this, and you will find strength.' He governed an empire while dealing with grief, illness, war, and betrayal. He never pretended these were small. He only refused to add to his suffering by treating them as permanent.",
      closing:
        "This moment is real. So is the fact that moments pass. Both of those things are true at the same time.",
    },
    {
      cosmicAngle:
        "Earth has been orbiting the Sun for 4.5 billion years. In that time, it has faced extinction events, ice ages, and the slow death of entire species. And it has continued. Whatever you are facing is happening on a world that has survived everything it has encountered so far.",
      humanAngle:
        "The things that cause us the most suffering are often the things that matter most to us. Which means that what you are feeling is, in a strange way, a map of your values. The worry is where the love is. The anxiety is where the hope is. They are two sides of the same door.",
      closing:
        "You are not required to have this figured out today. You are only required to keep going — and you already are.",
    },
    {
      cosmicAngle:
        "The Voyager 1 spacecraft has been traveling since 1977. It is now in interstellar space — the farthest human-made object — still sending signals home across 23 billion kilometers. It was launched before most people reading this were born, and it is still going. Persistence is built into the things we make and the things we are.",
      humanAngle:
        "There is an old Stoic practice: imagine the worst realistic outcome, sit with it fully, and notice that you could survive even that. Not comfortably, not easily — but you would survive. This is not pessimism. It is a reminder that you are more resilient than your fear wants you to believe.",
      closing:
        "The universe spent 13.8 billion years making you possible. It would not have bothered for something that could not handle this.",
    },
  ],
};

export function detectCategory(text: string): ShrinkerCategory {
  const lower = text.toLowerCase();
  const scores: Partial<Record<ShrinkerCategory, number>> = {};

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS) as [
    ShrinkerCategory,
    string[],
  ][]) {
    if (cat === "general") continue;
    let score = 0;
    for (const word of words) {
      if (lower.includes(word)) score++;
    }
    if (score > 0) scores[cat] = score;
  }

  let best: ShrinkerCategory = "general";
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores) as [
    ShrinkerCategory,
    number,
  ][]) {
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

export function getResponse(
  category: ShrinkerCategory,
  seed: number = 0
): PerspectiveResponse {
  const pool = RESPONSES[category] ?? RESPONSES.general;
  return pool[seed % pool.length];
}

export function getResponseCount(category: ShrinkerCategory): number {
  return (RESPONSES[category] ?? RESPONSES.general).length;
}
