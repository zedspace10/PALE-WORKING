export type LensId =
  | "cosmic"
  | "stoic"
  | "historical"
  | "scientific"
  | "philosophical";

export type PerspectiveLens = {
  id: LensId;
  label: string;
  subtitle: string;
  color: string;
  responses: string[];
};

export const PERSPECTIVE_LENSES: PerspectiveLens[] = [
  {
    id: "cosmic",
    label: "Cosmic",
    subtitle: "The view from 46 billion light years",
    color: "#7BA9F0",
    responses: [
      "You are standing on a pale blue dot, orbiting a middle-aged star, in the outer arm of one galaxy among two trillion. Whatever is troubling you is happening on a world so small that, from four light years away, the Sun would be just another star. This is not to say your experience doesn't matter — it does. But the universe has been unfolding for 13.8 billion years. It has survived supernovae, the collision of galaxies, and the death of entire star systems. And still, here you are.",
      "The light reaching Earth from the nearest star left before you were born. The atoms in your body were forged in stars that exploded before our Sun existed. You are not a problem to be solved. You are the universe, briefly aware of itself, holding something difficult in a moment of its own awareness. That is rare. That is extraordinary.",
      "From Voyager's position, 23 billion kilometers away, the entirety of human history — every war, every love, every fear, every triumph — is invisible. Earth is a fraction of a single pixel. Your worry, real as it is, exists on a world so small the cosmos does not know it as separate from the void. You are the void, made aware. The worry is part of that awareness. Let it be held by something larger.",
      "There are an estimated 2 trillion galaxies in the observable universe. Each contains hundreds of billions of stars. Most of those stars have planets. And here, on one of them, something complex enough to feel this experience has emerged. Whatever you are carrying right now, you are carrying it as one of the most improbable things the cosmos has ever produced.",
      "The universe is 13.8 billion years old. Your life is perhaps 80-100 years. The ratio is so extreme it is impossible to hold in the mind. And yet within those 80 years, you will feel things so intensely that they fill the entire frame of your experience. That intensity is real. It is also, seen against deep time, a bright light in a very brief moment. Bright lights are worth protecting.",
    ],
  },
  {
    id: "stoic",
    label: "Stoic",
    subtitle: "What is within your power",
    color: "#C8A96E",
    responses: [
      "The Stoics divided all things into two categories: what is within your control, and what is not. Your opinions, your intentions, your responses — these are yours. External events, other people's actions, the judgments of the world — these are not. Most suffering comes from treating the second category as if it were the first. Ask yourself: what part of this is actually mine to act on?",
      "Marcus Aurelius ruled an empire and wrote, in his private journal, that the obstacle becomes the path. Not despite difficulty — through it. The Stoics did not deny that things were hard. They insisted that the hardship was the material from which character is built. What is this moment asking you to build?",
      "Seneca wrote: 'We suffer more in imagination than in reality.' Most of what you fear about this situation may never come to pass. And if it does, you will meet it with the tools of that moment, which you do not yet have. You only ever deal with what is actually in front of you. Right now, you are still in the imagination.",
      "The Stoics practiced a meditation they called 'negative visualization' — imagining the loss of what you have, so you can appreciate it now. Whatever you are worried about losing or failing to obtain, it is worth asking: have you fully valued what you already have? The fear of loss often means something precious is already present.",
      "Epictetus was a slave who became one of history's most influential philosophers. Viktor Frankl survived a concentration camp and wrote a book about finding meaning in suffering. The Stoic tradition holds that no circumstance can permanently determine your inner state — only your response to it can. What response would the most resilient version of you choose right now?",
    ],
  },
  {
    id: "historical",
    label: "Historical",
    subtitle: "Through the lens of deep time",
    color: "#8B9BB4",
    responses: [
      "Every generation has believed its moment to be the most uncertain, most frightening, most unprecedented. The people who lived through the Black Death, the World Wars, the collapse of entire civilizations — they also woke up each morning and wondered how to move forward. Most of them did. The archive of human persistence is the longest record we have.",
      "One hundred years from now, this moment will be a footnote in a history that hasn't been written yet. The things that seem enormous right now — the things that keep you up at night — will either be long resolved or will be context for a world you cannot imagine. History is made of moments that felt impossible to those living through them.",
      "Ten thousand years of human civilization have passed through challenges that would seem unthinkable to any single person living through them. Empires fell. Languages died. Species went extinct. And still, people built, loved, created, and passed something forward. You are the recipient of everything they managed to preserve. That inheritance is still in you.",
      "In the sweep of history, the problems of any individual moment — however real — tend to be followed by other moments. Time does not erase difficulty, but it does contextualise it. The Romans who saw their republic fall could not have imagined that their language would shape civilization for two thousand years afterward. Your moment is not the end of the story.",
      "Consider how many people across history have faced exactly this kind of moment — loss, uncertainty, failure, fear of the future — and have found, on the other side of it, that something new became possible. The historical record is not a record of unbroken success. It is a record of interrupted persistence.",
    ],
  },
  {
    id: "scientific",
    label: "Scientific",
    subtitle: "What the evidence shows about resilience",
    color: "#9FB87A",
    responses: [
      "Neuroscience shows that the brain in distress narrows its view — a survival mechanism that kept our ancestors focused on immediate threats, but which can make problems seem larger and more permanent than they are. The brain that is afraid perceives danger everywhere. This is a feature, not a flaw — but it is worth knowing that your current view of this situation may be systematically wider than the actual threat.",
      "The psychological research on resilience consistently shows one thing: the capacity to recover is not a fixed trait you either have or don't. It is built through exposure, through meaning-making, through social connection, and through the slow accumulation of evidence that you have survived difficulty before. You have survived every difficult moment in your life so far. The sample size supports you.",
      "Post-traumatic growth — the documented tendency of many people to report increased strength, new possibilities, and deepened relationships after serious difficulty — is not universal, but it is real. It does not mean suffering is good. It means the human system is sometimes capable of reorganizing around a difficulty and emerging differently. The same energy that feels overwhelming now can, in time, become something else.",
      "The stress response that makes this feel urgent — the racing heart, the narrowed focus, the sense that something must be done immediately — evolved to help creatures escape predators. It is enormously useful for short-term physical threats. It is less useful for complex, slow-moving life problems. What your nervous system is treating as a tiger is probably better addressed with the slower, deliberate thinking that comes when the nervous system is calm.",
      "Studies on decision-making under emotional stress consistently show that the quality of decisions improves when people create even small amounts of psychological distance — imagining how they'll feel about this in ten years, or how they'd advise a friend in the same situation. The distancing doesn't solve the problem, but it changes the relationship to it. What does your wisest future self say about this?",
    ],
  },
  {
    id: "philosophical",
    label: "Philosophical",
    subtitle: "Deeper questions worth asking",
    color: "#C8A96E",
    responses: [
      "Camus wrote that the only serious philosophical question is whether life is worth living. He answered yes — not because suffering is absent, but because engagement with life, in all its absurdity and beauty, is itself the answer. You are here, asking this question. That is already a form of engagement. The question is worth taking seriously. So is the fact that you are still asking it.",
      "Kierkegaard described anxiety as the dizziness of freedom — the vertigo that comes with having genuine choices about your own existence. What feels like suffering might also be a sign that you have real choices in front of you. Anxiety and freedom are sometimes the same signal. What would it look like to choose, rather than to be chosen by circumstances?",
      "The Buddhists describe the second arrow: when something painful happens, that is the first arrow. The suffering you add by resisting it, by telling yourself it should not have happened, by fearing the future because of it — that is the second arrow. You cannot always avoid the first arrow. You have more choice about the second.",
      "Heidegger wrote about 'thrownness' — the condition of finding yourself already in a world you did not choose, with a past you did not design, in circumstances you did not ask for. This is the universal human situation. No one chose their starting conditions. What Heidegger called 'authentic existence' is the act of taking ownership of your response to the throw, making your own meaning from what you find yourself holding.",
      "Viktor Frankl, writing from a Nazi concentration camp, concluded that meaning — not pleasure, not power — is the deepest human need. Meaning can be found in what we create, in what we experience, and in the attitude we take toward unavoidable suffering. Whatever this moment contains, it contains the possibility of a meaningful response. What meaning is available here, even in difficulty?",
    ],
  },
];

export function getResponseForLens(lens: PerspectiveLens, seed: number): string {
  return lens.responses[seed % lens.responses.length];
}

export function getLensSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}
