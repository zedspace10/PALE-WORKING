## 1. Ambient scene foundation

- [x] 1.1 Add deterministic star-layer data and a contained decorative renderer with three dim depth layers; verify focused tests cover stable placement, bounded point count/brightness, non-interactive semantics, and layer-level rather than per-star motion.
- [x] 1.2 Build the SVG location sphere with radial body shading, shadow falloff, violet-blue rim light, specular highlight, and diffuse glow; verify the component renders without raster/network assets and preserves a stable static composition.

## 2. Motion and lifecycle

- [x] 2.1 Add slow transform/opacity loops for star drift and sphere float/breathing, gated by reduced motion, Home focus, and foreground application state; verify tests or explicit source contracts cover loop start, cleanup, and static reduced-motion values.
- [x] 2.2 Integrate the ambient scene into the Home hero, replace the flat dot/glow, and reduce the underlying full-screen star density so the text remains dominant; verify existing hero copy, birthday states, scroll-to-top behavior, safe-area spacing, and card interactions remain intact.

## 3. Quality and visual verification

- [x] 3.1 Add or update UI-focused tests for Home scene registration, decorative accessibility behavior, deterministic stars, shader-like sphere layers, lifecycle gating, and reduced-motion behavior; verify the targeted test suite passes.
- [x] 3.2 Run formatting, lint, TypeScript, the full unit/content suite, strict OpenSpec validation, and web/iOS/Android exports; verify every command exits successfully or resolve any regression introduced by the change.
- [x] 3.3 Run the application locally and inspect the Home hero at compact mobile and wider web sizes with standard and reduced motion; verify stars drift gently without flashing, the sphere reads as dimensional and softly glowing, text stays legible, tab switching pauses/resumes cleanly, scrolling remains responsive, and no console/runtime error appears.

## 4. Shift visual continuity

- [x] 4.1 Reuse the dimensional location sphere on Shift's entry and as the journey background, replacing the flat expanding circle with scale, opacity, and shallow positional animation while preserving stage timing, text legibility, the return contraction, lifecycle gating, and the slightly more visible star field.
- [x] 4.2 Extend UI contract coverage and visually verify the Shift entry plus representative journey stages at compact and wide sizes; run formatting, lint, TypeScript, targeted tests, strict OpenSpec validation, and confirm the local preview has no runtime errors.
