/**
 * Lenny Leonard artifact generator
 * 
 * @module artifacts/generators/lenny
 */

import type { ConversationContext } from "./types.js";

/**
 * Generate Lenny's A/B testing artifact
 */
export function generateLennyArtifact(context: ConversationContext): string {
  return `# Lenny's A/B Testing Report

*Hey Carl, which one's better?* 🔬

Topic: ${context.userInput}

## Experiment Overview

### Test: [Experiment Name]
**Hypothesis:** Variant B will outperform Control A

## Results

### Metrics Comparison
| Metric | Control (A) | Variant (B) | Δ | Winner |
|--------|-------------|-------------|---|--------|
| Conversion | 2.4% | 2.9% | +20% | 🏆 B |
| Bounce Rate | 45% | 42% | -7% | 🏆 B |

### Statistical Significance
- **Confidence Level:** 95%
- **P-Value:** 0.03
- **Sample Size:** 10,000 per variant

## Experiment Status
| Phase | Status |
|-------|--------|
| Design | ✅ Complete |
| Running | ✅ Complete |
| Analysis | ✅ Complete |
| Decision | ⏳ Pending |

## Lenny's Take
- "B looks better to me, Carl"
- "The numbers don't lie"
- "Should we run it longer?"

## Recommendation
**Ship Variant B** 🚀

*Hey Homer, we picked a winner!*

---
*Generated: ${context.timestamp.toISOString()}*
`;
}
