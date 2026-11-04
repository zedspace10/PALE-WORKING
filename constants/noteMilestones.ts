/**
 * A notification each time a sent note's light passes a milestone: the Sun's distance, Jupiter's
 * orbit, Neptune's orbit, Voyager 1, and arrival for stars within a hundred light years. Every
 * time is known the moment the note is sent, so PALE sets them on the phone itself: no server,
 * nothing sent. The note's own words never appear in a notification, so nothing private shows
 * on a locked screen.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { ensurePermission } from "@/constants/notifications";
import {
  destinationOf,
  marks,
  NOTES_STORAGE_KEY,
  parseNotes,
  type Note,
} from "@/constants/notes";

export const NOTE_MILESTONES_KEY = "@pale_note_milestones";
export const NOTE_ID_PREFIX = "pale-note-";
/** The most note milestones waiting at once (see the 64 limit in notifications.ts). */
export const NOTE_BUDGET = 30;
const YEAR_MS = 365.25 * 86_400_000;
// The Moon is passed 1.3 seconds after sending, while the person is still looking at the screen.
const SKIP = new Set(["the Moon"]);
// Arrivals further off than this are left out: a phone cannot hold a notification for centuries.
const MAX_ARRIVAL_YEARS = 100;

export interface PlannedNote {
  identifier: string;
  at: number;
  title: string;
  body: string;
}

const KEYS: Record<string, string> = {
  "the Sun's distance": "sun",
  "Jupiter's orbit": "jupiter",
  "Neptune's orbit": "neptune",
  "Voyager 1": "voyager",
};

/** "8 minutes", "about 4 hours", "about a day". */
export function afterWords(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  const hours = Math.round(seconds / 3600);
  if (hours < 20) return `about ${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.round(seconds / 86_400);
  return days <= 1 ? "about a day" : `about ${days} days`;
}

function spanWords(years: number): string {
  const whole = Math.floor(years);
  const months = Math.round((years - whole) * 12);
  const y = `${whole} ${whole === 1 ? "year" : "years"}`;
  return months ? `${y} and ${months} ${months === 1 ? "month" : "months"}` : y;
}

/** Every milestone still to come for one note, soonest first. */
export function milestonesFor(note: Note, now: number): PlannedNote[] {
  const dest = destinationOf(note);
  const arriveAt = note.sentAt + dest.ly * YEAR_MS;
  const out: PlannedNote[] = [];
  for (const m of marks(note.sentAt + 86_400_000)) {
    if (SKIP.has(m.name)) continue;
    // A note to a planet arrives before it reaches the farther landmarks.
    if (note.sentAt + m.seconds * 1000 >= arriveAt) continue;
    const at = note.sentAt + m.seconds * 1000;
    const extra =
      m.name === "Voyager 1" ? ", the farthest thing people have built" : "";
    out.push({
      identifier: `${NOTE_ID_PREFIX}${note.id}-${KEYS[m.name] ?? m.name}`,
      at,
      title: `Your note to ${dest.short}`,
      body: `It has just passed ${m.name}${extra}, ${afterWords(m.seconds)} after you sent it.`,
    });
  }
  if (dest.ly <= MAX_ARRIVAL_YEARS) {
    out.push({
      identifier: `${NOTE_ID_PREFIX}${note.id}-arrived`,
      at: arriveAt,
      title: `Your note has reached ${dest.name}`,
      body: `After ${dest.ly < 1 ? afterWords((arriveAt - note.sentAt) / 1000) : spanWords(dest.ly)} at the speed of light.`,
    });
  }
  return out.filter((p) => p.at > now + 30_000).sort((a, b) => a.at - b.at);
}

/** The soonest milestones across all notes, up to the budget. */
export function planNoteNotifications(
  notes: Note[],
  now: number,
  budget = NOTE_BUDGET,
): PlannedNote[] {
  return notes
    .flatMap((n) => milestonesFor(n, now))
    .sort((a, b) => a.at - b.at)
    .slice(0, budget);
}

export async function areNoteMilestonesOn(): Promise<boolean> {
  return (
    (await AsyncStorage.getItem(NOTE_MILESTONES_KEY).catch(() => null)) ===
    "true"
  );
}

let queue: Promise<unknown> = Promise.resolve();
/** Brings the phone's note notifications in line with the notes. One run at a time. */
export function refreshNoteMilestones(now = Date.now()): Promise<number> {
  const run = queue.then(
    () => rebuild(now),
    () => rebuild(now),
  );
  queue = run.catch(() => undefined);
  return run;
}

async function pendingNoteIds(): Promise<Set<string>> {
  const pending = await Notifications.getAllScheduledNotificationsAsync().catch(
    () => [],
  );
  return new Set(
    pending
      .map((r) => r.identifier)
      .filter((id) => id.startsWith(NOTE_ID_PREFIX)),
  );
}

async function rebuild(now: number): Promise<number> {
  const pending = await pendingNoteIds();
  const on =
    (await areNoteMilestonesOn()) &&
    (await Notifications.getPermissionsAsync()).granted;
  const plan = on
    ? planNoteNotifications(
        parseNotes(
          await AsyncStorage.getItem(NOTES_STORAGE_KEY).catch(() => null),
        ),
        now,
      )
    : [];
  const wanted = new Set(plan.map((p) => p.identifier));
  await Promise.all(
    [...pending]
      .filter((id) => !wanted.has(id))
      .map((id) =>
        Notifications.cancelScheduledNotificationAsync(id).catch(
          () => undefined,
        ),
      ),
  );
  if (plan.length && Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("notes", {
      name: "Your notes",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  for (const p of plan) {
    if (pending.has(p.identifier)) continue;
    await Notifications.scheduleNotificationAsync({
      identifier: p.identifier,
      content: { title: p.title, body: p.body, data: { url: "/notes" } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(p.at),
        ...(Platform.OS === "android" ? { channelId: "notes" } : {}),
      },
    });
  }
  return plan.length;
}

/** Turns note milestones on or off. Returns whether they ended up on. */
export async function setNoteMilestones(on: boolean): Promise<boolean> {
  const granted = on ? await ensurePermission() : false;
  await AsyncStorage.setItem(NOTE_MILESTONES_KEY, granted ? "true" : "false");
  await refreshNoteMilestones();
  return granted;
}
