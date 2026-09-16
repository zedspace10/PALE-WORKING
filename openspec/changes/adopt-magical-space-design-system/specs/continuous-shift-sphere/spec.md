## Purpose

Create a continuous, calming Shift focal object that feels like a magical Earth while remaining centered, accessible, and visually stable throughout the complete journey.

## ADDED Requirements

### Requirement: One sphere persists through the Shift journey
The Shift experience SHALL present one continuous sphere from the entry state through journey stages and the return state, without visually replacing it with a second sphere.

#### Scenario: User begins a Shift
- **WHEN** the user activates "Begin the Shift"
- **THEN** the visible entry sphere remains present and transitions into the journey background without disappearing, flashing, or being replaced by a lookalike

#### Scenario: User completes or exits a Shift
- **WHEN** the journey reaches its return state or the user exits early
- **THEN** the same sphere transitions to the appropriate resting state without a duplicate sphere becoming visible

### Requirement: Sphere remains horizontally centered
The Shift sphere's visual center SHALL remain aligned with the horizontal center of the available viewport in every entry, journey, completion, and supported viewport state.

#### Scenario: Journey changes stage
- **WHEN** a stage changes the sphere's scale, vertical position, opacity, or visual intensity
- **THEN** its horizontal center remains aligned with the viewport center

#### Scenario: Viewport width changes
- **WHEN** Shift is displayed on a compact phone, a wider mobile viewport, or after an orientation or layout-width change
- **THEN** the sphere is recalculated against the current viewport and remains horizontally centered

### Requirement: Sphere reads as a magical Earth
The sphere SHALL read as Earth before it reads as an abstract magical object. Its visually dominant layers SHALL use deep navy and ocean blue water, recognizable teal-green continent silhouettes, soft white cloud bands, spherical day/night shading, and a pale cyan atmospheric rim. Violet SHALL remain a secondary accent for restrained electrical filaments, auroral light, and shadow glow rather than replacing the planet's natural colour structure.

#### Scenario: Sphere is at its normal entry size
- **WHEN** the Shift entry state is visible
- **THEN** blue oceans, continent shapes, clouds, and atmosphere make the object recognizable as Earth rather than a flat dot, generic violet circle, or unidentifiable energy orb

#### Scenario: Sphere expands during the journey
- **WHEN** the shared sphere becomes a large background element
- **THEN** its oceans, continents, cloud structure, curved terminator, and atmosphere remain recognizable while the energy treatment stays subordinate

#### Scenario: Energy effect is active
- **WHEN** ambient motion is allowed and the app is foregrounded
- **THEN** violet-cyan lightning and auroral energy flow gently over or around the Earth layers without obscuring its continents, clouds, spherical shading, or atmosphere and without rapid flashes, hard strobes, or abrupt brightness jumps

#### Scenario: Decorative globe is interpreted non-visually
- **WHEN** assistive technology encounters the sphere
- **THEN** the globe remains decorative and does not claim to be a live, measured, or geographically precise Earth rendering

### Requirement: Sphere motion respects comfort and lifecycle
The sphere SHALL provide a stable fallback when reduced motion is requested and SHALL suspend nonessential ambient animation when Shift is not focused or the app is not active.

#### Scenario: Reduced motion is enabled
- **WHEN** the user requests reduced motion
- **THEN** the sphere retains its complete Earth-energy appearance while continuous drift, rotation, pulse, and lightning travel are stopped or reduced to immediate state changes

#### Scenario: App leaves the foreground
- **WHEN** the app becomes inactive or backgrounded
- **THEN** the sphere's ambient animation stops until the app is active and Shift is focused again

### Requirement: Sphere remains legible behind journey content
The sphere SHALL adapt its scale and visual intensity so journey text and controls remain readable at every stage.

#### Scenario: Sphere expands behind stage text
- **WHEN** a journey stage makes the sphere larger than its entry presentation
- **THEN** glow and opacity remain subdued enough that stage titles, descriptions, disclosures, and controls retain readable contrast

#### Scenario: Return message is presented
- **WHEN** the journey reaches "Welcome back"
- **THEN** the sphere supports the message as a calm background focal point without obscuring it
