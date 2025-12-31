# Changelog

All notable changes to Springfield Code will be documented in this file.

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
