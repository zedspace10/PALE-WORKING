## 1. Verification Foundation

- [x] 1.1 Add Expo-compatible ESLint and Vitest development tooling plus `lint`, `test`, `test:coverage`, `verify:content`, and aggregate `verify` scripts; verify a clean install can invoke every script without configuration errors.
- [x] 1.2 Create shared test setup, deterministic date/location fixtures, and coverage boundaries for pure domain code; verify a sample TypeScript test resolves the `@/` alias and runs on Windows.
- [x] 1.3 Document the release-check sequence, supported Node version, and OpenSpec validation command; verify a new contributor can run the sequence from the repository root.

## 2. Scientific Provenance and Editorial Corrections

- [x] 2.1 Add typed source, classification, review-date, review-by, precision, and observing-condition metadata plus a reusable primary-source registry; verify type checks reject an invalid classification and missing required fields.
- [x] 2.2 Add content validation that enumerates every curated catalogue, rejects missing/expired provenance, and checks declared canonical duplicate-subject values; verify intentional failing fixtures report stable item identifiers.
- [x] 2.3 Correct Big Bang, nucleosynthesis, dark ages, first-life, oxygenation, mitochondria, hominin, migration, civilisation, Andromeda-collision, and far-future certainty in `cosmicData` and `cosmicTimeMachine`; verify targeted content assertions and source metadata pass.
- [x] 2.4 Correct Proxima, Barnard's Star, Andromeda, Voyager, Sagittarius A-star, Titan, the Milky Way, disputed large structures, cosmic-horizon, Alpha Centauri, Vega, and other audited observatory/star-catalogue claims; verify targeted assertions and duplicate-subject consistency tests pass.
- [x] 2.5 Correct Tonight's Sky catalogue claims for lunar recession, Venus, Jupiter's barycentre, Betelgeuse uncertainty, the Double Cluster, Polaris, the Milky Way, Scorpius, constellation timing, and galaxy populations; verify no audited categorical wording remains in a content scan.
- [x] 2.6 Replace dynamic mission/record-holder wording with stable language or review-by metadata and add a user-accessible source/review affordance for factual cards; verify expired content fails validation and source links render with accessible labels.

## 3. Astronomy and Location Domain

- [x] 3.1 Extract and test finite coordinate validation, cached-location parsing, timestamp freshness, altitude/azimuth calculation, and explicit time inputs; verify boundary coordinates, corrupt JSON, stale cache, and time-advance cases pass.
- [x] 3.2 Implement named daylight/civil/nautical/astronomical-twilight/darkness classification and shared crossing calculations with polar-state results; verify threshold boundary and no-crossing tests pass.
- [x] 3.3 Replace exact-sounding Moon, meteor, equinox, and solstice results with approximation-aware result types and year-specific seasonal data or a sourced calculation; verify phase-window, year-boundary, hemisphere, rate, and event-expiry tests pass.
- [x] 3.4 Add apparent magnitude and object-kind visibility metadata with conservative guidance policies; verify Proxima Centauri and Barnard's Star cannot produce naked-eye claims while valid bright targets remain eligible.

## 4. Tonight's Sky and Reminders

- [x] 4.1 Replace Tonight's Sky's implicit statuses with the designed explicit location/solar state model and remove both London fallbacks; verify denied, timeout, malformed-cache, valid-cache, current-location, twilight, and polar scenarios through domain tests and observable UI states.
- [x] 4.2 Correct personal-star light-time copy and include the clock in recomputation so coordinates, directions, and eligibility refresh without a location change; verify fake-timer tests advance the result and no past year is described as a future arrival year.
- [x] 4.3 Apply visibility qualification and local-condition disclosure to object cards, remove unconditional “with your own eyes”/“it's there” claims, and make daylight/twilight wording scientifically accurate; verify rendered copy for bright, faint, twilight, and unavailable cases.
- [x] 4.4 Update location cache consumers and nightly reminders to use validated coordinates, shared twilight semantics, scoped notification identifiers, and recoverable busy/error states; verify invalid cache and notification rejection tests leave controls usable and do not cancel unrelated notifications.

## 5. Personalised Insights

- [x] 5.1 Extract component-preserving birthday validation and full-date historical-event filtering; verify leap days, impossible dates, future dates, supported age boundaries, and same-year post-birth events.
- [x] 5.2 Replace the ticking exact universe-age counter and journal snapshot claim with one sourced, rounded estimate formatter; verify Home and Journal contain no one-year or one-second precision and legacy stored values format compatibly.
- [x] 5.3 Relabel distance-since-birth as approximate travel along Earth's solar orbit, split whole completed orbits from the current partial year, and rename calendar-year progress; verify calculations around birthdays and leap years.
- [x] 5.4 Correct absolute biological/material ancestry statements and make birthday/shift-count persistence resilient to overlapping operations; verify content assertions and concurrent update tests pass.
- [x] 5.5 Replace device-clock-only Moment Card sunrise, sunset, star-visibility, and photon claims with location-aware solar wording when valid location exists and neutral wording otherwise; verify polar, indoor-unknown, morning, and evening copy cannot assert an unobserved local condition.

## 6. Journal Integrity and Privacy

- [x] 6.1 Refactor journal persistence to serialize mutations, keep current state in a ref, expose load/save/delete errors, and preserve drafts after failed saves; verify overlapping mutations and rejected-storage tests retain every successful entry and end all busy states.
- [x] 6.2 Replace “private” with accurate local-device/unencrypted-storage disclosure and add retryable error UI; verify the composer, empty state, and journal header use consistent wording and failed saves keep the typed draft.
- [x] 6.3 Separate exact calendar anniversaries from broader “around this time” discovery windows; verify month, week, three-month, six-month, one-year, leap-day, and DST-adjacent cases use the correct labels.
- [x] 6.4 Make the tab journal canonical and convert the duplicate top-level route to a compatibility redirect or re-export; verify tab navigation and direct `/journal` navigation render identical behavior.

## 7. Honest Visual Presentation

- [x] 7.1 Add a reusable visible and screen-reader-accessible “illustrative, not to scale” disclosure component; verify its accessibility label explains which dimensions are stylised.
- [x] 7.2 Apply the disclosure to solar-system and cosmic-web levels, explain that cluster positions/connections are artistic, and replace exact population transitions with sourced ranges; verify every visual level exposes the limitation before or alongside its scientific labels.
- [x] 7.3 Audit all remaining Home, Shift, Deep Time, Universe, location, and notification copy for unsupported “now”, “every”, “never”, exactness, and visibility language; verify the content scan has no unreviewed matches and each retained use has provenance or an explicit poetic classification.

## 8. Static Server Hardening

- [x] 8.1 Refactor landing-origin, base-path, escaping, and static-path decisions into importable pure helpers without starting the server during tests; verify valid configured origins and local-development origins pass while malformed or attacker-controlled values fail.
- [x] 8.2 Make `PUBLIC_ORIGIN` authoritative in production, strictly validate any enabled proxy headers, and HTML-escape template substitutions; verify malicious Host and forwarded-header integration requests are never reflected into generated markup or links.
- [x] 8.3 Restrict delivery to GET/HEAD, enforce segment-safe base paths and resolved-root containment, and add CSP, content-type, frame, and referrer headers; verify method, traversal, prefix-confusion, HEAD, 404, and security-header tests.
- [x] 8.4 Vendor the pinned QR implementation locally or add verified integrity/cross-origin protection compatible with the final CSP; verify the landing page generates a QR/deep link without loading mutable third-party executable code.

## 9. Dependencies and Release Verification

- [x] 9.1 Align Expo and Expo Constants with SDK 54's recommended patch versions using Expo's compatible installer, reconcile package/app version metadata, and verify Expo Doctor passes all checks.
- [x] 9.2 Apply compatible non-forced dependency remediations, rerun the production audit, and document each remaining high/critical advisory with reachability, impact, mitigation, owner, and review date; verify no reachable remediable severe advisory remains.
- [x] 9.3 Run formatting, lint, type checking, the complete test suite, content validation, strict OpenSpec validation, and Web/iOS/Android exports; fix every failure and record the successful commands in the change notes.
- [ ] 9.4 Manually exercise location denial/failure/cache, twilight, personal-star, birthday, journal failure/retry, direct journal route, Universe disclosure, notifications, and landing-server flows; record outcomes and verify no acceptance scenario remains untested.
