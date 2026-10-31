import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MomentCard } from "@/components/MomentCard";
import { ONBOARDED_KEY, Onboarding } from "@/components/Onboarding";
import { useNotificationSchedule } from "@/hooks/useNotificationSchedule";
import { useOpenCount } from "@/hooks/useOpenCount";
import { LOCATION_CACHE_KEY, parseCachedLocation } from "@/constants/location";
import palette from "@/constants/colors";
import {
  classifySolarAltitude,
  getSolarAltitude,
  SolarState,
} from "@/constants/solar";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav({ openCount }: { openCount: number }) {
  // Keep the nightly notifications in step with the app.
  useNotificationSchedule();

  // Full moment card on the first open of the day only.
  const [dismissed, setDismissed] = useState(openCount > 1);
  const hour = new Date().getHours();
  const [momentSolarState, setMomentSolarState] = useState<
    SolarState | null | undefined
  >(undefined);

  // The three opening screens, shown once. Someone already using PALE (anything saved from an
  // earlier version) goes straight in.
  const [onboarded, setOnboarded] = useState<boolean | undefined>(undefined);
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
      if (active) setOnboarded(seen);
    })();
    return () => {
      active = false;
    };
  }, []);

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
          hour={hour}
          openCount={openCount}
          solarState={momentSolarState}
          onDismiss={() => setDismissed(true)}
        />
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

  const { todayCount, loaded: countLoaded } = useOpenCount();

  // Safety net: never let the splash screen stick forever.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const fontsReady = fontsLoaded || fontError;
  const ready = timedOut || (fontsReady && countLoaded);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView
            style={{ flex: 1, backgroundColor: palette.dark.background }}
          >
            <RootLayoutNav openCount={todayCount} />
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
