## Why

PALE's current violet refresh is calmer than the original UI, but its screens still feel visually fragmented and the Shift journey breaks the illusion by replacing its entry sphere with a separately positioned sphere. A cohesive magical-space system—guided by Opal's restrained luminous surfaces and strong typography—can make the app feel more premium and restorative while keeping PALE's scientific content, accessibility, and successful Explore artwork intact.

## What Changes

- Replace the simple violet-blue globe with an Earth-first energy sphere: visually dominant blue oceans, teal-green continent silhouettes, white cloud bands, and a pale cyan atmosphere, overlaid with slow violet-cyan lightning and auroral glow.
- Keep one sphere instance mounted throughout the Shift entry, journey, and return sequence so beginning a Shift never swaps, flashes, or hides the focal object.
- Make the Shift sphere's horizontal center an invariant across every stage and supported viewport; only its vertical position, scale, glow, and opacity may change.
- Introduce an app-wide magical-space visual language: near-black space, midnight glass, icy cyan/blue primary illumination, violet signature accents, confident typography, luminous controls, and restrained ambient motion.
- Apply the shared language to Home, Shift, You, Journal, Tonight's Sky, Deep Time, Universe/Time Machine, location detail, modal, and navigation surfaces without changing their information or scientific meaning.
- Preserve Explore card and detail-page imagery, layout, content order, navigation, and cover treatment; only shared typography, colour, and app-chrome tokens may change there.
- Preserve reduced-motion behavior, readable contrast, minimum touch targets, lifecycle-aware animation, and explicit qualification of illustrative scientific visuals.

## Capabilities

### New Capabilities

- `continuous-shift-sphere`: One unmistakably Earth-like magical sphere remains mounted, continuously animated, and horizontally centered from Shift entry through the complete journey.
- `magical-space-interface`: A shared mobile-first visual system provides luminous dark surfaces, bold typography, calm motion, and consistent controls across PALE while protecting Explore's established visual composition.

### Modified Capabilities

None. The existing `honest-scientific-visualization` requirements continue to apply unchanged; the new decorative Earth-energy treatment must not imply a measured map or live Earth model.

## Impact

- Affects shared colour, typography, spacing, motion, surface, button, and tab-bar tokens.
- Refactors `app/(tabs)/shift.tsx` so the journey runs in the existing screen tree instead of creating a second sphere inside a native modal layer.
- Extends the SVG sphere scene and may add small reusable luminous-surface components; no remote runtime imagery or proprietary Opal assets are introduced.
- Touches core mobile screens and shared cards while intentionally limiting Explore changes to system-level type, colour, and navigation chrome.
- Adds UI contract tests and requires visual verification on compact and wide mobile viewports plus reduced-motion and app-lifecycle states.
