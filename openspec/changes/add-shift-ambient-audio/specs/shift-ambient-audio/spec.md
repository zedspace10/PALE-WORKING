## Purpose

Provide an optional, licensed ambient soundtrack that deepens the Shift journey without surprising users, requiring connectivity, or allowing audio to escape the active experience.

## ADDED Requirements

### Requirement: Shift uses a locally bundled reusable soundtrack
The application SHALL package the Shift soundtrack with the application, SHALL NOT stream it at runtime, and MUST retain a repository record of the track title, creator, source URL, licence, retrieval date, and file checksum. The recorded licence MUST permit copying, modification, distribution, public performance, and commercial use without a royalty payment.

#### Scenario: Shift is used offline
- **WHEN** a user begins Shift without network access
- **THEN** the soundtrack remains available from the bundled application asset

#### Scenario: Audio provenance is reviewed
- **WHEN** a maintainer inspects the bundled soundtrack
- **THEN** the repository identifies its source and reusable licence and provides a checksum that can be matched to the bundled file

### Requirement: Playback begins only from the Shift journey action
The application SHALL begin the ambient soundtrack only after the user activates `Begin the Shift`, SHALL loop it at a restrained background volume while enabled, and SHALL NOT play it on the Shift entry screen.

#### Scenario: Shift entry is displayed
- **WHEN** a user opens the Shift tab but has not begun the journey
- **THEN** no ambient soundtrack is audible

#### Scenario: Journey begins with sound enabled
- **WHEN** a user activates `Begin the Shift`
- **THEN** the visual journey starts and the bundled soundtrack begins looping at the configured background volume

### Requirement: Journey sound remains under user control
The active Shift journey SHALL expose a labelled sound control with a minimum 44 by 44 logical-pixel target. Activating it MUST immediately mute or restore the soundtrack, communicate the current state to assistive technology, and retain that choice for subsequent journeys while the current Shift screen remains mounted.

#### Scenario: User mutes the journey
- **WHEN** the soundtrack is playing and the user activates the sound control
- **THEN** playback becomes inaudible immediately and the control identifies that sound is off

#### Scenario: User begins another journey in the same screen session
- **WHEN** the user previously muted Shift and begins another journey without leaving the mounted Shift screen
- **THEN** the journey remains muted until the user explicitly restores sound

### Requirement: Playback is scoped to the foreground journey
The soundtrack MUST be inaudible when the journey is closed, the Shift screen unmounts, or the application is not in the foreground. It MAY resume only when the journey is still active, the application returns to the foreground, and the user has not muted it.

#### Scenario: Journey ends or is exited
- **WHEN** the user returns from Shift, follows its completion action, or exits with the back control
- **THEN** the soundtrack stops and its playback position is reset for the next journey

#### Scenario: Application leaves the foreground
- **WHEN** the application becomes inactive or enters the background during Shift
- **THEN** the soundtrack is not audible and no operating-system background playback is requested

### Requirement: Audio failure never blocks Shift
The application MUST continue the full visual Shift sequence when the soundtrack cannot load, decode, or play, and MUST leave the journey controls usable.

#### Scenario: Playback is unavailable
- **WHEN** the audio player reports an error or the platform declines playback
- **THEN** Shift continues without audio and the user can still skip, exit, and complete the journey
