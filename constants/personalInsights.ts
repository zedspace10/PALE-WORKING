import { CosmicEvent } from "@/constants/cosmicData";

export const MINIMUM_BIRTH_YEAR = 1900;
export const UNIVERSE_AGE_ESTIMATE = "approximately 13.8 billion years";
const AVERAGE_EARTH_ORBITAL_SPEED_KM_S = 29.78;

export type BirthdayValidation =
  | { ok: true; date: Date }
  | {
      ok: false;
      reason: "format" | "impossible" | "future" | "too-old";
      message: string;
    };

export function parseBirthdayInput(
  input: string,
  now: Date,
  minimumYear = MINIMUM_BIRTH_YEAR,
): BirthdayValidation {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input.trim());
  if (!match) {
    return {
      ok: false,
      reason: "format",
      message: "Enter your birthday as DD/MM/YYYY",
    };
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < minimumYear) {
    return {
      ok: false,
      reason: "too-old",
      message: `Enter a date in ${minimumYear} or later`,
    };
  }
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (
    !Number.isFinite(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return {
      ok: false,
      reason: "impossible",
      message: "Enter a real calendar date",
    };
  }
  if (date.getTime() >= now.getTime()) {
    return { ok: false, reason: "future", message: "Enter a date in the past" };
  }
  return { ok: true, date };
}

export function getEventsAfterBirth(
  events: readonly CosmicEvent[],
  birthday: Date,
): CosmicEvent[] {
  return events.filter((event) => {
    const eventDate = new Date(`${event.date}T12:00:00`);
    return eventDate.getTime() > birthday.getTime();
  });
}

function birthdayInYear(birthday: Date, year: number): Date {
  const month = birthday.getMonth();
  const day = birthday.getDate();
  const candidate = new Date(year, month, day, 12);
  if (candidate.getMonth() !== month) {
    // In non-leap years, treat 29 February's completed anniversary as 1 March.
    return new Date(year, 2, 1, 12);
  }
  return candidate;
}

export interface PersonalTravelMetrics {
  approximateOrbitDistanceKm: number;
  completedSolarOrbits: number;
  daysSinceLastBirthday: number;
  calendarYearProgressPercent: number;
  ageDays: number;
  ageHours: number;
}

export function getPersonalTravelMetrics(
  birthday: Date,
  now: Date,
): PersonalTravelMetrics {
  const elapsedMs = Math.max(0, now.getTime() - birthday.getTime());
  const ageDays = elapsedMs / 86_400_000;
  let completedSolarOrbits = now.getFullYear() - birthday.getFullYear();
  if (now < birthdayInYear(birthday, now.getFullYear()))
    completedSolarOrbits -= 1;
  completedSolarOrbits = Math.max(0, completedSolarOrbits);

  const lastBirthday = birthdayInYear(
    birthday,
    birthday.getFullYear() + completedSolarOrbits,
  );
  const yearStart = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
  const calendarYearProgressPercent =
    ((now.getTime() - yearStart.getTime()) /
      (nextYearStart.getTime() - yearStart.getTime())) *
    100;

  return {
    approximateOrbitDistanceKm:
      (elapsedMs / 1000) * AVERAGE_EARTH_ORBITAL_SPEED_KM_S,
    completedSolarOrbits,
    daysSinceLastBirthday: Math.max(
      0,
      Math.floor((now.getTime() - lastBirthday.getTime()) / 86_400_000),
    ),
    calendarYearProgressPercent,
    ageDays,
    ageHours: ageDays * 24,
  };
}

export function formatApproximateDistance(kilometres: number): string {
  if (kilometres >= 1_000_000_000) {
    return `about ${(kilometres / 1_000_000_000).toFixed(1)} billion`;
  }
  if (kilometres >= 1_000_000) {
    return `about ${Math.round(kilometres / 1_000_000)} million`;
  }
  return `about ${Math.round(kilometres / 1_000).toLocaleString()} thousand`;
}

export function formatUniverseAgeEstimate(
  _legacyValue?: number | string,
): string {
  return UNIVERSE_AGE_ESTIMATE;
}
