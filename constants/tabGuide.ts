/**
 * The guide to PALE's five places, shown once after the opening screens and again whenever
 * someone asks for it from the You tab.
 */

export const GUIDE_SEEN_KEY = "@pale_guide_seen";

export interface GuideStep {
  /** Its place along the tab bar, from the left. */
  tab: number;
  route:
    | "/(tabs)"
    | "/(tabs)/shift"
    | "/(tabs)/you"
    | "/(tabs)/notes"
    | "/(tabs)/explore";
  title: string;
  body: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    tab: 0,
    route: "/(tabs)",
    title: "Home",
    body: "Your pale blue dot, and where to start. Tonight's sky, the Time Machine and the Observatory are all here.",
  },
  {
    tab: 1,
    route: "/(tabs)/shift",
    title: "Shift",
    body: "A one minute journey from Earth out to everything we can see. Tap Earth to begin.",
  },
  {
    tab: 2,
    route: "/(tabs)/you",
    title: "You",
    body: "Add your birthday to see how far you have travelled around the Sun, and what we have found in your lifetime.",
  },
  {
    tab: 3,
    route: "/(tabs)/notes",
    title: "Notes",
    body: "Write something down. Keep it on your phone, or send it to a star and follow it on its way.",
  },
  {
    tab: 4,
    route: "/(tabs)/explore",
    title: "Explore",
    body: "Places in the universe, from the Moon to the edge of what we can see, and a new Hubble or Webb picture every week.",
  },
];

export const GUIDE_TAB_COUNT = 5;
/** Height of the tab bar, as set in app/(tabs)/_layout.tsx. */
export const TAB_BAR_HEIGHT = 58;

/** Where the guide's ring sits: over the tab, in a screen `width` by `height`. */
export function tabCentre(tab: number, width: number, height: number) {
  return {
    x: ((tab + 0.5) * width) / GUIDE_TAB_COUNT,
    y: height - TAB_BAR_HEIGHT / 2,
  };
}

// The You tab can ask for the guide again; the app's root shows it.
type Listener = () => void;
const listeners = new Set<Listener>();
export function onGuideRequested(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function requestGuide() {
  for (const l of listeners) l();
}
