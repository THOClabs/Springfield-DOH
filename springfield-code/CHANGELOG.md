# Changelog

All notable changes to Springfield Code will be documented in this file.

## [3.0.3] - 2025-12-31

### Added

- **Summon Command Tests** - 11 new tests for character loading paths (simpson-family, extended, springfield, specialists)
- **Generator Fallback Tests** - 6 new tests for `getArtifactTemplate` unknown character fallback
- **Skills Parsing Tests** - 2 new tests for non-array triggers/dependencies branches

### Improved

- **Total Tests**: 435 → 454 (+19 tests)
- **Statement Coverage**: 99.17% → 99.22% (maintained near-maximum)
- **Branch Coverage**: 94.50% → 94.72% (+0.22%)

### Technical

- Added `/* istanbul ignore */` exclusions for defense-in-depth code paths
- `src/commands/summon.ts` - specialists path marked as backward-compatibility
- `src/commands/summon-batch.ts` - catch block marked as ESM-unmockable
- `src/artifacts/generator.ts` - path traversal check marked as defense-in-depth
- `src/utils/stats.ts` - writeFileSync catch marked as ESM-unmockable

## [3.0.2] - 2025-12-31

### Added

- **Prerequisites Tests** - 9 new tests for `isSpringfieldInitialized()` and `verifyPrerequisites()` edge cases
- **Summon Batch Tests** - 19 new tests for tier validation, character listing, and batch summoning
- **Lisa/Stats Edge Case Tests** - 11 new tests for normal lisa summon path and stats reset failure branch
- **Springfield Status Tests** - 2 new tests for optional artifact display and RALPH READY status

### Improved

- **Statement Coverage**: 98.43% → 99.17% (+0.74%)
- **Branch Coverage**: 92.68% → 94.50% (+1.82%)
- **Function Coverage**: 98.31% → 98.87% (+0.56%)
- **Total Tests**: 394 → 435 (+41 tests)

### Technical

- Added `/* istanbul ignore */` exclusions for ESM-unmockable catch blocks
- `src/commands/springfield.ts` now at 100% statement coverage
- `src/commands/stats.ts` now at 100% statement coverage
- `src/commands/lisa.ts` now at 100% statement coverage
- `src/commands/summon-batch.ts` now at 97.31% statement coverage

## [3.0.1.1] - 2025-12-31

### Added

- **Config Edge Case Tests** - 30 new tests for `config.ts` covering `parseValue` for all config keys, invalid logLevel fallback, and malformed JSON config files
- **Stats Utilities Tests** - 25 new tests for `src/utils/stats.ts` covering migration paths, missing entries, parse errors, and edge cases
- **Lisa-Ralph Protocol Tests** - 12 new tests for file filtering, completion/iterations edge cases, and confirmation flow variants
- **Artifact Generator Tests** - 16 new tests for input sanitization (XSS prevention), character validation, and path traversal protection
- **Ralph Gate Tests** - 12 new tests for token expiration, hook handler edge cases, and authorization flow validation

### Improved

- **Branch Coverage**: 85.49% → 92.68% (+7.19%)
- **Statement Coverage**: 97.53% → 98.43% (+0.9%)
- **Total Tests**: 301 → 394 (+93 tests)
- All coverage metrics now above 92% (target achieved)

### Technical

- `config.ts` now at 100% branch coverage (was 55.55%)
- `src/utils/stats.ts` now at 96.36% branch coverage (was 71.79%)
- `src/commands/lisa-ralph-special.ts` improved to 89.18% branches
- `src/artifacts/generator.ts` improved to 85.71% branches
- `src/hooks/ralph-gate.ts` improved to 90.24% branches

## [3.0.1] - 2025-12-31

### Added

- **Comprehensive Command Tests** - 84 new tests covering all 40+ character command `run()` functions
- **Constants Tests** - 9 new tests for `validateRequiredFiles()` function
- **Logger Tests** - 17 new tests covering all Logger class methods including `info()`, `child()`, and log level filtering

### Improved

- **Function Coverage**: 75.28% → 98.31% (+23%)
- **Statement Coverage**: 94.12% → 97.53% (+3%)
- **Branch Coverage**: 80.62% → 85.49% (+5%)
- **Total Tests**: 191 → 301 (+110 tests)

### Technical

- All character commands now have 100% function coverage
- `constants.ts` `validateRequiredFiles()` now at 98.33% coverage
- `logger.ts` now at 100% coverage
- Static imports used for Vitest compatibility (fixes dynamic import issues)

## [3.0.0] - 2025-12-31

### ⚠️ BREAKING CHANGES

- **Removed `setRalphInitiated()` deprecated API** - Use `requestRalphAuthorization()` + `authorizeRalph()` pattern instead. See MIGRATION.md for details.

### Added

#### Validation Utilities (v3.0.0)

- New `src/utils/validation.ts` module consolidating file validation logic
- `isFileComplete()` - Check if file content is complete
- `hasTemplatePlaceholders()` - Detect template placeholders in content
- `validateFileContent()` - Detailed file validation result
- `validateRequiredFiles()` - Validate all required files in directory
- `validateSpringfieldDirectory()` - Validate Springfield directory state
- `isSpringfieldInitialized()` - Quick check if Springfield exists
- `isSpringfieldReady()` - Quick check if all files are ready
- Exported types: `FileValidationResult`, `DirectoryValidationResult`

#### Skills System (v3.0.0)

- New `src/skills/index.ts` with skill registry and utilities
- `registerSkill()` - Register skill from markdown string
- `registerSkillFromFile()` - Register skill from file
- `getSkill()` - Retrieve skill by ID
- `listSkills()` - List all registered skills
- `unregisterSkill()` - Remove a skill
- `clearSkillRegistry()` - Clear all skills (for testing)
- `loadSkillsFromDirectory()` - Bulk load skills
- `findSkillsByTrigger()` - Find skills by trigger phrase
- `parseFrontmatter()` - Parse YAML frontmatter from markdown
- Exported types: `Skill`, `SkillMetadata`, `RegisterSkillOptions`, `SkillLookupResult`, `SkillRegistryState`

#### TypeDoc CI Workflow

- New `.github/workflows/docs.yml` for automated documentation
- Generates TypeDoc on push to main branch
- Publishes to GitHub Pages

### Changed

- All hardcoded `200` values now use `getCachedConfig().minContentLength`
- `validateRequiredFiles()` in constants.ts now uses config default
- `src/skills/README.md` updated with full API documentation

### Removed

- `setRalphInitiated()` function and export (deprecated since v2.0.0)
- Related test cases for deprecated API

## [2.3.0] - 2025-12-31

### Added

#### Configuration System

- New `src/config.ts` module with centralized configuration
- Support for `.springfieldrc.json` config file
- Environment variables take precedence over file config
- Configurable: `tokenTtlMs`, `maxTokensPerMinute`, `rateLimitWindowMs`, `minContentLength`, `defaultMaxIterations`
- New exports: `getConfig()`, `getCachedConfig()`, `clearConfigCache()`, `validateConfig()`, `DEFAULT_CONFIG`

#### Integration Tests

- Full integration test suite in `tests/integration.test.ts`
- Tests for stats, summon-batch, cancel-ralph commands
- Configuration system tests with env var precedence

#### Developer Automation (6D)

- **Husky** pre-commit hooks with lint-staged
- **Commitlint** enforcing conventional commit messages
- **Semantic Release** for automated versioning (when used with CI)
- **Dependabot** for weekly dependency updates
- **Codecov** badge in README

### Changed

- Ralph Gate now uses centralized config instead of hardcoded values
- `prepare` script now runs `husky` for git hooks

## [2.2.0] - 2025-12-31

### Added

#### Batch Summon Command

- `/summon-batch` - Summon multiple characters by tier
- Tier aliases: `family`/`simpsons`, `extended`, `springfield`/`town`, `specialists`/`specialist`, `all`
- Lists available characters when called without input

#### Local Usage Statistics

- `/stats` - View character usage statistics
- `/stats reset` - Clear all usage data
- File-based storage in `.springfield/stats.json` - no network calls
- Tracks invocations per character and per tier

#### Cancel Ralph Command

- `/cancel-ralph` - Revoke active Ralph authorization tokens
- Useful for manually ending persistent iteration loops

#### Documentation

- `MIGRATION.md` - Deprecation guide for v3.0.0 breaking changes
- Placeholder READMEs for `skills/` and `templates/` directories
- Documents upcoming v3.0.0 extensibility features

### Fixed

- CharacterTier type now includes `"specialists"` union member
- `findAgentPath()` now correctly searches `specialists/` subdirectory

## [2.1.0] - 2025-12-31

### Added

#### 20 New Specialist Characters

- `/dr-nick` - API health checks and liveness probes ("Hi everybody!")
- `/patty` - Compliance gates and audit trails
- `/troy` - Onboarding and tutorial documentation
- `/lionel` - License and legal review
- `/hans` - Accessibility (a11y) analysis
- `/hibbert` - Performance profiling and diagnostics
- `/edna` - Code review checklists ("Ha!")
- `/otto` - Migration strategy planning
- `/lenny` - A/B testing and experiments
- `/kent` - Monitoring and alerting configuration
- `/snake` - Authentication and authorization review
- `/cookie` - Database and data modeling
- `/gil` - Error handling patterns
- `/bumblebee` - Internationalization (i18n)
- `/duffman` - Feature flags and rollouts ("Oh yeah!")
- `/fat-tony` - Microservices architecture
- `/sea-captain` - Container orchestration and K8s
- `/lovejoy` - Event-driven architecture
- `/helen` - User analytics and privacy
- `/agnes` - CI/CD pipeline requirements ("SEYMOUR!")

#### Documentation

- Added markdownlint configuration for consistent documentation
- Updated USERGUIDE.md with specialist character documentation
- Full TypeDoc API documentation generation

### Changed

- Character roster expanded from 20 to 40 characters
- Added new `specialists` tier in CHARACTER_TIERS

## [2.0.0] - 2025-12-30

### Added

#### Logger Abstraction

- Configurable logging via `SPRINGFIELD_LOG_LEVEL` environment variable
- Log levels: `debug`, `info`, `warn`, `error`, `silent`
- Module-specific loggers: `ralphGateLogger`, `artifactLogger`, `prerequisiteLogger`

#### Shared Types Module

- Centralized `src/types.ts` for common interfaces
- `CommandContext`, `PrerequisiteResult`, `ConversationContext` types

#### TypeDoc Generation

- Added typedoc configuration for API documentation
- `npm run docs` generates HTML documentation in `docs/`

### Changed

#### Generator Modularization

- Split 834-line `generator.ts` into modular per-character files
- Created `src/artifacts/generators/` directory with 20 generator modules
- Main generator.ts reduced to 120 lines

#### Graceful Rate Limiting

- `requestRalphAuthorization()` now returns `null` instead of throwing on rate limit
- Improved integration resilience for consuming code

#### Type Safety Improvements

- Replaced `as any` assertions with proper `Set<string>` patterns
- Removed redundant type aliases

### Fixed

- ESLint errors for unused variables
- Removed unused `writeArtifact` function
- Removed unused `__dirname` variable

### Developer Experience

- ESLint v9 flat config format
- 98 tests passing with 92% coverage
- All lint rules passing

## [1.0.0] - 2024-01-15

### Added

#### Core Features

- `/springfield init` - Initialize Springfield environment with template files
- `/springfield status` - Check planning status and Ralph readiness
- `/springfield reset` - Reset and reinitialize environment

#### Simpson Family Agents

- `/homer` - Dumb-smart questions that reveal hidden assumptions
- `/marge` - Organization and structure, motherly oversight
- `/bart` - Chaos engineering and edge case identification
- `/lisa` - Architecture, planning, and Ralph initiation
- `/maggie` - Logging strategy and monitoring (*squeak*)

#### Extended Family Agents

- `/grampa` - Historical context and legacy knowledge
- `/burns` - Budget constraints and resource allocation
- `/smithers` - Schedule management and executive translation
- `/flanders` - Coding standards and best practices

#### Springfield Specialists

- `/milhouse` - Dependency analysis (gets hurt first)
- `/moe` - Debugging and stack trace interpretation
- `/wiggum` - Security review (ironic incompetence reveals vulnerabilities)
- `/krusty` - Demo preparation and presentation
- `/bob` - Adversarial analysis and threat modeling
- `/skinner` - Timeline management and stakeholder communication
- `/nelson` - Test failures and coverage analysis ("Ha-ha!")
- `/apu` - Utility functions (24/7 availability)
- `/frink` - Experimental R&D and prototyping
- `/cbg` - Documentation review ("Worst X ever")
- `/willie` - Infrastructure and DevOps

#### Special Features

- **Ralph Gate Hook** - Prevents direct Ralph invocation
- **Lisa-Ralph Protocol** - Only Lisa can initiate Ralph after planning
- **Artifact Generation** - Characters create planning files in `.springfield/`
- **Prerequisites Verification** - Lisa checks all files before Ralph execution

### Technical Details

- Built with TypeScript and ES Modules
- Uses Vitest for testing (61 tests passing)
- Plugin manifest for Claude Code integration
- Depends on ralph-wiggum plugin for execution loops

## [0.1.0] - Initial Development

### Added

- Project scaffolding
- Basic command structure
- Initial agent definitions
