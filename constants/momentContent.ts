import { SOLAR_STATE_LABELS, SolarState } from "@/constants/solar";

export interface MomentLine {
  text: string;
  delay: number;
  style?: "primary" | "muted";
}

// What the Sun is doing where the person last was. Said only when it has been worked out from a
// real location; otherwise the line is left out rather than guessed.
function localSolarLines(solarState: SolarState | null): MomentLine[] {
  if (!solarState) return [];
  const text =
    solarState === "daylight"
      ? "Where you are, the Sun is up."
      : `Where you are, it is ${SOLAR_STATE_LABELS[solarState]}.`;
  return [{ text, delay: 2200, style: "muted" }];
}

export function getMomentLines(
  hour: number,
  openCount: number,
  solarState: SolarState | null,
): MomentLine[] {
  if (openCount >= 2) {
    return [
      { text: "Welcome back.", delay: 1200, style: "primary" },
      ...localSolarLines(solarState),
    ];
  }

  if (hour >= 21 || hour <= 4) {
    return [
      { text: "It's late.", delay: 1400, style: "primary" },
      ...localSolarLines(solarState),
      {
        text: "The stars are still there, even when you cannot see them.",
        delay: 1200,
        style: "muted",
      },
    ];
  }

  if (hour >= 5 && hour <= 8) {
    return [
      { text: "Good morning.", delay: 1400, style: "primary" },
      ...localSolarLines(solarState),
      {
        text: "The universe is about 13.8 billion years old.",
        delay: 1400,
        style: "muted",
      },
    ];
  }

  if (hour >= 11 && hour <= 14) {
    return [
      {
        text: "Sunlight takes about eight minutes to reach Earth.",
        delay: 1200,
        style: "primary",
      },
      {
        text: "The Sun you see is about eight minutes old.",
        delay: 1800,
        style: "muted",
      },
    ];
  }

  if (hour >= 17 && hour <= 20) {
    return [
      { text: "Good evening.", delay: 1400, style: "primary" },
      ...localSolarLines(solarState),
      {
        text: "If the sky is clear tonight, look up.",
        delay: 1200,
        style: "muted",
      },
    ];
  }

  return [
    { text: "Right now", delay: 1200, style: "muted" },
    {
      text: "the universe is about 13.8 billion years old.",
      delay: 1000,
      style: "primary",
    },
  ];
}
