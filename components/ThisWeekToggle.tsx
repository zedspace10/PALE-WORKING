import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import {
  isThisWeekNotifyOn,
  setThisWeekNotify,
} from "@/constants/thisWeekNotification";
import { useColors } from "@/hooks/useColors";

/** On the You tab, next to the Observatory reminder: a note when a new weekly picture arrives. */
export function ThisWeekToggle() {
  const colors = useColors();
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    isThisWeekNotifyOn().then((v) => {
      if (alive) setOn(v);
    });
    return () => {
      alive = false;
    };
  }, []);

  async function handleToggle(next: boolean) {
    setBusy(true);
    setNote(null);
    try {
      const reached = await setThisWeekNotify(next);
      setOn(reached);
      if (next && !reached) {
        setNote(
          "Notifications for PALE are turned off in your phone's settings.",
        );
      } else if (reached) {
        setNote(
          "Your phone decides when PALE can check, so the note can arrive a day or so after the picture.",
        );
      }
    } catch {
      setOn(await isThisWeekNotifyOn());
      setNote("This could not be changed. Check your settings and try again.");
    } finally {
      setBusy(false);
    }
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
            This week&apos;s picture
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A note when a new Hubble or Webb picture arrives
          </Text>
        </View>
        <Switch
          value={on}
          onValueChange={handleToggle}
          disabled={busy}
          accessibilityLabel="Tell me when this week's picture arrives"
          trackColor={{ false: colors.border, true: colors.primary + "55" }}
          thumbColor={on ? colors.primary : undefined}
        />
      </View>
      {note ? (
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          {note}
        </Text>
      ) : null}
    </View>
  );
}

// Matches the Observatory reminder card beside it.
const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 20, gap: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  labels: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: 0.2 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  note: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
