import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const BIRTHDAY_KEY = "@pale_birthday";
const SHIFT_COUNT_KEY = "@pale_shift_count";

export function useBirthday() {
  const [birthday, setBirthdayState] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(BIRTHDAY_KEY)
      .then((val) => {
        if (val) {
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            setBirthdayState(date);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveBirthday = async (date: Date) => {
    await AsyncStorage.setItem(BIRTHDAY_KEY, date.toISOString());
    setBirthdayState(date);
  };

  const clearBirthday = async () => {
    await AsyncStorage.removeItem(BIRTHDAY_KEY);
    setBirthdayState(null);
  };

  return { birthday, loading, saveBirthday, clearBirthday };
}

export function useShiftCount() {
  const [count, setCountState] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(SHIFT_COUNT_KEY)
      .then((val) => {
        if (!val) return;
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          setCountState(parsed);
        }
      })
      .catch(() => {});
  }, []);

  const incrementCount = async () => {
    const newCount = count + 1;
    await AsyncStorage.setItem(SHIFT_COUNT_KEY, newCount.toString());
    setCountState(newCount);
  };

  return { count, incrementCount };
}
