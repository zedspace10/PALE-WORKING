import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LightSignal } from "@/components/LightSignal";
import { JOURNAL_STORAGE_KEY } from "@/constants/journal";
import { StarField } from "@/components/StarField";
import {
  LOCATION_CACHE_KEY,
  parseCachedLocation,
  withTimeout,
  type Coordinates,
} from "@/constants/location";
import {
  aimAt,
  arrivalWords,
  DEFAULT_DESTINATION,
  DESTINATIONS,
  destinationOf,
  formatKm,
  heightWords,
  kmTravelled,
  MAX_NOTE_LINE,
  newNote,
  noteLink,
  NOTES_STORAGE_KEY,
  parseNotes,
  progressWords,
  type Aim,
  type Note,
} from "@/constants/notes";
import { useColors } from "@/hooks/useColors";
import { useResetScrollOnFocus } from "@/hooks/useResetScrollOnFocus";

// A location a few weeks old is still good enough to say which way to face.
const AIM_LOCATION_MAX_AGE_MS = 30 * 86_400_000;

async function findWhere(): Promise<Coordinates | null> {
  const cached = parseCachedLocation(
    await AsyncStorage.getItem(LOCATION_CACHE_KEY).catch(() => null),
    Date.now(),
    AIM_LOCATION_MAX_AGE_MS,
  );
  if (cached.ok) return { lat: cached.value.lat, lng: cached.value.lng };
  try {
    const { status } = await withTimeout(
      Location.requestForegroundPermissionsAsync(),
      10_000,
      "Location permission request timed out",
    );
    if (status !== "granted") return null;
    const position = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      10_000,
      "Location request timed out",
    );
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}

type Stage = "compose" | "sent" | "aim" | "light";

const capitalise = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Send a note to the universe: the Notes tab. Earlier journal entries stay reachable from the
 * bottom of this screen, so nobody loses what they wrote before the Journal became Notes.
 */
export function NotesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  // Room for the tab bar under the last note
  const bottomPad = (Platform.OS === "web" ? 34 : insets.bottom) + 70;

  const [notes, setNotes] = useState<Note[]>([]);
  const [line, setLine] = useState("");
  const [to, setTo] = useState(DEFAULT_DESTINATION);
  const [stage, setStage] = useState<Stage>("compose");
  const [current, setCurrent] = useState<Note | null>(null);
  const [aim, setAim] = useState<Aim | null | "none">(null);
  const [now, setNow] = useState(Date.now());
  const scrollRef = useRef<ScrollView>(null);
  useResetScrollOnFocus(scrollRef);
  const [journalCount, setJournalCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(NOTES_STORAGE_KEY)
      .then((raw) => setNotes(parseNotes(raw)))
      .catch(() => undefined);
    AsyncStorage.getItem(JOURNAL_STORAGE_KEY)
      .then((raw) => {
        const entries = raw ? JSON.parse(raw) : [];
        setJournalCount(Array.isArray(entries) ? entries.length : 0);
      })
      .catch(() => undefined);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const save = (next: Note[]) => {
    setNotes(next);
    AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(next)).catch(
      () => undefined,
    );
  };

  const send = () => {
    const text = line.trim() || "Hello from Earth.";
    const note = newNote(text, to);
    save([note, ...notes]);
    setCurrent(note);
    setStage("sent");
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const startAim = async () => {
    setStage("aim");
    setAim(null);
    const where = await findWhere();
    if (!where || !current) {
      setAim("none");
      return;
    }
    setAim(aimAt(destinationOf(current), where, new Date()));
  };

  const lightDone = (sent: boolean) => {
    if (sent && current) {
      const marked = { ...current, light: true };
      setCurrent(marked);
      save(notes.map((n) => (n.id === marked.id ? marked : n)));
    }
    setStage("sent");
  };

  const dest = current ? destinationOf(current) : null;
  const chosen = DESTINATIONS.find((d) => d.id === to) ?? null;
  const others = useMemo(
    () => notes.filter((n) => n.id !== current?.id),
    [notes, current],
  );

  const button = [styles.primary, { borderColor: colors.luminousBorder }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StarField count={70} containerOpacity={0.35} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 12, paddingBottom: bottomPad + 48 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {stage === "compose" && (
          <View style={styles.section}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Send a note to the universe
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              Write a line and choose where it is going. From the moment you
              send it, PALE follows how far it has gone at the speed of light.
              You can also send it as real light from your phone, and share a
              link so others can follow it.
            </Text>
            <TextInput
              value={line}
              onChangeText={setLine}
              maxLength={MAX_NOTE_LINE}
              placeholder="Hello from Earth."
              placeholderTextColor={colors.mutedForeground + "80"}
              accessibilityLabel="Your line"
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.glassStrong,
                  borderColor: colors.luminousBorder,
                },
              ]}
            />
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Follow it towards
            </Text>
            <View style={styles.stars}>
              {DESTINATIONS.map((d) => {
                const on = d.id === to;
                return (
                  <TouchableOpacity
                    key={d.id}
                    onPress={() => setTo(d.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${d.name}, ${arrivalWords(d)}`}
                    accessibilityState={{ selected: on }}
                    style={[
                      styles.star,
                      {
                        borderColor: on ? colors.primary : colors.border,
                        backgroundColor: on
                          ? colors.glassStrong
                          : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.starName,
                        {
                          color: on
                            ? colors.foreground
                            : colors.mutedForeground,
                        },
                      ]}
                    >
                      {d.short}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {chosen && (
              <View
                style={[
                  styles.chosen,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <Text style={[styles.chosenName, { color: colors.foreground }]}>
                  {chosen.name}
                </Text>
                <Text
                  style={[styles.chosenLine, { color: colors.mutedForeground }]}
                >
                  {chosen.line} {capitalise(arrivalWords(chosen))}.
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={send}
              accessibilityRole="button"
              style={[styles.primary, { borderColor: colors.primary }]}
            >
              <Text style={[styles.primaryText, { color: colors.foreground }]}>
                Send it
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {current && dest && stage !== "compose" && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.primary }]}>
              On its way to {dest.name}
            </Text>
            <Text style={[styles.title, { color: colors.foreground }]}>
              It has left Earth.
            </Text>
            <Text style={[styles.quote, { color: colors.foreground }]}>
              “{current.text}”
            </Text>
            <Text style={[styles.big, { color: colors.primary }]}>
              {formatKm(kmTravelled(current.sentAt, now))}
            </Text>
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              {capitalise(progressWords(current, now))}, travelling at the speed
              of light. It {arrivalWords(dest)}.
            </Text>

            {stage === "sent" && (
              <View style={styles.actions}>
                {!current.light && (
                  <TouchableOpacity
                    onPress={startAim}
                    accessibilityRole="button"
                    style={[styles.primary, { borderColor: colors.primary }]}
                  >
                    <Text
                      style={[styles.primaryText, { color: colors.foreground }]}
                    >
                      Send it with real light
                    </Text>
                  </TouchableOpacity>
                )}
                {current.light && (
                  <Text style={[styles.body, { color: colors.primary }]}>
                    You also sent it as real light from your phone.
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(noteLink(current)).catch(() => undefined)
                  }
                  accessibilityRole="link"
                  style={button}
                >
                  <Text
                    style={[styles.primaryText, { color: colors.foreground }]}
                  >
                    Follow it on the website
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setCurrent(null);
                    setLine("");
                    setStage("compose");
                  }}
                  accessibilityRole="button"
                  style={styles.secondary}
                >
                  <Text
                    style={[
                      styles.secondaryText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Write another
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {stage === "aim" && (
              <View style={styles.actions}>
                {aim === null && (
                  <Text
                    style={[styles.body, { color: colors.mutedForeground }]}
                  >
                    Finding {dest.name} in your sky…
                  </Text>
                )}
                {aim !== null && aim !== "none" && aim.kind === "up" && (
                  <Text style={[styles.aim, { color: colors.foreground }]}>
                    Face {aim.direction}, and point the phone{" "}
                    {heightWords(aim.alt)}. {dest.name} is there, whether or not
                    you can see it.
                  </Text>
                )}
                {aim !== null && aim !== "none" && aim.kind === "below" && (
                  <Text style={[styles.aim, { color: colors.foreground }]}>
                    {dest.name} is below your horizon right now
                    {aim.risesAt
                      ? `, and rises at about ${aim.risesAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : ""}
                    . You can send the light then, or point it straight up now,
                    and it will travel out among the stars all the same.
                  </Text>
                )}
                {aim === "none" && (
                  <Text style={[styles.aim, { color: colors.foreground }]}>
                    Without your location PALE cannot tell where {dest.name} is
                    tonight. Point the phone straight up instead; the light will
                    travel out among the stars all the same.
                  </Text>
                )}
                {aim !== null && (
                  <LightSignal line={current.text} onDone={lightDone} />
                )}
                <TouchableOpacity
                  onPress={() => setStage("sent")}
                  accessibilityRole="button"
                  style={styles.secondary}
                >
                  <Text
                    style={[
                      styles.secondaryText,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Not now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {others.length > 0 && stage !== "aim" && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Your notes
            </Text>
            {others.map((n) => {
              const d = destinationOf(n);
              return (
                <View
                  key={n.id}
                  style={[styles.noteRow, { borderColor: colors.border }]}
                >
                  <Text style={[styles.noteText, { color: colors.foreground }]}>
                    “{n.text}”
                  </Text>
                  <Text
                    style={[styles.noteMeta, { color: colors.mutedForeground }]}
                  >
                    To {d.name}. {formatKm(kmTravelled(n.sentAt, now))},{" "}
                    {progressWords(n, now)}.
                    {n.light ? " Also sent as light." : ""}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(noteLink(n)).catch(() => undefined)
                    }
                    accessibilityRole="link"
                  >
                    <Text style={[styles.link, { color: colors.primary }]}>
                      Follow it
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
        {journalCount > 0 && stage === "compose" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/journal")}
            accessibilityRole="button"
            style={[styles.noteRow, { borderColor: colors.border }]}
          >
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Your journal
            </Text>
            <Text style={[styles.noteMeta, { color: colors.mutedForeground }]}>
              {journalCount} {journalCount === 1 ? "entry" : "entries"} from
              before, still only on this phone.
            </Text>
            <Text style={[styles.link, { color: colors.primary }]}>
              Open your journal
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    alignSelf: "center",
    gap: 28,
    maxWidth: 620,
    paddingHorizontal: 24,
    width: "100%",
  },
  section: { gap: 14 },
  actions: { gap: 12, marginTop: 8 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  body: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_400Regular" },
  aim: { fontSize: 17, lineHeight: 26, fontFamily: "Inter_500Medium" },
  quote: {
    fontSize: 17,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  big: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
    fontVariant: ["tabular-nums"],
    marginTop: 8,
  },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  stars: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  star: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  starName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  chosen: { borderRadius: 16, borderWidth: 1, gap: 4, padding: 16 },
  chosenName: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  chosenLine: { fontSize: 14, lineHeight: 21, fontFamily: "Inter_400Regular" },
  primary: {
    alignItems: "center",
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 20,
  },
  primaryText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  secondary: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  secondaryText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  noteRow: { borderTopWidth: 1, gap: 4, paddingTop: 12 },
  noteText: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_500Medium" },
  noteMeta: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular" },
  link: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
    minHeight: 32,
    textAlignVertical: "center",
  },
});
