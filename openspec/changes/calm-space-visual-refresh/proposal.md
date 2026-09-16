## Why

PALE's current interface competes with its quiet, reflective purpose: amber accents, heavy disclosure cards, inconsistent card colours, uneven alignment, and sparse state screens make the experience feel busier and less polished than the content deserves. A cohesive calm-space visual system will improve hierarchy, readability, emotional tone, and motion while retaining the scientific qualifications established by the accuracy work.

## What Changes

- Replace the amber-led palette with a restrained violet and lavender accent system, deeper neutral surfaces, stronger typography, and bolder, more legible button treatments.
- Remove the bordered `Illustrative · Not to Scale` card and named source chips such as `Universe Overview` from journey visuals; retain the required scientific qualification as a quiet inline caption and accessible description, with provenance available through a subdued, consistent source affordance where needed.
- Recompose the Home hero so the pale-blue dot, `You are here.` marker, universe-age estimate, and supporting copy form one centered, consistently spaced block; simplify and unify the cards below it.
- Redesign the Explore grid with top-aligned content, a consistent dark-violet card treatment, calm generated space imagery, reliable contrast overlays, and a clearer Explore tab icon.
- Redesign daylight, twilight, and night state screens around a large state-specific celestial icon, clearer time hierarchy, and calmer supporting copy.
- Correct the Shift completion composition so the collapsed dot has deliberate separation from `Welcome back.`, and refine journey typography and actions.
- Add gentle entrance, press, expansion, and ambient transitions across the refreshed screens while respecting reduced-motion preferences.
- Remove incidental badges, chips, labels, and competing surface colours that do not help users understand or navigate the experience.

## Capabilities

### New Capabilities

- `calm-space-interface`: Defines the cohesive visual hierarchy, palette, imagery, layout, interaction feedback, accessible disclosure treatment, responsive behavior, and reduced-motion behavior for the Home, Shift, Tonight's Sky, Explore, and shared navigation experiences.

### Modified Capabilities

- None. The established scientific-content and illustrative-visual contracts remain in force; this change alters how their information is presented, not what accuracy or provenance must be available.

## Impact

- Affects shared colour tokens, typography and surface styles, source/illustration presentation, tab navigation, Home, Shift, universe journey, Tonight's Sky, Explore, location cards, and associated UI tests.
- Adds a small curated set of generated raster assets under the existing app asset pipeline; assets will be bundled locally and require no runtime network service.
- Uses the existing Expo, React Native Animated/Reanimated, SVG, gradient, and accessibility capabilities; no new runtime dependency or external API is expected.
- Scientific metadata, source URLs, review dates, calculations, and user data behavior remain unchanged.
