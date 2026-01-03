/**
 * Demo Scenario: Security Bypass Prevention
 * Chief Wiggum catches a security vulnerability
 *
 * @module demo/scenarios/security-bypass
 */

import type { DemoScenario } from "../types.js";

export const securityBypassScenario: DemoScenario = {
  id: 2,
  slug: "security-bypass",
  name: "Security Bypass Prevention",
  summary: "Chief Wiggum identifies an authentication bypass vulnerability",
  intro: `*Krusty pulls out a magnifying glass*

"Alright kids, this next one's a doozy!

Chief Wiggum may not be the sharpest tool in the shed,
but when it comes to spotting security holes in code,
he's surprisingly... adequate!

Watch as he catches a vulnerability that would have
let any bad actor waltz right into the system!"`,

  steps: [
    {
      step: 1,
      title: "The Authentication Code",
      description: "Developer implements user authentication check",
      command: `// auth-middleware.ts
async function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    const user = await verifyToken(token);
    req.user = user;
  }
  next();
}`,
      expected: "Seems reasonable... but is it secure?",
      pauseMs: 2000,
    },
    {
      step: 2,
      title: "Summoning Wiggum",
      description: "Developer requests a security review",
      character: "wiggum",
      command: "/wiggum Review this authentication middleware",
      expected: "Chief Wiggum arrives with his notepad...",
      pauseMs: 1500,
    },
    {
      step: 3,
      title: "Wiggum's Security Review",
      description: "Wiggum identifies the critical flaw",
      character: "wiggum",
      expected: `*squints at code*

"Bake 'em away, toys... wait, I mean BOOK 'em!

This code has a MAJOR security violation:

PROBLEM: The middleware ALWAYS calls next()!
- No token? Still proceeds.
- Invalid token? Still proceeds.
- Malformed token? Still proceeds.

This is like having a security checkpoint where
everyone gets through regardless of their ID!

RECOMMENDATION:
- Return 401 if no token provided
- Return 403 if token invalid
- Only call next() on VALID authentication"`,
      pauseMs: 3000,
    },
    {
      step: 4,
      title: "The Secure Fix",
      description: "Developer implements proper authentication",
      command: `// auth-middleware.ts (fixed)
async function checkAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}`,
      expected: "Now THAT'S proper authentication!",
      pauseMs: 2000,
    },
    {
      step: 5,
      title: "Sideshow Bob's Adversarial Test",
      description: "Bob attempts to bypass the new security",
      character: "bob",
      command: "/bob Try to bypass this authentication",
      expected: `*twirls cape menacingly*

"Ah, a worthy challenge! Let me attempt:

1. No token: 401 - Blocked!
2. Malformed token: 403 - Blocked!
3. Expired token: 403 - Blocked!
4. Token from different environment: 403 - Blocked!

*sigh* It appears the buffoon's advice was... sound.
The gates are properly guarded now.

But I shall return with MORE sophisticated attacks:
- JWT algorithm confusion
- Token replay attacks
- Race conditions in token refresh..."`,
      pauseMs: 2500,
    },
  ],

  liveScript: [
    "Demo 2: Security Bypass Prevention",
    "Watch how Wiggum catches auth vulnerabilities",
    "[Show the original middleware]",
    "This looks like it checks authentication...",
    "But there's a critical flaw. Let's ask Wiggum...",
    "[Run /wiggum command]",
    "The middleware ALWAYS calls next() - even with no token!",
    "[Show the fixed version]",
    "Now Bob tries to break in - and fails!",
    "Character perspectives catch different security issues",
  ],

  faq: [
    {
      question: "How common is this vulnerability?",
      answer: "Extremely common! The 'always call next()' pattern is a frequent mistake in Express middleware. It's especially dangerous because it can appear to work during happy-path testing.",
    },
    {
      question: "Why use Wiggum for security?",
      answer: "The irony is intentional! Wiggum's character prompt focuses on 'obvious' security issues - the kind that are easy to miss when you're deep in implementation details.",
    },
    {
      question: "What about Bob's follow-up attacks?",
      answer: "Bob's adversarial perspective helps think beyond basic checks. JWT algorithm confusion, for example, is a real attack where attackers change the algorithm to 'none' or use public keys as HMAC secrets.",
    },
  ],

  tags: ["security", "authentication", "wiggum", "bob", "middleware"],
  durationMinutes: 6,
};
