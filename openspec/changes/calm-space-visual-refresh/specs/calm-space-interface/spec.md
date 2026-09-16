## Purpose

Provide a calm, cohesive, space-oriented interface that gives PALE's reflective content clear hierarchy, accessible scientific context, and polished motion across screen sizes and user preferences.

## ADDED Requirements

### Requirement: The interface uses one calm visual language
The application SHALL use a cohesive deep-neutral and violet-led colour system, consistent surface treatment, stronger typographic hierarchy, and clearly weighted interactive controls. Amber SHALL NOT be used as the default accent for navigation, buttons, links, labels, or informational text.

#### Scenario: A primary screen is displayed
- **WHEN** a user opens Home, Shift, Tonight's Sky, Explore, or a linked cosmic detail screen
- **THEN** its background, surfaces, text, borders, and accents use the shared calm-space visual language with readable contrast

#### Scenario: An action is available
- **WHEN** a screen presents a primary or secondary button
- **THEN** the action has a visually clear affordance, a stronger label weight than surrounding body copy, and visible pressed and focus states

### Requirement: Scientific context remains accurate without visual clutter
The application SHALL NOT present illustrative qualifications or scientific sources as large bordered disclosure cards or separate source-title chips on immersive journey screens. Illustrative visuals MUST retain a concise visible `illustrative, not to scale` caption and an accessible longer explanation, while factual content MUST retain an understated path to its source and review context.

#### Scenario: An illustrative journey stage is shown
- **WHEN** the visual uses stylised size, distance, position, or animation timing
- **THEN** a quiet inline caption identifies it as illustrative and not to scale without obscuring or displacing the primary content

#### Scenario: A journey stage has provenance
- **WHEN** scientific source metadata is available for the current content
- **THEN** the interface does not show a named source chip such as `Universe Overview` and makes source and review context available through a consistent subdued affordance or accessible detail

### Requirement: Home presents a coherent centered hero
The Home screen SHALL compose the pale-blue dot, `You are here.` marker, universe-age estimate, qualifier, and birthday prompt or personal time metric as one centered responsive hero. Text wrapping and spacing MUST preserve the hierarchy without visual collisions or unintended left alignment.

#### Scenario: Home opens without a stored birthday
- **WHEN** the Home screen renders on a supported compact or wide viewport
- **THEN** the hero content is centered, intentionally spaced, fully readable, and the birthday prompt remains clearly actionable

#### Scenario: Home opens with a stored birthday
- **WHEN** the personal day metric is included in the hero
- **THEN** both age-of-universe and personal-time information remain visually ordered and fit without overlapping the content cards below

### Requirement: Explore cards use imagery and consistent information placement
The Explore screen SHALL present every destination with locally bundled space imagery, a consistent dark-violet overlay and surface treatment, and text aligned to a predictable top content region. Images MUST have meaningful accessibility text or be marked decorative when the card label already conveys their meaning.

#### Scenario: Explore grid is displayed
- **WHEN** destination cards are rendered
- **THEN** each card has legible top-aligned title, description, and distance content over a readable image treatment without unrelated per-card background colours

#### Scenario: A card image is unavailable
- **WHEN** an image asset cannot be decoded or displayed
- **THEN** the card retains its label, distance, contrast, dimensions, and tap target using the shared fallback surface

### Requirement: Explore navigation has a recognisable icon
The Explore destination in the tab bar SHALL use a recognisable discovery-oriented icon that is visually consistent with the other tab icons and clearly reflects active and inactive state.

#### Scenario: Tab navigation is displayed
- **WHEN** Explore is active or inactive
- **THEN** its icon remains identifiable, aligned with the other icons, and uses the corresponding shared navigation colour

### Requirement: Sky state screens have a clear celestial focal point
Tonight's Sky SHALL represent daylight, twilight, and astronomical-darkness states with a large state-appropriate celestial icon and a clear hierarchy for state name, local time, transition timing, and observing guidance. Decorative treatment MUST NOT imply greater astronomical precision than the underlying calculations provide.

#### Scenario: Daylight or twilight is active
- **WHEN** the Sun has not reached astronomical darkness
- **THEN** the screen shows an appropriate sun or horizon icon, the current state and local time prominently, and the qualified darkness timing beneath it

#### Scenario: Astronomical darkness is active
- **WHEN** the night-sky experience is available
- **THEN** the header or focal region uses a moon-and-stars treatment that complements rather than competes with the object guidance

### Requirement: Shift completion keeps the collapsed dot separate from its title
The Shift return sequence SHALL place the collapsed journey dot and `Welcome back.` title on distinct visual positions with deliberate spacing at all supported viewport sizes. Journey text and completion actions SHALL use the shared typography and button hierarchy.

#### Scenario: The return animation completes
- **WHEN** the journey circle contracts into the final dot
- **THEN** the dot remains visually separated from `Welcome back.` and the subtitle and actions appear in an intentional vertical rhythm

### Requirement: Motion is smooth, purposeful, and preference-aware
Refreshed screens SHALL use gentle transitions for content entrance, card interaction, expansion, and ambient emphasis without blocking navigation or comprehension. The application MUST respect the platform reduced-motion preference by removing looping, large-scale, and delayed motion while leaving content immediately available.

#### Scenario: Standard motion is enabled
- **WHEN** a refreshed screen enters or an interactive card changes state
- **THEN** the transition uses a smooth, brief opacity, position, scale, or glow change that preserves responsiveness

#### Scenario: Reduced motion is enabled
- **WHEN** the operating system requests reduced motion
- **THEN** content renders in its final state without looping pulses, staged delays, or large animated movement

### Requirement: Refreshed layouts remain usable and accessible
The refreshed interface SHALL preserve safe-area spacing, readable contrast, screen-reader names, logical focus order, and touch targets of at least 44 by 44 logical pixels for essential controls. Content SHALL remain usable on supported mobile and web viewports without horizontal clipping.

#### Scenario: A compact mobile viewport is used
- **WHEN** a refreshed screen renders at the narrowest supported width
- **THEN** text wraps intentionally, controls remain reachable, images do not force horizontal overflow, and bottom navigation does not cover content

#### Scenario: Assistive technology explores a visual screen
- **WHEN** a user navigates by screen reader, keyboard, or reduced-motion preference
- **THEN** all essential labels, actions, scientific qualifications, and focus states remain available in a logical order
