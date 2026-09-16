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

export async function cancelObservatoryNotifications(): Promise<void> {
  const identifiers = await readOurNotificationIds();
  await Promise.all(
    identifiers.map((identifier) =>
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

async function ensurePermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

/** Replaces only PALE Observatory notifications; unrelated notifications remain untouched. */
export async function refreshObservatorySchedule(
  now = new Date(),
): Promise<number> {
  if (!(await areNotificationsEnabled())) {
    await cancelObservatoryNotifications();
    return 0;
  }

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    await cancelObservatoryNotifications();
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

  await cancelObservatoryNotifications();
  const scheduledIds: string[] = [];
  try {
    for (const candidate of buildObservatorySchedule(
      cache.value,
      now,
      DAYS_AHEAD,
    )) {
      const identifier = await Notifications.scheduleNotificationAsync({
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
