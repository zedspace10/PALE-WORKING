import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import {
  buildObservatorySchedule,
  parseNotificationIds,
} from "@/constants/notificationDomain";
import { LOCATION_CACHE_KEY, parseCachedLocation } from "@/constants/location";

const ENABLED_KEY = "pale_notifications_enabled";
export const NOTIFICATION_IDS_KEY = "pale_observatory_notification_ids";
const CHANNEL_ID = "observatory";
const DAYS_AHEAD = 50;
/** Every Observatory reminder is named for its evening, so scheduling one again replaces it. */
export const OBSERVATORY_ID_PREFIX = "pale-observatory-";
const OBSERVATORY_TITLE_PREFIX = "The Observatory:";

export function observatoryIdFor(at: Date): string {
  const y = at.getFullYear();
  const m = String(at.getMonth() + 1).padStart(2, "0");
  const d = String(at.getDate()).padStart(2, "0");
  return `${OBSERVATORY_ID_PREFIX}${y}-${m}-${d}`;
}

// Refreshes run one at a time. Two running together (opening the app fires one on start and
// another as it becomes active) each scheduled a full set, and one set was then never cancelled,
// so some evenings had the reminder twice.
let queue: Promise<unknown> = Promise.resolve();
function oneAtATime<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export {
  buildObservatorySchedule,
  parseNotificationIds,
} from "@/constants/notificationDomain";

async function readOurNotificationIds(): Promise<string[]> {
  return parseNotificationIds(await AsyncStorage.getItem(NOTIFICATION_IDS_KEY));
}

async function storeOurNotificationIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(ids));
}

export function cancelObservatoryNotifications(): Promise<void> {
  return oneAtATime(cancelAllObservatory);
}

/**
 * Cancels every Observatory reminder on the phone: the ones PALE remembers, plus any left behind
 * by an earlier version (found by name or title). Other notifications are left alone.
 */
async function cancelAllObservatory(): Promise<void> {
  const identifiers = new Set(await readOurNotificationIds());
  try {
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    for (const request of pending ?? []) {
      const title = request.content?.title ?? "";
      if (
        request.identifier.startsWith(OBSERVATORY_ID_PREFIX) ||
        title.startsWith(OBSERVATORY_TITLE_PREFIX)
      ) {
        identifiers.add(request.identifier);
      }
    }
  } catch {
    // If the list cannot be read, the remembered ones are still cancelled.
  }
  await Promise.all(
    [...identifiers].map((identifier) =>
      Notifications.cancelScheduledNotificationAsync(identifier).catch(
        () => undefined,
      ),
    ),
  );
  await storeOurNotificationIds([]);
}

export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ENABLED_KEY)) === "true";
  } catch {
    return false;
  }
}

export async function setNotificationsEnabled(on: boolean): Promise<boolean> {
  if (!on) {
    await AsyncStorage.setItem(ENABLED_KEY, "false").catch(() => undefined);
    await cancelObservatoryNotifications();
    return false;
  }

  const granted = await ensurePermission();
  await AsyncStorage.setItem(ENABLED_KEY, granted ? "true" : "false").catch(
    () => undefined,
  );
  if (granted) await refreshObservatorySchedule();
  return granted;
}

export async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Replaces only PALE Observatory notifications; unrelated notifications remain untouched. */
export function refreshObservatorySchedule(now = new Date()): Promise<number> {
  return oneAtATime(() => rebuildObservatory(now));
}

async function rebuildObservatory(now: Date): Promise<number> {
  if (!(await areNotificationsEnabled())) {
    await cancelAllObservatory();
    return 0;
  }

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    await cancelAllObservatory();
    return 0;
  }

  const cache = parseCachedLocation(
    await AsyncStorage.getItem(LOCATION_CACHE_KEY).catch(() => null),
    now.getTime(),
  );
  if (!cache.ok) return 0;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "The Observatory",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await cancelAllObservatory();
  const scheduledIds: string[] = [];
  try {
    for (const candidate of buildObservatorySchedule(
      cache.value,
      now,
      DAYS_AHEAD,
    )) {
      const identifier = await Notifications.scheduleNotificationAsync({
        identifier: observatoryIdFor(candidate.at),
        content: { title: candidate.title, body: candidate.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: candidate.at,
          ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
        },
      });
      scheduledIds.push(identifier);
      await storeOurNotificationIds(scheduledIds);
    }
  } catch (error) {
    await storeOurNotificationIds(scheduledIds).catch(() => undefined);
    throw error;
  }
  return scheduledIds.length;
}
