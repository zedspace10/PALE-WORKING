## Why

PALE currently presents several approximate calculations, static datasets, and poetic statements as exact or live facts. Some outputs can be materially wrong for a user's location or date, and unsupported certainty undermines the calm, trustworthy experience the product is trying to create.

## What Changes

- Stop generating personalised sky guidance when location data is unavailable or invalid; never substitute an undisclosed location.
- Correct the personal-star time direction and only make visibility claims supported by apparent magnitude and observing conditions.
- Replace known factual errors and contradictions across the cosmic timeline, observatory, star catalogue, Tonight's Sky, and Universe copy with sourced, uncertainty-aware wording.
- Introduce structured provenance for scientific content, including source, review date, and whether a statement is factual, approximate, model-dependent, illustrative, or poetic.
- Replace false numerical precision in universe-age, Moon-phase, orbital, distance, and anniversary displays with honest estimates and labels.
- Correct journal privacy language, anniversary matching, date validation, and storage error handling.
- Clearly label non-scale and synthetic scientific visualisations as illustrative.
- Add automated tests and linting for astronomy, date, content, storage, and server behavior; align Expo patch versions and remediate dependency findings without forced breaking upgrades.
- Validate forwarded host/protocol inputs and harden the static landing server's path, method, and response handling.

## Capabilities

### New Capabilities

- `trusted-sky-guidance`: Location, darkness, visibility, Moon, seasonal, and meteor guidance is transparent about data availability and observational limits.
- `scientific-content-provenance`: User-facing scientific statements are accurate, internally consistent, sourced, reviewable, and explicit about uncertainty.
- `personalized-cosmic-insights`: Birthday-derived and time-derived insights use valid inputs, scientifically defensible calculations, and honest precision.
- `journal-data-integrity-and-privacy`: Journal storage, privacy language, anniversaries, and failure states accurately reflect actual behavior.
- `honest-scientific-visualization`: Visual representations disclose when scale, geometry, timing, or relationships are illustrative rather than measured.
- `safe-application-delivery`: Automated quality gates, dependency alignment, and landing-server validation protect the accuracy and integrity of delivered information.

### Modified Capabilities

None. This repository has no existing OpenSpec capability specifications.

## Impact

- User-visible screens: Tonight's Sky, Home, You, Journal, Shift, Deep Time, Universe, and location/notification messaging.
- Scientific data and calculations: `constants/cosmicData.ts`, `cosmicTimeMachine.ts`, `observatory.ts`, `skyEvents.ts`, `starCatalog.ts`, `solar.ts`, and related hooks.
- Persistence: birthday, location cache, journal, open-count, and notification settings stored through AsyncStorage.
- Delivery and tooling: `server/serve.js`, the landing template, Expo/package versions, scripts, and new test/lint configuration.
- The update preserves PALE's reflective tone, but poetic material will no longer be formatted as an observational or scientific fact.
