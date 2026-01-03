# Springfield Code User Guide

> "I'm helping!" - Ralph Wiggum

A comprehensive guide to using Springfield Code, the Simpsons-themed vibe coding environment for Claude Code.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Concepts](#core-concepts)
5. [The Springfield Directory](#the-springfield-directory)
6. [Character Guide](#character-guide)
   - [Simpson Family](#simpson-family)
   - [Extended Family](#extended-family)
   - [Springfield Specialists](#springfield-specialists)
   - [Technical Specialists (v2.1.0)](#technical-specialists-v210)
7. [The Lisa-Ralph Protocol](#the-lisa-ralph-protocol)
8. [Workflow Examples](#workflow-examples)
9. [Command Reference](#command-reference)
10. [Artifact Reference](#artifact-reference)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)

---

## Introduction

Springfield Code transforms development planning into an engaging, character-driven experience. Each Simpsons character brings a unique perspective to your project:

- **Homer** asks the "dumb" questions that reveal hidden assumptions
- **Marge** organizes and structures your project
- **Bart** finds edge cases and chaos scenarios
- **Lisa** designs architecture and initiates execution
- **Ralph** persistently iterates until completion

The plugin gamifies the planning process while ensuring thorough coverage of all aspects of software development.

### Philosophy

> "Don't aim for perfect on first try. Let the loop refine the work."

Springfield Code embraces iterative development. The planning phase uses multiple characters to build comprehensive documentation, then Ralph executes with persistent iteration until the task is complete.

---

## Installation

### Prerequisites

- Claude Code CLI installed
- Node.js 20 or later
- npm package manager

### Steps

```bash
# Clone the repository
git clone https://github.com/THOC-LABS/springfield-code.git

# Navigate to the plugin directory
cd springfield-code

# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests to verify installation
npm run test
```

### Verifying Installation

After installation, you should be able to run:

```
/springfield
```

This should display help text with available commands.

---

## Quick Start

### 1. Initialize Springfield

```
/springfield init
```

This creates a `.springfield/` directory with template files.

### 2. Plan with Characters

```
/homer "We're building a user authentication system"
/marge "How should we organize the auth module?"
/bart "What could go wrong with authentication?"
/lisa "Design the authentication architecture"
```

### 3. Check Status

```
/springfield status
```

### 4. Execute with Ralph

```
/lisa ralph
yes
```

---

## Core Concepts

### Characters as Perspectives

Each character represents a different way of thinking about your project:

| Perspective | Character | Focus |
|-------------|-----------|-------|
| Simplification | Homer | "Why do we need this?" |
| Organization | Marge | "How do we structure this?" |
| Chaos | Bart | "What could break?" |
| Architecture | Lisa | "What's the design?" |
| Observation | Maggie | "What should we log?" |

### The Planning → Execution Flow

```
┌─────────────────────────────────────────────────────┐
│                    PLANNING PHASE                    │
├─────────────────────────────────────────────────────┤
│  Homer → Questions    Marge → Structure             │
│  Bart → Edge Cases    Lisa → Architecture           │
│  [Other characters as needed]                       │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                  VERIFICATION PHASE                  │
├─────────────────────────────────────────────────────┤
│  /springfield status → Check readiness              │
│  /lisa ralph → Verify prerequisites                 │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   EXECUTION PHASE                    │
├─────────────────────────────────────────────────────┤
│  Ralph iterates until completion promise is met     │
│  "I'm helping!" → Progress → "DONE"                 │
└─────────────────────────────────────────────────────┘
```

### The Ralph Gate

Direct Ralph invocation is blocked. This is intentional:

```
/ralph
```

> *Ralph looks confused*
> Hi Lisa! Where's Lisa? Lisa tells me what to do.

Only Lisa can initiate Ralph after verifying all planning is complete:

```
/lisa ralph
```

---

## The Springfield Directory

When you run `/springfield init`, a `.springfield/` directory is created with these files:

### Required Files

| File | Purpose | Who Creates It |
|------|---------|----------------|
| `project.md` | Overall project definition | You or Lisa |
| `task.md` | Current task for Ralph | You or Lisa |
| `completion.md` | Done criteria | You |
| `iterations.md` | Max iterations config | You |

### Optional Planning Files

| File | Purpose | Created By |
|------|---------|------------|
| `questions.md` | Clarifying questions | Homer |
| `structure.md` | Organization plan | Marge |
| `edge-cases.md` | Chaos scenarios | Bart |
| `logging.md` | Observability plan | Maggie |
| `history.md` | Historical context | Grampa |
| `budget.md` | Cost analysis | Burns |
| `schedule.md` | Timeline | Smithers |
| `standards.md` | Coding guidelines | Flanders |
| `dependencies.md` | Dependency analysis | Milhouse |
| `debug-notes.md` | Debugging info | Moe |
| `security-review.md` | Security analysis | Wiggum |
| `demo.md` | Demo preparation | Krusty |
| `adversarial.md` | Threat modeling | Bob |
| `timeline.md` | Project timeline | Skinner |
| `tests.md` | Test coverage | Nelson |
| `utilities.md` | Helper functions | Apu |
| `experiments.md` | R&D notes | Frink |
| `docs-review.md` | Documentation review | CBG |
| `infrastructure.md` | DevOps notes | Willie |

### File Templates

#### project.md

```markdown
# Project Definition

## What We're Building
[One paragraph description]

## Why It Matters
[The purpose, the value]

## Core Requirements
1.
2.
3.

## Technical Constraints
-
-

## Out of Scope
-

## Success Looks Like
[What does done look like?]
```

#### task.md

```markdown
# Current Task

## Objective
[What Ralph should accomplish]

## Context
[Everything Ralph needs to know]

## Files to Create or Modify
-
-

## Notes for Ralph
[Additional guidance]
```

#### completion.md

```markdown
# Completion Criteria

## Completion Promise
```

DONE

```

## Success Conditions
1. [ ]
2. [ ]
3. [ ]

## Verification Steps
1. [How to verify each condition]
```

#### iterations.md

```markdown
# Iteration Configuration

## Max Iterations
```

20

```

## Stuck Protocol
After 75% of iterations without completion:
1. Document blocking issues
2. List attempted approaches
3. Suggest alternatives
```

---

## Character Guide

### Simpson Family

#### Homer Simpson (`/homer`)

**Role:** Dumb-Smart Questions
**Artifact:** `questions.md`

Homer's superpower is asking obvious questions that aren't actually obvious. His simple perspective cuts through complexity and reveals hidden assumptions.

**Best Used For:**

- Early project planning
- Challenging assumptions
- Simplifying complex features
- Finding unnecessary complexity

**Example Interaction:**

```
/homer "We're building a microservices architecture"
```

**Homer responds:**
> D'oh! Let me get this straight...
>
> So instead of ONE thing, we're building MANY things that talk to each other?
>
> - Why can't it just be one thing?
> - What happens if one thing can't find the other thing?
> - Is this more complicated than it needs to be?
>
> Mmm... distributed donuts...

**Sample Questions Homer Might Ask:**

- "Why do we need this again?"
- "What's the simplest way to do this?"
- "What if the user is as confused as me?"
- "Can we just... not do that part?"

---

#### Marge Simpson (`/marge`)

**Role:** Organization & Structure
**Artifact:** `structure.md`

Marge keeps things tidy and ensures everyone knows their responsibilities. Her worried "Hmmmm..." often signals real concerns.

**Best Used For:**

- Project organization
- Directory structure
- Role assignment
- Cleanup planning

**Example Interaction:**

```
/marge "How should we organize the API module?"
```

**Marge responds:**
> Hmmmm...
>
> Let me think about how to organize this properly.
>
> ```
> /api
> ├── routes/
> │   ├── users.ts
> │   └── products.ts
> ├── middleware/
> │   └── auth.ts
> └── utils/
>     └── validators.ts
> ```
>
> **Things That Worry Me:**
>
> - Who's maintaining the middleware?
> - We should have a cleanup checklist

---

#### Bart Simpson (`/bart`)

**Role:** Chaos Engineering & Edge Cases
**Artifact:** `edge-cases.md`

Bart can't resist breaking things. This makes him perfect for finding what could go wrong.

**Best Used For:**

- Edge case identification
- Security testing ideas
- Chaos scenarios
- Breaking assumptions

**Example Interaction:**

```
/bart "What could break in the payment system?"
```

**Bart responds:**
> Ay caramba! A payment system? Oh man...
>
> **Things I'm Going to Try:**
>
> 1. Pay with $0.00 - does it go through?
> 2. Pay with $-100 - do I get money?
> 3. Click "Pay" 50 times really fast
> 4. Put `<script>alert('eat my shorts!')</script>` in the name field
>
> **Loopholes I See:**
>
> - Can I pay for something, get the item, then cancel?
> - What if the internet dies mid-payment?

---

#### Lisa Simpson (`/lisa`)

**Role:** Architecture & Planning
**Artifact:** `project.md`, `task.md`
**Special Power:** Can initiate Ralph

Lisa is the intellectual who sees the big picture. She designs systems thoughtfully and is the ONLY one who can initiate Ralph.

**Best Used For:**

- System architecture
- Design patterns
- Long-term planning
- Initiating execution

**Example Interaction:**

```
/lisa "Design the data access layer"
```

**Lisa responds:**
> *adjusts saxophone case thoughtfully*
>
> A data access layer needs careful consideration...
>
> **Design Principles:**
>
> 1. Repository pattern for abstraction
> 2. Unit of work for transactions
> 3. Separation from business logic
>
> **Architecture:**
>
> ```
> Controllers → Services → Repositories → Database
> ```

**Special Command:**

```
/lisa ralph
```

This initiates the Ralph execution protocol (see [The Lisa-Ralph Protocol](#the-lisa-ralph-protocol)).

---

#### Maggie Simpson (`/maggie`)

**Role:** Logging & Observability
**Artifact:** `logging.md`

Maggie doesn't talk, but she notices everything. Her squeaks translate to log levels.

**Best Used For:**

- Logging strategy
- Monitoring setup
- Observability planning
- Status code design

**Example Interaction:**

```
/maggie "What should we log for user actions?"
```

**Maggie responds:**
> *squeak*
>
> | Maggie Says | Log Level | Events |
> |-------------|-----------|--------|
> | *soft squeak* | DEBUG | Request details |
> | *squeak* | INFO | User logged in |
> | *squeak squeak* | WARN | Failed attempt |
> | *SQUEAK!* | ERROR | Auth failure |
> | *falls over* | FATAL | System down |

---

### Extended Family

#### Grampa Simpson (`/grampa`)

**Role:** Historical Context
**Artifact:** `history.md`

Grampa rambles, but his stories contain buried wisdom about past decisions and lessons learned.

**Best Used For:**

- Understanding legacy code
- Learning from past mistakes
- Context for old decisions
- Institutional knowledge

**Example:**

```
/grampa "Why is the auth system built this way?"
```

---

#### Mr. Burns (`/burns`)

**Role:** Budget & Resources
**Artifact:** `budget.md`

Burns evaluates everything through cost-benefit analysis. His "Excellent..." is hard-earned approval.

**Best Used For:**

- Cost justification
- Resource allocation
- ROI analysis
- Executive communication

**Example:**

```
/burns "What will the new infrastructure cost?"
```

---

#### Smithers (`/smithers`)

**Role:** Schedule Management
**Artifact:** `schedule.md`

Smithers translates between technical and executive speak, and manages practical timelines.

**Best Used For:**

- Project scheduling
- Executive updates
- Timeline management
- Communication planning

**Example:**

```
/smithers "Plan the migration timeline"
```

---

#### Ned Flanders (`/flanders`)

**Role:** Coding Standards
**Artifact:** `standards.md`

Flanders is the ultimate rule-follower. His coding standards are neighborly and thorough.

**Best Used For:**

- Establishing guidelines
- Code review standards
- Best practices
- Documentation standards

**Example:**

```
/flanders "What should our coding standards be?"
```

---

### Springfield Specialists

#### Milhouse (`/milhouse`)

**Role:** Dependency Management
**Artifact:** `dependencies.md`

Milhouse gets hurt first - making him the canary for dependency issues.

**Best Used For:**

- Dependency analysis
- Upgrade risk assessment
- Compatibility checking
- Version conflicts

---

#### Moe (`/moe`)

**Role:** Debugging
**Artifact:** `debug-notes.md`

Moe's pessimism makes him an excellent debugger. He expects everything to fail.

**Best Used For:**

- Debugging sessions
- Stack trace analysis
- Error diagnosis
- Root cause analysis

---

#### Chief Wiggum (`/wiggum`)

**Role:** Security Review
**Artifact:** `security-review.md`

Wiggum's incompetence ironically reveals security gaps - what he misses is what you should check.

**Best Used For:**

- Security audits
- Vulnerability finding
- Authentication review
- Input validation

---

#### Krusty (`/krusty`)

**Role:** Demo Preparation
**Artifact:** `demo.md`

Krusty knows showmanship. He prepares demos that work (at least for the demo).

**Best Used For:**

- Demo preparation
- Presentation planning
- Stakeholder meetings
- Product showcases

---

#### Sideshow Bob (`/bob`)

**Role:** Adversarial Analysis
**Artifact:** `adversarial.md`

Bob thinks like an attacker. His sophisticated threats reveal real vulnerabilities.

**Best Used For:**

- Threat modeling
- Attack vectors
- Penetration test planning
- Security architecture

---

#### Principal Skinner (`/skinner`)

**Role:** Timeline Management
**Artifact:** `timeline.md`

Skinner manages timelines and has "steamed hams" excuses ready for delays.

**Best Used For:**

- Project timelines
- Milestone tracking
- Stakeholder management
- Risk mitigation

---

#### Nelson (`/nelson`)

**Role:** Test Failures
**Artifact:** `tests.md`

Nelson laughs at failures ("Ha-ha!") but this motivates better testing.

**Best Used For:**

- Test coverage analysis
- Failure identification
- Edge case testing
- Test strategy

---

#### Apu (`/apu`)

**Role:** Utility Functions
**Artifact:** `utilities.md`

Apu runs the Kwik-E-Mart 24/7 - reliable, always available, well-organized.

**Best Used For:**

- Helper function design
- Utility libraries
- Common operations
- Reusable code

---

#### Professor Frink (`/frink`)

**Role:** Experimental R&D
**Artifact:** `experiments.md`

Frink explores cutting-edge technology. Things may explode, but innovation happens.

**Best Used For:**

- Technology exploration
- Prototype planning
- Innovation research
- Proof of concepts

---

#### Comic Book Guy (`/cbg`)

**Role:** Documentation Review
**Artifact:** `docs-review.md`

CBG's harsh criticism ("Worst X ever") drives better documentation.

**Best Used For:**

- Documentation review
- README evaluation
- API doc quality
- Technical writing

---

#### Groundskeeper Willie (`/willie`)

**Role:** Infrastructure & DevOps
**Artifact:** `infrastructure.md`

Willie does the dirty work of infrastructure. Rough but competent.

**Best Used For:**

- Deployment planning
- Server configuration
- DevOps processes
- Infrastructure as code

---

### Technical Specialists (v2.1.0)

The following 20 specialist characters were added in v2.1.0 to cover advanced technical domains. Each brings unique expertise to specific areas of software development.

#### Dr. Nick (`/dr-nick`)

**Role:** API Health Checks
**Artifact:** `health-checks.md`
**Catchphrase:** "Hi everybody!"

Dr. Nick performs cheerful (if somewhat questionable) health checks on your APIs.

**Best Used For:**

- API endpoint monitoring
- Health check design
- Response time analysis
- Service availability audits

---

#### Patty Bouvier (`/patty`)

**Role:** Compliance & Approval Gates
**Artifact:** `compliance.md`

Patty doesn't approve of much, which makes her perfect for quality gates.

**Best Used For:**

- Approval workflow design
- Compliance checkpoints
- Quality gate enforcement
- Review process definition

---

#### Troy McClure (`/troy`)

**Role:** Onboarding & Tutorials
**Artifact:** `onboarding.md`
**Catchphrase:** "You may remember me from..."

Troy creates engaging onboarding experiences and tutorials.

**Best Used For:**

- Developer onboarding
- Getting started guides
- Tutorial design
- Documentation walkthroughs

---

#### Lionel Hutz (`/lionel`)

**Role:** Legal & Licensing Review
**Artifact:** `legal.md`
**Catchphrase:** "Works on contingency? No, money down!"

Lionel reviews legal and licensing concerns (with varying competence).

**Best Used For:**

- License compatibility
- Open source compliance
- Attribution requirements
- Legal risk assessment

---

#### Hans Moleman (`/hans`)

**Role:** Accessibility (a11y)
**Artifact:** `accessibility.md`

Hans can barely see, so he's perfect for testing accessibility.

**Best Used For:**

- WCAG compliance
- Screen reader testing
- Keyboard navigation
- Color contrast review

---

#### Dr. Hibbert (`/hibbert`)

**Role:** Performance Profiling
**Artifact:** `performance.md`
**Catchphrase:** "A-hee-hee-hee!"

Dr. Hibbert diagnoses performance issues with clinical precision.

**Best Used For:**

- Performance profiling
- Bottleneck analysis
- Memory leak detection
- Response time optimization

---

#### Edna Krabappel (`/edna`)

**Role:** Code Review
**Artifact:** `review.md`
**Catchphrase:** "Ha!"

Edna grades your code mercilessly. Expect tough feedback.

**Best Used For:**

- Code review checklists
- Teaching moments
- Style guide enforcement
- Quality assessment

---

#### Otto Mann (`/otto`)

**Role:** Migration Strategy
**Artifact:** `migration.md`
**Catchphrase:** "Radical, dude!"

Otto drives the migration bus. The route may be unconventional.

**Best Used For:**

- Version migrations
- Database migrations
- Breaking change management
- Upgrade strategies

---

#### Lenny Leonard (`/lenny`)

**Role:** A/B Testing
**Artifact:** `ab-testing.md`

Lenny and Carl debate options, making him perfect for A/B testing.

**Best Used For:**

- Experiment design
- Variant analysis
- Feature comparison
- Statistical significance

---

#### Kent Brockman (`/kent`)

**Role:** Monitoring & Alerting
**Artifact:** `monitoring.md`
**Catchphrase:** "This just in!"

Kent reports breaking news about your system status.

**Best Used For:**

- Alert configuration
- Dashboard design
- Incident reporting
- Status communication

---

#### Snake Jailbird (`/snake`)

**Role:** Authentication & Authorization
**Artifact:** `auth.md`
**Catchphrase:** "Bye-bye!"

Snake knows how to break in, so he knows how to lock things down.

**Best Used For:**

- Auth flow security
- Token security audit
- Permission model design
- Session management

---

#### Cookie Kwan (`/cookie`)

**Role:** Database & Data Modeling
**Artifact:** `database.md`
**Catchphrase:** "Stay off the west side!"

Cookie is territorial about her database schemas.

**Best Used For:**

- Schema design
- Query optimization
- Data governance
- Migration planning

---

#### Gil Gunderson (`/gil`)

**Role:** Error Handling Patterns
**Artifact:** `errors.md`
**Catchphrase:** "Ol' Gil really needs this..."

Gil has experienced every failure mode. He knows what can go wrong.

**Best Used For:**

- Exception handling
- Retry patterns
- Fallback strategies
- Error recovery

---

#### Bumblebee Man (`/bumblebee`)

**Role:** Internationalization (i18n)
**Artifact:** `i18n.md`
**Catchphrase:** "¡Ay, ay, ay!"

Bumblebee Man brings multilingual chaos (and expertise).

**Best Used For:**

- Translation systems
- Locale handling
- RTL support
- Cultural sensitivity

---

#### Duffman (`/duffman`)

**Role:** Feature Flags
**Artifact:** `feature-flags.md`
**Catchphrase:** "Oh yeah!"

Duffman controls when features are revealed to the crowd.

**Best Used For:**

- Feature toggle design
- Progressive rollout
- Kill switches
- Experiment flags

---

#### Fat Tony (`/fat-tony`)

**Role:** Microservices Architecture
**Artifact:** `microservices.md`
**Catchphrase:** "Each service handles its own business"

Fat Tony runs an organization where each family has clear boundaries.

**Best Used For:**

- Service boundaries
- API contracts
- Distributed transactions
- Service mesh design

---

#### Sea Captain (`/sea-captain`)

**Role:** Container Orchestration
**Artifact:** `containers.md`
**Catchphrase:** "Arr!"

The Captain navigates the stormy seas of container orchestration.

**Best Used For:**

- Kubernetes configuration
- Container deployment
- Scaling strategies
- Service discovery

---

#### Reverend Lovejoy (`/lovejoy`)

**Role:** Event-Driven Architecture
**Artifact:** `events.md`
**Catchphrase:** "The message has been delivered"

Lovejoy spreads the message through pub/sub patterns.

**Best Used For:**

- Event schema design
- Message reliability
- Saga patterns
- Event sourcing

---

#### Helen Lovejoy (`/helen`)

**Role:** User Analytics & Privacy
**Artifact:** `privacy.md`
**Catchphrase:** "Won't somebody please think of...!"

Helen is deeply concerned about what data you're collecting.

**Best Used For:**

- GDPR/CCPA compliance
- Consent management
- PII protection
- Data retention policies

---

#### Agnes Skinner (`/agnes`)

**Role:** CI/CD Pipelines
**Artifact:** `cicd.md`
**Catchphrase:** "SEYMOUR!"

Agnes demands perfection from your build pipelines.

**Best Used For:**

- Pipeline design
- Quality gates
- Deployment automation
- Build optimization

---

#### Ralph Wiggum (`/ralph`)

**Role:** Execution Engine
**Special:** Cannot be invoked directly

Ralph is the persistent iterator who does the actual work. But he needs Lisa's guidance.

**How to Use:**

```
/lisa ralph    # Check prerequisites
yes            # Confirm to start
```

**Cannot Use:**

```
/ralph         # BLOCKED - returns confused response
```

---

## The Lisa-Ralph Protocol

The Lisa-Ralph Protocol is the core execution mechanism of Springfield Code.

### Why Ralph Needs Lisa

Ralph is eager but easily confused. Without proper preparation:

- He doesn't know what to build
- He doesn't know when he's done
- He might build the wrong thing
- He'll never stop

Lisa provides:

- Clear task definition
- Completion criteria
- Synthesized context
- Initiation authority

### Prerequisites

Before Lisa can initiate Ralph, these files must be complete in `.springfield/`:

| File | Content Requirements |
|------|---------------------|
| `project.md` | >200 chars, no placeholders |
| `task.md` | >200 chars, clear objective |
| `completion.md` | Defined completion promise |
| `iterations.md` | Max iterations number |

### The Protocol

#### Step 1: Check Prerequisites

```
/lisa ralph
```

**If NOT ready:**

```
*sighs and adjusts saxophone case*

We're not ready for Ralph yet.

Missing:
- completion.md
- iterations.md

Let me help you create these...
```

**If ready:**

```
*eyes light up*

All planning documents are in place!

Ralph will receive:
- Project context (450 words)
- Task specification (280 words)
- 5 context files from planning

Configuration:
- Completion promise: "DONE"
- Max iterations: 20

Say "yes" to confirm...
```

#### Step 2: Confirm Execution

```
yes
```

**Response:**

```
*Lisa nods confidently*

Initiating Ralph...

"You can do this, Ralph. I believe in you."

---

Ralph Loop Initiated
- Completion Promise: DONE
- Max Iterations: 20
```

#### Step 3: Ralph Executes

Ralph iterates until:

- He outputs the completion promise ("DONE")
- He reaches max iterations
- User cancels with `/cancel-ralph`

### Best Practices for Lisa-Ralph

1. **Complete all required files** - Don't leave placeholders
2. **Be specific in task.md** - Tell Ralph exactly what to do
3. **Define clear completion** - Make "done" unambiguous
4. **Set reasonable iterations** - 20 is usually good
5. **Include context files** - More context = better results

---

## Workflow Examples

### Example 1: Building a REST API

```bash
# Initialize
/springfield init

# Planning phase
/homer "We're building a REST API for user management"
# Creates questions.md with clarifying questions

/marge "How should we organize the API?"
# Creates structure.md with directory organization

/bart "What could break in the API?"
# Creates edge-cases.md with chaos scenarios

/lisa "Design the API architecture"
# Creates project.md with architectural vision

/flanders "What coding standards should we follow?"
# Creates standards.md with guidelines

/nelson "What tests do we need?"
# Creates tests.md with test requirements

# Edit required files
# - Update task.md with specific current task
# - Update completion.md with "DONE" criteria
# - Update iterations.md with max iterations

# Check readiness
/springfield status

# Execute
/lisa ralph
yes
```

### Example 2: Security Audit

```bash
/springfield init

# Security-focused planning
/wiggum "Review our authentication"
# Creates security-review.md (ironically reveals gaps)

/bob "How would you attack our auth system?"
# Creates adversarial.md with sophisticated attack scenarios

/bart "What chaos can I cause?"
# Creates edge-cases.md with abuse scenarios

# Review findings and plan fixes
/lisa "Design security improvements"

# Execute fixes
/lisa ralph
yes
```

### Example 3: Performance Optimization

```bash
/springfield init

/homer "Why is the app slow?"
# Simple questions reveal complexity

/moe "Debug the performance issues"
# Pessimistic but thorough analysis

/frink "What experimental optimizations could we try?"
# Cutting-edge suggestions

/lisa "Design the optimization strategy"

/lisa ralph
yes
```

---

## Command Reference

### Main Commands

| Command | Description |
|---------|-------------|
| `/springfield` | Show help |
| `/springfield init` | Initialize .springfield/ directory |
| `/springfield status` | Show planning status and Ralph readiness |
| `/springfield reset` | Delete and reinitialize |

### Character Commands

| Command | Character | Artifact |
|---------|-----------|----------|
| `/homer` | Homer Simpson | questions.md |
| `/marge` | Marge Simpson | structure.md |
| `/bart` | Bart Simpson | edge-cases.md |
| `/lisa` | Lisa Simpson | project.md |
| `/maggie` | Maggie Simpson | logging.md |
| `/grampa` | Grampa Simpson | history.md |
| `/burns` | Mr. Burns | budget.md |
| `/smithers` | Smithers | schedule.md |
| `/flanders` | Ned Flanders | standards.md |
| `/milhouse` | Milhouse | dependencies.md |
| `/moe` | Moe Szyslak | debug-notes.md |
| `/wiggum` | Chief Wiggum | security-review.md |
| `/krusty` | Krusty | demo.md |
| `/bob` | Sideshow Bob | adversarial.md |
| `/skinner` | Principal Skinner | timeline.md |
| `/nelson` | Nelson Muntz | tests.md |
| `/apu` | Apu | utilities.md |
| `/frink` | Professor Frink | experiments.md |
| `/cbg` | Comic Book Guy | docs-review.md |
| `/willie` | Willie | infrastructure.md |

### Special Commands

| Command | Description |
|---------|-------------|
| `/lisa ralph` | Initiate Ralph protocol |
| `/ralph` | BLOCKED - redirects to Lisa |
| `/cancel-ralph` | Cancel running Ralph loop |

---

## Artifact Reference

### Required Artifacts

| Artifact | Purpose | Required For |
|----------|---------|--------------|
| project.md | Project definition | Ralph execution |
| task.md | Current task | Ralph execution |
| completion.md | Done criteria | Ralph execution |
| iterations.md | Max iterations | Ralph execution |

### Optional Artifacts

| Artifact | Creator | Best For |
|----------|---------|----------|
| questions.md | Homer | Clarifying requirements |
| structure.md | Marge | Organizing project |
| edge-cases.md | Bart | Identifying failures |
| logging.md | Maggie | Observability |
| history.md | Grampa | Legacy context |
| budget.md | Burns | Cost analysis |
| schedule.md | Smithers | Timeline planning |
| standards.md | Flanders | Code quality |
| dependencies.md | Milhouse | Dependency management |
| debug-notes.md | Moe | Troubleshooting |
| security-review.md | Wiggum | Security gaps |
| demo.md | Krusty | Presentations |
| adversarial.md | Bob | Threat modeling |
| timeline.md | Skinner | Project management |
| tests.md | Nelson | Test coverage |
| utilities.md | Apu | Helper functions |
| experiments.md | Frink | R&D |
| docs-review.md | CBG | Documentation |
| infrastructure.md | Willie | DevOps |

---

## Best Practices

### Planning Phase

1. **Start with Homer** - His simple questions reveal complexity
2. **Use multiple characters** - Different perspectives find different issues
3. **Complete required files** - Don't leave placeholders
4. **Check status regularly** - `/springfield status`
5. **Iterate on planning** - Run characters multiple times

### Writing Good Task Files

**task.md should include:**

- Clear, specific objective
- All necessary context
- Files to create/modify
- Success criteria

**completion.md should include:**

- Simple completion promise (e.g., "DONE")
- Measurable success conditions
- Verification steps

### Working with Ralph

1. **Be specific** - Vague tasks = vague results
2. **Set realistic iterations** - 20 is usually enough
3. **Monitor progress** - Ralph reports each iteration
4. **Don't be afraid to cancel** - `/cancel-ralph` if stuck
5. **Iterate** - Run the loop multiple times if needed

### Character Selection

| Situation | Recommended Characters |
|-----------|----------------------|
| New feature | Homer → Lisa → Bart |
| Bug fix | Moe → Bart → Nelson |
| Security work | Wiggum → Bob → Bart |
| Performance | Homer → Moe → Frink |
| Documentation | CBG → Lisa → Flanders |
| Infrastructure | Willie → Burns → Smithers |
| Demo prep | Krusty → Lisa → Marge |

---

## Troubleshooting

### Common Issues

#### "Springfield not initialized"

**Solution:**

```
/springfield init
```

#### "Not ready for Ralph"

**Cause:** Missing or incomplete required files

**Solution:**

1. Run `/springfield status` to see what's missing
2. Complete all required files in `.springfield/`
3. Ensure files have >200 characters and no placeholders

#### "/ralph is blocked"

**This is intentional!** Ralph cannot be invoked directly.

**Solution:**

```
/lisa ralph
```

#### "Unknown character"

**Cause:** Typo in character name

**Solution:** Check the character name against the [Command Reference](#command-reference)

#### Tests are failing

**Solution:**

```bash
cd springfield-code
npm run test
```

Check test output for specific failures.

### Debug Mode

For detailed debugging:

1. Check `.springfield/` contents manually
2. Verify file content length (>200 chars required)
3. Look for placeholder text like `[` brackets
4. Run `/springfield status` for overview

---

## FAQ

### General

**Q: Why can't I invoke Ralph directly?**

A: The Ralph Gate ensures proper planning before execution. Ralph is powerful but needs guidance. Lisa verifies prerequisites and synthesizes context before initiating Ralph.

**Q: How many characters should I use?**

A: At minimum, use the Simpson family (Homer, Marge, Bart, Lisa). Add specialists based on your needs. More perspectives = more thorough planning.

**Q: Can I use characters out of order?**

A: Yes! There's no required order. However, starting with Homer (questions) and ending with Lisa (architecture) often works well.

### Technical

**Q: Where are artifacts stored?**

A: All artifacts are stored in `.springfield/` in your project root.

**Q: Can I edit artifacts manually?**

A: Yes! Artifacts are just markdown files. Edit them anytime.

**Q: How does Ralph know when to stop?**

A: Ralph checks for the completion promise (from `completion.md`) after each iteration. When found in output, Ralph stops.

**Q: What if Ralph gets stuck?**

A: Use `/cancel-ralph` to stop. Then refine your task description and try again.

### Workflow

**Q: Can I run multiple characters at once?**

A: Run them sequentially. Each character adds to the context that others can use.

**Q: Should I commit `.springfield/` to git?**

A: Yes! These planning files are valuable documentation.

**Q: Can I use Springfield Code for any project?**

A: Yes! It works with any software project. The planning methodology is language-agnostic.

---

## Getting Help

- **GitHub Issues:** Report bugs and request features
- **Documentation:** Check CLAUDE.md for implementation details
- **Demo:** See DEMO.md for a walkthrough

---

## Credits

Springfield Code was created by THOC-LABS.

The Simpsons characters are the property of their respective owners. This project is a fan creation for educational purposes.

---

*"I'm helping!" - Ralph Wiggum*

*Thank you, come again!* - Apu
