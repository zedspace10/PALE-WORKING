## Why

The Home `You are here.` hero is the emotional entry point to PALE, but its current static point and full-screen twinkle field do not give that moment the depth or gentle sense of motion established by the refreshed calm-space design. A restrained ambient scene can make the hero feel alive and dimensional without becoming bright, busy, or distracting.

## What Changes

- Add a contained field of dim stars behind the Home hero that drifts in slow, shallow parallax layers without flashes or abrupt direction changes.
- Replace the flat pale-blue point above `You are here.` with a larger shader-like sphere using layered radial gradients, rim light, a soft atmosphere, and subtle breathing/hover motion.
- Reuse the dimensional sphere throughout Shift: show it on the entry screen, then replace the journey's flat expanding background circle with the shaded sphere as it scales and drifts behind each stage. Gently increase Shift's ambient star visibility so the full sequence shares one calm visual language.
- Keep the scene decorative and non-cartographic: star positions and sphere shading will not imply a live sky map, Earth model, or measured location.
- Pause looping motion when Home is not focused or the app is inactive, and render the completed static composition when reduced motion is requested.
- Preserve the existing Home copy, centered hierarchy, scroll behavior, safe areas, accessibility order, and compact/wide layout support.

## Capabilities

### New Capabilities

- `home-hero-ambient-motion`: Defines the appearance, motion, performance, reduced-motion, accessibility, and responsive behavior of the Home hero's ambient stars and dimensional location sphere.

### Modified Capabilities

- None.

## Impact

- Affects the Home hero in `app/(tabs)/index.tsx`, the Shift entry and journey in `app/(tabs)/shift.tsx`, the existing star/motion conventions, and UI-focused tests.
- Adds small reusable React Native/SVG visual components and deterministic star data; no remote assets, runtime network calls, scientific data changes, or new package dependency are expected.
- Uses existing `Animated`, `react-native-svg`, focus lifecycle, and reduced-motion capabilities across Expo web, iOS, and Android.
