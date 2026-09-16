## Purpose

Give PALE a coherent mobile-first magical-space interface with luminous dark surfaces, confident typography, restrained motion, and consistent accessible controls across its screens.

## ADDED Requirements

### Requirement: Screens share a calm magical-space visual language
Core PALE screens SHALL use a consistent system of near-black and midnight surfaces, icy cyan/blue primary illumination, violet secondary accents, soft glass depth, rounded geometry, and sparse space-inspired atmosphere. Violet SHALL provide PALE's signature magical character without becoming a uniform wash across backgrounds, text, and controls.

#### Scenario: User moves between core screens
- **WHEN** the user navigates among Home, Shift, You, Journal, Tonight's Sky, Deep Time, Universe/Time Machine, or location detail
- **THEN** colour, surface depth, corner treatment, typography, and control emphasis feel like one coherent product

#### Scenario: Luminous styling is applied
- **WHEN** a card, button, selected state, or focal object uses a glow or gradient
- **THEN** the effect prioritizes cool cyan/blue light with selective violet energy accents and remains localized rather than covering every surface or reducing text contrast

### Requirement: Typography provides a confident hierarchy
The interface SHALL use a licensed bundled sans-serif family with bold, tightly composed display text, readable body text, and clearly differentiated metadata and actions.

#### Scenario: Screen hierarchy is rendered
- **WHEN** a screen contains a title, supporting copy, metadata, and actions
- **THEN** each level is distinguishable by weight, size, line height, spacing, and contrast without relying on many unrelated colours

#### Scenario: Text wraps on a compact viewport
- **WHEN** a heading or action label wraps on a narrow mobile screen or with larger text settings
- **THEN** it remains readable, avoids clipping, and preserves the intended information order

### Requirement: Interactive surfaces are clear and tactile
Primary actions, secondary actions, cards, inputs, and selected navigation states SHALL use consistent rounded surfaces, readable labels, visible focus or selection cues, and calm press feedback.

#### Scenario: Primary action is available
- **WHEN** a screen presents its main action
- **THEN** the action has stronger luminous emphasis and typographic weight than secondary actions without using a flashing or high-glare effect

#### Scenario: User presses or focuses a control
- **WHEN** a control is pressed, keyboard-focused, or selected
- **THEN** it provides a visible response without abrupt scale jumps or loss of label contrast

#### Scenario: User relies on touch accessibility
- **WHEN** an interactive control is rendered
- **THEN** its touch target is at least 44 by 44 logical pixels and its accessible role and label communicate the action

### Requirement: Ambient motion remains calm and optional
Decorative glows, gradients, stars, and surface animations SHALL move slowly, avoid flashing, and respect reduced-motion and app-lifecycle settings.

#### Scenario: Ambient animation runs normally
- **WHEN** the current screen is focused, the app is active, and reduced motion is not requested
- **THEN** decorative motion uses low-amplitude continuous movement with no rapid brightness cycling

#### Scenario: Reduced motion is requested
- **WHEN** the operating system requests reduced motion
- **THEN** content and controls remain fully usable with a visually complete static presentation

### Requirement: Explore composition is preserved
Explore SHALL retain its existing card images, card arrangement, content order, navigation behavior, detail covers, and information hierarchy while adopting only shared typography, colour, and navigation-chrome refinements.

#### Scenario: Explore list is refreshed
- **WHEN** the magical-space design system is applied to the Explore tab
- **THEN** all existing destinations, artwork, card dimensions, grid/list arrangement, labels, distances, and tap destinations remain unchanged

#### Scenario: Explore detail is refreshed
- **WHEN** a location detail page uses updated shared tokens
- **THEN** its existing cover image treatment, scroll behavior, content sequence, and scientific disclosures remain unchanged

### Requirement: Content meaning and provenance remain unchanged
The visual refresh SHALL NOT alter scientific values, qualification, source access, journal meaning, stored user data, or domain behavior.

#### Scenario: Existing content is restyled
- **WHEN** a factual statement, estimate, visibility message, source disclosure, or journal entry is displayed inside a refreshed surface
- **THEN** its value, qualifier, provenance, and behavior match the pre-refresh experience

### Requirement: Interface remains readable across supported mobile layouts
Refreshed screens SHALL maintain readable contrast, safe-area spacing, non-overlapping controls, and dark overscroll surfaces on compact and wide mobile viewports.

#### Scenario: Screen is displayed on a compact phone
- **WHEN** the available width or height is constrained
- **THEN** titles, cards, controls, and tab chrome fit without horizontal overflow or inaccessible content

#### Scenario: Scrollable screen reaches an edge
- **WHEN** the user scrolls or overscrolls a refreshed page
- **THEN** no white or unintended light background is exposed

#### Scenario: Text is shown on a luminous surface
- **WHEN** copy is placed over a gradient, image, glass card, or glow
- **THEN** the foreground and its immediate backing maintain accessible contrast
