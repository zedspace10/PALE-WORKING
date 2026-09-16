import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

import { shouldRunHomeHeroMotion } from "@/constants/homeHeroMotion";

export function useHomeHeroMotionActive(reduceMotion: boolean) {
  const [isFocused, setIsFocused] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, []),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", setAppState);
    return () => subscription.remove();
  }, []);

  return shouldRunHomeHeroMotion(reduceMotion, isFocused, appState);
}
