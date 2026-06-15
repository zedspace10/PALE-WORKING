import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const KEY = "@pale_open_count";

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
      } catch {
        setTodayCount(1);
      } finally {
        setLoaded(true);
      }
    }
    increment();
  }, []);

  return { todayCount, loaded };
}
