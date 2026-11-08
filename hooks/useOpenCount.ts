import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "@pale_open_count";
const LAST_OPEN_KEY = "@pale_last_open_at";
const BIRTHDAY_KEY = "@pale_birthday";

interface OpenRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useOpenCount() {
  const [todayCount, setTodayCount] = useState<number>(1);
  const [loaded, setLoaded] = useState(false);
  // For the opening card: when PALE was last opened, and the birthday if one was added. Both stay
  // on the phone.
  const [lastVisitAt, setLastVisitAt] = useState<number | null>(null);
  const [birthday, setBirthday] = useState<Date | null>(null);

  useEffect(() => {
    async function increment() {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const today = todayStr();
        let record: OpenRecord = raw ? JSON.parse(raw) : { date: "", count: 0 };

        if (record.date !== today) {
          record = { date: today, count: 1 };
        } else {
          record.count += 1;
        }

        await AsyncStorage.setItem(KEY, JSON.stringify(record));
        setTodayCount(record.count);

        const [last, born] = await Promise.all([
          AsyncStorage.getItem(LAST_OPEN_KEY),
          AsyncStorage.getItem(BIRTHDAY_KEY),
        ]);
        const lastAt = Number(last);
        if (Number.isFinite(lastAt) && lastAt > 0) setLastVisitAt(lastAt);
        const bornAt = born ? new Date(born) : null;
        if (bornAt && !Number.isNaN(bornAt.getTime())) setBirthday(bornAt);
        await AsyncStorage.setItem(LAST_OPEN_KEY, String(Date.now()));
      } catch {
        setTodayCount(1);
      } finally {
        setLoaded(true);
      }
    }
    increment();
  }, []);

  return { todayCount, loaded, lastVisitAt, birthday };
}
