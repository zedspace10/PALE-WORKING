# Trusted Sky Guidance Specification

## Purpose

Ensure every location- and time-dependent sky statement is based on valid inputs and communicates the limits of what the app can actually know.

## Requirements

### Requirement: Location-specific guidance uses a verified location
The system SHALL generate personalised sky positions, directions, dusk times, and visibility guidance only from finite coordinates within valid latitude and longitude ranges. A cached location MUST include a valid timestamp and MUST NOT be used after its declared freshness period. The system SHALL NOT silently substitute a default city when location is denied, invalid, unavailable, or timed out.

#### Scenario: Current location is available
- **WHEN** the device returns valid coordinates
- **THEN** the system calculates the sky for those coordinates and identifies the result as current local guidance

#### Scenario: Fresh cached location is available
- **WHEN** live location is temporarily unavailable and a validated cached location is still within its freshness period
- **THEN** the system may calculate the sky from that cache and SHALL tell the user that the last known location is being used

#### Scenario: Location is unavailable
- **WHEN** permission is denied, the request fails, times out, or stored coordinates fail validation
- **THEN** the system presents an unavailable state with a retry path and SHALL NOT show another location's sky as the user's sky

### Requirement: Darkness language matches solar twilight
The system SHALL distinguish civil twilight, nautical twilight, astronomical twilight, and astronomical darkness. It MUST NOT describe a solar altitude of minus six degrees as fully dark, and it SHALL handle polar days without inventing a dusk time.

#### Scenario: Sun is between minus six and minus eighteen degrees
- **WHEN** the location is in twilight but not astronomical darkness
- **THEN** the system describes the current twilight stage and avoids claiming the sky is fully dark

#### Scenario: No darkness crossing occurs
- **WHEN** the Sun does not cross the selected darkness threshold on the local date
- **THEN** the system explains the polar or seasonal condition without presenting a fabricated time

### Requirement: Visibility claims are qualified
The system SHALL distinguish geometric altitude from naked-eye visibility. A statement that an object can be seen unaided MUST require an appropriate apparent-magnitude threshold and MUST be accompanied by a concise condition note covering clouds, light pollution, horizon obstruction, and atmospheric conditions.

#### Scenario: Object is above the horizon but too faint
- **WHEN** an object's computed altitude is positive but its apparent magnitude is beyond the configured naked-eye threshold
- **THEN** the system does not say it is visible with the naked eye and identifies the needed optical aid when known

#### Scenario: Object passes the visibility model
- **WHEN** altitude and apparent magnitude meet the configured visibility criteria
- **THEN** the system presents the direction as an estimate and states that local observing conditions may prevent visibility

### Requirement: Personal-star light travel is time-directionally correct
The system SHALL describe a personal star as a star whose light arriving around the present left approximately during the user's birth period. It MUST NOT describe a past birth year as the future arrival date of light leaving now.

#### Scenario: Suitable personal star exists
- **WHEN** the catalogue has a star with distance close to the user's age and valid observing metadata
- **THEN** the system uses approximate language for the departure period and applies the standard visibility qualification

#### Scenario: No suitable visible star exists
- **WHEN** no catalogue entry satisfies the age, coordinate, and visibility constraints
- **THEN** the system omits the personal-star card instead of making an unsupported claim

### Requirement: Calendar sky events disclose approximation
The system SHALL distinguish exact astronomical instants from broad observing windows. Moon phase, meteor shower, solstice, and equinox copy MUST NOT claim exact nightly status from coarse recurring bins or static calendar dates.

#### Scenario: Date falls near a Moon phase
- **WHEN** the date is near but not at an exact new- or full-Moon instant
- **THEN** the system uses wording such as "near new Moon" or "appears nearly full" and does not claim there is no Moon for the whole night

#### Scenario: Only recurring meteor data is available
- **WHEN** the system has a typical annual shower window but no year-specific peak time and observing forecast
- **THEN** it presents a likely activity window, labels rates as ideal-condition estimates, and avoids "peaks tonight" certainty

#### Scenario: Equinox or solstice is shown
- **WHEN** a seasonal marker is presented
- **THEN** the system uses a calculated or sourced year-specific instant and avoids claiming day and night are exactly equal everywhere

### Requirement: Sky guidance refreshes with time
The system SHALL recompute time-sensitive directions, altitudes, solar state, and personal-star eligibility at the advertised refresh interval.

#### Scenario: Time advances without coordinate change
- **WHEN** the refresh interval elapses while latitude and longitude remain unchanged
- **THEN** all time-dependent sky cards and directions are recalculated using the new current time
