## Context

See `proposal.md` for motivation. PALE is an Expo/React Native application whose scientific copy and calculations are spread across screen modules and several TypeScript catalogues. Location, birthdays, journals, and notification settings are local-only AsyncStorage records. The app has no first-party content service, so accuracy, provenance, and expiry must work offline and be reviewable in source control.

The current sky engine computes approximate geometry on-device. It has no weather or light-pollution source, and several catalogue entries lack apparent magnitude. The project has TypeScript and export scripts but no lint or automated test runner. The standalone static server interpolates request-derived origin values into its landing template.

## Goals / Non-Goals

**Goals:**

- Make the trust level of every scientific output explicit in both data and presentation.
- Keep astronomy and date calculations pure, deterministic, and unit-testable.
- Preserve existing local user data while correcting how it is described and formatted.
- Preserve PALE's reflective voice without allowing reflection to masquerade as measurement.
- Establish a release command that checks types, lint, tests, content metadata, OpenSpec, Expo compatibility, and exports.

**Non-Goals:**

- Build an observatory-grade ephemeris or guarantee real-world visibility without weather, light-pollution, and horizon data.
- Add a backend, analytics, accounts, cloud journal sync, or remote location storage.
- Encrypt legacy journal data in this change; the UI will accurately disclose local unencrypted storage.
- Redesign the overall navigation or visual identity.
- Make decorative diagrams physically to scale; they will be clearly disclosed as illustrative.

## Decisions

### 1. Introduce a typed content provenance layer

Create a central source registry and a small metadata contract shared by curated catalogues:

- `sourceIds`: one or more stable references to primary sources.
- `classification`: `fact`, `estimate`, `model-dependent`, `disputed`, `dynamic`, or `poetic`.
- `reviewedAt`: ISO calendar date.
- `reviewBy`: required for dynamic or record-holder claims.
- Optional `precisionNote` and `conditions` for concise UI disclosure.

Existing catalogue types will be extended rather than replacing all content with a new content-management abstraction. Full-screen factual cards will expose a compact source/review affordance; poetic copy will be styled or labelled separately. A validation test will walk all curated collections, reject missing or expired metadata, and check duplicate subject keys for explicitly declared canonical values.

Alternative considered: leave citations in code comments. Rejected because comments cannot be shown to users, validated, or used to expire dynamic claims.

### 2. Separate pure astronomy/domain functions from screens

Move or expose coordinate validation, twilight classification, altitude/azimuth calculation, personal-star selection, approximate Moon phase, seasonal markers, and date formatting as pure functions outside React components. Screens will receive explicit `now`, coordinates, and catalogue data. This eliminates hidden `new Date()` dependencies that do not refresh when coordinates stay constant.

Use named result types such as `Estimate<T>` and `ObservationGuidance` where useful so formatted output carries qualifiers alongside values. The existing lightweight equations remain suitable for reflective guidance, but their precision and limitations will be explicit.

Alternative considered: adopt a large ephemeris library. Rejected for the initial change because it increases bundle and dependency risk without solving weather, obstruction, or light-pollution uncertainty. Year-specific seasonal instants can be supplied by a small sourced table covering the supported release horizon, with expiry validation, or a tested published polynomial if that is smaller.

### 3. Replace the location fallback with an explicit state machine

Tonight's Sky will distinguish `loading`, `ready-current`, `ready-cached`, `unavailable`, `denied`, `daylight`, and twilight states. Cached JSON will be parsed through a runtime schema that validates finite coordinate ranges and timestamp freshness. Failed live retrieval may use a valid fresh cache, visibly marked as such; otherwise the user gets retry/settings guidance. London will not exist as a runtime fallback.

The same validated location record will feed reminders. Notification copy will describe the selected twilight threshold rather than the generic word "dark" when the threshold is not astronomical darkness.

Alternative considered: retain London as a labelled preview. Rejected because it still risks users treating the directions as local and adds a second product mode that was not requested.

### 4. Use astronomical darkness for the strongest darkness claim

Solar-altitude states will be named: daylight above 0 degrees, civil twilight from 0 to -6, nautical twilight from -6 to -12, astronomical twilight from -12 to -18, and astronomical darkness at or below -18. The screen may remain useful during twilight, but will say which stage applies. Dusk calculations and reminders will use shared functions and explicitly handle no-crossing polar cases.

Alternative considered: keep -6 degrees for continuity. Rejected because the interface currently calls it fully dark, which is factually wrong. A user preference for earlier reminders can be added later without changing the scientific label.

### 5. Model visibility conservatively

Add apparent magnitude and an object-kind visibility policy to the observing catalogue. Point sources can receive a conservative naked-eye threshold and minimum altitude; extended objects and constellations receive tailored wording instead of a binary visible flag. All guidance retains a standing local-conditions disclaimer. Stars too faint for unaided vision can still be used as reflective personal-star matches only if the card clearly says optical aid is required; otherwise they are omitted from the naked-eye flow.

Alternative considered: altitude-only visibility. Rejected because it labels intrinsically invisible targets as visible.

### 6. Prefer honest rounded values over simulated precision

Universe age becomes a sourced display constant at appropriate precision rather than a wall-clock counter. Existing stored journal values remain readable but are formatted as legacy approximate metadata. Birthday movement copy will identify Earth's solar orbit and use rounded units; whole completed orbits and time since the last birthday will replace decimal "completed" orbits. Calendar-year progress will be named as such unless a genuine orbital-position calculation is used.

Date input will use component-preserving validation. Historical-event eligibility will compare complete dates, not years.

Alternative considered: increase numerical sophistication while retaining exact-looking output. Rejected because additional digits would still exceed the uncertainty of the scientific inputs and reference frames.

### 7. Make journal mutations serialized and failures recoverable

Journal state will maintain a current ref and a single mutation queue so overlapping writes cannot persist stale snapshots. Loading, saving, and deleting will expose error state and retry behavior. A failed save leaves the draft untouched. Existing storage keys and entry fields remain compatible; any added schema version is additive.

The canonical tab journal becomes the single implementation. The legacy top-level route will redirect or re-export the canonical screen so deep links remain compatible.

Alternative considered: replace AsyncStorage with encrypted storage now. Rejected because large journal text, cross-platform support, and migration/backup behavior require a separate privacy design. This change fixes the claim and reliability gap without risking data loss.

### 8. Treat scientific diagrams as explanatory illustrations

Solar-system and cosmic-web visuals keep their current artistic layouts but gain a persistent, accessible "illustrative, not to scale" control. The cosmic-web description explicitly states that named objects are not plotted at measured relative coordinates and that connecting lines are decorative. Text shown in visual transitions will use the same provenance registry as other content.

Alternative considered: construct a physically accurate interactive map. Rejected because real distance scales would make the current three-level interaction unusable and require a substantially different product.

### 9. Add focused verification tooling

Use Vitest for pure TypeScript domain and server tests, plus ESLint with the Expo-compatible configuration. Keep component rendering tests limited to behavior that cannot be covered through extracted pure functions. Add scripts for `lint`, `test`, `test:coverage`, `verify:content`, and an aggregate `verify` command. OpenSpec validation remains a separate CLI-backed step in documentation because OpenSpec is intentionally not a runtime dependency.

Expo packages will be aligned with `expo install --fix` for SDK 54-compatible patch versions. Run a non-forced audit fix first, then document any remaining severe transitive advisories with reachability and review dates rather than using `npm audit fix --force`.

Alternative considered: Jest through the full React Native preset. Rejected for the first pass because most high-risk logic can be isolated and tested without transforming the entire native UI dependency graph; Vitest is faster and keeps tests focused on deterministic domain behavior.

### 10. Make the landing origin configuration-driven

Production landing links will use a validated `PUBLIC_ORIGIN`. Development may derive an origin only from a strict localhost/loopback allowlist. If proxy headers are enabled, accept only `http` or `https` protocol tokens and RFC-compatible host/optional-port syntax, then HTML-escape all substitutions. Base-path stripping will require a segment boundary, static paths will be checked with a relative-path containment test, and only GET/HEAD will be supported.

Add CSP, `X-Content-Type-Options`, frame protection, and referrer policy. Vendor the QR script under the static assets (or pin it with verified integrity if local vendoring proves impractical) so executable code is not fetched from an mutable third-party URL at page load.

Alternative considered: merely escape the current Host header. Rejected because safe escaping prevents markup injection but still lets an attacker generate trusted-looking links for an arbitrary host.

## Risks / Trade-offs

- [Source metadata increases editorial work] -> Seed a small reusable primary-source registry and validate metadata automatically so future omissions fail early.
- [A stricter visibility policy produces fewer cards] -> Prefer fewer defensible observations and retain non-visible objects in clearly labelled educational content.
- [Astronomical-darkness reminders occur later] -> Explain twilight stages now; a future preference can offer earlier reminders without redefining darkness.
- [Content corrections alter carefully written prose] -> Keep the reflective sentence where possible and revise only the factual premise or certainty marker.
- [Stored legacy journal metadata has excessive precision] -> Preserve data but format it through the new approximate presentation and mark the old field as legacy.
- [Dependency remediation may require an Expo SDK upgrade] -> Apply compatible patch upgrades first, document unreachable transitive risks, and split any SDK major migration into a separate OpenSpec change.
- [CSP can break the existing landing QR code] -> vendor and test the QR dependency before enforcing the final policy.
- [One large change touches many screens] -> Implement in task groups with passing verification after each group and keep data migrations additive/reversible.

## Migration Plan

1. Add pure domain utilities, provenance types, validation, and tests without changing stored data.
2. Correct catalogues and connect source metadata; validate all content before changing screens.
3. Switch Tonight's Sky and reminders to the validated location/twilight/visibility model.
4. Update personalised metrics, journal behavior, privacy copy, and the canonical journal route while retaining existing storage keys.
5. Add illustration disclosures and source affordances across screens.
6. Harden the landing server and vendor or integrity-pin its QR dependency.
7. Align compatible packages, triage advisories, and run the complete release verification matrix.

Rollback is code-only: retain prior storage keys and treat new fields as optional so reverting the application does not make existing birthdays or journal entries unreadable. Do not delete or rewrite user journal records during rollout.
