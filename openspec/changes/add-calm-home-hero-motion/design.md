## Context

See `proposal.md` for motivation and `specs/home-hero-ambient-motion/spec.md` for observable behavior. Home currently renders a full-screen `StarField` and builds its location marker from a 5px `Animated.View` plus a 24px glow. Every `StarField` star owns an opacity animation, while the Home marker runs a six-second scale/opacity loop. The project already includes React Native `Animated`, `react-native-svg`, Expo Router focus state, and a reactive reduced-motion hook; the effect must work across web, iOS, and Android without adding a rendering dependency.

## Goals / Non-Goals

**Goals:**

- Make the Home hero feel dimensional and quietly alive while preserving the centered content hierarchy.
- Keep animation work bounded, focus-aware, deterministic, and limited to native-driver transforms and opacity.
- Produce a shader-like visual with the existing SVG stack and consistent output across supported platforms.
- Keep all decorative layers out of pointer handling and accessibility navigation.

**Non-Goals:**

- Adding a true fragment-shader runtime or a dependency such as Skia.
- Depicting Earth, a live sky, real star coordinates, or physical scale.
- Redesigning Home cards, changing copy/data, or changing Shift's journey timing and scientific content.
- Adding user-configurable animation controls beyond the existing platform reduced-motion preference.

## Decisions

### 1. Build a contained `HomeHeroScene` from two reusable visual layers

Create a scene component behind the Home hero content that composes an ambient star field and a dimensional location sphere. Home remains responsible for copy and layout while the scene owns decorative drawing and animation lifecycle. The scene uses absolute positioning, `pointerEvents="none"`, and hidden accessibility descendants so it cannot alter interaction or reading order.

Embedding all drawing directly in the Home screen was rejected because it would make an already substantial screen harder to test and tune. Reusing the current full-screen `StarField` alone was rejected because it cannot provide contained parallax depth or lifecycle-aware layer motion.

### 2. Move a few star layers instead of animating every star

Generate a deterministic set of roughly 30–45 small points split across three depth layers. Each layer receives one shared animated progress value and moves only a few logical pixels over a long 24–40 second cycle; direction and duration vary by layer. Base opacity stays low, with at most a very small layer-level opacity breath. Home's existing full-screen field is reduced in count/opacity so both effects do not create visual noise.

Layer-level animation bounds the number of active loops and keeps screenshots stable. Independent random movement or aggressive twinkling was rejected because it increases work, can resemble flashing, and makes the calm composition unpredictable.

### 3. Create the sphere with SVG radial gradients and layered atmospheric light

Use a compact SVG containing a radial body gradient, a darker falloff toward the lower edge, a violet-blue rim, and a small soft specular highlight. Place one or two blurred-looking glow circles behind it using translucent SVG/React Native layers. Animate the composed sphere with a two-pixel vertical float and a low-amplitude glow/scale breath lasting roughly 6–10 seconds.

This provides a shader-like highlight, shadow, and rim-light result with dependencies already shipped by PALE. A true shader was rejected because adding a GPU rendering runtime for a single 60–72px element would increase native build and compatibility risk without a proportionate visual gain. Raster or generated imagery was rejected because the sphere needs to scale and animate consistently on all platforms.

### 4. Gate loops by reduced motion, route focus, and application state

Home obtains its focus state and passes an active flag to the scene. The scene also observes whether the application is active. It starts loops only when focused, foregrounded, and not reduced-motion; cleanup stops every loop and restores stable values. Reduced motion renders the same finished composition without drift, hover, or breathing.

Leaving loops active on hidden tabs was rejected because Expo tab screens remain mounted and would otherwise consume resources without producing visible output.

### 5. Keep layout content-driven and motion transform-only

The sphere occupies a fixed visual anchor within the existing hero flow, while stars live in an absolute layer bounded by the hero. All animation uses opacity and transforms with the native driver. No animation changes padding, text measurement, scroll position, or card layout.

Animating layout properties was rejected because it can cause reflow, inconsistent native/web behavior, and movement of the primary content.

### 6. Test motion contracts and visually tune at representative widths

Add focused tests for deterministic star generation, reduced-motion static values, lifecycle gating, decorative semantics, and Home integration. Verify the animation at compact mobile and wide web sizes, including tab switching, scrolling, and reduced-motion mode. Check that no console/runtime errors appear and that the title/estimate remain legible at the brightest point of the scene.

### 7. Reuse the sphere component across the Shift entry and journey

Render the existing dimensional sphere in Shift's pre-journey entry instead of maintaining a second flat orb implementation. When the journey starts, render that same sphere as a decorative layer behind the stage copy and drive its scale with the existing stage-size progression. Add a shallow, slow positional drift to keep the background alive, reduce its opacity as it grows, and preserve the existing contraction into the return marker. Use transform-based animation where possible and stop all looping motion when Shift is unfocused, inactive, or reduced motion is requested. Raise Shift's star opacity by a restrained amount so the field reads more clearly against black without competing with the sphere, button, or copy.

Duplicating the SVG or drawing a separate flat journey circle was rejected because the entry and journey intentionally represent one continuous `You are here.` marker and should remain visually consistent.

## Risks / Trade-offs

- **[Layer motion can expose empty edges]** → Oversize each star layer slightly and keep translation below its inset margin.
- **[SVG radial gradients may render somewhat differently across platforms]** → Use a small number of opaque stops and verify web/iOS/Android exports plus representative visual screenshots.
- **[The combined full-screen and hero stars may feel busy]** → Reduce the Home screen's global field density/opacity and cap hero-star brightness during visual tuning.
- **[A larger sphere can crowd small screens or large font sizes]** → Keep its anchor content-driven, reserve explicit vertical space, and test compact widths/font scaling without absolute copy positioning.
- **[Hidden-tab animations could continue accidentally]** → Make focus/application state part of the loop start condition and add cleanup-focused tests or source contracts.
- **[A brighter Shift field could compete with its CTA]** → Keep the increase small, retain sparse points, and verify the entry at compact and wide widths.
- **[A large shaded sphere could reduce stage-copy contrast]** → Fade the sphere as it grows, keep it behind all meaningful content, and verify every stage rather than only the first frame.

## Migration Plan

1. Add the contained scene and sphere components behind a stable API.
2. Replace the Home dot/glow markup while preserving hero copy and existing entrance animation timing.
3. Reduce the Home global star density and wire focus/reduced-motion lifecycle gating.
4. Run targeted tests, full project verification, and compact/wide visual checks.
5. Reuse the same sphere on Shift's entry and through the journey, replacing the flat expanding circle while preserving stage timing and the return contraction.
6. Roll back by restoring the previous dot/glow markup and removing the scene components; no data or schema migration is involved.
