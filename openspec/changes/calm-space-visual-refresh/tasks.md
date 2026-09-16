## 1. Shared visual foundation

- [x] 1.1 Replace amber-led semantic colour tokens with the contrast-checked deep-neutral, violet, lavender, text, surface, border, focus, and pressed-state roles described in the design; verify affected screens contain no amber default action/text styling and automated contrast checks or documented calculations meet accessible targets.
- [x] 1.2 Add shared typography, card, button, and icon-container primitives or style helpers with bolder action labels and consistent radii/spacing; verify Home, Explore, Shift, and Tonight's Sky can consume the same roles without screen-local duplicates.
- [x] 1.3 Add a reactive reduced-motion hook and reusable calm entrance/press animation helpers; verify focused tests show animated final values are immediately visible and loops/delays are bypassed when reduced motion is enabled.

## 2. Explore artwork and cards

- [x] 2.1 Generate eight text-free, portrait-oriented calm-space artworks for Moon, Mars, Saturn, Galactic Center, Andromeda, Pillars of Creation, Sagittarius A*, and Observable Edge, then optimise and store them under `assets/images/explore/`; verify all files decode, use consistent dimensions/art direction, contain no embedded text or logos, and record their aggregate bundled size.
- [x] 2.2 Add explicit local artwork mapping and a stable fallback treatment to the location catalogue/card model; verify a unit test covers all eight location IDs plus the missing-image fallback.
- [x] 2.3 Rebuild `LocationCard` with an image background, consistent dark-violet overlay, top-aligned title/description/distance, accessible image semantics, 44px minimum interaction size, and subtle press motion; verify the grid remains legible at compact and wide viewports.
- [x] 2.4 Refine the Explore header/grid spacing and add an explicit compass/star-map Explore tab icon with aligned active/inactive states; verify the tab is registered, selectable, and visually aligned with every other tab.

## 3. Scientific context without clutter

- [x] 3.1 Replace the bordered illustration disclosure card with an unboxed inline `Illustrative · not to scale` caption and full accessibility explanation; verify Shift and universe visual stages no longer render the bordered card while visible and screen-reader qualifications remain present.
- [x] 3.2 Replace named source-title chips such as `Universe Overview` with a subdued consistent `Sources & methods` disclosure suitable for immersive and detail contexts; verify source/review metadata and URLs remain available and no journey screen renders a source-title button.

## 4. Screen compositions

- [x] 4.1 Recompose the Home dot, `You are here.`, universe-age estimate, qualifier, and birthday/personal metric as one centered responsive hero; verify both birthday states at compact and wide viewports have intentional wrapping, spacing, and no overlap.
- [x] 4.2 Unify Home observatory/navigation cards with the shared surface, typography, icon, and motion system while removing nonessential badges or labels; verify expansion, navigation, reminder, source, and keyboard/touch interactions still work.
- [x] 4.3 Build a shared SVG sky-state hero for daylight, twilight, and astronomical darkness and integrate it with the Tonight's Sky hierarchy; verify representative solar states display the correct large icon, time, qualified transition text, and observing guidance without changing calculations.
- [x] 4.4 Recompose Shift stage typography and completion layout around a dedicated contracted-dot anchor, then apply the shared button/motion system; verify the dot remains separated from `Welcome back.` and completion actions remain reachable at supported viewport heights.
- [x] 4.5 Apply the calm palette, simplified context treatment, and preference-aware motion to the universe journey controls and overlays; verify zoom navigation, stage labels, pale-blue-dot sequence, qualification, and source access still work.

## 5. Quality and delivery

- [x] 5.1 Add or update UI-focused tests for semantic colours, disclosure availability, Explore image coverage/fallback, tab icon registration, sky-state variants, Home composition states, and reduced-motion behavior; verify the targeted test suite passes.
- [x] 5.2 Run formatting check, lint, TypeScript, all unit/content tests, strict OpenSpec validation, Expo Doctor, and web/iOS/Android exports; verify every command exits successfully or document and resolve any regression introduced by this change.
- [x] 5.3 Run the application locally and visually inspect Home, Explore, Shift stages/completion, universe journey, Tonight's Sky daylight/dark states, and representative detail screens at compact mobile and wider web sizes; verify there is no clipping, hidden content, amber action styling, intrusive disclosure card, named `Universe Overview` chip, inaccessible focus state, or console/runtime error.
- [x] 5.4 Perform a focused native-device accessibility smoke test for safe areas, font scaling, screen-reader order, touch targets, reduced motion, and image fallback; verify results are recorded before the change is archived.
