# Calm-space visual refresh QA

## Explore artwork

All artwork was generated with the built-in image generation tool, then resized and JPEG-compressed for local bundling. The shared art direction was: text-free portrait mobile card artwork; cinematic, scientifically grounded space imagery; subject weighted toward the lower two-thirds with dark upper negative space; restrained indigo, violet, and blue palette; no logo or watermark.

| Asset                     | Dimensions |   Bytes |
| ------------------------- | ---------: | ------: |
| `andromeda.jpg`           |  640 × 800 | 120,568 |
| `galactic-center.jpg`     |  640 × 800 | 135,815 |
| `mars.jpg`                |  640 × 800 |  94,226 |
| `moon.jpg`                |  640 × 800 |  84,199 |
| `observable-edge.jpg`     |  640 × 800 | 137,814 |
| `pillars-of-creation.jpg` |  640 × 800 | 117,942 |
| `sagittarius-a-star.jpg`  |  640 × 800 |  82,216 |
| `saturn.jpg`              |  640 × 800 |  81,811 |

Aggregate bundled size: **854,591 bytes**. `ffprobe` confirmed every image decodes at 640 × 800, and the UI regression test verifies JPEG framing and coverage of all eight location IDs.

## Automated checks

- Semantic foreground/background, muted-text/background, and violet-accent/background contrast calculations are covered in `tests/ui/visual-refresh.test.ts`.
- The same suite covers artwork mapping and fallback, compact disclosure access, Explore registration, sky-state variants, both Home hero states, and reduced-motion helper behavior.

## Manual inspection record

Completed on 2026-09-16.

### Browser

- Inspected Home with and without a stored birthday at compact mobile and wide desktop widths. The hero remains centred, both metric states wrap intentionally, and the navigation cards keep a consistent calm surface treatment.
- Inspected Explore at compact and wide widths. All eight local artworks decoded, card text stayed top-aligned and readable, the two-column grid remained balanced, and the compass tab icon aligned with the other tabs.
- Inspected a location detail with keyboard navigation. The `Sources & methods` control showed a visible focus ring, expanded from the keyboard, and retained its review date, notes, and source links.
- Inspected Shift entry, intermediate stages, and completion. The unboxed illustration caption stayed secondary, and the contracted dot remained clearly separated from `Welcome back.` at completion.
- Inspected the universe journey at solar-system, Milky Way, and observable-universe stages, including the pale-blue-dot sequence. Zoom controls, labels, qualification, and source access remained available without the former bordered disclosure or named source chip.
- Inspected the current daylight Tonight's Sky state. The daylight icon, local time, transition timing, and qualified observing guidance were all present. Twilight and darkness variants were additionally checked through the shared SVG variant tests because the live local solar state was daylight during the pass.
- No clipping, hidden content, amber default action styling, inaccessible keyboard focus, or application runtime error was observed. Development-only React Native Web compatibility warnings were unchanged; new card text-shadow warnings were removed during the pass.

### Android native accessibility smoke test

- Tested on the Android API 34 emulator through Expo Go at 1080 × 2400. Status/navigation safe areas and the fixed tab bar remained unobstructed.
- Increased Android font scale to 1.3. Hero and card copy wrapped without horizontal clipping; vertical overflow remained scrollable.
- Inspected the accessibility tree and focus order. Primary Home actions and all five tab items expose meaningful labels in visual order.
- Measured actionable accessibility bounds. Home actions and tab items exceed the 44 × 44 minimum target.
- Disabled Android animator, transition, and window animation scales, relaunched the app, and confirmed final content was immediately visible rather than left in a hidden entrance state.
- Opened Explore natively and confirmed all bundled images decoded and stayed readable beneath the shared violet overlay. The stable no-image treatment is covered by the focused fallback test.
- Expo Go displayed its known SDK 53 development warning for remote push notifications; this is an Expo Go limitation and did not affect layout or interaction. A development build is required to exercise remote notifications on device.
