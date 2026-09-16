## Context

See `proposal.md` for motivation. PALE is an Expo Router application shared by native and web, uses Inter through Expo fonts, and already includes React Native Animated, Reanimated, SVG, gradients, and a common colour hook. The current visual language is distributed between `constants/colors.ts` and screen-local amber constants/styles. Explore cards use eight unrelated gradients and no imagery; Home and Shift use separately composed animated elements; Tonight's Sky renders daylight as a text-only state. The recently archived accuracy work requires visible illustrative qualification, accessible explanations, and available source/review context, so visual simplification cannot remove those truths.

## Goals / Non-Goals

**Goals:**

- Establish a compact set of reusable palette, surface, typography, button, and motion conventions for the affected screens.
- Make Home, Shift, Tonight's Sky, Explore, universe journey, and tab navigation feel like one calm product on native and web.
- Preserve accuracy and accessibility while removing disclosure cards, named source pills, noisy labels, and conflicting colour blocks.
- Bundle polished Explore imagery locally with predictable rendering and no network dependency.

**Non-Goals:**

- Rewriting scientific copy, calculations, provenance data, or location behavior.
- Replacing Inter or introducing a new component framework.
- Redesigning every secondary data-heavy screen beyond the shared tokens and disclosure treatment it inherits.
- Adding live astronomical imagery, remote media fetching, or a user-selectable theme system.

## Decisions

### 1. Use shared semantic tokens with violet as the interaction accent

`constants/colors.ts` will define deep ink background and surface roles, near-white text, lavender-muted text, violet primary/accent roles, and restrained violet borders/glows. A representative direction is background `#06050B`, card `#12101C`, elevated card `#191628`, foreground `#F7F4FF`, muted foreground `#AAA4BE`, and primary violet near `#9F8CFF`; exact values will be contrast-checked during implementation. Screen-local amber values will be replaced in affected interaction and text styles.

This retains the black-space atmosphere while making actions calmer and more coherent. A warmer gold palette was rejected because it is the principal source of the current visual tension. Per-screen accent palettes were rejected because they recreate the inconsistent-card problem.

### 2. Strengthen hierarchy using the existing Inter family

Display headings will use bold weights, tighter tracking, and controlled line heights; buttons and navigation labels will use semibold or bold weights; metadata will be quieter and less letter-spaced. Layout will prefer a small number of clearly grouped text levels over many all-caps micro-labels.

Keeping Inter avoids font-loading, bundle, and cross-platform variability. Introducing a display font was rejected because the requested improvement is hierarchy and calmness, not a more decorative identity.

### 3. Replace disclosure containers with a quiet disclosure line

The current bordered `IllustrationDisclosure` becomes an unboxed inline caption with the exact visible qualification `Illustrative · not to scale` and a full accessibility label containing the longer explanation. Journey screens will not render source-title chips. Provenance will use a reusable subdued `Sources & methods` text affordance (or an equivalent compact disclosure row in detail contexts) whose accessible label includes evidence class, review date, and source titles; the source URLs remain available from that affordance.

This satisfies the existing honesty and provenance contracts without allowing secondary information to dominate the scene. Removing all visible qualification was rejected because it would make stylised scientific visuals misleading and violate the main specification.

### 4. Treat Home as one responsive hero followed by one card system

The dot, marker, universe-age estimate, qualifier, and personal prompt/metric will sit in a bounded centered hero with a responsive maximum width and content-driven minimum height instead of relying on a fixed proportion that can split the composition. The estimate will use deliberate line wrapping and balanced type sizing. Observatory and navigation cards will share radius, surface, border, internal spacing, icon treatment, and press feedback; unnecessary badges are removed or restyled as simple icons.

Absolute positioning for the full hero was rejected because it would be fragile across content states and font scaling.

### 5. Give Explore eight local artworks under one overlay system

Generate one portrait-oriented, text-free image for each existing destination: Moon, Mars, Saturn, Galactic Center, Andromeda, Pillars of Creation, Sagittarius A*, and the Observable Edge. Images will share a cinematic deep-space art direction with violet/blue colour grading, quiet negative space in the upper text region, and no embedded labels or logos. They will be resized/compressed to an appropriate card resolution and stored beneath `assets/images/explore/`.

Each `Location` receives an explicit local image key/source. `LocationCard` uses an image background, a shared dark-violet contrast gradient, top-aligned content, and a stable fallback surface. A single image reused across all cards was rejected because it weakens destination recognition; runtime image URLs were rejected for offline behavior, privacy, and layout stability.

### 6. Use code-native celestial and navigation icons

A shared `SkyStateIcon` built with SVG primitives will render sun, twilight horizon, or moon-and-stars variants at hero scale and can apply subtle glow animation. Explore will receive an explicit compass/star-map style tab icon in the existing custom SVG icon set. These icons are semantic, resolution-independent, themeable, and accessible; raster icon assets were rejected because they are harder to tint and animate consistently.

### 7. Centralise preference-aware motion

A small reduced-motion hook will read `AccessibilityInfo.isReduceMotionEnabled()` and subscribe to preference changes. A shared motion vocabulary will use brief opacity/translate entrances, small press-scale feedback, measured expansion transitions, and low-amplitude ambient glow. Existing long staged or looping animations will jump to their final readable state, or disable the loop, when reduced motion is active. Navigation and input remain responsive regardless of animation state.

Motion will use existing platform APIs and installed libraries; no dependency is added. Broad spring-heavy motion was rejected because it conflicts with the requested calm tone and makes web/native parity harder.

### 8. Compose the Shift ending around a dedicated dot anchor

The contraction target remains an independently positioned visual anchor above the completion copy. `Welcome back.`, its subtitle, and final actions occupy a separate vertically spaced content group, so the final dot never appears attached to the title. The group uses safe-area-aware padding and responsive spacing rather than a magic negative offset.

### 9. Verify screenshots and behavior at representative breakpoints

Implementation will be checked on compact mobile and a wider web viewport, in Home birthday states, Explore, Shift stage and completion states, and daylight/dark Tonight's Sky states. Tests will cover semantic token use, image mapping/fallback, disclosure availability, tab registration, and reduced-motion final states where practical. Existing content and calculation tests remain unchanged.

## Risks / Trade-offs

- **[Generated art can reduce text contrast or feel visually inconsistent]** → Use one art direction, reserve upper negative space, apply a uniform overlay, and verify every card at compact width.
- **[Eight bundled images increase application size]** → Limit pixel dimensions to their displayed use, compress assets, and record the final aggregate size during verification.
- **[Removing prominent source chips can make provenance harder to discover]** → Keep one consistently located `Sources & methods` affordance with explicit accessibility metadata and retain source links in detail contexts.
- **[Global token changes can affect screens outside the requested set]** → Audit token consumers, keep semantic meanings stable, and visually smoke-test inherited screens before completion.
- **[Motion behaves differently on web and native]** → Prefer transform and opacity animations, avoid layout-dependent native-driver assumptions, and test both a browser export and native exports.
- **[Reduced-motion handling can leave animated values invisible]** → Initialise or immediately set values to final states before bypassing sequences and add focused tests for the static path.

## Migration Plan

1. Add the shared violet-led tokens and reduced-motion utility while keeping component APIs compatible.
2. Generate, optimise, and register the eight Explore images with a fallback mapping.
3. Refactor shared disclosure, source, card, icon, and button treatments.
4. Recompose Home, Explore, Tonight's Sky, Shift, universe journey, and tab navigation incrementally so each screen remains runnable.
5. Run formatting, lint, type checking, unit/content tests, strict OpenSpec validation, platform exports, and browser visual checks at representative viewports.
6. Roll back by reverting the visual component/token changes and removing the new bundled assets; no user data or schema migration is involved.
