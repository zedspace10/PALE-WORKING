import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Sound for the four moments of a Shift journey.
 *
 * Everything here fails silently. If a file is missing, if the device refuses
 * to play, if audio is unavailable for any reason, the journey runs exactly as
 * it does in silence. Sound is never allowed to break the sequence.
 *
 * To add audio, drop the four files into assets/sounds and uncomment the
 * matching require lines below. Until then the module is inert.
 */

export type ShiftSound = "begin" | "stage" | "contract" | "arrive";

const MUTED_KEY = "pale_shift_muted";

/**
 * Add files as: assets/sounds/begin.mp3, stage.mp3, contract.mp3, arrive.mp3
 * then uncomment. require() paths must be literal, so they cannot be built
 * from a variable.
 */
const FILES: Partial<Record<ShiftSound, number>> = {
  // begin: require("@/assets/sounds/begin.mp3"),
  // stage: require("@/assets/sounds/stage.mp3"),
  // contract: require("@/assets/sounds/contract.mp3"),
  // arrive: require("@/assets/sounds/arrive.mp3"),
};

const players: Partial<Record<ShiftSound, Audio.Sound>> = {};
let ready = false;
let muted = false;

export async function isShiftMuted(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(MUTED_KEY)) === "true";
  } catch {
    return false;
  }
}

export async function setShiftMuted(next: boolean): Promise<void> {
  muted = next;
  try {
    await AsyncStorage.setItem(MUTED_KEY, next ? "true" : "false");
  } catch {}
  if (next) {
    for (const s of Object.values(players)) {
      s?.stopAsync().catch(() => {});
    }
  }
}

/**
 * Loads the sounds and sets the audio mode. Call when a journey begins.
 *
 * The audio mode matters: silent switch is respected, and other audio is
 * mixed with rather than interrupted, so somebody's own music keeps playing.
 */
export async function prepareShiftSounds(): Promise<void> {
  muted = await isShiftMuted();
  if (ready) return;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false, // honour the physical silent switch
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch {
    return;
  }

  for (const key of Object.keys(FILES) as ShiftSound[]) {
    const mod = FILES[key];
    if (!mod) continue;
    try {
      const { sound } = await Audio.Sound.createAsync(mod, {
        volume: key === "stage" ? 0.35 : 0.6,
      });
      players[key] = sound;
    } catch {
      // A missing or unreadable file just means that moment stays silent.
    }
  }

  ready = true;
}

/** Plays one moment. Safe to call whether or not anything is loaded. */
export function playShiftSound(key: ShiftSound): void {
  if (muted || Platform.OS === "web") return;
  const sound = players[key];
  if (!sound) return;
  sound.replayAsync().catch(() => {});
}

/** Frees the players. Call when a journey ends. */
export async function releaseShiftSounds(): Promise<void> {
  for (const key of Object.keys(players) as ShiftSound[]) {
    try {
      await players[key]?.unloadAsync();
    } catch {}
    delete players[key];
  }
  ready = false;
}
