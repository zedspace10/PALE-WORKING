/**
 * The cosmic calendar: all 13.8 billion years squeezed into one calendar year. The Big Bang is
 * the first moment of 1 January and now is midnight at the end of 31 December. Each day is
 * about 38 million years; each second is about 440 years.
 */
import { UNIVERSE_AGE_YEARS } from "@/constants/timeJourney";

const YEAR_DAYS = 365;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** How long ago each moment in the Time Machine happened, in years. */
export const CALENDAR_YEARS_AGO: Record<string, number> = {
  "big-bang": UNIVERSE_AGE_YEARS,
  cmb: UNIVERSE_AGE_YEARS - 380_000,
  "dark-ages": 13.6e9,
  "first-stars": 13.5e9,
  "first-galaxies": 13.4e9,
  "sun-born": 4.6e9,
  "earth-forms": 4.54e9,
  oceans: 4.4e9,
  "first-life": 3.5e9,
  oxygen: 2.4e9,
  "complex-cells": 2e9,
  multicellular: 600e6,
  cambrian: 540e6,
  land: 470e6,
  dinosaurs: 230e6,
  asteroid: 66e6,
  mammals: 66e6,
  primates: 6e6,
  fire: 1e6,
  "homo-sapiens": 300_000,
  "out-of-africa": 70_000,
  civilization: 12_000,
  now: 0,
};

function clock(secondsIntoDay: number, withSeconds: boolean): string {
  const s = Math.floor(secondsIntoDay);
  const h24 = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}${withSeconds ? `:${pad(sec)}` : ""} ${h24 < 12 ? "am" : "pm"}`;
}

/** "1 September", "30 December, 6:04 am", "31 December, 11:59:48 pm". */
export function calendarWords(yearsAgo: number): string {
  if (yearsAgo <= 0) return "Midnight, 31 December";
  if (yearsAgo >= UNIVERSE_AGE_YEARS) return "1 January, just after midnight";
  const days = (1 - yearsAgo / UNIVERSE_AGE_YEARS) * YEAR_DAYS;
  let day = Math.floor(days);
  const secondsIntoDay = (days - day) * 86_400;
  let month = 0;
  while (day >= MONTH_DAYS[month]) {
    day -= MONTH_DAYS[month];
    month += 1;
  }
  const date = `${day + 1} ${MONTHS[month]}`;
  // The last two days are where everything human happens, so give the time of day there.
  if (month === 11 && day >= 29) {
    const secondsLeft = 86_400 - secondsIntoDay;
    return `${date}, ${clock(secondsIntoDay, day === 30 && secondsLeft < 60)}`;
  }
  // The first day holds the first light, minutes after the start.
  if (month === 0 && day === 0)
    return `${date}, ${clock(secondsIntoDay, false)}`;
  return date;
}

export function calendarFor(id: string): string | null {
  const years = CALENDAR_YEARS_AGO[id];
  return years === undefined ? null : calendarWords(years);
}

export const CALENDAR_INTRO =
  "Squeeze all of it into one year, and the Big Bang is the first moment of 1 January. Now is midnight on 31 December. Each moment below shows its date.";
