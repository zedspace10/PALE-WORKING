import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import {
  areNotificationsEnabled,
  setNotificationsEnabled,
} from "@/constants/notifications";
import { useColors } from "@/hooks/useColors";

export function NightlyReminderToggle() {
  const colors = useColors();
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const enabled = await areNotificationsEnabled();
      if (!alive) return;
      setOn(enabled);
      if (enabled) setNote(await locationNote());
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function locationNote(): Promise<string | null> {
    try {
      const raw = await AsyncStorage.getItem("pale_location_cache");
      return raw
        ? null
        : "Open Tonight's Sky once so PALE knows when it gets dark where you are.";
    } catch {
      return null;
    }
  }

  async function handleToggle(next: boolean) {
    setBusy(true);
    setNote(null);
    const reached = await setNotificationsEnabled(next);
    setOn(reached);

    if (next && !reached) {
      setNote("Notifications are turned off for PALE in your device settings.");
    } else if (reached) {
      setNote(await locationNote());
    }
    setBusy(false);
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.labels}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Nightly reminder
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            when the sky gets dark where you are
          </Text>
        </View>
        <Switch
          value={on}
          onValueChange={handleToggle}
          disabled={busy}
          trackColor={{ false: colors.border, true: colors.primary + "55" }}
          thumbColor={on ? colors.primary : undefined}
        />
      </View>

      {note && (
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          {note}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  labels: { flex: 1, gap: 4 },
  title: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  note: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
