import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MomentCard } from "@/components/MomentCard";
import { ONBOARDED_KEY, Onboarding } from "@/components/Onboarding";
import { TabGuide } from "@/components/TabGuide";
import { GUIDE_SEEN_KEY, onGuideRequested } from "@/constants/tabGuide";
import { useNotificationSchedule } from "@/hooks/useNotificationSchedule";
import { useOpenCount } from "@/hooks/useOpenCount";
import { LOCATION_CACHE_KEY, parseCachedLocation } from "@/constants/location";
import { noteIdFromIdentifier } from "@/constants/noteMilestones";
import palette from "@/constants/colors";
// Defines the background check for a new weekly picture; must load before anything else runs.
import "@/constants/thisWeekTask";
import {
  classifySolarAltitude,
  getSolarAltitude,
  SolarState,
} from "@/constants/solar";

SplashScreen.preventAutoHideAsync();
// Fade out of the splash screen rather than cutting straight to the app (iOS).
SplashScreen.setOptions({ fade: true, duration: 700 });

function RootLayoutNav({
  openCount,
  lastVisitAt,
  onReady,
}: {
  openCount: number;
  lastVisitAt: number | null;
  /** Called once the first screen is decided, so the splash screen can fade straight into it. */
  onReady: () => void;
}) {
  // Keep the nightly notifications in step with the app.
  useNotificationSchedule();

  // Tapping a notification opens what it is about: the weekly picture, or the very note a
  // milestone is about (phones only; the web has no notifications).
  const router = useRouter();
  const handledResponse = useRef<string | null>(null);
  useEffect(() => {
    if (Platform.OS === "web") return;
    const open = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const id = response.notification.request.identifier;
      const url = response.notification.request.content.data?.url;
      if (handledResponse.current === id) return;
      if (url === "/this-week") router.push("/this-week");
      else if (url === "/notes") {
        const data = response.notification.request.content.data;
        const note =
          typeof data?.note === "string" ? data.note : noteIdFromIdentifier(id);
        router.push(
          note
            ? { pathname: "/(tabs)/notes", params: { note, opened: id } }
            : "/(tabs)/notes",
        );
      } else return;
      handledResponse.current = id;
    };
    // Opened from the notification when PALE was closed, or while it was running.
    Notifications.getLastNotificationResponseAsync()
      .then(open)
      .catch(() => undefined);
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [router]);

  // Full moment card on the first open of the day only.
  const [dismissed, setDismissed] = useState(openCount > 1);
  const [openedAt] = useState(() => new Date());
  const [momentSolarState, setMomentSolarState] = useState<
    SolarState | null | undefined
  >(undefined);

  // The three opening screens, shown once. Someone already using PALE (anything saved from an
  // earlier version) goes straight in.
  const [onboarded, setOnboarded] = useState<boolean | undefined>(undefined);
  // The guide to the five tabs: once, after the opening screens, and again from the You tab.
  const [guideSeen, setGuideSeen] = useState<boolean | undefined>(undefined);
  const [guideAsked, setGuideAsked] = useState(false);
  useEffect(() => onGuideRequested(() => setGuideAsked(true)), []);
  const finishGuide = () => {
    AsyncStorage.setItem(GUIDE_SEEN_KEY, "1").catch(() => undefined);
    setGuideSeen(true);
    setGuideAsked(false);
  };
  useEffect(() => {
    let active = true;
    (async () => {
      const keys = await AsyncStorage.getAllKeys().catch(() => [] as string[]);
      const seen =
        keys.includes(ONBOARDED_KEY) ||
        keys.some((k) =>
          [
            "@pale_birthday",
            "@pale_notes",
            "@pale_shift_count",
            "@pale_journal",
            "@pale_reminder_hint_views",
            LOCATION_CACHE_KEY,
          ].includes(k),
        );
      if (seen && !keys.includes(ONBOARDED_KEY)) {
        AsyncStorage.setItem(ONBOARDED_KEY, "1").catch(() => undefined);
      }
      if (active) {
        setOnboarded(seen);
        setGuideSeen(keys.includes(GUIDE_SEEN_KEY));
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // The first screen is known once onboarding and the moment card have both been worked out.
  // Until then the splash stays up, so Home never flashes before the card covers it.
  const firstScreenKnown =
    onboarded !== undefined && momentSolarState !== undefined;
  useEffect(() => {
    if (firstScreenKnown) onReady();
  }, [firstScreenKnown, onReady]);

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDED_KEY, "1").catch(() => undefined);
    setOnboarded(true);
    // The opening screens stand in for today's moment card.
    setDismissed(true);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const now = new Date();
      const cached = parseCachedLocation(
        await AsyncStorage.getItem(LOCATION_CACHE_KEY).catch(() => null),
        now.getTime(),
      );
      const next = cached.ok
        ? classifySolarAltitude(
            getSolarAltitude(cached.value.lat, cached.value.lng, now),
          )
        : null;
      if (active) setMomentSolarState(next);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.dark.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="shift"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="location/[id]"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="this-week"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="tonight-sky"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "fade",
          }}
        />
      </Stack>

      {onboarded === false && <Onboarding onDone={finishOnboarding} />}

      {onboarded === true && !dismissed && momentSolarState !== undefined && (
        <MomentCard
          now={openedAt}
          lastVisitAt={lastVisitAt}
          solarState={momentSolarState}
          onDismiss={() => setDismissed(true)}
        />
      )}

      {onboarded === true &&
        dismissed &&
        (guideSeen === false || guideAsked) && (
          <TabGuide onDone={finishGuide} />
        )}
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const {
    todayCount,
    loaded: countLoaded,
    lastVisitAt,
  } = useOpenCount();

  // Safety net: never let the splash screen stick forever.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || fontError;
  const ready = timedOut || (fontsReady && countLoaded);
  const [firstScreenReady, setFirstScreenReady] = useState(false);
  const markFirstScreenReady = useCallback(() => setFirstScreenReady(true), []);

  useEffect(() => {
    if (timedOut || (ready && firstScreenReady)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready, firstScreenReady, timedOut]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GestureHandlerRootView
          style={{ flex: 1, backgroundColor: palette.dark.background }}
        >
          <RootLayoutNav
            openCount={todayCount}
            lastVisitAt={lastVisitAt}
            onReady={markFirstScreenReady}
          />
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
