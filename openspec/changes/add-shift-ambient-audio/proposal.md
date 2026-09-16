## Why

Shift is designed as an immersive one-minute perspective journey, but it currently relies only on visuals and haptics. A quiet ambient soundscape can make the sequence feel more spatial and cohesive while preserving user control and avoiding uncertain music rights.

## What Changes

- Bundle one loopable ambient-space music track locally and play it at a restrained volume only after the user explicitly begins Shift.
- Use the CC0 `Outer Space Loop` track by wipics from OpenGameArt, record its source, licence, original filename, retrieval date, and checksum in the repository, and avoid runtime streaming or attribution dependencies.
- Add an always-reachable, labelled sound toggle during the journey; muting takes effect immediately and remains respected for the rest of the current Shift screen session.
- Stop playback when Shift is exited, the route unmounts, or the app leaves the foreground; do not enable operating-system background playback.
- Treat playback failure as non-blocking so the visual journey still starts and completes normally.

## Capabilities

### New Capabilities

- `shift-ambient-audio`: Defines licensed local audio, user-initiated playback, journey-scoped lifecycle, accessible controls, and graceful fallback for Shift.

### Modified Capabilities

- None.

## Impact

- Adds a locally bundled MP3 and its CC0 provenance record under `assets/audio/`.
- Adds the Expo SDK-compatible `expo-audio` package for Android, iOS, and web playback.
- Updates the Shift screen and focused tests; no scientific copy, timing calculations, user data, remote service, microphone permission, or background-audio capability changes.
