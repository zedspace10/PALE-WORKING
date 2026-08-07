import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { getEntryForDate } from "@/constants/observatory";
import { findDusk } from "@/constants/solar";

const ENABLED_KEY = "pale_notifications_enabled";
const LOCATION_KEY = "pale_location_cache"; // written by app/tonight-sky.tsx
const CHANNEL_ID = "observatory";

/**
 * iOS silently drops anything past 64 pending local notifications. 50 leaves
 * headroom and is far longer than any realistic gap between app opens.
 */
const DAYS_AHEAD = 50;

/**
 * Notifications name a specific Observatory entry, so the whole batch goes
 * stale whenever OBSERVATORY_ENTRIES changes. Every refresh therefore cancels
 * and rebuilds rather than topping up.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ENABLED_KEY)) === "true";
  } catch {
    return false;
  }
}

/**
 * Turns the daily notification on or off. Returns the state actually reached,
 * which may be false if the user declines the system permission prompt.
 */
export async function setNotificationsEnabled(on: boolean): Promise<boolean> {
  if (!on) {
    try {
      await AsyncStorage.setItem(ENABLED_KEY, "false");
    } catch {}
    await Notifications.cancelAllScheduledNotificationsAsync();
    return false;
  }

  const granted = await ensurePermission();
  try {
    await AsyncStorage.setItem(ENABLED_KEY, granted ? "true" : "false");
  } catch {}
  if (granted) await refreshObservatorySchedule();
  return granted;
}

async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

async function readCachedLocation(): Promise<{ lat: number; lng: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(LOCATION_KEY);
    if (!raw) return null;
    const { lat, lng } = JSON.parse(raw);
    if (typeof lat !== "number" || typeof lng !== "number") return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * Cancels every pending notification and reschedules the next DAYS_AHEAD
 * nights, each at that night's civil dusk. Returns how many were scheduled.
 *
 * Returns 0 without scheduling anything when notifications are off, permission
 * is missing, or no location has been cached yet. It never guesses a location:
 * a wrong position means an alert firing in the middle of the night.
 */
export async function refreshObservatorySchedule(): Promise<number> {
  if (!(await areNotificationsEnabled())) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return 0;
  }

  const perms = await Notifications.getPermissionsAsync();
  if (!perms.granted) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return 0;
  }

  const loc = await readCachedLocation();
  if (!loc) return 0;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "The Observatory",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = Date.now();
  let scheduled = 0;

  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    const day = new Date();
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() + offset);

    const dusk = findDusk(loc.lat, loc.lng, day);
    if (!dusk) continue; // polar summer, or the sky never darkens that day
    if (dusk.getTime() <= now + 60_000) continue; // today's dusk already passed

    const entry = getEntryForDate(day);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `The Observatory: ${entry.location}`,
        body: entry.locationDetail,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: dusk,
        ...(Platform.OS === "android" ? { channelId: CHANNEL_ID } : {}),
      },
    });
    scheduled++;
  }

  return scheduled;
}
