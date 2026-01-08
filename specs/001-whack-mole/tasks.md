---

description: "Task list for AI Character Puzzle Whack-a-Mole Game implementation"
---

# Tasks: AI Character Puzzle Whack-a-Mole Game

**Input**: Design documents from `/specs/001-whack-mole/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as critical business logic MUST have 100% coverage per constitution testing standards.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single web application**: `whack-mole-game/`, `src/`, `tests/` at repository root
- Paths follow project structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan in whack-mole-game/ with src/, tests/, public/ directories
- [ ] T002 Initialize Vue 3 + Vite project in whack-mole-game/ with package.json, vite.config.js, index.html
- [ ] T003 [P] Install and configure ESLint with Vue 3 rules in whack-mole-game/.eslintrc.js
- [ ] T004 [P] Install and configure Vitest in whack-mole-game/vitest.config.js
- [ ] T005 [P] Install and configure Playwright in whack-mole-game/playwright.config.js
- [ ] T006 Create environment configuration in whack-mole-game/.env with AI service variables
- [ ] T007 Create README.md in whack-mole-game/ with project overview and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create constants.js in whack-mole-game/src/utils/constants.js with default game parameters
- [ ] T009 [P] Create validation.js in whack-mole-game/src/utils/validation.js with parameter validation functions
- [ ] T010 [P] Create useLocalStorage.js in whack-mole-game/src/composables/useLocalStorage.js with localStorage and IndexedDB utilities
- [ ] T011 [P] Create Button.vue in whack-mole-game/src/components/shared/Button.vue
- [ ] T012 [P] Create Modal.vue in whack-mole-game/src/components/shared/Modal.vue
- [ ] T013 Create main.js in whack-mole-game/src/main.js with Vue app initialization
- [ ] T014 [P] Create App.vue in whack-mole-game/src/App.vue with root component and screen navigation
- [ ] T015 Create storageService.js in whack-mole-game/src/services/storageService.js for data persistence operations

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Gameplay (Priority: P1) 🎯 MVP

**Goal**: Core game mechanic - players click moles to collect puzzle pieces and assemble AI-generated character

**Independent Test**: Start game, click 5+ moles, verify pieces appear and can be assembled into complete character image

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T016 [P] [US1] Unit test for gameLogic.js in whack-mole-game/tests/unit/gameLogic.test.js covering mole spawning and collision detection
- [ ] T017 [P] [US1] Unit test for puzzleGenerator.js in whack-mole-game/tests/unit/puzzleGenerator.test.js covering image slicing
- [ ] T018 [P] [US1] Component test for GameCanvas.vue in whack-mole-game/tests/component/GameCanvas.test.vue covering game loop and mole rendering
- [ ] T019 [P] [US1] Component test for PuzzlePiece.vue in whack-mole-game/tests/component/PuzzlePiece.test.vue covering drag and drop
- [ ] T020 [P] [US1] E2E test for gameplay flow in whack-mole-game/tests/e2e/gameplay.spec.js covering start, play, complete

### Implementation for User Story 1

- [ ] T021 [P] [US1] Create gameLogic.js in whack-mole-game/src/utils/gameLogic.js with mole spawning algorithm and collision avoidance
- [ ] T022 [P] [US1] Create puzzleGenerator.js in whack-mole-game/src/utils/puzzleGenerator.js with image slicing logic for grid pieces
- [ ] T023 [US1] Create aiImageService.js in whack-mole-game/src/services/aiImageService.js for AI image generation integration (depends on T010)
- [ ] T024 [US1] Create useAIImageGen.js in whack-mole-game/src/composables/useAIImageGen.js for AI generation state management (depends on T023)
- [ ] T025 [US1] Create useGameState.js in whack-mole-game/src/composables/useGameState.js for active game session state (depends on T015)
- [ ] T026 [US1] Create Mole.vue in whack-mole-game/src/components/game/Mole.vue for individual mole component
- [ ] T027 [US1] Create PuzzlePiece.vue in whack-mole-game/src/components/game/PuzzlePiece.vue for draggable puzzle piece
- [ ] T028 [US1] Create PuzzleGrid.vue in whack-mole-game/src/components/game/PuzzleGrid.vue for assembly area
- [ ] T029 [US1] Create ScoreDisplay.vue in whack-mole-game/src/components/game/ScoreDisplay.vue for real-time score
- [ ] T030 [US1] Create GameCanvas.vue in whack-mole-game/src/components/game/GameCanvas.vue with Canvas API for game rendering (depends on T026, T027, T028, T029, T021, T022, T025)
- [ ] T031 [US1] Create MainMenu.vue in whack-mole-game/src/components/ui/MainMenu.vue with start game button (depends on T011)
- [ ] T032 [US1] Create ResultsScreen.vue in whack-mole-game/src/components/ui/ResultsScreen.vue with score and completion display (depends on T011)
- [ ] T033 [US1] Integrate game navigation in App.vue to flow between MainMenu, GameCanvas, ResultsScreen (depends on T031, T030, T032)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Game Configuration & Character Customization (Priority: P2)

**Goal**: Users can configure all game parameters and AI prompts to customize gameplay experience

**Independent Test**: Open configuration screen, adjust parameters, enter character description, start game, verify behavior matches settings

### Tests for User Story 2 ⚠️

- [ ] T034 [P] [US2] Unit test for validation.js in whack-mole-game/tests/unit/validation.test.js covering parameter validation rules
- [ ] T035 [P] [US2] Component test for ConfigPanel.vue in whack-mole-game/tests/component/ConfigPanel.test.vue covering parameter adjustment
- [ ] T036 [P] [US2] E2E test for configuration flow in whack-mole-game/tests/e2e/configuration.spec.js covering configure, save, apply

### Implementation for User Story 2

- [ ] T037 [P] [US2] Create useGameConfig.js in whack-mole-game/src/composables/useGameConfig.js for configuration state management (depends on T010)
- [ ] T038 [US2] Create ParameterSlider.vue in whack-mole-game/src/components/config/ParameterSlider.vue for adjustable parameter controls
- [ ] T039 [US2] Create DifficultyPreset.vue in whack-mole-game/src/components/config/DifficultyPreset.vue for preset selection
- [ ] T040 [US2] Create PromptEditor.vue in whack-mole-game/src/components/config/PromptEditor.vue for AI prompt input and history
- [ ] T041 [US2] Create ConfigPanel.vue in whack-mole-game/src/components/config/ConfigPanel.vue with comprehensive configuration interface (depends on T037, T038, T039, T040, T012, T011)
- [ ] T042 [US2] Add configuration screen navigation in App.vue from MainMenu to ConfigPanel (depends on T041)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Scoring and Progression (Priority: P3)

**Goal**: Users earn points, track high scores, and view progress statistics across game sessions

**Independent Test**: Play game, hit moles, complete puzzle, verify score recorded and displayed in high scores list

### Tests for User Story 3 ⚠️

- [ ] T043 [P] [US3] Unit test for scoreService.js in whack-mole-game/tests/unit/scoreService.test.js covering score calculation
- [ ] T044 [P] [US3] Component test for HighScoresList.vue in whack-mole-game/tests/component/HighScoresList.test.vue covering score display
- [ ] T045 [P] [US3] E2E test for scoring flow in whack-mole-game/tests/e2e/scoring.spec.js covering gameplay, scoring, high scores

### Implementation for User Story 3

- [ ] T046 [P] [US3] Create scoreService.js in whack-mole-game/src/services/scoreService.js for score calculation and persistence (depends on T015)
- [ ] T047 [US3] Create HighScoresList.vue in whack-mole-game/src/components/ui/HighScoresList.vue with sorting and filtering (depends on T011)
- [ ] T048 [US3] Add scoring to ResultsScreen.vue with final score, accuracy, achievements display (depends on T046)
- [ ] T049 [US3] Add high scores navigation in App.vue from MainMenu to HighScoresList (depends on T047)
- [ ] T050 [US3] Integrate score tracking in GameCanvas.vue real-time score display (depends on T046, T030)
- [ ] T051 [US3] Integrate high score saving in useGameState.js when game completes (depends on T046, T025)

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T052 [P] Update README.md in whack-mole-game/README.md with complete documentation and deployment instructions
- [ ] T053 Code cleanup and refactoring across all components
- [ ] T054 Performance optimization ensuring 60fps game loop and <100ms click response
- [ ] T055 [P] Additional unit tests for edge cases in whack-mole-game/tests/unit/ for validation and error handling
- [ ] T056 Security hardening for input sanitization and prompt validation
- [ ] T057 Validate quickstart.md by following installation and deployment steps
- [ ] T058 Run all test suites (unit, component, E2E) and ensure 80%+ coverage
- [ ] T059 Build production bundle with `npm run build` and verify no errors
- [ ] T060 Deploy to static hosting (Netlify/Vercel) and validate one-click deployment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (Basic Gameplay): Depends on Foundational - No dependencies on other stories
  - User Story 2 (Configuration): Depends on Foundational - Integrates with App.vue, independently testable
  - User Story 3 (Scoring): Depends on Foundational - Integrates with US1 and US2 components, independently testable
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Foundation for all gameplay
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with App.vue navigation, extends US1 with configurable parameters
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 (GameCanvas scoring) and US2 (uses GameConfiguration), but scoring can be tested independently

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Utils before composables and services
- Composables before components
- Services before components that depend on them
- Core components before integration components
- Integration before navigation and routing
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T007) can run in parallel
- All Foundational tasks (T008-T015) marked [P] can run in parallel within Phase 2
- Within User Story 1:
  - All tests (T016-T020) can run in parallel
  - All utils (T021, T022) can run in parallel
  - All services (T023) can run in parallel
  - All composables (T024, T025) can run in parallel
  - All components (T026-T032) can run in parallel except T030 which depends on T026-T029
- Within User Story 2:
  - All tests (T034-T036) can run in parallel
  - All components (T038-T040) can run in parallel
- Within User Story 3:
  - All tests (T043-T045) can run in parallel
  - Components (T047) can run in parallel
- Polish tasks (T052-T056) can run in parallel
- Different user stories can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for gameLogic.js in tests/unit/gameLogic.test.js"
Task: "Unit test for puzzleGenerator.js in tests/unit/puzzleGenerator.test.js"
Task: "Component test for GameCanvas.vue in tests/component/GameCanvas.test.vue"
Task: "Component test for PuzzlePiece.vue in tests/component/PuzzlePiece.test.vue"
Task: "E2E test for gameplay flow in tests/e2e/gameplay.spec.js"

# Launch all utils for User Story 1 together:
Task: "Create gameLogic.js in src/utils/gameLogic.js"
Task: "Create puzzleGenerator.js in src/utils/puzzleGenerator.js"

# Launch all services and composables for User Story 1 together:
Task: "Create aiImageService.js in src/services/aiImageService.js"
Task: "Create useAIImageGen.js in src/composables/useAIImageGen.js"
Task: "Create useGameState.js in src/composables/useGameState.js"

# Launch all leaf components for User Story 1 together:
Task: "Create Mole.vue in src/components/game/Mole.vue"
Task: "Create PuzzlePiece.vue in src/components/game/PuzzlePiece.vue"
Task: "Create PuzzleGrid.vue in src/components/game/PuzzleGrid.vue"
Task: "Create ScoreDisplay.vue in src/components/game/ScoreDisplay.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - Basic Gameplay
4. **STOP and VALIDATE**: Test User Story 1 independently by starting game, hitting moles, collecting and assembling puzzle pieces
5. Deploy/demo MVP if ready

**MVP Scope**: Core game mechanic - players click moles, collect puzzle pieces, assemble AI-generated character. No configuration, no scoring/tracking.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Basic Gameplay) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Configuration) → Test independently → Deploy/Demo
4. Add User Story 3 (Scoring) → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Basic Gameplay) - T021-T033
   - Developer B: User Story 2 (Configuration) - T034-T042
   - Developer C: User Story 3 (Scoring) - T043-T051
3. Stories complete and integrate independently
4. All developers collaborate on Phase 6 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per constitution testing standards)
- Critical business logic (gameLogic, puzzleGenerator, scoreService) MUST have 100% test coverage
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 60
**Tasks by User Story**:
- Setup (Phase 1): 7 tasks
- Foundational (Phase 2): 8 tasks
- User Story 1 (P1): 18 tasks (5 tests + 13 implementation)
- User Story 2 (P2): 9 tasks (3 tests + 6 implementation)
- User Story 3 (P3): 9 tasks (3 tests + 6 implementation)
- Polish (Phase 6): 9 tasks

**Parallel Opportunities**: 30 tasks marked with [P] can run in parallel

**Independent Test Criteria**:
- US1: Start game, click 5+ moles, verify pieces drop and assemble into complete character
- US2: Open config, adjust parameters, enter prompt, start game, verify settings applied
- US3: Play game, complete puzzle, verify score recorded in high scores list
