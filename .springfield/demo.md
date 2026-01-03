# Krusty's Before/After Demo Script

*adjusts bow tie, drops cigarette*

Hey hey, kids! It's your old pal Krusty! Today we're doing something EDUCATIONAL! *shudders* I know, I know, but the network says we gotta show the sponsors how this code thing works.

So here's the deal - we're gonna show what happens BEFORE the fixes and AFTER the fixes. It's like my career: before rehab, after rehab. Well, between relapses anyway.

*honks horn*

LET'S DO THIS!

---

## DEMO 1: The NaN Disaster

### 🔴 BEFORE THE FIX

```bash
# Set a garbage value for token TTL
$ export SPRINGFIELD_TOKEN_TTL_MS="krusty_is_great"

# Start the application
$ npm start

# Output: NOTHING! No warning, no error, just... silence.

# Try to use Ralph...
$ /lisa authorize-ralph

# What happens internally:
#   tokenTTL = parseInt("krusty_is_great", 10) = NaN
#   expiresAt = Date.now() + NaN = NaN
#   NaN < Date.now() = false (ALWAYS)
#   Token NEVER EXPIRES!

# Wait 5 minutes (way past 30 second TTL)...
$ /ralph-loop

# Ralph still works! The token NEVER EXPIRED!
# *canned laughter that's actually nervous laughter*
```

### 🟢 AFTER THE FIX

```bash
# Set a garbage value for token TTL
$ export SPRINGFIELD_TOKEN_TTL_MS="krusty_is_great"

# Start the application
$ npm start

# Output:
# [WARN] [CONFIG] Invalid numeric value for TOKEN_TTL_MS: "krusty_is_great"
#   → Using default: 30000
# [INFO] Configuration loaded successfully

# Now you KNOW something was wrong!

# Try to use Ralph...
$ /lisa authorize-ralph
# [INFO] [SECURITY] Ralph authorization granted, expires in 30000ms

# Wait 35 seconds...
$ /ralph-loop
# [ERROR] [SECURITY] Ralph authorization expired or not granted
# "Ralph says: 'I'm not allowed to do that without Lisa's help!'"

# TOKEN EXPIRED AS EXPECTED!
# *actual applause*
```

### Demo Script for Live Presentation

```
1. Open terminal, show clean environment
2. Set bad TTL: export SPRINGFIELD_TOKEN_TTL_MS="bad_value"
3. Start app, show warning message appears
4. Point to log: "See? It TELLS you there's a problem!"
5. Show default being used: "It uses 30000ms instead of NaN"
6. Authorize Ralph, wait, show expiration works
7. Conclusion: "No more silent security failures!"
```

---

## DEMO 2: The Silent Skill Failure

### 🔴 BEFORE THE FIX

```bash
# Create a broken skill file
$ echo "this is not valid javascript" > skills/broken-skill.ts

# Start the application
$ npm start

# Output: NOTHING about the broken skill!

# Check what skills loaded
$ /springfield skills

# Output: "Available skills: ..."
# (broken-skill is just... not there. No explanation.)

# Developer spends 2 hours wondering why their skill doesn't work
# *sad trombone*
```

### 🟢 AFTER THE FIX

```bash
# Create a broken skill file
$ echo "this is not valid javascript" > skills/broken-skill.ts

# Start the application
$ npm start

# Output:
# [ERROR] [SKILLS] Failed to register skill: broken-skill.ts
#   → Error: SyntaxError: Unexpected identifier
#   → Path: /path/to/skills/broken-skill.ts
# [INFO] Loaded 46 of 47 skills (1 failed)

# Developer sees IMMEDIATELY what went wrong!

# Check what skills loaded
$ /springfield skills

# Output: "Available skills: ... (broken-skill.ts failed to load)"
# *triumphant horn fanfare*
```

### Demo Script for Live Presentation

```
1. Show skills directory with intentionally broken file
2. Start app (BEFORE): "Notice how it says nothing?"
3. "Developer has NO IDEA their skill didn't load"
4. Start app (AFTER): "Boom! Right there in the logs!"
5. Show error message with file path and reason
6. "Fixed in seconds instead of hours!"
```

---

## DEMO 3: The Tool Name Bypass

### 🔴 BEFORE THE FIX

```bash
# Try to invoke Ralph without Lisa's permission

# Normal name - BLOCKED (good!)
$ /ralph-loop
# "Authorization required. Please ask Lisa first."

# Underscore variation - BYPASSED (bad!)
$ /ralph_loop
# *Ralph executes without authorization*
# "I'm Ralph! I'm helping!"

# Security bypassed by replacing hyphen with underscore!
# *Sideshow Bob slow clap*
```

### 🟢 AFTER THE FIX

```bash
# Try to invoke Ralph without Lisa's permission

# Normal name - BLOCKED
$ /ralph-loop
# "Authorization required. Please ask Lisa first."

# Underscore variation - ALSO BLOCKED!
$ /ralph_loop
# "Authorization required. Please ask Lisa first."

# Mixed separators - BLOCKED!
$ /ralph-_-loop
# "Authorization required. Please ask Lisa first."

# Unicode variant - BLOCKED!
$ /rаlph-loop  # (Cyrillic 'а')
# "Authorization required. Please ask Lisa first."

# ALL variants normalized to same check!
# *Security team cheers*
```

### Demo Script for Live Presentation

```
1. "Watch this security bypass in action..."
2. Try ralph-loop without auth: BLOCKED (expected)
3. Try ralph_loop without auth: IT WORKS! (gasp!)
4. "This is the BEFORE behavior"
5. Apply fix, restart
6. Try all variants: ALL BLOCKED
7. "Normalization catches ALL variations!"
```

---

## DEMO 4: The Config Validation Mystery

### 🔴 BEFORE THE FIX

```bash
# Create a config with problematic values
$ cat > .springfield/config.json << EOF
{
  "tokenTTL": 50,
  "rateLimit": {
    "maxTokens": 0,
    "windowMs": 500
  }
}
EOF

# Start the application
$ npm start

# Output: "Springfield Code started successfully!"
# (No warning about weird values!)

# Meanwhile:
# - Token TTL of 50ms means tokens expire IMMEDIATELY
# - Max 0 tokens means NO ONE can ever get authorized
# - Window of 500ms means rate limit resets every half second

# Everything SEEMS fine but NOTHING works right
# *confused audience noises*
```

### 🟢 AFTER THE FIX

```bash
# Create a config with problematic values
$ cat > .springfield/config.json << EOF
{
  "tokenTTL": 50,
  "rateLimit": {
    "maxTokens": 0,
    "windowMs": 500
  }
}
EOF

# Start the application
$ npm start

# Output:
# [WARN] [CONFIG] Configuration validation warnings:
#   → tokenTTL (50ms) is very short - tokens may expire before use
#   → maxTokens (0) means no authorizations possible
#   → windowMs (500ms) is very short rate limit window
# [INFO] Springfield Code started with configuration warnings

# NOW YOU KNOW your config is weird before problems happen!
```

### Demo Script for Live Presentation

```
1. Show problematic config file
2. Start app (BEFORE): "See? No warnings!"
3. Try to use the system: "Nothing works!"
4. "But WHY doesn't it work?"
5. Start app (AFTER): "Look at those warnings!"
6. "Now you know IMMEDIATELY something is wrong"
```

---

## DEMO 5: The JSON Parse Nightmare

### 🔴 BEFORE THE FIX

```bash
# Create a malformed JSON config
$ echo '{"tokenTTL": 30000, "bad":' > .springfield/config.json

# Start the application
$ npm start

# Output: "Springfield Code started successfully!"
# (Wait, what? The JSON is broken!)

# What happened internally:
# - JSON.parse threw an error
# - catch block returned defaults silently
# - User thinks their config loaded
# - Actually using COMPLETELY DIFFERENT values

# *audience gasps*
```

### 🟢 AFTER THE FIX

```bash
# Create a malformed JSON config
$ echo '{"tokenTTL": 30000, "bad":' > .springfield/config.json

# Start the application
$ npm start

# Output:
# [ERROR] [CONFIG] Failed to parse config file
#   → Path: .springfield/config.json
#   → Error: SyntaxError: Unexpected end of JSON input
#   → Using defaults instead
# [INFO] Springfield Code started with default configuration

# USER KNOWS THEIR CONFIG FAILED!
```

---

## DEMO 6: The Full Experience

### 🔴 BEFORE (The Nightmare Scenario)

```bash
$ export SPRINGFIELD_TOKEN_TTL_MS="bad"    # NaN injection
$ echo "broken" > skills/my-skill.ts       # Broken skill
$ echo "{bad json" > .springfield/config.json  # Bad config

$ npm start
# Output: "Springfield Code started successfully!"

# EVERYTHING IS BROKEN AND NOTHING TELLS YOU!

$ /summon homer
# (Gets fallback dialogue but you don't know why)

$ /my-skill
# "Command not found" (skill didn't load but no explanation)

# Developer: "WHY DOESN'T ANYTHING WORK?!"
# *developer flips table*
```

### 🟢 AFTER (The Dream Scenario)

```bash
$ export SPRINGFIELD_TOKEN_TTL_MS="bad"    # NaN injection
$ echo "broken" > skills/my-skill.ts       # Broken skill
$ echo "{bad json" > .springfield/config.json  # Bad config

$ npm start

# Output:
# [WARN] [CONFIG] Invalid numeric TOKEN_TTL_MS: "bad", using default 30000
# [ERROR] [CONFIG] Failed to parse config file, using defaults
#   → Error: SyntaxError at position 1
# [ERROR] [SKILLS] Failed to register skill: my-skill.ts
#   → Error: SyntaxError: Unexpected identifier
# [WARN] [AGENTS] Agent definition not found: homer.md, using fallback
# [INFO] Springfield Code started with 3 warnings, 2 errors

# EVERY PROBLEM IS VISIBLE!

$ /summon homer
# [INFO] [AGENTS] Using fallback dialogue for homer (agent file missing)
# (You know WHY you're getting fallback!)

# Developer: "Oh, I see exactly what I need to fix!"
# *developer fixes things calmly*
```

---

## Quick Reference Card for Demos

```
┌────────────────────────────────────────────────────────────────┐
│                 KRUSTY'S DEMO CHEAT SHEET                       │
├────────────────────────────────────────────────────────────────┤
│ Demo 1: NaN                                                     │
│   BEFORE: Silent NaN, tokens never expire                       │
│   AFTER: Warning logged, default used, tokens expire properly   │
├────────────────────────────────────────────────────────────────┤
│ Demo 2: Skills                                                  │
│   BEFORE: Silent failure, skill just missing                    │
│   AFTER: Error logged with path and reason                      │
├────────────────────────────────────────────────────────────────┤
│ Demo 3: Tool Names                                              │
│   BEFORE: Underscore bypasses security                          │
│   AFTER: All variants normalized, bypass blocked                │
├────────────────────────────────────────────────────────────────┤
│ Demo 4: Config Validation                                       │
│   BEFORE: Weird values accepted silently                        │
│   AFTER: Warnings shown for problematic values                  │
├────────────────────────────────────────────────────────────────┤
│ Demo 5: JSON Parse                                              │
│   BEFORE: Broken JSON fails silently                            │
│   AFTER: Error logged, user knows config failed                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Krusty's Demo Tips

*lights cigar*

1. **Start with the scary one** - NaN security bypass gets attention
2. **Show the silence first** - Let them FEEL the frustration
3. **Then show the fix** - The relief is palpable
4. **Use real errors** - Don't fake it, break it for real
5. **End with the full scenario** - Show how bad it was, how good it is

---

## Post-Demo Q&A Prep

**Q: "Doesn't all this logging slow things down?"**
A: Frink measured it - 0.0003ms per log. Negligible!

**Q: "What if we don't want all these logs?"**
A: Set `SPRINGFIELD_LOG_LEVEL=error` to only see errors!

**Q: "How do I know which logs to read?"**
A: Each log has a module tag like `[CONFIG]` or `[SKILLS]`. Filter by module!

**Q: "Will this break existing setups?"**
A: No! Behavior only changes for INVALID inputs. Valid configs work exactly the same!

---

*puts out cigar*

Alright, that's the show! Remember kids, logging isn't just for lumberjacks! And always tell an adult if your code is failing silently!

*honks horn, exits stage*

---

*Generated by Krusty the Clown - Demo Script*
*"I didn't get to where I am by not knowing how to work a crowd!"*
