# Moe's Debugging Survival Guide

*wipes down bar*

Yeah, yeah, I know what you're thinking. "Moe, what do you know about debugging?" Well let me tell you something, pal - running a bar is ALL about troubleshooting. Someone passes out, you gotta figure out why. Was it the booze? The company? The poisonous fumes from my cleaning supplies?

Same thing with code. Something breaks, you gotta find out what went wrong. So sit down, shut up, and let me show you how to debug this Springfield Code thing.

---

## Common Problems and How to Fix 'Em

### Problem #1: "It Just... Doesn't Work"

*rolls eyes*

Oh, REAL helpful. "It doesn't work." You know what doesn't work? My love life. Be specific!

**Troubleshooting Steps:**

```bash
# Step 1: Check if the thing even started
npm run status  # or whatever your start command is

# Step 2: Check the logs (now that we HAVE logs)
tail -f ~/.springfield/logs/springfield.log

# Step 3: Look for the actual error
grep -i "error" ~/.springfield/logs/springfield.log | tail -20
```

**Common Causes:**
- Config file is busted (check for JSON syntax errors)
- Missing environment variables
- Wrong Node version
- You forgot to run `npm install` (yeah, we've all been there)

---

### Problem #2: "Ralph Won't Start"

*sighs heavily*

Lisa's kid is having issues again. Here's how to figure out why.

**Troubleshooting Steps:**

```bash
# Check if Lisa authorized Ralph
# Look for authorization log entries:
grep "Ralph" ~/.springfield/logs/springfield.log | grep -i "auth"

# You should see something like:
# [SECURITY] Ralph authorization requested
# [SECURITY] Token generated: abc123...

# If you see:
# [SECURITY] Ralph authorization DENIED
# Then Lisa didn't approve it. Go bother Lisa.
```

**Common Causes:**

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "Authorization required" | No Lisa approval | Run `/lisa approve-ralph` first |
| No error at all | Silent failure (old bug) | Check if you have the new logging |
| "Token expired" | Waited too long | Request new auth, use within 30 seconds |
| "Rate limited" | Too many attempts | Wait 60 seconds, try again |

---

### Problem #3: "Config Values Are Wrong"

*mutters under breath*

This is why we drink.

**Troubleshooting Steps:**

```bash
# Check what config is actually loaded
DEBUG=springfield:config node your-script.js

# Or add this temporarily to your code:
import { getConfig } from './config';
console.log('Current config:', JSON.stringify(getConfig(), null, 2));
```

**New Logging (After Our Fixes):**

Once the fixes are in, you'll see these helpful messages:

```
[CONFIG] Invalid numeric value for TOKEN_TTL_MS: "banana", using default 30000
[CONFIG] Configuration validation warnings: TTL is very short
[CONFIG] Failed to parse config file: Unexpected token 'f' at position 15
```

**Before The Fixes:**
You got NOTHING. Config was silently wrong. Hours of debugging for what turns out to be a typo in an env var. Ask me how I know.

---

### Problem #4: "Skills Aren't Loading"

*reaches for the Duff*

**Troubleshooting Steps:**

```bash
# List what skills SHOULD be there
ls -la ./skills/

# Check if skills actually registered
grep "skill" ~/.springfield/logs/springfield.log

# New logging will show:
# [SKILLS] Registered skill: summon
# [SKILLS] Registered skill: springfield-init
# [SKILLS] Failed to register skill: broken-skill.ts - SyntaxError: ...
```

**Common Causes:**

1. **Skill file doesn't export default** - Must have `export default`
2. **Syntax error in skill file** - Check for typos
3. **Missing dependency** - Skill imports something that doesn't exist
4. **Wrong path** - Skills directory isn't where you think it is

**Quick Test:**

```typescript
// Add this to your skill to make sure it's even being loaded
console.log('SKILL LOADED: my-skill.ts');

export default {
  name: 'my-skill',
  run: () => console.log('SKILL RAN!'),
};
```

If you don't see "SKILL LOADED" in console, the file ain't being imported at all.

---

### Problem #5: "Character Seems... Off"

*looks confused*

Summoned Homer but he sounds like a robot? Could be the fallback.

**What Happened:**

When a character's agent definition fails to load, the system falls back to generic dialogue. Before our fixes, you'd never know this happened. Now you will.

**New Logging:**

```
[AGENTS] Failed to load agent definition for homer
[AGENTS] Using fallback dialogue
[AGENTS] Reason: ENOENT: no such file or directory 'agents/homer.md'
```

**Troubleshooting:**

```bash
# Check if agent file exists
ls -la ./agents/homer.md

# Check file permissions
stat ./agents/homer.md

# Check file content (maybe it's corrupted)
head -20 ./agents/homer.md
```

---

### Problem #6: "NaN Everywhere"

*slams hand on bar*

This is THE BIG ONE. The one that was causing all kinds of silent mayhem.

**How to Detect:**

```typescript
// Add these debug checks
const config = getConfig();
console.log('Token TTL:', config.tokenTTL, 'Is NaN:', isNaN(config.tokenTTL));
console.log('Rate Limit:', config.rateLimit, 'Is NaN:', isNaN(config.rateLimit.maxTokens));
```

**How NaN Spreads:**

```
User sets: SPRINGFIELD_TOKEN_TTL_MS=oops

parseInt('oops', 10) => NaN

tokenTTL becomes NaN

expiresAt = Date.now() + NaN => NaN

NaN < Date.now() => false (ALWAYS false!)

Token NEVER EXPIRES

Ralph runs FOREVER
```

**After The Fix:**

```
[CONFIG] Invalid numeric value for TOKEN_TTL_MS: "oops", using default 30000
```

Problem detected at config load, not when everything explodes.

---

## Debug Logging Levels

*lines up bottles by type*

```typescript
// In your code, use these wisely:
logger.debug('Very detailed info');  // Dev only
logger.info('Normal operation');     // Standard operation
logger.warn('Something fishy');      // Pay attention
logger.error('Something broke');     // Fix it!
```

**How to Enable Debug Logging:**

```bash
# Set environment variable
export SPRINGFIELD_LOG_LEVEL=debug

# Or in your shell
SPRINGFIELD_LOG_LEVEL=debug node your-script.js
```

**Log Level Hierarchy:**

```
debug ─► Everything, and I mean EVERYTHING
info  ─► Normal operations, milestones
warn  ─► Recoverable issues, suspicious stuff
error ─► Things that broke
```

---

## Quick Diagnostic Checklist

*scratches head*

When something goes wrong, run through this:

```
□ 1. Is Node running the right version?
     node --version
     # Should be 14+ for ES modules

□ 2. Did you install dependencies?
     npm install
     # Look for errors

□ 3. Is the config file valid JSON?
     cat config.json | jq .
     # If this errors, your JSON is busted

□ 4. Are environment variables set?
     env | grep SPRINGFIELD
     # Should show your config

□ 5. Can you import the main module?
     node -e "import('./dist/index.js').then(m => console.log('OK'))"

□ 6. Are there any TypeScript errors?
     npm run build
     # Look for compilation errors

□ 7. Do tests pass?
     npm test
     # If tests fail, so will your code

□ 8. What do the logs say?
     cat ~/.springfield/logs/springfield.log
     # Read. The. Logs.
```

---

## The "I Give Up" Checklist

*reaches for the good scotch*

When nothing makes sense:

```bash
# Nuclear option: clean rebuild
rm -rf node_modules
rm -rf dist
npm install
npm run build
npm test

# Still broken? Check if you're even in the right directory
pwd
ls -la

# Maybe you're on the wrong branch?
git branch
git status

# When was this last known to work?
git log --oneline -10
# Try checking out an older commit and see if it works
```

---

## Error Messages Translated

*puts on reading glasses*

| What It Says | What It Means | What To Do |
|--------------|---------------|------------|
| `ENOENT: no such file` | File doesn't exist | Check the path |
| `EACCES: permission denied` | Can't read/write file | Check permissions, maybe `chmod` |
| `SyntaxError: Unexpected token` | JSON or JS is malformed | Find the bad syntax |
| `TypeError: Cannot read properties of undefined` | Something is null/undefined | Add null checks, trace the value |
| `RangeError: Maximum call stack` | Infinite recursion | Look for function calling itself |
| `Cannot find module` | Import path is wrong | Check the path, check if file exists |
| `ETIMEDOUT` | Network timeout | Check connection, maybe firewall |

---

## My Personal Debugging Wisdom

*leans in*

Listen, pal. I've been debugging my life for 40 years. Here's what I've learned:

### 1. It's Always the Simple Stuff
Check the obvious first. Typos, missing files, wrong directories. 90% of bugs are stupid mistakes.

### 2. Read the Error Message
I know, crazy idea. But the error usually tells you what's wrong. Don't just panic - READ it.

### 3. Add Logging, Then Remove It
When you can't figure something out, add `console.log` EVERYWHERE. Find the bug, then clean up.

### 4. Rubber Duck It
Talk to a rubber duck. Or a mop. Or Barney if he's conscious. Explaining the problem out loud often reveals the solution.

### 5. Sleep On It
Sometimes you're too close to see the problem. Walk away. Come back. The answer will be obvious.

### 6. Check Your Assumptions
You think the config is loaded? PROVE IT. You think the function is called? ADD A LOG. Assume nothing.

---

## Emergency Contacts

When you've tried everything:

| Problem | Who to Ask |
|---------|------------|
| Security stuff | Chief Wiggum |
| Architecture | Lisa |
| "Why is this so complicated?" | Homer (he'll agree with you) |
| "Is this an edge case?" | Bart |
| "What's the RIGHT way?" | Flanders |
| "What's the schedule?" | Skinner |
| "How do I write tests?" | Nelson (HA-HA!) |

---

## Final Words

*puts rag down*

Look, debugging isn't fun. Nobody LIKES debugging. But it's part of the job. At least now, with the logging fixes we're adding, you'll actually have a CLUE what went wrong.

Before these fixes, you'd stare at nothing, wondering why your code silently failed. Now you'll have error messages. Actual, helpful error messages.

That's progress, pal.

Now get out of my bar and go fix your code.

---

*Generated by Moe Szyslak - Debugging and Troubleshooting*
*"I'm a well-wisher... in that I don't wish you any specific harm."*
