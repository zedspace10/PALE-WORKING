## 1. Licensed asset and playback foundation

- [ ] 1.1 Reconfirm the OpenGameArt source page and CC0 deed, download the original `outer_space.mp3` as `assets/audio/shift-ambient.mp3`, and add `assets/audio/README.md` with creator, source, licence, retrieval date, byte size, duration/format, and SHA-256 checksum; verify the file decodes, its checksum matches the record, and it remains within the planned bundle-size range.
- [ ] 1.2 Install the Expo SDK-compatible `expo-audio` dependency without enabling recording or background-playback configuration; verify package installation, Expo Doctor, and app configuration show no new microphone or background-audio permission.

## 2. Journey-scoped audio behavior

- [ ] 2.1 Add a focused Shift ambient-audio hook that owns local playback, looping, restrained volume, screen-session mute state, foreground/background behavior, reset, cleanup, and non-blocking errors; verify focused tests cover lifecycle decisions and unavailable-player fallback.
- [ ] 2.2 Start the soundtrack from the existing `Begin the Shift` gesture, stop/reset it through every Shift exit path, and add an accessible 44px-or-larger sound on/off control to the journey modal; verify repeat journeys retain the current screen-session mute choice while the entry screen remains silent.

## 3. Verification and delivery

- [ ] 3.1 Add or update integration-focused tests for the bundled source, licence/checksum record, user-initiated playback seam, labelled mute state, and visual-journey independence from audio failure; verify the targeted suite passes.
- [ ] 3.2 Run formatting, lint, TypeScript, all unit/content tests, strict OpenSpec validation, Expo Doctor, and web/iOS/Android exports; verify all checks pass without introducing native permissions outside the approved scope.
- [ ] 3.3 Run Shift locally on web and a native target with sound on/off, repeat journeys, exit/completion navigation, offline/local-asset loading, and background/foreground transitions; verify the loop is quiet and unobtrusive, controls remain reachable, audio never escapes the active foreground journey, and results are recorded for archive.
