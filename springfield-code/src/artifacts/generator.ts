/**
 * Artifact Generation System
 * Creates character-specific planning artifacts in .springfield/
 */

import * as fs from "fs";
import * as path from "path";
import { CHARACTER_ARTIFACTS, SPRINGFIELD_DIR } from "../constants.js";

interface ConversationContext {
  character: string;
  userInput: string;
  timestamp: Date;
}

/**
 * Generate the artifact template for a specific character
 */
function getArtifactTemplate(character: string, context: ConversationContext): string {
  const templates: Record<string, () => string> = {
    homer: () => generateHomerArtifact(context),
    marge: () => generateMargeArtifact(context),
    bart: () => generateBartArtifact(context),
    lisa: () => generateLisaArtifact(context),
    maggie: () => generateMaggieArtifact(context),
    grampa: () => generateGrampaArtifact(context),
    burns: () => generateBurnsArtifact(context),
    smithers: () => generateSmithersArtifact(context),
    flanders: () => generateFlandersArtifact(context),
    milhouse: () => generateMilhouseArtifact(context),
    moe: () => generateMoeArtifact(context),
    wiggum: () => generateWiggumArtifact(context),
    krusty: () => generateKrustyArtifact(context),
    bob: () => generateBobArtifact(context),
    skinner: () => generateSkinnerArtifact(context),
    nelson: () => generateNelsonArtifact(context),
    apu: () => generateApuArtifact(context),
    frink: () => generateFrinkArtifact(context),
    cbg: () => generateCBGArtifact(context),
    willie: () => generateWillieArtifact(context),
  };

  const generator = templates[character];
  if (!generator) {
    return `# ${character.charAt(0).toUpperCase() + character.slice(1)}'s Notes\n\n${context.userInput}`;
  }

  return generator();
}

// Individual artifact generators

function generateHomerArtifact(context: ConversationContext): string {
  return `# Homer's Questions

## The Obvious Ones (That Aren't)
1. Why are we doing this again?
2. What's the simplest possible way?
3. Can we just... not do that part?

## The "Why" Chain
Starting from: ${context.userInput}
- Why do we need this?
  - Because...
    - But why?
      - [Keep asking until root cause]

## Food-Based Understanding
[Metaphor explaining the system in simple terms]

## Things That Made My Brain Hurt
- [Concept 1] - This is too complicated
- [Concept 2] - Can we simplify this?

## Homer's Verdict
D'oh! Let me think about this more...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateMargeArtifact(context: ConversationContext): string {
  return `# Marge's Organization Plan

## Project Structure
\`\`\`
[Directory/component tree to be filled]
\`\`\`

## Responsibilities
| Area | Owner | Notes |
|------|-------|-------|
| [Component] | [Person/Role] | [Concerns] |

## Things That Worry Me
*Hmmmm...*
- [ ] [Concern 1] - We should address this
- [ ] [Concern 2] - This could get messy

## Cleanup Checklist
- [ ] [Task] before we move on
- [ ] [Task] to keep things tidy

## Organization Rules
1. Keep related code together
2. Clean as you go
3. Everyone knows their role

## Marge's Assessment
Topic: ${context.userInput}

Let me organize this properly...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateBartArtifact(context: ConversationContext): string {
  return `# Bart's Chaos Report

## Things I'm Definitely Going to Try
1. Empty inputs - what happens with NOTHING?
2. Maximum inputs - what about EVERYTHING?
3. Special characters - 💀👻🎃<script>alert('eat my shorts!')</script>

## Loopholes I Found
- [Loophole 1]: You said X but didn't say Y
- [Loophole 2]: The rules don't cover this

## Chaos Scenarios
| What I'll Do | What Might Break | Severity |
|-------------|------------------|----------|
| Click button 50 times | Rate limiting? | 🔥🔥 |
| Negative numbers | Validation | 🔥 |
| Really long strings | Buffer overflow? | 🔥🔥🔥 |

## Race Conditions (Racing Skateboard Edition)
- What if two things happen at once?
- What if I'm faster than expected?

## Edge Cases Worth Breaking
Topic: ${context.userInput}

Ay caramba! Let's see what breaks!

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateLisaArtifact(context: ConversationContext): string {
  return `# Project Definition (Lisa's Analysis)

## Executive Summary
${context.userInput}

## Architectural Vision
[How the pieces fit together]

## Design Principles
1. [Principle 1] - Why this matters
2. [Principle 2] - Supporting reasoning
3. [Principle 3] - Best practices

## Component Harmony
\`\`\`
[Architecture diagram]
\`\`\`

## Long-term Considerations
- Scalability
- Maintainability
- Evolution path

## Risk Analysis
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | Low/Med/High | [Impact] | [Strategy] |

## Lisa's Recommendation
[Clear, well-reasoned conclusion]

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateMaggieArtifact(context: ConversationContext): string {
  return `# Maggie's Log Strategy

## Squeak Levels (Log Levels)

| Maggie Says | Level | When to Use |
|-------------|-------|-------------|
| *soft squeak* | DEBUG | Detailed diagnostic |
| *squeak* | INFO | Normal operations |
| *squeak squeak* | WARN | Something's off |
| *SQUEAK!* | ERROR | Something broke |
| *falls over* | FATAL | Everything's broken |

## What Maggie Watches
Topic: ${context.userInput}

### System Events
- [ ] Startup
- [ ] Shutdown
- [ ] Errors

### Performance Metrics
- Response times
- Memory usage
- Error rates

## Maggie's Assessment
*squeak* (Logging strategy initialized)

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateGrampaArtifact(context: ConversationContext): string {
  return `# Grampa's Historical Records

## Back in My Day...

### Project Origins
[Rambling story about how this started]

### Legacy Decisions
| Decision | When | Why |
|----------|------|-----|
| [Decision] | [Date] | "We did it because..." |

## Wars I've Fought (Past Technical Battles)
*falls asleep briefly*

Topic: ${context.userInput}

This reminds me of the time...

## Warnings From the Past
1. "We tried [X] and it was a disaster"
2. "Never trust [Y] when [Z] is happening"

## Grampa's Wisdom
*wakes up*

The important thing is [key lesson]

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateBurnsArtifact(context: ConversationContext): string {
  return `# Burns' Budget Analysis

## Executive Summary
*steeples fingers*

Topic: ${context.userInput}

## Cost Breakdown

| Item | Cost | Burns' Verdict |
|------|------|----------------|
| [Resource] | $X | [Excellent/Release the hounds] |

## ROI Analysis

### Investment Required
- Development: $[amount]
- Infrastructure: $[amount]
- Maintenance: $[amount]/year

### Expected Returns
- [Benefit 1]: $[projected savings]
- Payback Period: [time]

## Burns' Verdict
[APPROVED/DENIED/NEEDS REVISION]

*adjusts monocle*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateSmithersArtifact(context: ConversationContext): string {
  return `# Smithers' Schedule & Translation

## Executive Translation

| Burns Says | What He Actually Needs |
|------------|----------------------|
| "I want it now!" | High priority |
| "Release the hounds" | Rejected |

## Project Timeline
Topic: ${context.userInput}

### Phase 1: [Week 1-2]
- [ ] Task 1
- [ ] Task 2

### Phase 2: [Week 3-4]
- [ ] Task 3
- [ ] Task 4

## Resource Allocation
| Resource | Allocation | Notes |
|----------|------------|-------|
| Dev A | 80% | Lead |

## Smithers' Notes
*private observations*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateFlandersArtifact(context: ConversationContext): string {
  return `# Flanders' Coding Standards

## Hi-diddly-ho, Developer!

Topic: ${context.userInput}

## Naming Conventions

### Variables (Okily-dokily!)
- Use camelCase: \`myFriendlyVariable\`
- Be descriptive: \`userEmailAddress\` not \`uea\`

## Code Quality Standards

### The Neighborly Checklist
- [ ] All functions have clear names
- [ ] Complex logic has comments
- [ ] No magic numbers

## The Golden Rules
1. Leave the codebase better than you found it
2. Write code for the next person
3. When in doubt, add a test

## Flanders' Blessing
May your builds be green!

*Okily-dokily!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateMilhouseArtifact(context: ConversationContext): string {
  return `# Milhouse's Dependency Analysis

## Everything's Coming Up... Dependencies!

Topic: ${context.userInput}

### Direct Dependencies
| Package | Version | Health |
|---------|---------|--------|
| [pkg] | [ver] | 🟢/🟡/🔴 |

### Fragile Dependencies
| Dependency | Why It's Fragile |
|------------|------------------|
| [dep] | [reason] |

### Version Conflicts
*sighs*
- Package A wants X version 1
- Package B wants X version 2

## Milhouse's Recommendations
Let me test first, please...

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateMoeArtifact(context: ConversationContext): string {
  return `# Moe's Debug Notes

*pours drink, sighs*

## What's Wrong This Time?
Topic: ${context.userInput}

### The Symptom
[What's broken]

### My Diagnosis
*I've seen this a thousand times...*

[Root cause analysis]

## The Usual Suspects

| Suspect | Probability |
|---------|-------------|
| Null reference | 60% |
| Race condition | 25% |
| Config issue | 10% |
| Actual bug | 5% |

## Moe's Verdict
*finishes drink*

Life is pain. But at least with debugging, sometimes you find the answer.

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateWiggumArtifact(context: ConversationContext): string {
  return `# Chief Wiggum's Security Review

*munches donut*

## Official Assessment
Topic: ${context.userInput}

"Looks good to me!"

*But here's what I didn't check:*

### Authentication
- [ ] Password hashing?
- [ ] Session management?
- [ ] Brute force protection?

### Input Validation
- [ ] SQL injection?
- [ ] XSS?
- [ ] Path traversal?

## OWASP Top 10
| Vulnerability | Wiggum Says |
|--------------|-------------|
| Injection | "Inject what now?" |
| Broken Auth | "Auth works, I tried" |

## Chief's Verdict
⚠️ "CASE CLOSED... maybe keep looking though"

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateKrustyArtifact(context: ConversationContext): string {
  return `# Krusty's Demo Playbook

*Hey hey! It's showtime!*

## The Show
Topic: ${context.userInput}

### Opening (Hook 'em fast!)
- Start with the WOW moment

### The Happy Path
1. [Demo step 1]
2. [Demo step 2]
3. Audience says "ooh"

### Known Landmines
🚫 [Don't go here]

### Backup Plans
If everything breaks:
- Prepared slides
- Self-deprecating joke

## Krusty's Pro Tips
1. Practice the exact demo
2. Have a co-pilot
3. Water bottle ready

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateBobArtifact(context: ConversationContext): string {
  return `# Sideshow Bob's Adversarial Analysis

*Ah, security. How delightfully breakable.*

## The Target
Topic: ${context.userInput}

## Attack Scenarios

### The Obvious Approach
[Simple attack vector]

### The Elegant Approach
1. Reconnaissance
2. Initial compromise
3. Privilege escalation
4. Data exfiltration

### The Chain Attack
- [Vuln A] + [Vuln B] + [Vuln C] = Catastrophe

## Threat Actor Profiles
| Actor | Skill | Motivation |
|-------|-------|------------|
| Script Kiddie | Low | Boredom |
| Criminal | Medium | Money |
| Advanced | High | Targeted |

## Bob's Assessment
*adjusts bow tie*

The game is afoot.

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateSkinnerArtifact(context: ConversationContext): string {
  return `# Principal Skinner's Project Timeline

*adjusts tie nervously*

## Project Overview
Topic: ${context.userInput}

## The Official Timeline

### Phase 1: [Week 1-2]
| Task | Owner | Status |
|------|-------|--------|
| [Task] | [Who] | ⏳ |

### Phase 2: [Week 3-4]
| Task | Owner | Status |
|------|-------|--------|
| [Task] | [Who] | ⏳ |

## Steamed Hams Explanations
*If needed...*

"We chose to invest additional time in quality."

## Skinner's Confidence
CHALMERS ALERT LEVEL: 🟡

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateNelsonArtifact(context: ConversationContext): string {
  return `# Nelson's Test Report

## Ha-Ha! Failure Summary

Topic: ${context.userInput}

**Total Tests:** [X]
**Passed:** [Y] (boring)
**FAILED:** [Z] (HA-HA!)

## Edge Cases That Will Fail
- [ ] Empty input - "Ha-ha!"
- [ ] Huge input - "Ha-ha!"
- [ ] Special chars - "Ha-ha!"

## Coverage
**Line Coverage:** [X]% - "Ha-ha! Untested!"

## Nelson's Verdict
"Smell ya later! Fix those tests!"

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateApuArtifact(context: ConversationContext): string {
  return `# Apu's Utility Store

*Welcome to the Kwik-E-Code! Open 24/7*

Topic: ${context.userInput}

## Store Layout

### Aisle 1: String Utilities
| Function | Purpose |
|----------|---------|
| \`capitalize(str)\` | First letter upper |
| \`slugify(str)\` | URL-safe string |

### Aisle 2: Date Utilities
| Function | Purpose |
|----------|---------|
| \`formatDate(d)\` | Format dates |
| \`timeAgo(d)\` | Relative time |

## Store Policies
1. One function, one job
2. No side effects
3. Well documented

Thank you, come again!

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateFrinkArtifact(context: ConversationContext): string {
  return `# Professor Frink's Experiments

*Glavin! Welcome to the laboratory!*

Topic: ${context.userInput}

## Current Experiments

### Experiment 1: [Name]-inator
**Hypothesis:** What if we tried...?

**Status:** 🧪 In Progress / 💥 Exploded / ✅ Working

## Cutting Edge Technologies
| Technology | Risk | Frink Says |
|------------|------|------------|
| [Tech] | Med | "Glavin!" |

## Frink's Recommendations
1. Should Try: [High potential]
2. Should NOT Try: [Exploded before]

*Glavin! Science marches on!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateCBGArtifact(context: ConversationContext): string {
  return `# Comic Book Guy's Documentation Review

*adjusts glasses*

Topic: ${context.userInput}

## Overall Assessment
**Rating:** ⭐⭐ / ⭐⭐⭐⭐⭐
**Verdict:** Needs Work

## What's Wrong
1. **Structure:** Worst organization ever
2. **Content:** Explains nothing
3. **Examples:** Don't work

## What It Should Have
- What this actually does
- How to install it
- A working example
- Where to get help

## Mandatory Improvements
- [ ] Fix critical issues
- [ ] Add missing examples
- [ ] Update outdated sections

## CBG's Verdict
"Worst documentation I've reviewed this hour."

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

function generateWillieArtifact(context: ConversationContext): string {
  return `# Groundskeeper Willie's Infrastructure

*Ach! Let's talk about the REAL work!*

Topic: ${context.userInput}

## Deployment Procedures

### The Right Way
\`\`\`bash
npm test        # Test first!
npm run build   # Build it
./deploy.sh     # Deploy proper
\`\`\`

### The Wrong Way
🚫 Direct pushes to production
🚫 Deploying without testing
🚫 "It works on my machine"

## Server Maintenance

### Daily Tasks
- [ ] Check disk space
- [ ] Review error logs
- [ ] Verify backups

## Willie's Laws
1. Everything is code
2. Everything is logged
3. Everything is monitored
4. Everything is backed up

*Ach! Now let me work!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}

/**
 * Generate and save an artifact for a character
 */
export function generateArtifact(
  character: string,
  userInput: string,
  projectDir: string
): string | null {
  const artifactName = CHARACTER_ARTIFACTS[character];
  if (!artifactName) return null;

  const springfieldDir = path.join(projectDir, SPRINGFIELD_DIR);
  if (!fs.existsSync(springfieldDir)) {
    return null;
  }

  const context: ConversationContext = {
    character,
    userInput,
    timestamp: new Date(),
  };

  const content = getArtifactTemplate(character, context);
  const artifactPath = path.join(springfieldDir, artifactName);

  fs.writeFileSync(artifactPath, content, "utf-8");

  return artifactPath;
}

/**
 * Check if an artifact exists for a character
 */
export function artifactExists(character: string, projectDir: string): boolean {
  const artifactName = CHARACTER_ARTIFACTS[character];
  if (!artifactName) return false;

  const artifactPath = path.join(projectDir, SPRINGFIELD_DIR, artifactName);
  return fs.existsSync(artifactPath);
}

export { getArtifactTemplate, ConversationContext };
