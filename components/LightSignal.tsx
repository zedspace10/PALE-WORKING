import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { morsePulses, signalSeconds, signalText } from "@/constants/notes";
import { useColors } from "@/hooks/useColors";

type Source = "torch" | "screen";
type Phase = "ready" | "warming" | "sending" | "done";

interface Props {
  line: string;
  onDone: (sent: boolean) => void;
}

/**
 * Sends a line as real light: the phone's torch flashes it in Morse code. Where the torch cannot
 * be used (the web, or camera access turned down) the whole screen flashes instead, which is also
 * real light leaving the phone. Nothing is recorded or sent anywhere; the camera is only opened
 * because that is how iPhone lets an app switch the torch on.
 */
export function LightSignal({ line, onDone }: Props) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [source, setSource] = useState<Source | null>(
    Platform.OS === "web" ? "screen" : null,
  );
  const [phase, setPhase] = useState<Phase>("ready");
  const [lit, setLit] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);
  const started = useRef(false);

  const text = signalText(line);
  const seconds = signalSeconds(line);

  useEffect(
    () => () => {
      cancelled.current = true;
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const play = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const pulses = morsePulses(line);
    setPhase("sending");
    let i = 0;
    const step = () => {
      if (cancelled.current) return;
      if (i >= pulses.length) {
        setLit(false);
        setPhase("done");
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return;
      }
      const pulse = pulses[i++];
      setLit(pulse.on);
      setCharIndex(pulse.char);
      timer.current = setTimeout(step, pulse.ms);
    };
    // A short pause first, so the person can steady the phone.
    timer.current = setTimeout(step, 1200);
  }, [line]);

  const begin = async () => {
    if (Platform.OS === "web") {
      setSource("screen");
      play();
      return;
    }
    let granted = permission?.granted ?? false;
    if (!granted) {
      const answer = await requestPermission().catch(() => null);
      granted = answer?.granted ?? false;
    }
    if (granted) {
      setSource("torch");
      setPhase("warming"); // playback starts once the camera reports it is ready
    } else {
      setSource("screen");
      play();
    }
  };

  const stop = () => {
    cancelled.current = true;
    if (timer.current) clearTimeout(timer.current);
    setLit(false);
    onDone(false);
  };

  const screenFlash = source === "screen" && phase === "sending";

  return (
    <View style={styles.wrap}>
      {source === "torch" && phase !== "done" ? (
        <CameraView
          style={styles.hiddenCamera}
          facing="back"
          enableTorch={lit}
          onCameraReady={play}
          onMountError={() => {
            setSource("screen");
            play();
          }}
        />
      ) : null}

      {phase === "ready" && (
        <View style={styles.block}>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Your phone will flash “{text}” in Morse code, about {seconds}{" "}
            seconds of light. Hold it up towards the star, the torch facing the
            sky.
          </Text>
          <TouchableOpacity
            onPress={begin}
            accessibilityRole="button"
            style={[styles.primary, { borderColor: colors.primary }]}
          >
            <Text style={[styles.primaryText, { color: colors.foreground }]}>
              Send the light
            </Text>
          </TouchableOpacity>
          <Text style={[styles.small, { color: colors.mutedForeground }]}>
            On iPhone this asks to use the camera, because that is how apps
            switch on the torch. Nothing is recorded. Never point a light at
            aircraft.
          </Text>
        </View>
      )}

      <Modal
        visible={phase !== "ready"}
        animationType="fade"
        onRequestClose={stop}
        statusBarTranslucent
      >
        <View
          style={[
            styles.modal,
            {
              backgroundColor:
                screenFlash && lit ? "#FFFFFF" : colors.background,
            },
          ]}
        >
          {(phase === "warming" || phase === "sending") && (
            <View style={styles.modalBlock}>
              <Text
                style={[
                  styles.title,
                  { color: screenFlash && lit ? "#05070C" : colors.foreground },
                ]}
              >
                {phase === "warming" ? "Getting the light ready" : "Sending"}
              </Text>
              <Text
                style={[
                  styles.signal,
                  { color: screenFlash && lit ? "#05070C" : colors.primary },
                ]}
                accessibilityLiveRegion="polite"
              >
                {[...text].map((ch, i) => (
                  <Text
                    key={i}
                    style={{
                      opacity: i <= charIndex ? 1 : 0.3,
                    }}
                  >
                    {ch}
                  </Text>
                ))}
              </Text>
              <TouchableOpacity
                onPress={stop}
                accessibilityRole="button"
                style={styles.secondary}
              >
                <Text
                  style={[
                    styles.secondaryText,
                    {
                      color:
                        screenFlash && lit ? "#05070C" : colors.mutedForeground,
                    },
                  ]}
                >
                  Stop
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {phase === "done" && (
            <View style={styles.modalBlock}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                The light has left.
              </Text>
              <Text style={[styles.body, { color: colors.mutedForeground }]}>
                Much of it scattered in the air. The rest is travelling away
                from Earth at 300,000 km every second, and it will not stop.
              </Text>
              <TouchableOpacity
                onPress={() => onDone(true)}
                accessibilityRole="button"
                style={[styles.primary, { borderColor: colors.primary }]}
              >
                <Text
                  style={[styles.primaryText, { color: colors.foreground }]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  hiddenCamera: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
  },
  block: { gap: 14 },
  modal: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  modalBlock: { gap: 18, maxWidth: 520, alignSelf: "center", width: "100%" },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
  signal: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  primary: {
    alignItems: "center",
    borderRadius: 27,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 54,
  },
  primaryText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  secondary: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  secondaryText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
