import { getEntryForDate } from "@/constants/observatory";
import { findEveningSolarCrossing } from "@/constants/solar";

export interface NotificationCandidate {
  at: Date;
  title: string;
  body: string;
}

export function parseNotificationIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter(
      (identifier): identifier is string =>
        typeof identifier === "string" && identifier.length > 0,
    );
  } catch {
    return [];
  }
}

export function buildObservatorySchedule(
  coordinates: { lat: number; lng: number },
  now: Date,
  daysAhead: number,
): NotificationCandidate[] {
  const candidates: NotificationCandidate[] = [];
  for (let offset = 0; offset < daysAhead; offset += 1) {
    const day = new Date(now);
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    const crossing = findEveningSolarCrossing(
      coordinates.lat,
      coordinates.lng,
      day,
    );
    if (
      crossing.kind !== "crossing" ||
      crossing.at.getTime() <= now.getTime() + 60_000
    ) {
      continue;
    }
    const entry = getEntryForDate(day);
    candidates.push({
      at: crossing.at,
      title: `The Observatory: ${entry.location}`,
      body: `PALE estimates astronomical darkness is beginning. ${entry.locationDetail}`,
    });
  }
  return candidates;
}
