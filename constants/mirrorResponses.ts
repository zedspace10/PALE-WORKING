import AsyncStorage from
  '@react-native-async-storage/async-storage';

interface MirrorCategory {
  id: string;
  triggers: string[];
  responses: string[];
}

const CATEGORIES: MirrorCategory[] = [
  {
    id: 'overwhelm',
    triggers: ['overwhelmed','too much',
      'can\'t cope','drowning','swamped',
      'buried','everything at once',
      'too many','can\'t handle',
      'falling apart'],
    responses: [
      'Right now your heart is beating, your lungs are breathing, 37 trillion cells are quietly doing their work. You are already managing more complexity than you realise. The rest is smaller than it feels.',
      'The Milky Way manages 400 billion stars simultaneously. Each one a nuclear reactor burning for billions of years. The universe handles overwhelming complexity without rushing. Without stopping. Without breaking.',
      'A single teaspoon of neutron star material weighs 10 billion tonnes. Gravity compressed that from something the size of a city in under a second. The universe handles pressure differently to you. But it handles it.',
      'Clouds in the Eagle Nebula are 70 trillion kilometres tall. They formed from chaos — slowly, without effort, by simply letting gravity work. The most overwhelming things in the universe resolve the same way.'
    ]
  },
  {
    id: 'anxiety',
    triggers: ['anxious','anxiety','worried',
      'scared','fear','dread','terrified',
      'nervous','panic','what if',
      'uncertain','unsure','frightened',
      'dreading','apprehensive'],
    responses: [
      'The Voyager 1 probe was launched in 1977 with instruments designed for a 5 year mission. It is now 23 billion kilometres away, still functioning, still transmitting. Nobody planned for this. It happened anyway.',
      'Every star you can see tonight is a nuclear reactor that has been burning for billions of years with no guaranteed end date. The universe does not require certainty to keep going. Neither do you.',
      'In 1990, scientists asked NASA to turn Voyager around to photograph Earth from 6 billion kilometres away. They did not know what they would see. They looked anyway. That photograph changed everything.',
      'The first stars ignited 200 million years after the Big Bang. Before that: only darkness. The universe waited 200 million years for the first light. It was not anxious about the darkness.'
    ]
  },
  {
    id: 'loneliness',
    triggers: ['lonely','alone','no one',
      'nobody','isolated','left out',
      'no friends','abandoned','by myself',
      'disconnected','no one cares','invisible'],
    responses: [
      'The iron in your blood was forged inside ancient stars billions of years before Earth existed. Those stars scattered their elements across space and eventually those elements became you. You are not separate from the universe. You are a piece of it that learned to feel.',
      'Light from the Andromeda Galaxy arriving at your eyes right now left 2.5 million years ago — before humans existed. It has been travelling toward you for longer than our entire species has been alive. Some things move toward you very slowly.',
      'The Voyager probes carry a golden record with sounds from Earth: whale song, thunder, a mother\'s first words to a newborn. They have been playing to the void for nearly 50 years. We sent them anyway. Connection is always worth attempting.',
      'There are more possible arrangements of atoms in one human brain than there are atoms in the observable universe. No configuration like yours has ever existed. The universe made something genuinely new when it made you.'
    ]
  },
  {
    id: 'sadness',
    triggers: ['sad','grief','loss','died',
      'death','heartbroken','crying','miss',
      'mourning','bereaved','upset','hurt',
      'depressed','down','low','empty inside'],
    responses: [
      'The light reaching your eyes from the Andromeda Galaxy left 2.5 million years ago — long before humans existed. It has been travelling toward this exact moment your entire life. Some things move toward you very slowly. But they arrive.',
      'Hydrogen atoms in your body formed 13.8 billion years ago in the first minutes after the Big Bang. They have been part of countless things across all of cosmic time. They arrived here. In you. Right now. Still here.',
      'The ocean tides have been rising and falling twice a day for 4 billion years without stopping. Pulled by the same Moon. Following the same rhythm. Some things just keep going quietly, without being asked to.',
      'The Hubble Space Telescope has captured galaxies so distant their light took 13 billion years to arrive. In every direction — in every corner of the sky — there is more. Always more. The universe does not run out.'
    ]
  },
  {
    id: 'anger',
    triggers: ['angry','furious','rage',
      'frustrated','livid','mad','annoyed',
      'infuriated','resentful','bitter',
      'hate','so angry','really angry'],
    responses: [
      'The Sun releases energy equivalent to 100 billion nuclear bombs every single second. It has done this for 4.6 billion years. All of that energy directed outward — warming planets, driving weather, making photosynthesis possible. Energy directed outward creates rather than destroys.',
      'Jupiter\'s Great Red Spot is a storm that has raged for at least 350 years. Winds of 600 kilometres per hour. A storm larger than Earth itself. It has been slowly shrinking for the last century. Even the most persistent storms eventually calm.',
      'Tectonic plates move at the same speed your fingernails grow — a few centimetres per year. The Himalayas formed from this imperceptible movement over 50 million years. The most powerful forces often work most slowly.',
      'Solar flares — explosions on the Sun\'s surface — last between minutes and hours. Then the Sun returns to its steady, life-giving radiation. Intensity does not have to be permanent.'
    ]
  },
  {
    id: 'failure',
    triggers: ['failed','failure',
      'not good enough','gave up','useless',
      'worthless','messed up','mistake',
      'let everyone down','disappointed in myself',
      'terrible at','can\'t do anything right'],
    responses: [
      'The Sun has been imperfectly fusing hydrogen for 4.6 billion years. The process is inefficient — only a fraction of available energy is actually converted. By any engineering standard the Sun is a deeply imperfect machine. It is also the reason everything you have ever known exists.',
      'Evolution has been making mistakes for 3.8 billion years. Almost every mutation is neutral or harmful. The ones that occasionally work changed everything. The process requires an enormous number of failures to produce anything remarkable.',
      'The first rockets built to reach space exploded on the launch pad. Many times. By teams of the most capable engineers alive. Every successful launch in history was preceded by failures that were essential to it.',
      'The Wright brothers first flight lasted 12 seconds and covered 37 metres. It happened in 1903. 66 years later humans walked on the Moon. The distance between those two moments is almost incomprehensible. It started with 12 seconds.'
    ]
  },
  {
    id: 'comparison',
    triggers: ['jealous','envious',
      'not as good as','everyone else',
      'why not me','comparing myself',
      'behind','less than','left behind',
      'they\'re better','wish I was like'],
    responses: [
      'No two stars in the observable universe are identical. Not one of the estimated two sextillion stars is the same as another. The universe has spent 13.8 billion years producing variety. Comparison between unique things produces no useful information.',
      'From 100 million light-years away every galaxy in our local group appears as a single faint smudge of light. Indistinguishable from each other. The differences that feel vast from inside are invisible from outside.',
      'Every snowflake has a unique crystalline structure. Not because the universe is trying to make each one special. But because the conditions that form each one are never exactly repeated. Uniqueness is not an achievement. It is simply what happens when something real forms.',
      'The cosmic microwave background looks almost identical in every direction of the sky. But examine it closely enough and tiny variations appear. Those tiny variations are why galaxies exist. The differences are the point.'
    ]
  },
  {
    id: 'stuck',
    triggers: ['stuck','trapped',
      'going nowhere','can\'t move',
      'no way out','same thing every day',
      'no progress','frozen','stagnant',
      'not moving forward','in a rut'],
    responses: [
      'Light that left the Andromeda Galaxy 2.537 million years ago is arriving at your eyes right now for the very first time. It was never stuck. It simply covered an incomprehensible distance one moment at a time.',
      'Continental drift moves at 2.5 centimetres per year — the same speed your fingernails grow. The Atlantic Ocean was made by this imperceptible movement over hundreds of millions of years. Progress at the most fundamental level is often invisible in the moment.',
      'A photon of light created in the core of the Sun takes 100,000 years to reach the surface — bouncing between particles, seemingly going nowhere. Then it takes 8 minutes to reach Earth. The longest part of the journey can feel like standing still.',
      'Stalactites grow approximately 1 centimetre every 100 years. Some formations in deep caves are 500,000 years old. They are still growing. Still moving. Invisibly. Continuously. Not stuck.'
    ]
  },
  {
    id: 'small',
    triggers: ['small','insignificant',
      'don\'t matter','nobody','invisible',
      'who cares','meaningless','pointless',
      'no impact','no one notices',
      'no difference','what\'s the point'],
    responses: [
      'You are made of approximately 7,000,000,000,000,000,000,000,000,000 atoms. Every single one existed since the Big Bang. They have been part of ancient stars, interstellar clouds, ancient oceans, other living things. They arrived here, assembled into something capable of wondering about its own significance.',
      'The Pale Blue Dot photograph shows Earth as a single pixel of light in an ocean of darkness. Carl Sagan said: on that dot, every king and peasant, every creator and destroyer of civilisations, every saint and sinner in the history of our species lived. Small is not the same as insignificant.',
      'Mitochondria — tiny structures inside each of your cells — were once separate organisms. Two billion years ago they merged with another cell in an event so unlikely it may have only happened once in Earth\'s history. That merger is the reason all complex life exists. The small things changed everything.',
      'The Higgs boson — the particle that gives all matter its mass — is invisible and cannot be touched. Without it, nothing would have any substance at all. The most important things are often the smallest.'
    ]
  },
  {
    id: 'change',
    triggers: ['change','changing','transition',
      'everything is different',
      'scared of change','nothing is the same',
      'don\'t recognise','lost my way',
      'who am i','identity',
      'things are changing'],
    responses: [
      'The Milky Way has completed approximately 20 full rotations since it formed 13 billion years ago. At no point did it look exactly the same as before. The galaxy is defined by its movement. Change is not instability. It is the evidence of being alive.',
      'Stars spend millions of years in the process of formation — collapsing, heating, igniting, stabilising. From the outside the process looks like chaos. From inside, presumably, it feels like pressure. The pressure is the process.',
      'The atoms in your body are replaced continuously throughout your life. You are not the same matter you were seven years ago. Change is not loss of self. It is how the self stays alive.',
      'Every 26,000 years the Earth wobbles on its axis — a slow circular motion called precession. The North Star has not always been the North Star. In 12,000 years Vega will take its place. Even the fixed points change. The sky keeps being beautiful.'
    ]
  }
];

const UNIVERSAL: string[] = [
  'Right now, light that left a distant star before you were born is arriving at Earth for the first time. It has been travelling toward this moment your entire life.',
  'The universe has been expanding for 13.8 billion years without pausing, without doubting, without looking back. Outward is the only direction it has ever consistently moved.',
  'There are more atoms in a glass of water than there are glasses of water in all of Earth\'s oceans. The scale of things is almost always larger than it first appears.',
  'Somewhere beyond our solar system, the New Horizons spacecraft — the fastest object ever launched by humans — is still travelling. It has been going for 19 years. It has barely begun.',
  'The cosmic microwave background — the afterglow of the Big Bang — passes through this room right now. Through you. The beginning of the universe is still everywhere.',
  'Every 88 days, Mercury completes a full orbit of the Sun. It has done this approximately 25 billion times since the solar system formed. Steady. Consistent. Still going.'
];

export interface MirrorResponse {
  truth: string;
}

export async function findResponse(
  input: string
): Promise<MirrorResponse> {
  const lower = input.toLowerCase();

  let best: MirrorCategory | null = null;
  let bestScore = 0;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const trigger of cat.triggers) {
      if (lower.includes(trigger)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }

  const pool = best ? best.responses : UNIVERSAL;
  const key = 'mirror_idx_' +
    (best ? best.id : 'universal');

  let idx = 0;
  try {
    const stored =
      await AsyncStorage.getItem(key);
    const last = stored
      ? parseInt(stored, 10) : -1;
    idx = (last + 1) % pool.length;
  } catch {}

  try {
    await AsyncStorage.setItem(
      key, String(idx));
  } catch {}

  return { truth: pool[idx] };
}
