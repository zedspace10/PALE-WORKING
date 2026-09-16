## Context

See `proposal.md` for motivation. Shift currently lives in `app/(tabs)/shift.tsx` as a modal sequence started by a direct `Begin the Shift` press. Its timers, completion state, exit paths, reduced-motion handling, and haptics are local to that screen. The project is Expo SDK 54 and does not currently include an audio playback package or audio assets.

The selected asset is `Outer Space Loop` by wipics from OpenGameArt. Its asset page labels the work CC0 and public domain, provides a purpose-built loopable 1.7 MB MP3, and links to the CC0 1.0 deed. CC0 permits commercial copying, modification, distribution, and performance without attribution; PALE will still keep source and checksum metadata for auditability.

## Goals / Non-Goals

**Goals:**

- Make playback local, cross-platform, low-volume, user-initiated, controllable, and limited to the active foreground journey.
- Keep the visual journey fully functional if audio is unsupported or fails.
- Preserve a reviewable chain from the bundled bytes to the source and licence declaration.

**Non-Goals:**

- Background or lock-screen playback, playlists, track selection, streaming, recording, microphone access, or global application sound settings.
- Changing Shift timing, scientific content, completion behavior, or reduced-motion behavior.
- Treating the ambient track as scientific sonification or implying that space itself sounds this way.

## Decisions

### 1. Use the CC0 `Outer Space Loop` MP3 as a local asset

Implementation will download the original `outer_space.mp3` from its OpenGameArt asset page, store it as `assets/audio/shift-ambient.mp3`, and add `assets/audio/README.md` with the title, creator, source page, original filename, CC0 URL, retrieval date, bundled byte size, and SHA-256 checksum. The source page and the CC0 deed will be rechecked at download time.

A CC0 asset was chosen over typical “royalty-free” catalogue music because royalty-free may still impose account, attribution, redistribution, or platform restrictions. Procedurally synthesising a new track was rejected because it would be harder to reach the requested musical quality and would add a production workflow unrelated to the app.

### 2. Use the Expo SDK-compatible `expo-audio` playback hook

Install the SDK-resolved `expo-audio` version with `npx expo install expo-audio`. A small `useShiftAmbientAudio` hook will own the player, loop flag, restrained volume, mute state, app-state subscription, and reset behavior. The package supports Android, iOS, web, local `require()` sources, looping, volume, and automatic player release on unmount.

The older `expo-av` API was rejected because Expo now provides `expo-audio` as the dedicated playback library. A raw HTML audio element was rejected because Shift also targets native platforms.

### 3. Start from the existing user gesture and never request background playback

`beginJourney` will request playback synchronously from the same explicit press that opens the journey, satisfying web autoplay policies. Audio mode will respect the device silent setting, mix rather than interrupt other audio, and disable background playback. The hook will pause on non-active `AppState` values, optionally resume only for an active unmuted journey, and seek to the start when the journey ends.

Preloading the local player while the screen is mounted is acceptable, but audible playback before `beginJourney` is not. Enabling a native background-audio config plugin was rejected because the soundtrack must not outlive the experience.

### 4. Put one compact sound control beside the journey exit control

The modal will expose a 44px-or-larger icon button near the top edge, opposite the back control, using the shared violet visual language. Its icon and accessibility label/state will distinguish `Sound on` and `Sound off`. Muting changes the player immediately and the boolean remains in screen state across repeat journeys until the Shift tab unmounts.

Hiding the control in a menu was rejected because sound needs an obvious, immediate escape. A volume slider was rejected as unnecessary complexity for a single deliberately quiet background level.

### 5. Keep audio errors outside the journey state machine

Playback calls will be guarded and will not be awaited before visual state advances. Failure can set an internal unavailable state for tests and control semantics, but it will not surface a blocking modal or alter stage timers. Tests will focus on pure lifecycle decisions and static integration seams rather than mocking native media internals deeply.

## Risks / Trade-offs

- **[A third-party uploader could misrepresent ownership despite a CC0 label]** → Preserve the source page, author declaration, CC0 URL, retrieval date, and exact checksum; the OpenGameArt page explicitly marks the file public domain, but no public licence source offers an absolute warranty.
- **[Loop boundaries or compression artefacts may be audible]** → Use the asset advertised as a loop, listen on web and native, and trim or crossfade only if needed while retaining modification provenance.
- **[Browser autoplay policies can reject playback]** → Call play from the direct Begin press and treat rejection as non-blocking.
- **[Audio could continue after navigation or app backgrounding]** → Centralise pause/reset cleanup in one hook, subscribe to `AppState`, and test every exit path.
- **[The asset increases the application bundle]** → Keep the compressed MP3 and record its final size; the published source is approximately 1.7 MB.
- **[Ambient sound may conflict with assistive or personal audio]** → Use low volume, respect silent mode, mix with other audio, and expose an immediate labelled mute control.

## Migration Plan

1. Add the provenance record and verified local audio asset.
2. Install the Expo-compatible playback dependency without enabling microphone or background-audio configuration.
3. Add the lifecycle hook and integrate it with every Shift begin/exit/unmount path.
4. Add focused tests, run the complete project verification suite and platform exports, then perform web and native playback checks with sound on/off and background/foreground transitions.
5. Roll back by removing the hook, UI control, asset, provenance record, and dependency; no data migration is required.
