# Personalized Cosmic Insights Specification

## Purpose

Ensure birthday- and time-derived insights remain emotionally engaging without implying precision or physical meaning that the underlying inputs cannot support.

## Requirements

### Requirement: Birthday input represents a real eligible date
The system SHALL reject calendar dates that do not exist, dates in the future, and dates outside the supported age range. Validation MUST compare the constructed date's components with the user's submitted day, month, and year.

#### Scenario: Impossible date is submitted
- **WHEN** the user submits a date such as 31 February
- **THEN** the system shows a validation message and stores no birthday

#### Scenario: Valid date is submitted
- **WHEN** the user submits a real past date within the supported range
- **THEN** the system stores the same calendar date and uses it for personal calculations

### Requirement: Universe age is displayed as an estimate
The system SHALL present the age of the universe at scientifically defensible precision and SHALL NOT increment an arbitrary exact year counter from a hardcoded epoch. Journal records MUST NOT imply that an entry captured an exact universe age.

#### Scenario: Universe age appears on screen
- **WHEN** the Home, Journal, or another screen displays universe age
- **THEN** it uses a rounded estimate such as approximately 13.8 billion years with provenance and no second-by-second pseudo-precision

### Requirement: Movement and orbit metrics describe their reference frame
The system SHALL label distance based on average Earth orbital speed as an estimate of distance carried along Earth's orbit around the Sun. It SHALL distinguish completed whole orbits from a current partial orbit and MUST NOT present calendar-year progress as physical orbital progress.

#### Scenario: Distance since birth is shown
- **WHEN** the app calculates age multiplied by average orbital speed
- **THEN** it labels the result approximate and identifies Earth's solar orbit as the reference path

#### Scenario: Orbit count is shown
- **WHEN** the user's age includes a partial year
- **THEN** the system separately reports completed whole solar orbits and elapsed progress since the last birthday

#### Scenario: Current calendar progress is shown
- **WHEN** no true orbital position calculation is available
- **THEN** the system labels the value as progress through the calendar year rather than Earth's orbital progress

### Requirement: Personal historical events use full dates
The system SHALL include events occurring after the user's birth instant, including later events in the same calendar year, and SHALL exclude events that occurred before birth.

#### Scenario: Event and birth share a year
- **WHEN** an event date is later than the birthday in the same year
- **THEN** the event is included in the user's lived-history list

### Requirement: Personal biology statements avoid absolutes
The system SHALL avoid saying every cell has a feature when known cell types are exceptions and SHALL distinguish primordial material from atoms or molecules formed at later cosmic stages.

#### Scenario: Ancestry of cells or atoms is described
- **WHEN** content discusses mitochondria, hydrogen, or stellar material in the body
- **THEN** the wording uses scientifically valid qualifiers and does not collapse nuclei, neutral atoms, elements, cells, and organisms into one event
