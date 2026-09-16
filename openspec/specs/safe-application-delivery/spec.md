# Safe Application Delivery Specification

## Purpose

Make accuracy and security properties repeatable at release time through automated checks, dependency alignment, and defensive static-server behavior.

## Requirements

### Requirement: Accuracy-sensitive behavior has automated gates
The project SHALL provide repeatable scripts that type-check, lint, test, and build the application. Tests MUST cover location failure, coordinate validation, solar twilight thresholds, time refresh, Moon/event approximation, birthday validation, personal metrics, journal anniversaries, content provenance, and storage failures.

#### Scenario: Release checks run
- **WHEN** the documented verification command is executed from a clean dependency install
- **THEN** type checking, linting, tests, OpenSpec validation, and platform exports complete successfully or return a non-zero failure

### Requirement: Expo dependencies are SDK-compatible
Runtime and tool packages SHALL satisfy the patch ranges recommended for the configured Expo SDK, and package metadata SHALL use a coherent application versioning policy.

#### Scenario: Expo health check runs
- **WHEN** the Expo compatibility checker examines the project
- **THEN** it reports no dependency-version mismatch for the configured SDK

### Requirement: Dependency vulnerabilities are triaged
The production dependency graph SHALL contain no known critical or high vulnerability that is both reachable in the application's supported use and remediable without an accepted exception. Exceptions MUST record reachability, impact, compensating controls, owner, and review date.

#### Scenario: Dependency audit reports a severe advisory
- **WHEN** a high or critical advisory is present after compatible upgrades
- **THEN** release validation fails unless a current documented exception demonstrates that the vulnerable path is not reachable or is otherwise mitigated

### Requirement: Landing URLs use trusted validated origin data
The static landing server SHALL construct URLs only from a configured public origin or strictly validated proxy headers. It MUST reject control characters, markup delimiters, invalid schemes, and untrusted host values before embedding data in HTML.

#### Scenario: Trusted public origin is configured
- **WHEN** the server renders the landing page with a valid configured origin
- **THEN** every generated URL uses that origin regardless of an attacker-controlled Host header

#### Scenario: Forwarded header is malformed
- **WHEN** a forwarded host or protocol contains an invalid value
- **THEN** the server rejects the request or uses the trusted configured origin without reflecting the value into HTML

### Requirement: Static delivery enforces safe request boundaries
The server SHALL serve only files whose resolved paths remain inside the static root, SHALL remove a base path only on a complete path-segment match, SHALL restrict supported methods, and SHALL apply baseline security headers. Third-party executable assets SHALL be pinned and integrity-protected or served locally.

#### Scenario: Traversal or prefix-confusion path is requested
- **WHEN** a request attempts traversal or uses a path that merely starts with the configured base-path text
- **THEN** the server does not expose a file outside the intended route and static root

#### Scenario: Unsupported method is requested
- **WHEN** a method other than GET or HEAD reaches the static server
- **THEN** the server responds with method-not-allowed and does not execute normal route handling

#### Scenario: Landing page is served
- **WHEN** a valid landing request succeeds
- **THEN** the response includes content-type protection, framing protection, referrer policy, and a content security policy compatible with its pinned assets
