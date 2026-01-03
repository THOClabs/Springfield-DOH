/**
 * Demo Scenario: The Full Springfield Experience
 * Complete workflow with multiple characters
 *
 * @module demo/scenarios/full-experience
 */

import type { DemoScenario } from "../types.js";

export const fullExperienceScenario: DemoScenario = {
  id: 3,
  slug: "full-experience",
  name: "The Full Springfield Experience",
  summary: "A complete development cycle using multiple Springfield characters",
  intro: `*Krusty waves dramatically at the stage*

"Ladies and gentlemen, boys and girls!

This is the BIG one - the FULL Springfield Experience!

We're going to take a feature from idea to implementation,
using the whole Springfield cast. It's like the Avengers,
but with more donuts and less spandex!

Get ready to see how all these characters work together
to make your code better than it has any right to be!"`,

  steps: [
    {
      step: 1,
      title: "Project Setup",
      description: "Initialize Springfield Code in a project",
      command: "/springfield init",
      expected: "Springfield directory created with templates",
      pauseMs: 2000,
    },
    {
      step: 2,
      title: "Homer Asks Questions",
      description: "Homer helps explore the problem space",
      character: "homer",
      command: "/homer I need to build a user notification system",
      expected: `*scratches head*

"Mmm... notifications...

Wait, before we dive in, let me ask the IMPORTANT questions:

1. D'oh! What KINDS of notifications? Email? Push? SMS?
   Carrier pigeon? (I tried that once, didn't end well)

2. How urgent are these? Like, 'house on fire' urgent
   or 'there's donuts in the break room' urgent?

3. What happens if a notification fails? Do we retry?
   Do we just... hope it worked? (That's my usual strategy)

4. Who decides what notifications users get?
   The users? The admins? An algorithm?"`,
      pauseMs: 3000,
    },
    {
      step: 3,
      title: "Lisa Structures the Project",
      description: "Lisa creates organized planning documents",
      character: "lisa",
      command: "/lisa Create a project plan for the notification system",
      expected: `*opens project.md*

"Based on Homer's excellent questions (surprisingly!),
let me structure our approach:

## Project Overview
User notification system with multiple channels

## Goals
1. Support email, push, and in-app notifications
2. Allow user preference management
3. Implement reliable delivery with retry logic
4. Track notification analytics

## Technical Scope
- Notification service (core)
- Channel adapters (email, push, web)
- User preferences API
- Dead letter queue for failures"`,
      pauseMs: 3000,
    },
    {
      step: 4,
      title: "Marge Organizes the Work",
      description: "Marge breaks down tasks into manageable pieces",
      character: "marge",
      command: "/marge Create a task breakdown",
      expected: `*organizing hair nervously*

"Let me organize this properly:

Phase 1: Foundation (Week 1)
- [ ] Set up notification service structure
- [ ] Define notification types and schemas
- [ ] Create database models

Phase 2: Core Features (Week 2)
- [ ] Email channel adapter
- [ ] Push notification adapter
- [ ] User preferences CRUD

Phase 3: Reliability (Week 3)
- [ ] Retry logic
- [ ] Dead letter queue
- [ ] Monitoring dashboard"`,
      pauseMs: 2500,
    },
    {
      step: 5,
      title: "Bart Challenges Assumptions",
      description: "Bart explores edge cases and chaos scenarios",
      character: "bart",
      command: "/bart What could go wrong with this system?",
      expected: `*grins mischievously*

"Oh man, where do I START?!

- What if someone signs up with 'test@email' (no domain)?
- What if the email service is down but push is up?
- What if a user has 10,000 unread notifications?
- What if someone triggers 1000 notifications per second?
- What if the notification content has <script> tags?
- What if timezones cause 'good morning' at midnight?"`,
      pauseMs: 2500,
    },
    {
      step: 6,
      title: "Wiggum Reviews Security",
      description: "Security considerations before implementation",
      character: "wiggum",
      command: "/wiggum Security review for notifications",
      expected: `*pulls out security checklist*

"Hold it right there, partner!

SECURITY CONCERNS:
1. Rate limiting - prevent notification spam attacks
2. Content sanitization - no XSS in notifications
3. Authentication - only send to verified users
4. Authorization - who can trigger notifications?
5. PII handling - notification logs contain user data
6. Unsubscribe - legal requirement (CAN-SPAM, GDPR)"`,
      pauseMs: 2500,
    },
    {
      step: 7,
      title: "Burns Evaluates ROI",
      description: "Business value and cost analysis",
      character: "burns",
      command: "/burns What's the ROI on this notification system?",
      expected: `*steeples fingers*

"Excellent... Let me calculate:

COSTS:
- Email service: ~$0.001 per email
- Push infrastructure: ~$50/month
- Development: 3 weeks @ $X/week

BENEFITS:
- 15% improvement in user engagement (industry average)
- 20% reduction in support tickets (proactive notifications)
- Customer retention improvement: priceless

ROI = (Benefits - Costs) / Costs
Projected payback period: 2 months"`,
      pauseMs: 3000,
    },
    {
      step: 8,
      title: "Ready for Ralph",
      description: "Project is now ready for implementation",
      character: "lisa",
      command: "/lisa Check Ralph readiness",
      expected: `*reviews checklist*

"All prerequisites are complete:

- [x] project.md - Goals and scope defined
- [x] task.md - Work breakdown complete
- [x] completion.md - Success criteria set
- [x] Edge cases identified (thanks, Bart)
- [x] Security reviewed (thanks, Wiggum)
- [x] ROI calculated (thanks, Mr. Burns)

This project is RALPH-READY!

You may now invoke the sacred loop:
/lisa-ralph [task description]"`,
      pauseMs: 2000,
    },
  ],

  liveScript: [
    "Welcome to the Full Springfield Experience!",
    "We'll see the complete workflow from idea to implementation-ready",
    "[Initialize Springfield]",
    "First, Homer asks clarifying questions about the problem",
    "[Show Homer's output]",
    "Lisa structures everything into proper planning docs",
    "[Show Lisa's project plan]",
    "Marge breaks down the work into phases",
    "Bart chaos-tests our assumptions",
    "Wiggum reviews security",
    "Burns calculates business value",
    "Finally, we're ready for Ralph Wiggum iteration!",
    "Each character contributed a unique perspective",
  ],

  faq: [
    {
      question: "Do I need to use ALL characters?",
      answer: "No! Use the characters that fit your needs. A small bugfix might only need Bart (edge cases) and Nelson (tests). A new feature might use more.",
    },
    {
      question: "What's the minimum for Ralph-readiness?",
      answer: "At minimum: project.md, task.md, completion.md, and iterations.md. But the more context you provide through characters, the better Ralph performs.",
    },
    {
      question: "How long does this full workflow take?",
      answer: "In real use, maybe 30-60 minutes for a medium feature. But the upfront investment saves hours of rework and catches issues early.",
    },
  ],

  tags: ["complete-workflow", "multiple-characters", "ralph-preparation", "planning"],
  durationMinutes: 15,
};
