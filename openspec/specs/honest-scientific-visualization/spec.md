# Honest Scientific Visualization Specification

## Purpose

Prevent decorative or compressed visual models from being mistaken for measured maps, to-scale diagrams, or live astronomical simulations.

## Requirements

### Requirement: Illustrative visuals are labelled
Any scientific visual whose positions, distances, sizes, connections, timing, or motion are not based on a consistent physical scale SHALL carry a visible concise "illustrative, not to scale" disclosure and an accessible longer explanation.

#### Scenario: Solar-system visual is displayed
- **WHEN** planet radii, sizes, or animation speeds use different scales or stylised values
- **THEN** the screen identifies the representation as illustrative and not to scale

#### Scenario: Cosmic-web visual is displayed
- **WHEN** named clusters or voids are placed using layout coordinates rather than astronomical coordinates and distance data
- **THEN** the system identifies the arrangement and links as an artistic representation rather than a map of their real relative positions

### Requirement: Visual labels do not imply unsupported precision
Labels and transitions associated with illustrative views SHALL use the same ranges, uncertainty, and provenance rules as textual scientific content.

#### Scenario: Estimated population is shown in a transition
- **WHEN** a visual transition mentions galaxy or star counts
- **THEN** the text uses a supported range or model-qualified estimate rather than a categorical exact population

### Requirement: Accessibility preserves the disclosure
The illustrative nature and scientific limitations of a visual SHALL be available to screen-reader and non-visual users.

#### Scenario: Visual is explored with assistive technology
- **WHEN** the user focuses the visual or its explanatory control
- **THEN** the accessibility description includes the non-scale or illustrative qualification
