# Verification notes

Date: 2026-09-16

## Automated release gate

| Command | Result |
| --- | --- |
| `npm ci` | Passed from the lockfile. The local runner is Node 22.12.0 and emitted the expected engine warning; the documented/supported release baseline is Node 22.13 or newer. |
| `npm run verify` | Passed: Prettier, ESLint with zero warnings, TypeScript, 13 test files / 110 tests, 4 content-test files / 24 tests, and Web/iOS/Android exports. |
| `npm run test:coverage` | Passed: 64.42% statements, 70.98% branches, 61.71% functions, and 66.19% lines across the configured domain/server boundaries. |
| `npx expo install --check` | Passed: SDK 54 dependencies are compatible. |
| `npx expo-doctor` | Passed: 17/17 checks. |
| `npx --yes @fission-ai/openspec@1.13.0 validate harden-user-facing-information --strict` | Passed. |
| `npm audit fix` | Applied all compatible non-forced fixes. |
| `npm audit --omit=dev` | 0 critical; nine high build-time package records and thirteen moderate package records remain. Their eight underlying advisories, reachability, mitigations, owner, and review date are documented in `docs/dependency-security.md`. |
| `git diff --check` | Passed with no whitespace errors. |

The working revision and `origin/main` both resolved to `2ec8e4041852f700b4445524caee45099d3734b7` before these uncommitted implementation changes.

## Browser and acceptance exercise

| Scenario | Outcome |
| --- | --- |
| Home | Rendered meaningful content with the rounded universe-age estimate and qualified Observatory wording; no blank page or error overlay was visible. |
| Location failure | Leaving the browser permission request unresolved now exits the loading state after ten seconds and renders the retryable “We don't know where you are tonight” state. This browser pass exposed and led to the permission-timeout fix. |
| Location denial/cache | Deterministic tests verify explicit denial, fresh-cache fallback after live failure, invalid/stale cache rejection, and no default-city fallback. A real location grant was not accepted because that would disclose the user's precise location. |
| Twilight | Boundary and polar/no-crossing fixtures verify all named solar states and astronomical-darkness copy. A real-time twilight state was not available during the browser session. |
| Personal star and birthday | Browser entry of `31/02/2000` produced the intended impossible-date error without storing data. Deterministic tests cover valid dates, leap days, future/range rejection, orbit metrics, and corrected personal-star light-time direction. |
| Journal | The direct `/journal` route rendered the canonical tab implementation, accurate local/unencrypted privacy copy, and the composer. Storage rejection, draft retention, retry, concurrent mutations, anniversary windows, leap days, and DST boundaries pass deterministic tests. |
| Universe | Manually traversed Solar System, Milky Way, and Observable Universe levels; each showed a visible and accessible illustrative/not-to-scale disclosure plus source/review metadata. |
| Notifications | Mocked native scheduling verified scoped cancellation, partial-ID persistence on rejection, and a recoverable enabled state. The UI switch was not toggled because changing browser/device notification permission requires user action. |
| Landing server | The local hardened server rendered the landing page, locally generated QR SVG, and `exps://localhost:8083` link without a third-party script. Integration tests cover hostile headers, traversal, methods, HEAD, 404s, CSP, frame, referrer, and content-type behavior. |

## Remaining native-device check

OpenSpec task 9.4 remains open until a real Android/iOS device or simulator is available for user-authorized location and notification permission flows. Neither `adb` nor the Android `emulator` command is installed in this environment, and iOS simulation is unavailable on Windows. Every branch that can be exercised without changing those permissions or exposing precise location is covered above; the remaining native interactions are not silently marked complete.
