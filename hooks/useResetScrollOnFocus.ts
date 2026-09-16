import { useFocusEffect } from "expo-router";
import { RefObject, useCallback } from "react";
import { Platform } from "react-native";

interface ScrollToTopTarget {
  scrollTo?: (options: { x?: number; y?: number; animated?: boolean }) => void;
  scrollToOffset?: (options: { offset: number; animated?: boolean }) => void;
}

export function useResetScrollOnFocus<T extends ScrollToTopTarget>(
  scrollRef: RefObject<T | null>,
) {
  useFocusEffect(
    useCallback(() => {
      const resetScroll = () => {
        const scrollTarget = scrollRef.current;

        if (scrollTarget?.scrollToOffset) {
          scrollTarget.scrollToOffset({ offset: 0, animated: false });
        } else {
          scrollTarget?.scrollTo?.({ x: 0, y: 0, animated: false });
        }

        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      };

      resetScroll();
      const frame = requestAnimationFrame(resetScroll);

      return () => cancelAnimationFrame(frame);
    }, [scrollRef]),
  );
}
