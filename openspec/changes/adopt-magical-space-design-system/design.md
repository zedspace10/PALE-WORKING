## Context

See `proposal.md` for motivation. PALE is an Expo/React Native application that also exports to web. It already ships Inter, SVG, linear-gradient, blur, reduced-motion support, lifecycle-aware ambient animation, shared colour/type constants, and bundled Explore imagery.

The current `HomeLocationSphere` is a small SVG globe-like gradient shared by Home and Shift. Shift renders it twice: once in the tab screen and once in a native `Modal`; stage interpolation also adds explicit horizontal offsets. Consequently, pressing "Begin the Shift" crossfades between two objects and the journey sphere leaves the horizontal centerline. A native modal cannot visually reuse a mounted view below the modal layer, so continuity requires a screen-tree change rather than only styling.

The Opal references are used as directional principles—strong neo-grotesk hierarchy, inky glass, icy light blooms, glossy focal objects, and selective luminous edges—not as a source of copied assets, layouts, content, or proprietary typography. Explore is already visually successful and has explicit image/scroll regression coverage.

## Goals / Non-Goals

**Goals:**

- Make one sphere instance visually continuous across every Shift state and keep its x-axis center fixed.
- Make the focal object read unmistakably as Earth first, with restrained magical energy layered over its natural blue, green, white, and atmospheric colour structure.
- Consolidate the visual system into reusable tokens and primitives before applying it screen by screen.
- Preserve scientific trust, user data behavior, performance, accessibility, and the current Explore composition.
- Keep the experience calm: soft depth, slow energy flow, no strobe, no excessive gradients.

**Non-Goals:**

- Copying Opal assets, trademarked product elements, screens, or a proprietary font.
- Adding a 3D engine, WebGL dependency, live Earth data, geographic accuracy, or a physically based globe simulation.
- Reworking Explore card art, layout, destination content, cover composition, or navigation.
- Changing scientific copy, estimates, provenance, notification behavior, journal persistence, or app information architecture.
- Replacing the app's navigation library or creating separate light and dark themes.

## Decisions

### 1. Extend the existing bundled Inter family instead of importing an unknown reference font

PALE will keep its licensed, bundled Inter weights and tune its tokens toward the reference character: larger tightly tracked displays, bold card titles and actions, calmer body leading, and high-contrast metadata. This avoids runtime font loading, licensing ambiguity, layout shifts, and a new dependency while achieving the desired modern grotesk hierarchy.

Alternatives considered:

- Import the apparent Opal typeface: rejected because the exact family and app-use license are not established.
- Add a different open-source display family: deferred because a second family would increase bundle/layout complexity without first exhausting the existing Inter range.

### 2. Evolve semantic tokens before editing individual screens

`constants/colors.ts` and `constants/ui.ts` will become the source of truth for the magical-space system. The palette will retain an ink-black base and introduce semantic midnight glass, elevated glass, icy cyan/blue primary illumination, atmospheric blue, violet signature energy, luminous borders, subdued copy, and overlay/backdrop values. Cyan/blue provides the dominant Opal-like light source for selected controls and focal surfaces; violet is reserved for magical energy, depth, and occasional emphasis so the interface does not become a uniform purple wash. Type, radii, spacing, shadow/glow, and motion durations will be expressed as named tokens. Existing semantic names will either remain compatible or migrate in one mechanical pass.

Reusable presentation primitives will cover the patterns repeated across the app:

- a luminous/glass surface with an optional localized glow or gradient wash;
- a primary gradient action and a quieter secondary action;
- a small atmospheric glow layer for focal areas;
- existing `CalmPressable` behavior extended rather than duplicated.

Gradients are accents, not backgrounds for every card. Most surfaces remain dark and quiet, with at most one localized light source or edge treatment.

Alternatives considered:

- Restyle each screen independently: rejected because it would recreate the visual fragmentation this change is intended to remove.
- Replace every card with blur: rejected because blur is platform-dependent, comparatively expensive, and visually noisy when overused.

### 3. Render the Earth-energy sphere in layered SVG and native transforms

The existing sphere component will become a layered decorative SVG:

1. a soft external halo;
2. a clipped spherical body with deep navy-to-ocean-blue radial shading and a curved day/night terminator;
3. several recognizable but simplified teal-green continent silhouettes arranged to read as Earth at small and large sizes without claiming cartographic precision;
4. translucent soft-white cloud bands and small weather swirls crossing both ocean and land;
5. a pale cyan atmospheric rim and cool specular highlight;
6. two or three subordinate violet-cyan lightning/aurora paths with broad translucent colour strokes and narrower pale cores;
7. one restrained outer energy arc and a soft violet shadow glow.

Ambient life will come from slow wrapper rotation, small opacity interpolation, and slight scale/breathing transforms. Energy paths will not flash on and off. The effect will use existing React Native Animated/SVG capabilities and native-driven transforms where supported; no shader engine or image asset is required. The same component remains decorative and hidden from the accessibility tree.

At small sizes, ocean, land, cloud, and atmosphere shapes remain distinct enough for immediate Earth recognition; micro-detail may drop out before those layers do. At large journey scales, Earth structure remains visible while lightning, overall opacity, and halo strength reduce so text stays legible. A visual hierarchy target keeps natural Earth layers dominant and confines violet primarily to energy paths, outer glow, and shadow. The component exposes appearance intensity and activity inputs but not journey-specific positioning.

Alternatives considered:

- WebGL/Three.js custom shader: rejected for bundle size, native/web parity, accessibility, and lifecycle complexity.
- Generated raster/video sphere: rejected because scaling and state transitions would be less crisp, larger to ship, and harder to pause cleanly.
- Literal map artwork: rejected because the globe is poetic and decorative rather than a geographic visualization.

### 4. Replace the Shift native modal with an in-tree journey overlay and one sphere layer

`ShiftScreen` will own exactly one mounted sphere layer. Entry content and journey content will be sibling overlays within the same screen tree. Starting a journey raises/fades in the absolute journey overlay while the shared sphere animates from its entry transform into the first stage transform. This avoids crossing a native modal boundary, which is the only reliable way to keep the same visual instance mounted.

The shared sphere anchor is `left: 50%` plus a fixed negative half-width (or an equivalent centered wrapper). Animation may interpolate `translateY`, scale, opacity, halo intensity, and rotation, but never `translateX`. The existing `JOURNEY_SPHERE_X` offsets are removed. Width/orientation changes update the scale targets but do not change the center anchor. Stage copy and controls render above the shared layer; stars and ambient glows render below it.

Entry, journey, completion, and exit states share one state machine and one set of animated values. Content crossfades around the sphere. The overlay receives modal-like accessibility isolation while active, blocks interaction with entry content, respects safe areas, and retains the visible exit control. Returning resets transforms only after the exit transition completes, preventing a snap.

Alternatives considered:

- Keep the native modal and move a second sphere to the same initial coordinates: rejected because it still swaps instances and can produce a frame-level flash or mismatch.
- Take a visual snapshot of the sphere into the modal: rejected because it is not the same live object and complicates native/web support.
- Navigate to the existing standalone Shift route: rejected because it would still remount the sphere and broaden navigation scope.

### 5. Apply the visual system in controlled screen groups

The refresh will proceed in groups so each group can be visually and behaviorally verified:

- **Global chrome:** root background, tab bar, safe areas, shared buttons/surfaces, focus/pressed states.
- **Focal screens:** Home and Shift receive atmospheric hero lighting and the new sphere treatment.
- **Personal screens:** You and Journal use bolder hierarchy, quiet glass sections, and localized cyan-violet highlights without changing data or forms.
- **Cosmic utilities:** Tonight's Sky, Deep Time, Universe/Time Machine, location detail, and transient cards/modals adopt the same surfaces and typography while preserving disclosures and values.
- **Explore:** only shared font/color/chrome tokens are accepted. Location card media, dimensions, arrangement, text order, distance placement, route behavior, detail cover, scroll surface, and disclosure order are regression-protected.

Screen-specific gradients will be built from common colour stops but positioned to serve each screen's hierarchy. This creates variety without introducing unrelated card colours.

### 6. Make animation and visual quality testable

Pure configuration helpers will hold deterministic sphere/stage scale and opacity targets where practical. UI contract tests will assert one Shift sphere test identifier, no duplicate entry/journey sphere identifiers, absence of horizontal stage offsets, Explore preservation, semantic token presence, contrast floors, reduced-motion behavior, and dark scroll surfaces.

Visual verification will cover compact and wide mobile viewports, entry-to-journey continuity, every journey stage, exit and completion, reduced motion, foreground/background transitions, scroll edges, keyboard/input states, and all tabs. Runtime console errors and unhandled warnings are failures.

Automated tests cannot prove aesthetic quality or frame-perfect centering, so browser/device screenshots and interaction checks remain required acceptance evidence.

## Risks / Trade-offs

- **[In-tree journey overlay differs from native modal focus behavior]** → Apply modal-like accessibility isolation, block pointer events behind the overlay, retain a top-level exit control, and test back/escape behavior on native and web.
- **[Layered SVG and multiple glows reduce performance on older devices]** → Limit path count, avoid animated blur/filter primitives, animate wrappers with native transforms, reduce effects at large scale, and stop work off-focus/background.
- **[Recognizable continents imply geographic or live accuracy]** → Use simplified familiar silhouettes rather than measured coastlines, keep the object decorative, avoid data labels, and never describe it as live or measured.
- **[Luminous cyan text can fail contrast over gradients]** → Place copy on stable dark backing, reserve glow for edges/focal areas, and verify contrast on the immediate rendered background.
- **[App-wide refresh accidentally regresses Explore]** → Protect Explore with explicit contract tests and review its diff separately; reject structural or image changes.
- **[Token migration creates a large diff]** → Land shared primitives first, update screen groups systematically, and keep behavior/content edits out of styling commits.
- **[Wide sphere scaling clips unexpectedly]** → Use overflow intentionally at a full-screen decorative layer, keep the anchor centered, and verify compact/wide and orientation changes.

## Migration Plan

1. Add/extend magical-space tokens and reusable surface/action primitives without changing screen structure.
2. Upgrade the sphere in isolation and verify static, animated, reduced-motion, and background states.
3. Refactor Shift to one mounted sphere and an in-tree overlay; preserve current durations, copy, disclosures, controls, completion count, and ambient audio integration.
4. Migrate global chrome and screens in controlled groups, running tests after each group.
5. Apply only allowed shared token/type changes to Explore and run its existing artwork/detail/scroll regression suite.
6. Run formatting, lint, typecheck, full tests, content verification, exports, and interactive visual QA.

Rollback is file-local: restore previous tokens/components and the prior Shift modal implementation together. No user-data or schema migration is involved.
