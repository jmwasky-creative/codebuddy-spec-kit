# Component Contracts: AI Character Puzzle Whack-a-Mole Game

**Feature**: AI Character Puzzle Whack-a-Mole Game
**Date**: 2026-01-08
**Phase**: Phase 1 - Design & Contracts

## Overview

This document defines the Vue 3 component interfaces, props, emits, and contracts for all components in the AI Character Puzzle Whack-a-Mole Game. Each component contract specifies:
- Component purpose and responsibility
- Props (input) with types, validation, and defaults
- Emits (events) with payloads
- Public methods (if any)
- Slots (if any)
- Dependencies and relationships

## Component Architecture

```
App.vue (Root)
├── MainMenu.vue (Feature: Start game, configure, high scores)
│   ├── Button.vue (Shared)
│   └── Modal.vue (Shared)
├── GameCanvas.vue (Feature: Main game area)
│   ├── Mole.vue (Feature: Individual mole)
│   ├── PuzzlePiece.vue (Feature: Draggable pieces)
│   ├── PuzzleGrid.vue (Feature: Assembly area)
│   └── ScoreDisplay.vue (Feature: Real-time score)
├── ConfigPanel.vue (Feature: Configuration interface)
│   ├── ParameterSlider.vue (Feature: Adjustable controls)
│   ├── DifficultyPreset.vue (Feature: Preset selection)
│   ├── PromptEditor.vue (Feature: AI prompt input)
│   ├── Button.vue (Shared)
│   └── Modal.vue (Shared)
└── ResultsScreen.vue (Feature: Game completion)
    ├── Button.vue (Shared)
    └── HighScoresList.vue (Feature: Score records)
```

---

## 1. App.vue (Root Component)

**Purpose**: Root application component managing overall application state, routing between screens (MainMenu, GameCanvas, ConfigPanel, ResultsScreen)

**Props**: None

**Emits**:
- `@navigate-to-screen(screen: string)` - User navigates to a screen

**Public Methods**:
- `navigateToScreen(screen: string)` - Change current screen
- `handleGameStart(config: GameConfiguration)` - Start new game session
- `handleGameEnd(results: GameSession)` - Process game completion
- `handleConfigurationSave(config: GameConfiguration)` - Save configuration changes

**State** (managed via Pinia store):
- `currentScreen: string` - Current active screen ("main", "game", "config", "results")
- `activeGameSession: GameSession | null` - Active game session (if any)
- `gameConfiguration: GameConfiguration` - Current game configuration

**Dependencies**:
- MainMenu.vue
- GameCanvas.vue
- ConfigPanel.vue
- ResultsScreen.vue

---

## 2. GameCanvas.vue

**Purpose**: Main game rendering area using HTML5 Canvas for game loop, mole rendering, and animations

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `gameConfig` | `GameConfiguration` | yes | - | Game configuration for this session |
| `onGameEnd` | `Function` | yes | - | Callback when game ends |

**Emits**:
- `@mole-hit(moleId: string, position: {x, y})` - User hit a mole
- `@piece-drop(pieceId: string, position: {x, y})` - Puzzle piece dropped
- `@game-complete(session: GameSession)` - Game completed (all pieces collected or time expired)
- `@score-change(score: number)` - Score updated
- `@game-abandoned()` - User navigated away before completion

**Public Methods**:
- `startGame()` - Initialize game loop and spawning
- `pauseGame()` - Pause game loop (if pause feature added)
- `resumeGame()` - Resume game loop
- `endGame()` - Clean up game loop and resources
- `getGameSession(): GameSession` - Get current session data
- `getMoles(): Mole[]` - Get all active moles
- `getPuzzlePieces(): PuzzlePiece[]` - Get all puzzle pieces

**Canvas Drawing** (internal):
- `drawGameArea()` - Clear and redraw game area background
- `drawMoles()` - Render all active moles
- `drawPuzzlePieces()` - Render dropped pieces
- `drawUI()` - Render game UI (timer, score)

**Game Loop**:
- Uses `requestAnimationFrame` for 60fps rendering
- Delta time for frame-independent movement
- Handles mole spawning, disappearing, animations

**Dependencies**:
- Mole.vue (component for individual mole instances, optional)
- PuzzlePiece.vue (component for dropped pieces, optional)
- Composables: `useGameState`, `useGameConfig`

**Technical Notes**:
- Canvas size determined by `gameConfig.visualSettings.gameAreaSize`
- Mole position random within bounds with collision avoidance
- Game loop stops when `endGame()` called or game completes/abandons

---

## 3. Mole.vue

**Purpose**: Individual mole component for rendering and interaction (optional, can be rendered directly in Canvas)

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `mole` | `Mole` | yes | - | Mole data object |
| `size` | `number` | yes | 80 | Mole size in pixels |
| `onHit` | `Function` | yes | - | Callback when mole is hit |

**Emits**:
- `@hit(moleId: string)` - User clicked/hit the mole

**Public Methods**:
- `handleClick()` - Handle user click/tap on mole

**Visual States**:
- `appearing` - Mole just spawned, fade-in animation
- `visible` - Mole fully visible, can be hit
- `hit` - Mole was hit, disappear animation
- `expired` - Mole time ran out, disappear animation

**Dependencies**:
- None (self-contained)

**Technical Notes**:
- Component is optional if rendering directly in Canvas
- If used as component, integrates with GameCanvas.vue

---

## 4. PuzzlePiece.vue

**Purpose**: Draggable puzzle piece component for user interaction and assembly

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `piece` | `PuzzlePiece` | yes | - | Puzzle piece data object |
| `size` | `number` | yes | 100 | Piece size in pixels |
| `snappingTolerance` | `number` | yes | 30 | Snap distance in pixels |
| `onDrop` | `Function` | yes | - | Callback when piece dropped |
| `onSnap` | `Function` | yes | - | Callback when piece snaps to correct position |

**Emits**:
- `@drop(pieceId: string, position: {x, y})` - Piece dropped at position
- `@snap(pieceId: string, correctPosition: boolean)` - Piece snapped (correct or incorrect)

**Public Methods**:
- `handleDragStart(event: DragEvent)` - Start drag operation
- `handleDrag(event: DragEvent)` - Update drag position
- `handleDrop(event: DragEvent)` - Drop piece at position
- `checkSnapPosition(position: {x, y}): boolean` - Check if position is within snapping tolerance of correct position

**Visual States**:
- `collected` - Piece dropped from mole, visible in game area
- `dragging` - User is dragging the piece
- `placed` - Piece placed in assembly grid
- `correct` - Piece is in correct position

**Dependencies**:
- Native HTML5 Drag and Drop API

**Technical Notes**:
- Uses `draggable="true"` attribute
- Drag image can be custom or default browser preview
- Snapping logic based on Euclidean distance calculation

---

## 5. PuzzleGrid.vue

**Purpose**: Puzzle assembly grid for dragging and dropping pieces to complete character image

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `rows` | `number` | yes | 3 | Number of rows in grid |
| `cols` | `number` | yes | 3 | Number of columns in grid |
| `pieceSize` | `number` | yes | 100 | Size of each piece in pixels |
| `completedImage` | `string` | yes | - | Base64 of complete character image |
| `onComplete` | `Function` | yes | - | Callback when puzzle is complete |
| `onPiecePlaced` | `Function` | yes | - | Callback when piece is placed |

**Emits**:
- `@complete()` - All pieces in correct positions
- `@piece-placed(pieceId: string, correct: boolean)` - Piece placed in grid

**Public Methods**:
- `getCorrectPosition(rowIndex: number, colIndex: number): {x, y}` - Get coordinates for grid position
- `isPieceInCorrectPosition(piece: PuzzlePiece): boolean` - Check if piece is correct
- `getCompletionStatus(): {total, placed, correct}` - Get puzzle completion status
- `showCompleteImage()` - Show full character image (when puzzle complete)

**Visual Features**:
- Grid overlay showing piece outlines
- Placeholder boxes for empty positions
- Highlight when piece in correct position
- Animations for piece placement

**Dependencies**:
- None (self-contained grid rendering)

---

## 6. ScoreDisplay.vue

**Purpose**: Real-time score display during gameplay

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `score` | `number` | yes | 0 | Current score |
| `hits` | `number` | yes | 0 | Number of moles hit |
| `misses` | `number` | yes | 0 | Number of missed clicks |
| `timeRemaining` | `number` | yes | 60 | Time remaining in seconds |

**Emits**: None (display-only component)

**Public Methods**: None

**Visual Features**:
- Score counter (large, prominent)
- Hits/misses indicators
- Timer countdown
- Optional: Score change animation (+10, -2)

**Dependencies**:
- None (display-only)

---

## 7. ConfigPanel.vue

**Purpose**: Main configuration interface for all game parameters and AI prompts

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `config` | `GameConfiguration` | yes | - | Current configuration |
| `onSave` | `Function` | yes | - | Callback when configuration saved |
| `onReset` | `Function` | yes | - | Callback when configuration reset |

**Emits**:
- `@save(config: GameConfiguration)` - User saved configuration
- `@reset()` - User reset to default values
- `@cancel()` - User canceled changes

**Public Methods**:
- `handleSave()` - Validate and save configuration
- `handleReset()` - Reset all parameters to defaults
- `validateConfiguration(config: GameConfiguration): boolean` - Validate all parameters

**Sections**:
1. Game Settings (duration, grid size)
2. Mole Behavior (appearance interval, display duration)
3. Scoring Rules (points per hit, miss penalty, time bonus)
4. Visual Settings (area size, mole size, piece size, theme color)
5. AI Character Prompts (prompt editor, presets)

**Dependencies**:
- ParameterSlider.vue
- DifficultyPreset.vue
- PromptEditor.vue
- Button.vue
- Modal.vue

---

## 8. ParameterSlider.vue

**Purpose**: Reusable adjustable parameter control with min/max and value display

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | yes | - | Parameter label |
| `modelValue` | `number` | yes | - | Current value (v-model) |
| `min` | `number` | yes | 0 | Minimum value |
| `max` | `number` | yes | 100 | Maximum value |
| `step` | `number` | no | 1 | Step increment |
| `unit` | `string` | no | "" | Unit label (e.g., "seconds", "pixels") |

**Emits**:
- `@update:modelValue(value: number)` - User changed value

**Public Methods**: None

**Visual Features**:
- Range slider input
- Value display next to slider
- Label with unit
- Optional: Preset buttons (common values)

**Dependencies**:
- None (self-contained)

---

## 9. DifficultyPreset.vue

**Purpose**: Preset selection for difficulty levels (Easy, Medium, Hard)

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPreset` | `string` | yes | "Custom" | Currently selected preset |
| `onPresetSelect` | `Function` | yes | - | Callback when preset selected |

**Emits**:
- `@preset-select(presetName: string, presetConfig: GameConfiguration)` - User selected preset

**Public Methods**: None

**Presets**:
- **Easy**: Longer duration (120s), slower moles (2s interval), larger grid (2x2)
- **Medium**: Balanced (60s, 1s interval, 3x3 grid)
- **Hard**: Shorter duration (30s), faster moles (0.5s interval), larger grid (4x4)

**Dependencies**:
- Button.vue (for preset buttons)

---

## 10. PromptEditor.vue

**Purpose**: AI prompt input with preset selection and history

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPrompt` | `string` | yes | - | Current prompt text |
| `presets` | `Array<Preset>` | yes | [] | Available presets |
| `history` | `Array<string>` | yes | [] | Recent prompt history |
| `onPromptChange` | `Function` | yes | - | Callback when prompt changes |
| `onGenerate` | `Function` | yes | - | Callback when user requests generation |

**Emits**:
- `@prompt-change(prompt: string)` - User edited prompt text
- `@generate(prompt: string)` - User requested image generation
- `@preset-select(preset: Preset)` - User selected preset

**Public Methods**:
- `handlePromptInput(value: string)` - Handle text input
- `handleGenerate()` - Trigger image generation
- `selectPreset(preset: Preset)` - Select preset prompt
- `addToHistory(prompt: string)` - Add prompt to history

**Visual Features**:
- Textarea for prompt input
- Preset dropdown or buttons
- History list (recently used prompts)
- Generate button
- Loading state during generation

**Dependencies**:
- Button.vue

---

## 11. MainMenu.vue

**Purpose**: Main menu with game options (start, configure, high scores, help)

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onStartGame` | `Function` | yes | - | Callback to start game |
| `onConfigure` | `Function` | yes | - | Callback to open configuration |
| `onHighScores` | `Function` | yes | - | Callback to show high scores |
| `onHelp` | `Function` | yes | - | Callback to show help/instructions |

**Emits**:
- `@start-game()` - User clicked "Start Game"
- `@configure()` - User clicked "Configure Game"
- `@high-scores()` - User clicked "High Scores"
- `@help()` - User clicked "Help/Instructions"

**Public Methods**: None

**Visual Features**:
- Title and logo
- Start Game button (large, prominent)
- Configure Game button
- High Scores button
- Help/Instructions button

**Dependencies**:
- Button.vue
- Modal.vue (for help overlay)

---

## 12. ResultsScreen.vue

**Purpose**: Game completion results display with score, time, and achievements

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `session` | `GameSession` | yes | - | Completed game session |
| `isPersonalBest` | `boolean` | yes | false | Whether personal best score |
| `isFastestTime` | `boolean` | yes | false | Whether fastest completion |
| `onPlayAgain` | `Function` | yes | - | Callback to play again |
| `onMenu` | `Function` | yes | - | Callback to return to menu |

**Emits**:
- `@play-again()` - User clicked "Play Again"
- `@menu()` - User clicked "Main Menu"

**Public Methods**: None

**Visual Features**:
- Final score (large, prominent)
- Time taken
- Accuracy (hits, misses, hit rate)
- Completed puzzle image
- Achievement badges (Personal Best, Fastest Time)
- Play Again button
- Main Menu button

**Dependencies**:
- Button.vue
- HighScoresList.vue (embedded or separate component)

---

## 13. HighScoresList.vue

**Purpose**: Display high scores with sorting and filtering

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `scores` | `Array<ScoreRecord>` | yes | [] | Score records to display |
| `sortBy` | `string` | yes | "score" | Sort column: "score", "time", "date" |
| `limit` | `number` | yes | 10 | Number of records to show |

**Emits**: None (display-only)

**Public Methods**:
- `sortByScore()` - Sort by score (descending)
- `sortByTime()` - Sort by completion time (ascending)
- `sortByDate()` - Sort by date (descending)

**Visual Features**:
- Table with columns: Rank, Score, Time, Date, Character
- Sorting buttons for each column
- Highlight top 3 with badges (🥇🥈🥉)
- Scrollable list if many records

**Dependencies**:
- None (display-only)

---

## 14. Button.vue (Shared)

**Purpose**: Reusable button component with variants and states

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `string` | no | "primary" | Button style: "primary", "secondary", "danger" |
| `size` | `string` | no | "medium" | Button size: "small", "medium", "large" |
| `disabled` | `boolean` | no | false | Disabled state |
| `loading` | `boolean` | no | false | Loading state (shows spinner) |
| `icon` | `string` | no | "" | Icon name (if using icon library) |

**Emits**:
- `@click()` - Button clicked

**Public Methods**: None

**Variants**:
- **primary**: Primary action button (green, prominent)
- **secondary**: Secondary action button (gray/blue)
- **danger**: Destructive action button (red)

**States**:
- Default: Normal appearance
- Disabled: Grayed out, no hover effects
- Loading: Spinner icon, disabled click

**Dependencies**:
- None (self-contained)

---

## 15. Modal.vue (Shared)

**Purpose**: Reusable modal overlay for dialogs, confirmations, help content

**Props**:
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `visible` | `boolean` | yes | false | Modal visibility state |
| `title` | `string` | yes | "" | Modal title |
| `showClose` | `boolean` | no | true | Show close button |
| `onClose` | `Function` | yes | - | Callback when modal closed |

**Slots**:
- `default` - Modal body content
- `footer` - Modal footer (buttons, actions)

**Emits**:
- `@close()` - Modal closed (via close button or backdrop click)

**Public Methods**:
- `open()` - Show modal
- `close()` - Hide modal

**Visual Features**:
- Backdrop overlay (semi-transparent black)
- Modal container centered on screen
- Close button (top-right)
- Footer slot for action buttons
- Escape key closes modal

**Dependencies**:
- None (self-contained)

---

## Composables Contracts

### useGameConfig.js

**Purpose**: Game configuration state management with localStorage persistence

**Returns**:
```javascript
{
  config: Ref<GameConfiguration>,    // Reactive configuration object
  loadConfig: () => Promise<void>,  // Load from localStorage
  saveConfig: () => Promise<void>,  // Save to localStorage
  resetConfig: () => void,           // Reset to defaults
  validateConfig: (config) => boolean // Validate parameters
}
```

---

### useGameState.js

**Purpose**: Active game session state management

**Returns**:
```javascript
{
  session: Ref<GameSession | null>,  // Reactive session object
  startSession: (config) => void,    // Initialize new session
  endSession: () => void,            // Finalize session
  updateScore: (score) => void,       // Update score
  recordHit: () => void,             // Record mole hit
  recordMiss: () => void,            // Record missed click
  collectPiece: () => void,           // Record piece collected
  placePiece: (piece) => void         // Record piece placed
}
```

---

### useLocalStorage.js

**Purpose**: localStorage/IndexedDB utilities for persistence

**Returns**:
```javascript
{
  getItem: (key) => Promise<any>,        // Get from localStorage
  setItem: (key, value) => Promise<void>, // Set in localStorage
  removeItem: (key) => Promise<void>,     // Remove from localStorage
  indexedDB: {
    open: (dbName, version, stores) => Promise<IDBDatabase>,
    add: (store, data) => Promise<IDBValidKey>,
    getAll: (store) => Promise<any[]>,
    getByIndex: (store, index, value) => Promise<any[]>,
    delete: (store, key) => Promise<void>
  }
}
```

---

### useAIImageGen.js

**Purpose**: AI image generation service integration

**Returns**:
```javascript
{
  generateImage: (prompt, options) => Promise<{dataUrl, width, height}>,
  getPresets: () => Promise<Array<Preset>>,
  saveToIndexedDB: (character) => Promise<void>,
  loadFromIndexedDB: (id) => Promise<Character>
}
```

---

## TypeScript / JSDoc Types

All components and composables should include TypeScript interfaces or JSDoc type definitions for:

- `GameConfiguration`
- `GameSession`
- `Mole`
- `PuzzlePiece`
- `Character`
- `ScoreRecord`
- `PromptConfiguration`
- `Preset` (for prompt presets)

Example:
```javascript
/**
 * @typedef {Object} GameConfiguration
 * @property {number} gameDuration
 * @property {{rows: number, cols: number}} puzzleGridSize
 * @property {number} moleAppearanceInterval
 * @property {number} moleDisplayDuration
 * @property {Object} scoringRules
 * @property {number} scoringRules.pointsPerHit
 * @property {number} scoringRules.missPenalty
 * @property {number} scoringRules.timeBonusMultiplier
 * @property {Object} visualSettings
 * @property {{width: number, height: number}} visualSettings.gameAreaSize
 * @property {number} visualSettings.moleSize
 * @property {number} visualSettings.pieceSize
 * @property {string} visualSettings.themeColor
 * @property {string} difficultyPreset
 */
```

---

## Testing Contracts

### Unit Tests
- All composables: `useGameConfig`, `useGameState`, `useLocalStorage`, `useAIImageGen`
- All utility functions: `gameLogic`, `puzzleGenerator`, `validation`, `constants`
- Test coverage: 80% minimum, 100% for critical logic

### Component Tests
- All Vue components using Vue Test Utils
- Test props, emits, methods, user interactions
- Mount and snapshot testing where appropriate

### E2E Tests
- Full gameplay flow (start, play, complete)
- Configuration flow (adjust params, save, apply)
- High scores flow (complete games, view scores)
- Test using Playwright

---

## Summary

This component contracts document defines all Vue 3 components, their interfaces, and contracts for the AI Character Puzzle Whack-a-Mole Game. All components follow Vue 3 Composition API best practices with `<script setup>` syntax, clear separation of concerns, and comprehensive prop validation.
