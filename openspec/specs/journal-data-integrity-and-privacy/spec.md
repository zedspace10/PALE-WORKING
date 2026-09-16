# Journal Data Integrity and Privacy Specification

## Purpose

Give journal users accurate expectations about local storage and ensure entries remain available, correctly dated, and recoverable from ordinary failures.

## Requirements

### Requirement: Privacy language describes actual storage
The system SHALL state that journal entries are stored locally on the device and are not sent to a PALE service. Unless encryption is implemented and verified, it MUST NOT describe the storage itself as encrypted or categorically private.

#### Scenario: Journal composer is shown
- **WHEN** a user is invited to write an entry
- **THEN** the interface provides concise local-storage wording and a path to fuller privacy information

### Requirement: Storage failures are visible and recoverable
Loading, saving, and deleting journal entries SHALL handle storage rejection without leaving the interface indefinitely busy or silently claiming success. A failed save MUST preserve the user's unsaved text for retry.

#### Scenario: Initial load fails
- **WHEN** local storage rejects the journal read
- **THEN** the loading state ends and the user sees an error with a retry action

#### Scenario: Save fails
- **WHEN** local storage rejects a new entry write
- **THEN** the saving state ends, the draft remains in the composer, and the user sees a retryable error

#### Scenario: Concurrent operations occur
- **WHEN** entry mutations overlap
- **THEN** the resulting stored collection includes every successful mutation without loss from stale state

### Requirement: Anniversary language matches the date window
The system SHALL reserve exact labels such as "on this day" and "a year ago today" for entries whose local calendar anniversary matches. Broader windows MUST use approximate language such as "around this time."

#### Scenario: Exact anniversary matches
- **WHEN** an entry's month and day match the current local date in a previous year
- **THEN** the system may label it an exact anniversary

#### Scenario: Entry is only near an anniversary
- **WHEN** an entry falls inside a broader discovery window but not on the matching calendar date
- **THEN** the system uses approximate retrospective wording

### Requirement: Journal metadata uses honest precision
Moon and universe metadata captured with an entry SHALL use the same approximation rules as the rest of the app and MUST remain interpretable after content-calculation updates.

#### Scenario: Entry metadata is displayed
- **WHEN** an existing or new journal entry is rendered
- **THEN** estimated values are labelled approximate and legacy values remain readable through a documented migration or compatibility path

### Requirement: Journal has one canonical route
All navigation paths to the journal SHALL render the same maintained experience and behavior.

#### Scenario: Journal is opened from any supported route
- **WHEN** the user follows a tab, deep link, or internal journal link
- **THEN** the canonical journal implementation is displayed without a divergent duplicate screen
