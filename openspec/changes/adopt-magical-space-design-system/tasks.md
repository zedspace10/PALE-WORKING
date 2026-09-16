## 1. Establish the Magical-Space Foundation

- [x] 1.1 Add UI contract tests for the new cyan/blue-primary and violet-secondary semantic palette, typography hierarchy, luminous surface primitives, 44px touch targets, reduced-motion behavior, dark scroll surfaces, and protected Explore composition; verify the focused test file fails for the intended missing contracts before implementation.
- [x] 1.2 Extend the shared colour, typography, spacing, radius, glow, and motion tokens so near-black glass and icy cyan/blue illumination dominate while violet remains a signature magical accent; verify automated hierarchy and contrast checks pass for foreground, body, muted, accent, and action text on their immediate dark surfaces.
- [x] 1.3 Build reusable luminous/glass surface and primary/secondary action treatments on top of `CalmPressable`, including visible press/focus states and static reduced-motion fallbacks; verify component contract tests and TypeScript pass.

## 2. Build the Continuous Magical Earth Sphere

- [x] 2.1 Add Shift/sphere regression tests that require exactly one mounted Shift sphere, prohibit entry/journey duplicate identifiers and horizontal stage-offset arrays, and cover centering, Earth-layer presence, violet-energy subordination, reduced motion, lifecycle pausing, and non-live decorative semantics; verify the focused tests fail before the refactor.
- [x] 2.2 Upgrade the shared SVG sphere with deep navy/ocean-blue shading, simplified teal-green continent silhouettes, soft white cloud bands, a curved terminator, pale cyan atmosphere, subordinate violet-cyan energy filaments, and calm layered glow; verify it is unmistakably Earth at both Home/Shift entry and expanded journey sizes, contains no remote asset, and the focused sphere tests pass.
- [x] 2.3 Refactor Shift from a native journey modal to an accessible in-tree full-screen overlay driven by the existing journey state, with one sphere instance anchored to the viewport center and no animated `translateX`; verify beginning, skipping, completing, exiting, and resizing never swap or horizontally displace the sphere.
- [x] 2.4 Integrate the shared sphere's y/scale/opacity/energy transitions with journey stages while preserving timing, copy, disclosures, completion count, haptics, exit controls, and ambient-audio behavior; verify normal-motion and reduced-motion journeys both complete without flashes, snaps, warnings, or inaccessible background controls.

## 3. Apply the System Across the App

- [x] 3.1 Refresh root/tab chrome and the Home screen with the shared inky glass, luminous selection, bold type, atmospheric hero, and calm controls; verify all five tabs remain identifiable, safe-area aligned, and usable on compact and wide mobile viewports.
- [x] 3.2 Refresh You and Journal surfaces, inputs, empty/content states, and primary actions with localized cyan-violet lighting and the shared hierarchy; verify saved journal data, reminder behavior, personal insights, keyboard access, and scroll-to-top behavior are unchanged.
- [x] 3.3 Refresh Tonight's Sky, Deep Time, Universe/Time Machine, location detail, and shared transient cards/modals with the same tokens and primitives; verify factual values, qualifications, source access, navigation, safe areas, and scroll-edge backgrounds are unchanged.
- [x] 3.4 Apply only permitted shared typography, colour, and navigation-chrome updates to Explore; verify existing artwork files, card layout/dimensions, destination order, text order, distances, routes, detail covers, scroll behavior, and disclosure order are byte- or contract-equivalent where applicable.

## 4. Verify Quality and Delivery

- [x] 4.1 Run the focused UI, content, journal, astronomy, and Explore regression suites and fix only regressions caused by this change; verify all focused tests pass.
- [x] 4.2 Run `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run verify:content`; verify every command exits successfully without warnings promoted to errors.
- [x] 4.3 Run web, iOS, and Android exports; verify each supported platform build completes without adding a new dependency or remote runtime asset.
- [x] 4.4 Run the app locally and visually verify Home, the full Shift entry-to-return sequence, You, Journal, Explore/list detail, Tonight's Sky, Deep Time, and Universe/Time Machine at compact and wide mobile sizes, including reduced motion and background/foreground transitions; verify centering, contrast, no white overscroll, no clipped controls, and no console/runtime errors.
