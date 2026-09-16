## Purpose

Give the Home `You are here.` hero a calm sense of depth and life through restrained ambient stars and a dimensional location sphere without compromising readability, accessibility, or device performance.

## ADDED Requirements

### Requirement: The Home hero has a restrained ambient star field
The Home hero SHALL display a contained background of dim star-like points that move slowly and continuously without flashing, abrupt direction changes, or competing with the hero copy.

#### Scenario: Home is focused with standard motion enabled
- **WHEN** the Home hero is visible and the platform permits motion
- **THEN** multiple shallow layers of star-like points drift gently at different rates behind the hero content

#### Scenario: Hero text is read over the star field
- **WHEN** the star field passes behind the sphere, title, estimate, qualifier, or personal metric
- **THEN** the text remains clearly legible and the stars remain visually subordinate

### Requirement: The location marker appears as a dimensional calm sphere
The marker above `You are here.` SHALL render as a softly shaded sphere with depth, restrained rim light, and a diffuse atmospheric glow. Its motion MUST remain slow and low-amplitude and MUST NOT flash, strobe, or rapidly change brightness.

#### Scenario: The sphere is displayed with standard motion enabled
- **WHEN** the Home hero is visible
- **THEN** the sphere has a visible highlight-to-shadow gradient, a soft edge glow, and subtle breathing or floating motion

#### Scenario: The sphere is displayed on a compact viewport
- **WHEN** the Home screen renders at the narrowest supported mobile width
- **THEN** the sphere and its glow remain centered, fully visible, and separated from the title and estimate without increasing horizontal overflow

### Requirement: Ambient motion respects user preference and screen lifecycle
The Home hero SHALL render a complete static composition when reduced motion is enabled and SHALL stop its repeating animation work while Home is unfocused or the application is inactive.

#### Scenario: Reduced motion is enabled
- **WHEN** the platform requests reduced motion
- **THEN** the stars and sphere render in stable final positions with no looping drift, breathing, or hover motion

#### Scenario: User leaves Home
- **WHEN** the user changes tabs, navigates away, or backgrounds the application
- **THEN** repeating hero animations stop until Home is active and focused again

### Requirement: The animated scene remains decorative and non-cartographic
The ambient stars and dimensional sphere SHALL NOT claim to represent measured star positions, a live sky, a scaled Earth, or the user's physical location. Decorative layers MUST NOT add focusable elements or alter the existing screen-reader order.

#### Scenario: Assistive technology explores Home
- **WHEN** a screen reader navigates through the Home hero
- **THEN** it encounters the existing meaningful hero copy and actions without separately focusing decorative stars, glows, or sphere layers

#### Scenario: User interprets the ambient scene
- **WHEN** the Home hero is displayed
- **THEN** the composition reads as an atmospheric location marker rather than a scientific map or simulation

### Requirement: Ambient motion does not block interaction or scrolling
The animated scene SHALL ignore pointer input and SHALL NOT delay, capture, or visibly degrade Home navigation, expansion, scrolling, or tab interaction on supported web and mobile platforms.

#### Scenario: User interacts while the scene is moving
- **WHEN** the user scrolls Home, expands the observatory card, or selects a navigation action
- **THEN** the interaction responds normally and the decorative scene does not intercept the gesture

### Requirement: Shift reuses the calm dimensional marker
Shift SHALL reuse the same dimensional sphere as Home on its entry screen and as the journey's animated background marker. The sphere SHALL replace the flat expanding circle, scale and drift behind the stage copy, and remain visually subordinate enough for all text and controls to stay legible. Shift SHALL also present a slightly more visible ambient star background.

#### Scenario: User opens Shift before starting the journey
- **WHEN** the Shift entry screen is focused
- **THEN** the shared violet-blue sphere appears above `You are here.` and the surrounding stars are clearly visible without reading as bright, dense, or flashing

#### Scenario: User starts the Shift journey
- **WHEN** the journey advances through its perspective stages
- **THEN** the same shaded sphere replaces the flat background circle and transitions in scale and position behind the stage copy without obscuring the content

#### Scenario: The journey returns to Earth
- **WHEN** the final stage completes
- **THEN** the background sphere contracts to the small return marker before `Welcome back.` appears

#### Scenario: Shift motion is unavailable or off-screen
- **WHEN** reduced motion is requested, Shift loses focus, or the application becomes inactive
- **THEN** the sphere renders as a stable composition and its repeating float, breathing, scale, and drift motion stops
