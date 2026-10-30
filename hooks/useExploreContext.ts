import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  LOCATION_CACHE_KEY,
  parseCachedLocation,
  type Coordinates,
} from "@/constants/location";
import { NOTES_STORAGE_KEY, parseNotes, type Note } from "@/constants/notes";
import { useBirthday } from "@/hooks/useBirthday";

// A location a few weeks old still says which way to face. Explore only uses one the person has
// already shared elsewhere in PALE; it never asks for it.
const EXPLORE_LOCATION_MAX_AGE_MS = 30 * 86_400_000;

export interface ExploreContext {
  where: Coordinates | null;
  notes: Note[];
  birthday: Date | null;
  now: Date;
}

/** What Explore needs to make each place personal, refreshed whenever the screen comes into view. */
export function useExploreContext(): ExploreContext {
  const { birthday } = useBirthday();
  const [where, setWhere] = useState<Coordinates | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [now, setNow] = useState(() => new Date());

  useFocusEffect(
    useCallback(() => {
      let live = true;
      setNow(new Date());
      Promise.all([
        AsyncStorage.getItem(LOCATION_CACHE_KEY).catch(() => null),
        AsyncStorage.getItem(NOTES_STORAGE_KEY).catch(() => null),
      ]).then(([locationRaw, notesRaw]) => {
        if (!live) return;
        const cached = parseCachedLocation(
          locationRaw,
          Date.now(),
          EXPLORE_LOCATION_MAX_AGE_MS,
        );
        setWhere(
          cached.ok ? { lat: cached.value.lat, lng: cached.value.lng } : null,
        );
        setNotes(parseNotes(notesRaw));
      });
      return () => {
        live = false;
      };
    }, []),
  );

  return { where, notes, birthday, now };
}
