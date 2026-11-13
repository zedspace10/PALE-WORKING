import { type Href, useRouter } from "expo-router";
import { useCallback } from "react";

/**
 * Back, or, when there is nothing to go back to (the screen was opened straight from a
 * notification, for example), the screen it belongs to. A back arrow should never do nothing.
 */
export function useGoBack(fallback: Href) {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback);
  }, [router, fallback]);
}

/** The same, for places that already hold a router. */
export function goBackOr(router: ReturnType<typeof useRouter>, fallback: Href) {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
