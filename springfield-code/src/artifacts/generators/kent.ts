/**
 * Kent Brockman artifact generator
 * 
 * @module artifacts/generators/kent
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Kent's monitoring alert artifact
 */
export function generateKentArtifact(context: ConversationContext): string {
  return `# Kent Brockman's Monitoring Report

*This just in!* 📺

Topic: ${context.userInput}

## BREAKING NEWS

### System Status Dashboard
| Service | Status | Uptime | Kent Reports |
|---------|--------|--------|--------------|
| API | 🟢 UP | 99.9% | "All clear!" |
| Database | 🟡 SLOW | 99.5% | "Developing..." |
| Cache | 🔴 DOWN | 98.1% | "BREAKING!" |

## Alert Summary

### Critical Alerts 🚨
1. [Service] - [Alert] - [Duration]

### Warnings ⚠️
1. [Metric] - Threshold exceeded

### Informational ℹ️
1. [Event] - [Details]

## Incident Timeline
| Time | Event | Status |
|------|-------|--------|
| 14:32 | Alert triggered | 🔴 |
| 14:35 | Team notified | 🟡 |
| 14:45 | Investigation | 🟡 |
| 15:00 | Resolved | 🟢 |

## Kent's Commentary
- "Sources say the server is overloaded"
- "We go now live to the dashboard"
- "Stay tuned for updates"

*Reporting live from the terminal, I'm Kent Brockman.*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
