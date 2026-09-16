import { formatUniverseAgeEstimate } from "@/constants/personalInsights";
import { SOLAR_STATE_LABELS, SolarState } from "@/constants/solar";

export interface MomentLine {
  text: string;
  delay: number;
  style?: "primary" | "muted";
}

function localSolarLine(solarState: SolarState | null): string {
  if (!solarState) {
    return "PALE has not verified the Sun's position for your location.";
  }
  if (solarState === "daylight") {
    return "At your recent location, the Sun is above the horizon.";
  }
  return `At your recent location, it is ${SOLAR_STATE_LABELS[solarState]}.`;
}

export function getMomentLines(
  hour: number,
  openCount: number,
  solarState: SolarState | null,
): MomentLine[] {
  if (openCount >= 2) {
    return [
      { text: "You came back.", delay: 1200, style: "primary" },
      {
        text: "Another moment to notice where you are.",
        delay: 3000,
        style: "muted",
      },
    ];
  }

  if (hour >= 21 || hour <= 4) {
    return [
      {
        text: "Your device clock says it is late.",
        delay: 1400,
        style: "primary",
      },
      { text: localSolarLine(solarState), delay: 2600, style: "muted" },
      {
        text: "The sky you can actually see still depends on clouds, light, and your surroundings.",
        delay: 1200,
        style: "muted",
      },
    ];
  }

  if (hour >= 5 && hour <= 8) {
    return [
      { text: "Morning by your device clock.", delay: 1400, style: "primary" },
      { text: localSolarLine(solarState), delay: 2400, style: "muted" },
      { text: "This one is yours.", delay: 1400, style: "primary" },
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
        text: "PALE cannot tell whether sunlight is reaching you indoors or through cloud.",
        delay: 1800,
        style: "muted",
      },
      { text: localSolarLine(solarState), delay: 1200, style: "muted" },
    ];
  }

  if (hour >= 17 && hour <= 20) {
    return [
      { text: "Evening by your device clock.", delay: 1400, style: "primary" },
      { text: localSolarLine(solarState), delay: 2200, style: "muted" },
      {
        text: "Star visibility depends on twilight and local observing conditions.",
        delay: 1200,
        style: "muted",
      },
    ];
  }

  return [
    { text: "Right now", delay: 1200, style: "muted" },
    {
      text: `the universe is ${formatUniverseAgeEstimate()}.`,
      delay: 1000,
      style: "primary",
    },
    { text: "You are here.", delay: 2000, style: "primary" },
  ];
}
