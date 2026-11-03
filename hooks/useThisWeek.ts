import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  needsRefresh,
  parseSavedThisWeek,
  parseThisWeek,
  THIS_WEEK_CACHE_KEY,
  THIS_WEEK_URL,
  type ThisWeek,
} from "@/constants/thisWeek";

/**
 * This week's picture: the saved copy straight away, and a fresh one from stellaraspace.com when
 * the saved one is a few hours old. If the site cannot be reached, the saved copy stays.
 */
export function useThisWeek(): ThisWeek | null {
  const [pin, setPin] = useState<ThisWeek | null>(null);

  useFocusEffect(
    useCallback(() => {
      let live = true;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      (async () => {
        const saved = parseSavedThisWeek(
          await AsyncStorage.getItem(THIS_WEEK_CACHE_KEY).catch(() => null),
        );
        if (live && saved) setPin(saved.pin);
        if (!needsRefresh(saved, Date.now())) return;
        try {
          const res = await fetch(THIS_WEEK_URL, { signal: controller.signal });
          if (!res.ok) return;
          const raw: unknown = await res.json();
          const fresh = parseThisWeek(raw);
          if (!fresh) return;
          // The site's own copy is saved, and checked again whenever it is read back.
          AsyncStorage.setItem(
            THIS_WEEK_CACHE_KEY,
            JSON.stringify({ fetchedAt: Date.now(), pin: raw }),
          ).catch(() => undefined);
          if (live) setPin(fresh);
        } catch {
          // Offline or the site is down: keep what we have.
        }
      })();
      return () => {
        live = false;
        clearTimeout(timer);
        controller.abort();
      };
    }, []),
  );

  return pin;
}
