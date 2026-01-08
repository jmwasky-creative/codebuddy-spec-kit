# Data Model: AI Character Puzzle Whack-a-Mole Game

**Feature**: AI Character Puzzle Whack-a-Mole Game
**Date**: 2026-01-08
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the data entities, their attributes, relationships, validation rules, and state transitions for the AI Character Puzzle Whack-a-Mole Game. All data is stored client-side using localStorage (configuration, small datasets) and IndexedDB (large datasets like images and score records).

## Entities

### 1. Game Configuration

Represents all adjustable game parameters with default and custom values.

**Storage**: localStorage (key: `whackMole_config`)

**Attributes**:

| Field | Type | Required | Default | Description |
|-------|------|----------|----------|-------------|
| `gameDuration` | number | yes | 60 | Game duration in seconds (30-300) |
| `puzzleGridSize` | object | yes | `{rows: 3, cols: 3}` | Puzzle grid dimensions (2-6 each) |
| `moleAppearanceInterval` | number | yes | 1.0 | Time between mole appearances in seconds (0.5-5.0) |
| `moleDisplayDuration` | number | yes | 0.8 | Time mole remains visible in seconds (0.3-3.0) |
| `scoringRules` | object | yes | - | Scoring configuration |
| `scoringRules.pointsPerHit` | number | yes | 10 | Points awarded per mole hit |
| `scoringRules.missPenalty` | number | yes | -2 | Points deducted for misses (optional) |
| `scoringRules.timeBonusMultiplier` | number | yes | 0.1 | Bonus points per remaining second |
| `visualSettings` | object | yes | - | Visual configuration |
| `visualSettings.gameAreaSize` | object | yes | `{width: 800, height: 600}` | Game area dimensions in pixels |
| `visualSettings.moleSize` | number | yes | 80 | Mole size in pixels (40-120) |
| `visualSettings.pieceSize` | number | yes | 100 | Puzzle piece size in pixels (50-150) |
| `visualSettings.themeColor` | string | yes | "#4CAF50" | Primary theme color (hex) |
| `difficultyPreset` | string | no | "Custom" | Preset name: "Easy", "Medium", "Hard", or "Custom" |

**Validation Rules**:
- `gameDuration`: Must be between 30 and 300
- `puzzleGridSize.rows` and `cols`: Must be between 2 and 6
- `moleAppearanceInterval`: Must be between 0.5 and 5.0
- `moleDisplayDuration`: Must be between 0.3 and 3.0
- `scoringRules.pointsPerHit`: Must be positive number (>0)
- `scoringRules.missPenalty`: Can be negative or zero
- `visualSettings.gameAreaSize.width` and `height`: Must be between 400 and 1920
- `visualSettings.moleSize`: Must be between 40 and 120
- `visualSettings.pieceSize`: Must be between 50 and 150
- `visualSettings.themeColor`: Must be valid hex color code (#XXXXXX)

**State Transitions**: None (configuration is stateless)

**Relationships**:
- One-to-many with Game Sessions (each session uses a configuration snapshot)

---

### 2. Game Session

Represents a single gameplay instance with state, progress, and applied configuration.

**Storage**: IndexedDB (store: `game_sessions`, keyPath: `id`, autoIncrement: true)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | yes | Unique session identifier (auto-generated) |
| `startTime` | number | yes | Timestamp when game started (Unix epoch) |
| `endTime` | number | no | Timestamp when game ended (null if in progress) |
| `status` | string | yes | Session status: "in_progress", "completed", "abandoned" |
| `score` | number | yes | Current score (updates in real-time) |
| `hits` | number | yes | Number of moles hit |
| `misses` | number | yes | Number of missed moles (clicks on empty space) |
| `completedPuzzlePieces` | number | yes | Number of puzzle pieces collected |
| `totalPuzzlePieces` | number | yes | Total pieces needed (grid.rows * grid.cols) |
| `puzzleComplete` | boolean | yes | Whether puzzle is fully assembled |
| `configurationSnapshot` | object | yes | Copy of Game Configuration used for this session |
| `characterId` | string | no | Reference to Character entity (AI-generated) |
| `isPersonalBest` | boolean | no | Whether this session achieved personal best score |
| `isFastestTime` | boolean | no | Whether this session achieved fastest completion |

**Validation Rules**:
- `score`: Must be non-negative
- `hits`: Must be non-negative
- `misses`: Must be non-negative
- `completedPuzzlePieces`: Must be between 0 and `totalPuzzlePieces`
- `totalPuzzlePieces`: Must equal `configurationSnapshot.puzzleGridSize.rows * configurationSnapshot.puzzleGridSize.cols`
- `status`: Must be one of: "in_progress", "completed", "abandoned"
- `startTime`: Must be valid Unix timestamp

**State Transitions**:

```
in_progress → completed (all pieces collected or time expired)
in_progress → abandoned (user navigates away)
completed → completed (final state, no transitions)
abandoned → abandoned (final state, no transitions)
```

**Relationships**:
- Many-to-one with Game Configuration (via configurationSnapshot)
- Many-to-one with Character (via characterId)

---

### 3. Mole

Represents a temporary clickable element in the game area.

**Storage**: In-memory (component state), not persisted

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique mole identifier for the current session |
| `x` | number | yes | X coordinate in game area (pixels) |
| `y` | number | yes | Y coordinate in game area (pixels) |
| `appearanceTime` | number | yes | Timestamp when mole appeared (Unix epoch) |
| `hitTime` | number | no | Timestamp when mole was hit (null if not hit) |
| `hit` | boolean | yes | Whether mole was hit by user |
| `expired` | boolean | yes | Whether mole disappeared without being hit |
| `size` | number | yes | Mole size in pixels (from visualSettings.moleSize) |

**Validation Rules**:
- `x` and `y`: Must be within game area bounds (0 to width/height minus mole size)
- `appearanceTime`: Must be valid Unix timestamp
- `hitTime`: Must be >= appearanceTime if not null
- `hit` and `expired`: Cannot both be true (mutually exclusive)
- `size`: Must be positive

**State Transitions**:

```
created (appears in game) → hit (user clicks) → removed (disappears)
created (appears in game) → expired (time runs out) → removed (disappears)
```

**Relationships**: None (transient, session-scoped)

---

### 4. Puzzle Piece

Represents a fragment of the complete character image that user collects and assembles.

**Storage**: IndexedDB (store: `puzzle_pieces`, keyPath: `id`, autoIncrement: true)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique piece identifier (composite: sessionId + rowIndex + colIndex) |
| `sessionId` | number | yes | Reference to Game Session |
| `rowIndex` | number | yes | Row position in puzzle grid (0-based) |
| `colIndex` | number | yes | Column position in puzzle grid (0-based) |
| `imageData` | string | yes | Data URL of the piece image (base64 encoded) |
| `collected` | boolean | yes | Whether piece has been collected by user |
| `placedInGrid` | boolean | yes | Whether piece has been placed in assembly grid |
| `correctPosition` | boolean | yes | Whether piece is in correct position in grid |
| `dropX` | number | no | X coordinate where piece dropped (pixels) |
| `dropY` | number | no | Y coordinate where piece dropped (pixels) |
| `snappingTolerance` | number | yes | Distance in pixels to snap to correct position |

**Validation Rules**:
- `sessionId`: Must reference valid Game Session
- `rowIndex` and `colIndex`: Must be within grid bounds (0 to rows/cols - 1)
- `imageData`: Must be valid base64-encoded image data
- `snappingTolerance`: Must be positive (typically 20-50 pixels)
- `dropX` and `dropY`: Required if `placedInGrid` is true

**State Transitions**:

```
created (generated from character image) → collected (dropped from mole) → placedInGrid (dragged to assembly area)
created (generated) → collected → placedInGrid (incorrect position) → placedInGrid (correct position)
```

**Relationships**:
- Many-to-one with Game Session (via sessionId)
- Many-to-one with Character (via imageData derived from character)

---

### 5. Character

Represents the AI-generated animated character image with associated prompt and metadata.

**Storage**: IndexedDB (store: `characters`, keyPath: `id`, autoIncrement: true)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique character identifier (UUID or timestamp-based) |
| `prompt` | string | yes | AI prompt used to generate character |
| `promptTheme` | string | no | Preset theme name if used (e.g., "fantasy", "sci-fi") |
| `imageData` | string | yes | Full character image data URL (base64 encoded) |
| `imageFormat` | string | yes | Image format: "png", "jpeg", "webp" |
| `width` | number | yes | Image width in pixels |
| `height` | number | yes | Image height in pixels |
| `aspectRatio` | number | yes | Aspect ratio (width / height) |
| `gridConfig` | object | yes | Grid configuration used to slice image |
| `gridConfig.rows` | number | yes | Number of rows for puzzle pieces |
| `gridConfig.cols` | number | yes | Number of columns for puzzle pieces |
| `pieceWidth` | number | yes | Width of each puzzle piece (pixels) |
| `pieceHeight` | number | yes | Height of each puzzle piece (pixels) |
| `createdAt` | number | yes | Timestamp when character was generated (Unix epoch) |
| `generationDuration` | number | no | Time taken to generate image in milliseconds |
| `generationService` | string | no | AI service used (e.g., "OpenAI", "Stability AI") |
| `isDefault` | boolean | yes | Whether this is a default (non-AI) character |

**Validation Rules**:
- `imageData`: Must be valid base64-encoded image data
- `imageFormat`: Must be one of: "png", "jpeg", "webp"
- `width` and `height`: Must be positive numbers
- `aspectRatio`: Must be > 0
- `gridConfig.rows` and `cols`: Must be between 2 and 6
- `pieceWidth` and `pieceHeight`: Must be positive (width / cols, height / rows)
- `createdAt`: Must be valid Unix timestamp
- `generationDuration`: Must be positive if present

**State Transitions**: None (character is static once generated)

**Relationships**:
- One-to-many with Game Sessions (multiple sessions can use same character)
- One-to-many with Puzzle Pieces (character is sliced into pieces)

---

### 6. Score Record

Represents a completed game's results with performance metrics and configuration snapshot.

**Storage**: IndexedDB (store: `score_records`, keyPath: `id`, autoIncrement: true)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | yes | Unique record identifier (auto-generated) |
| `sessionId` | number | yes | Reference to Game Session |
| `score` | number | yes | Final score |
| `hits` | number | yes | Total moles hit |
| `misses` | number | yes | Total missed clicks |
| `accuracy` | number | yes | Hit accuracy (hits / total clicks, 0-1) |
| `completionTime` | number | yes | Time to complete puzzle in seconds |
| `completionPercentage` | number | yes | Percentage of puzzle completed (0-100) |
| `timestamp` | number | yes | When game was completed (Unix epoch) |
| `characterName` | string | no | Character identifier or name (from prompt) |
| `difficultyPreset` | string | no | Difficulty preset used (if not custom) |
| `configurationSnapshot` | object | no | Partial config snapshot (duration, gridSize) |

**Validation Rules**:
- `score`: Can be any integer (may be negative if penalties apply)
- `hits` and `misses`: Must be non-negative
- `accuracy`: Must be between 0 and 1 (inclusive)
- `completionTime`: Must be positive (or null if incomplete)
- `completionPercentage`: Must be between 0 and 100
- `timestamp`: Must be valid Unix timestamp

**State Transitions**: None (record is final, immutable)

**Relationships**:
- One-to-one with Game Session (via sessionId)
- One-to-one with Character (via characterName reference)

**Indexes**:
- Index on `score` (descending) for high scores
- Index on `completionTime` (ascending) for fastest times
- Index on `timestamp` (descending) for recent games

---

### 7. Prompt Configuration

Represents user's saved prompt settings with text content, presets, and usage history.

**Storage**: localStorage (key: `whackMole_prompts`)

**Attributes**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPrompt` | string | yes | Active prompt text for character generation |
| `promptHistory` | array | no | Array of recently used prompts |
| `presets` | array | no | Array of preset prompt configurations |
| `presetHistory` | array | no | Array of recently used preset names |

**Validation Rules**:
- `currentPrompt`: String length 1-500 characters
- `promptHistory`: Each element string length 1-500, max 50 entries
- `presets`: Each element object with `{name, prompt, theme}` fields
- `presetHistory`: Array of strings (preset names), max 20 entries

**State Transitions**: None (configuration is stateless)

**Relationships**: None (standalone configuration)

---

## Entity Relationships Diagram

```
Game Configuration (localStorage)
    ├── 1:N ──> Game Session (IndexedDB)
                  ├── 1:N ──> Mole (in-memory, transient)
                  └── 1:N ──> Puzzle Piece (IndexedDB)
                                   └── N:1 ──> Character (IndexedDB)

Character (IndexedDB)
    ├── 1:N ──> Game Session (via characterId)
    └── 1:N ──> Puzzle Piece (derived from imageData)

Score Record (IndexedDB)
    └── 1:1 ──> Game Session (via sessionId)

Prompt Configuration (localStorage)
    (independent, referenced during character generation)
```

## Storage Strategy

### localStorage (Small, Fast Access)
- Key: `whackMole_config` → Game Configuration
- Key: `whackMole_prompts` → Prompt Configuration
- Size limit: ~5-10MB (browser-dependent)
- Access: Synchronous, fast
- Use case: Configuration, user preferences, small datasets

### IndexedDB (Large, Asynchronous)
- Store: `game_sessions` → Game Sessions
- Store: `characters` → AI-generated Characters
- Store: `puzzle_pieces` → Puzzle Pieces
- Store: `score_records` → Score Records
- Size limit: ~50-100MB (browser-dependent)
- Access: Asynchronous, efficient for large datasets
- Use case: Large data (images), many records (scores), complex queries

## Data Lifecycle

### Game Configuration Lifecycle
1. User creates/updates configuration via ConfigPanel
2. Validated and saved to localStorage
3. Snapshot copied to Game Session when game starts
4. Can be modified at any time (affects future sessions)

### Character Lifecycle
1. User enters/selects prompt in PromptEditor
2. AI service generates image (5-10 seconds)
3. Character stored in IndexedDB with imageData
4. Referenced by Game Session when game starts
5. Sliced into Puzzle Pieces during game initialization

### Game Session Lifecycle
1. Created when game starts (status: in_progress)
2. Updates real-time (score, hits, misses, collectedPieces)
3. Completed when all pieces collected or time expires (status: completed)
4. Abandoned if user navigates away (status: abandoned)
5. Score Record created when completed
6. Archived after 30 days (cleanup task)

### Puzzle Piece Lifecycle
1. Generated from Character image (sliced into grid)
2. Dropped when Mole is hit (collected: true)
3. Dragged to assembly grid (placedInGrid: true)
4. Snaps to correct position if within tolerance (correctPosition: true)
5. Archived after Game Session completion (cleanup task)

### Score Record Lifecycle
1. Created when Game Session completes
2. Indexed by score (descending), completionTime (ascending), timestamp (descending)
3. Displayed in High Scores screen
4. Archived after 90 days (cleanup task)

## Data Validation Summary

All validation rules are applied at:
- Input time (user interaction via Vue components)
- Storage time (before saving to localStorage/IndexedDB)
- Retrieval time (when loading from storage)

Validation ensures:
- Data integrity (no invalid states)
- Type safety (correct data types)
- Range constraints (values within acceptable bounds)
- Relationship consistency (foreign keys reference valid entities)

## Migration and Cleanup

### Cleanup Tasks
- Delete archived Game Sessions (>30 days old)
- Delete archived Puzzle Pieces (>30 days old)
- Delete archived Score Records (>90 days old)
- Delete unused Characters (>90 days old, no references)

### Data Migration
- If data model changes, migration script updates existing records
- Version field in localStorage tracks data model version
- IndexedDB versioning for schema changes
