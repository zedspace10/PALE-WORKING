import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  title: string;
  subtitle: string;
  isOn: () => Promise<boolean>;
  setOn: (on: boolean) => Promise<boolean>;
  /** Shown under the switch once it is on. */
  onNote?: string;
}

/** A notification setting on the You tab, matching the Observatory reminder card. */
export function NotifyToggle({ title, subtitle, isOn, setOn, onNote }: Props) {
  const colors = useColors();
  const [on, setOnState] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    isOn().then((v) => {
      if (alive) setOnState(v);
    });
    return () => {
      alive = false;
    };
  }, [isOn]);

  async function handleToggle(next: boolean) {
    setBusy(true);
    setNote(null);
    try {
      const reached = await setOn(next);
      setOnState(reached);
      if (next && !reached) {
        setNote(
          "Notifications for PALE are turned off in your phone's settings.",
        );
      } else if (reached && onNote) {
        setNote(onNote);
      }
    } catch {
      setOnState(await isOn());
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
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        </View>
        <Switch
          value={on}
          onValueChange={handleToggle}
          disabled={busy}
          accessibilityLabel={title}
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
