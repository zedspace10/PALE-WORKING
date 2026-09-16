import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

import { createSerializedState } from "@/constants/serializedState";

const BIRTHDAY_KEY = "@pale_birthday";
const SHIFT_COUNT_KEY = "@pale_shift_count";

export function useBirthday() {
  const [birthday, setBirthdayState] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const store = useRef(createSerializedState<Date | null>(null)).current;

  useEffect(() => {
    AsyncStorage.getItem(BIRTHDAY_KEY)
      .then((val) => {
        if (val) {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            return store.replace(date, async () => {}).then(setBirthdayState);
          }
        }
      })
      .catch(() => setError("Your saved birthday could not be loaded."))
      .finally(() => {
        setLoading(false);
      });
  }, [store]);

  const saveBirthday = async (date: Date) => {
    try {
      const saved = await store.replace(date, (next) =>
        AsyncStorage.setItem(BIRTHDAY_KEY, next!.toISOString()),
      );
      setBirthdayState(saved);
      setError(null);
    } catch {
      setError("Your birthday could not be saved. Please try again.");
      throw new Error("Birthday save failed");
    }
  };

  const clearBirthday = async () => {
    try {
      await store.replace(null, () => AsyncStorage.removeItem(BIRTHDAY_KEY));
      setBirthdayState(null);
      setError(null);
    } catch {
      setError("Your birthday could not be cleared. Please try again.");
      throw new Error("Birthday clear failed");
    }
  };

  return { birthday, loading, error, saveBirthday, clearBirthday };
}

export function useShiftCount() {
  const [count, setCountState] = useState(0);
  const counter = useRef(createSerializedState(0)).current;

  useEffect(() => {
    AsyncStorage.getItem(SHIFT_COUNT_KEY)
      .then((val) => {
        if (!val) return;
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          return counter.replace(parsed, async () => {}).then(setCountState);
        }
      })
      .catch(() => {});
  }, [counter]);

  const incrementCount = async () => {
    const newCount = await counter.update(
      (current) => current + 1,
      (next) => AsyncStorage.setItem(SHIFT_COUNT_KEY, next.toString()),
    );
    setCountState(newCount);
  };

  return { count, incrementCount };
}
