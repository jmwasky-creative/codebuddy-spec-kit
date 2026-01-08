<!--
SYNC IMPACT REPORT
==================
Version Change: None → 1.0.0 (Initial Constitution)
Modified Principles: None (Initial creation)
Added Sections:
  - Code Standards (代码规范)
  - Testing Standards (测试规范)
  - Documentation Standards (需求文档规范)
  - Governance (治理规则)
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Aligned with new principles
  ✅ spec-template.md - Aligned with documentation standards
  ✅ tasks-template.md - Aligned with testing requirements
Follow-up TODOs: None
-->

# CodeBuddy Constitution

## Core Principles

### Code Standards (代码规范)

All Python code MUST adhere to PEP 8 style guidelines with the following additional rules:

**Mandatory Requirements:**
- Maximum line length: 100 characters (not 79 as per PEP 8)
- Use 4 spaces for indentation, never tabs
- All functions MUST have docstrings following Google style guide
- All modules MUST have a module-level docstring explaining purpose
- Type hints MUST be used for all function signatures (Python 3.9+ syntax)
- All imports MUST be at the top of files, grouped in order: stdlib, third-party, local
- Avoid wildcard imports (`from module import *`)
- Use f-strings for string formatting (Python 3.6+)
- Avoid using single-letter variable names except for loop counters (i, j, k) or mathematical contexts (x, y, z)

**Naming Conventions:**
- Classes: PascalCase (e.g., `UserService`)
- Functions and variables: snake_case (e.g., `get_user_data`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Private members: leading underscore (e.g., `_internal_method`)
- Protected members: single leading underscore (e.g., `_protected_method`)

**Code Organization:**
- Each module should have a single, clear responsibility
- Keep functions under 50 lines unless justified by complexity
- Keep classes focused and avoid god classes (>300 lines is a warning sign)
- Use type hints for better IDE support and documentation

**Rationale:** Consistent code style improves readability, reduces cognitive load, and enables better collaboration. PEP 8 is the de facto standard for Python, with 100-char limit accommodating modern wide monitors and clearer code structure.

### Testing Standards (测试规范)

Testing is a non-negotiable part of development. All code MUST have corresponding tests.

**Test Structure:**
- Unit tests: `tests/unit/test_[module_name].py`
- Integration tests: `tests/integration/test_[feature_name].py`
- Contract tests: `tests/contract/test_[endpoint].py` (for APIs)
- Test files MUST mirror the source code structure

**Test Requirements:**
- All public functions MUST have unit tests
- All API endpoints MUST have contract tests
- Critical user journeys MUST have integration tests
- Tests MUST be independent and can run in any order
- Tests MUST follow the Arrange-Act-Assert (AAA) pattern

**Test Coverage:**
- Minimum 80% code coverage for new features
- 100% coverage for critical business logic
- Coverage reports MUST be generated on CI/CD

**Test Naming:**
- Test functions MUST be descriptive: `test_[function_name]_[scenario]_[expected_result]`
- Example: `test_calculate_total_with_discount_applies_correctly`
- Use pytest fixtures for common test setup

**Test Discipline:**
- Tests MUST be written before implementation (TDD) when possible
- Tests MUST fail before code is written (Red-Green-Refactor)
- Never comment out failing tests
- All tests MUST pass before merging

**Rationale:** Tests provide safety net for refactoring, catch bugs early, serve as living documentation, and enable confident deployment. High coverage reduces regression risk and improves code quality.

### Documentation Standards (需求文档规范)

All features MUST have complete documentation before implementation begins.

**Required Documentation Artifacts:**
1. **Feature Specification** (`spec.md`): User stories, requirements, acceptance criteria
2. **Implementation Plan** (`plan.md`): Technical approach, architecture, dependencies
3. **Data Model** (`data-model.md`): Entities, relationships, schemas
4. **API Contracts** (`contracts/`): API endpoints, request/response schemas
5. **Quickstart Guide** (`quickstart.md`): How to run and test the feature

**Specification Requirements:**
- User stories MUST be prioritized (P1, P2, P3) and independently testable
- Each user story MUST deliver standalone value
- Requirements MUST be specific, measurable, and testable
- Edge cases MUST be documented with expected behavior
- Success criteria MUST be measurable and technology-agnostic

**Implementation Plan Requirements:**
- Technical context MUST include language version, dependencies, platform
- Constitution check MUST verify compliance with all principles
- Project structure MUST be defined and justified
- Complexity violations MUST be documented with alternatives considered

**Documentation Updates:**
- All documentation MUST be kept in sync with code changes
- README MUST be updated when new features are added
- Changelog MUST be maintained for version releases
- Deprecation notices MUST be documented in advance

**Rationale:** Complete documentation reduces ambiguity, enables better planning, facilitates onboarding, and serves as the contract between stakeholders and implementation team. Well-documented features are easier to maintain and extend.

## Code Quality & Security

### Code Review Process

All code changes MUST go through peer review before merging:
- At least one approval required for minor changes
- Two approvals required for major features or breaking changes
- Reviewer MUST check compliance with all constitution principles
- Reviewer MUST verify tests pass and coverage is adequate
- Reviewer MUST verify documentation is updated

### Security Requirements

- All user inputs MUST be validated and sanitized
- Secrets MUST be stored in environment variables, never in code
- Dependencies MUST be scanned for vulnerabilities regularly
- Sensitive data MUST be encrypted at rest and in transit
- All security-related changes MUST be documented

### Performance Standards

- All features MUST meet performance targets defined in specs
- Performance tests MUST be included for critical paths
- Database queries MUST be optimized (N+1 problems must be avoided)
- Response times MUST be monitored in production
- Memory usage MUST be within defined limits

## Development Workflow

### Branch Management

- Main branch MUST always be deployable
- Feature branches: `feature/[###-feature-name]`
- Bugfix branches: `bugfix/[###-description]`
- Branches MUST be short-lived (<7 days ideal)
- Branches MUST be deleted after merge

### Commit Standards

- Commit messages MUST follow conventional commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(auth): add JWT token validation`
- Commits MUST be atomic and focused on single change
- Large commits (>500 lines) should be split

### Code Health Checks

All code MUST pass the following gates before merge:
- Linter checks (e.g., flake8, pylint, ruff) with zero errors
- Type checker (mypy) with zero errors
- All tests MUST pass
- Code coverage MUST meet threshold (80% minimum)
- Security scan MUST pass

## Governance

This constitution supersedes all other coding practices and conventions. It is the single source of truth for development standards.

### Amendment Process

Constitution amendments follow these rules:
- Proposals MUST be documented with rationale and impact analysis
- Amendments require team consensus or maintainer approval
- Breaking changes MUST increment MAJOR version
- Non-breaking additions MUST increment MINOR version
- Clarifications and minor fixes MUST increment PATCH version

**Versioning Rules:**
- MAJOR: Incompatible changes, removal of principles, fundamental restructuring
- MINOR: New principles added, new sections, material guidance expansions
- PATCH: Clarifications, wording improvements, non-semantic refinements

### Compliance & Enforcement

- All pull requests MUST verify constitution compliance
- Violations MUST be justified in pull request description
- Complexity increases MUST have explicit alternatives considered
- Teams SHOULD use constitution gates in code review checklist

### Violation Handling

If a principle cannot be followed:
1. Document the specific violation and reason
2. Propose simpler alternative that does comply
3. Explain why alternative is insufficient
4. Seek explicit approval before proceeding
5. Mark violation in implementation plan with complexity tracking table

### Runtime Guidance

For detailed development workflows and technology-specific guidance, refer to:
- `.specify/templates/plan-template.md` - Implementation planning
- `.specify/templates/spec-template.md` - Specification writing
- `.specify/templates/tasks-template.md` - Task breakdown
- `.specify/templates/checklist-template.md` - Quality checklists

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
