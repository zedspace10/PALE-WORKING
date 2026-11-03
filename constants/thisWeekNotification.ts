/**
 * A quiet note when a new weekly picture arrives. There is no push server: PALE checks
 * stellaraspace.com in the background (the phone decides when, usually overnight) and, if the
 * picture is new, sets its own notification for the next lunchtime. At most one per picture, never
 * for a picture the person has already opened, and off until they turn it on.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { ensurePermission } from "@/constants/notifications";
import {
  parseSavedThisWeek,
  parseThisWeek,
  THIS_WEEK_CACHE_KEY,
  THIS_WEEK_URL,
  type ThisWeek,
} from "@/constants/thisWeek";

export const THIS_WEEK_TASK = "pale-this-week-check";
export const THIS_WEEK_NOTIFY_KEY = "@pale_this_week_notify";
/** The newest picture PALE has already told the person about, or that they have already seen. */
export const THIS_WEEK_SEEN_KEY = "@pale_this_week_seen";
export const THIS_WEEK_ID_PREFIX = "pale-this-week-";
const NOTIFY_HOUR = 12;
const NOTIFY_MINUTE = 30;

/** The next 12:30 in the person's own time, at least a minute from now. */
export function nextLunchtime(now: Date): Date {
  const at = new Date(now);
  at.setHours(NOTIFY_HOUR, NOTIFY_MINUTE, 0, 0);
  if (at.getTime() <= now.getTime() + 60_000) at.setDate(at.getDate() + 1);
  return at;
}

export function thisWeekNotificationContent(pin: ThisWeek) {
  const distance = pin.distance.charAt(0).toUpperCase() + pin.distance.slice(1);
  return {
    title: `This week: ${pin.object}`,
    body: `${pin.title}. ${distance}.`,
    data: { url: "/this-week" },
  };
}

export async function isThisWeekNotifyOn(): Promise<boolean> {
  return (
    (await AsyncStorage.getItem(THIS_WEEK_NOTIFY_KEY).catch(() => null)) ===
    "true"
  );
}

async function currentPinId(): Promise<string | null> {
  const saved = parseSavedThisWeek(
    await AsyncStorage.getItem(THIS_WEEK_CACHE_KEY).catch(() => null),
  );
  return saved?.pin.id ?? null;
}

/** The person opened this picture, so there is nothing to tell them. */
export async function markThisWeekSeen(id: string): Promise<void> {
  await AsyncStorage.setItem(THIS_WEEK_SEEN_KEY, id).catch(() => undefined);
  await Notifications.cancelScheduledNotificationAsync(
    `${THIS_WEEK_ID_PREFIX}${id}`,
  ).catch(() => undefined);
}

/**
 * Looks for a new picture and, if there is one, sets the notification. Returns what it did.
 * `fetchImpl` is passed in so this can be tested without the network.
 */
export async function checkForNewPicture(
  now = new Date(),
  fetchImpl: typeof fetch = fetch,
): Promise<"off" | "unchanged" | "scheduled" | "failed"> {
  if (!(await isThisWeekNotifyOn())) return "off";
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return "off";

  let raw: unknown;
  try {
    const res = await fetchImpl(THIS_WEEK_URL);
    if (!res.ok) return "failed";
    raw = await res.json();
  } catch {
    return "failed";
  }
  const pin = parseThisWeek(raw);
  if (!pin) return "failed";
  // Keep Explore's copy fresh as well.
  await AsyncStorage.setItem(
    THIS_WEEK_CACHE_KEY,
    JSON.stringify({ fetchedAt: now.getTime(), pin: raw }),
  ).catch(() => undefined);

  const seen = await AsyncStorage.getItem(THIS_WEEK_SEEN_KEY).catch(() => null);
  if (seen === pin.id) return "unchanged";
  await AsyncStorage.setItem(THIS_WEEK_SEEN_KEY, pin.id);

  await Notifications.scheduleNotificationAsync({
    identifier: `${THIS_WEEK_ID_PREFIX}${pin.id}`,
    content: thisWeekNotificationContent(pin),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextLunchtime(now),
      ...(Platform.OS === "android" ? { channelId: "this-week" } : {}),
    },
  });
  return "scheduled";
}

/** Turns the weekly note on or off. Returns whether it ended up on. */
export async function setThisWeekNotify(on: boolean): Promise<boolean> {
  // Loaded only here, so the rest of the app (and the tests) do not need the native modules.
  const BackgroundTask = await import("expo-background-task");
  if (!on) {
    await AsyncStorage.setItem(THIS_WEEK_NOTIFY_KEY, "false");
    await BackgroundTask.unregisterTaskAsync(THIS_WEEK_TASK).catch(
      () => undefined,
    );
    const pending =
      await Notifications.getAllScheduledNotificationsAsync().catch(() => []);
    await Promise.all(
      pending
        .filter((r) => r.identifier.startsWith(THIS_WEEK_ID_PREFIX))
        .map((r) =>
          Notifications.cancelScheduledNotificationAsync(r.identifier).catch(
            () => undefined,
          ),
        ),
    );
    return false;
  }

  const granted = await ensurePermission();
  if (!granted) {
    await AsyncStorage.setItem(THIS_WEEK_NOTIFY_KEY, "false");
    return false;
  }
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("this-week", {
      name: "This week's picture",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  // Whatever is showing now has already been seen: only the next new picture brings a note.
  const id = await currentPinId();
  if (id) await AsyncStorage.setItem(THIS_WEEK_SEEN_KEY, id);
  await AsyncStorage.setItem(THIS_WEEK_NOTIFY_KEY, "true");
  // Every six hours at most; in practice the phone chooses, usually overnight.
  await BackgroundTask.registerTaskAsync(THIS_WEEK_TASK, {
    minimumInterval: 6 * 60,
  });
  return true;
}
