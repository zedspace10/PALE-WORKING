## Purpose

Make PALE's scientific content traceable, internally consistent, and candid about estimates, uncertainty, model dependence, and poetic interpretation.

## ADDED Requirements

### Requirement: Scientific claims have provenance metadata
Each curated scientific content item SHALL carry a stable identifier, classification, source title, source URL, and last-reviewed date. The classification MUST distinguish established fact, estimate, model-dependent prediction, disputed claim, dynamic value, and poetic reflection.

#### Scenario: Factual content is rendered
- **WHEN** a user opens a factual card or timeline item
- **THEN** the system can expose its source and review date without relying on unstructured comments in source code

#### Scenario: Content lacks required provenance
- **WHEN** validation encounters a scientific item without the required metadata
- **THEN** the quality gate fails and identifies the item by stable identifier

### Requirement: Certainty matches the evidence
The system SHALL use approximate language for estimated quantities, conditional language for predictions, and explicit attribution for disputed or speculative ideas. Poetic statements MUST be visually or textually distinguishable from scientific claims.

#### Scenario: Quantity has a published range
- **WHEN** a source reports a range or order-of-magnitude estimate
- **THEN** the user-facing copy preserves that range or uses an honest rounded approximation rather than a single exact value

#### Scenario: Outcome is model-dependent
- **WHEN** an event such as a future galactic encounter is not certain under current models
- **THEN** the content states the uncertainty and does not use a categorical event title or date

#### Scenario: Reflection accompanies a fact
- **WHEN** a card combines a sourced fact with reflective prose
- **THEN** the presentation distinguishes the sourced statement from the reflection

### Requirement: Known factual errors are corrected
The curated baseline SHALL conform to current primary scientific sources and SHALL remove known false or materially misleading statements identified by the project audit.

#### Scenario: Early-universe content is validated
- **WHEN** Big Bang, nucleosynthesis, or cosmic-dark-age content is displayed
- **THEN** it avoids a spatial centre or literal observed singularity, identifies light-nuclei formation rather than proton/neutron formation in the first minutes, and describes the dark ages on a roughly hundred-million-year scale rather than longer than the Solar System's age

#### Scenario: Object catalogue content is validated
- **WHEN** content covers Proxima Centauri, the Double Cluster, Voyager, Andromeda, Scorpius, Titan, Sagittarius A-star, or the Milky Way
- **THEN** it respectively accounts for Proxima's flare activity, locates the Double Cluster in Perseus, distinguishes interstellar space from leaving the Solar System, calls Andromeda the nearest major galaxy, uses the correct Southern Hemisphere observing season, acknowledges methane and ethane plus Titan's subsurface water evidence, avoids saying all Galactic stars orbit the black hole itself, and preserves accepted star-count ranges

#### Scenario: Barycentre content is displayed
- **WHEN** the Jupiter-Sun barycentre is explained
- **THEN** the system says both bodies orbit their common barycentre without claiming Jupiter does not orbit the Sun

### Requirement: Content is internally consistent
Statements describing the same object or phenomenon SHALL use compatible values and uncertainty across all screens.

#### Scenario: Duplicate subject is validated
- **WHEN** the same subject appears in more than one catalogue or screen
- **THEN** automated content validation detects contradictory categorical claims or incompatible unsourced values

### Requirement: Dynamic claims expire safely
Claims about active missions, record holders, current distances, population counts, or "largest known" objects SHALL have an explicit review-by date or SHALL use wording that remains true without a live data source.

#### Scenario: Dynamic content passes its review date
- **WHEN** a time-sensitive item is older than its review policy allows
- **THEN** validation flags the item before release and the UI does not silently present it as current
