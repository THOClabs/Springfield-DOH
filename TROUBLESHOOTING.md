# Springfield Code Troubleshooting Guide

> Common issues and solutions during the Ralph Wiggum build process

---

## Build & Setup Issues

### npm install fails

**Symptoms:**
- Dependency resolution errors
- Package not found errors

**Solutions:**
1. Check Node.js version: `node --version` (requires 20+)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and package-lock.json, reinstall
4. Check if @anthropic-ai/claude-code-sdk is available

### TypeScript compilation errors

**Symptoms:**
- `tsc` fails with type errors
- Module not found errors

**Solutions:**
1. Verify tsconfig.json matches CLAUDE.md template
2. Check import paths use correct extensions
3. Ensure all dependencies have @types packages
4. Run `npm run build` with `--verbose` for details

### Plugin won't load in Claude Code

**Symptoms:**
- `/springfield` command not recognized
- Plugin doesn't appear in plugin list

**Solutions:**
1. Verify `.claude-plugin/plugin.json` exists and validates
2. Check plugin.json has correct "name" field
3. Ensure commands array lists all command names
4. Check Claude Code logs for plugin load errors
5. Try: `/plugin reload springfield-code`

---

## Command Issues

### /springfield init fails

**Symptoms:**
- Directory not created
- Permission denied errors

**Solutions:**
1. Check write permissions in current directory
2. Ensure not running in read-only filesystem
3. Check if `.springfield/` already exists (use reset)
4. Verify template files exist in plugin's templates/ directory

### /springfield status shows wrong info

**Symptoms:**
- Files marked missing when they exist
- Incorrect Ralph readiness status

**Solutions:**
1. Check file paths are correct (case-sensitive on Linux/Mac)
2. Verify files have content (not just template placeholders)
3. Check for hidden characters in filenames
4. Run with debug logging enabled

### Character commands don't respond

**Symptoms:**
- `/homer` returns nothing or errors
- Character response is generic/wrong

**Solutions:**
1. Verify agent definition file exists in `agents/` directory
2. Check agent .md file has valid structure
3. Verify summon.ts can find and load agent files
4. Check for syntax errors in agent definition

---

## Ralph-Specific Issues

### /ralph not blocked (gate not working)

**Symptoms:**
- Direct `/ralph` invocation succeeds
- Gate hook not intercepting

**Solutions:**
1. Verify hook is registered in plugin.json
2. Check hook file exports default hook correctly
3. Verify hook event type is "PreToolUse"
4. Check hook logic for toolName matching

### Lisa can't initiate Ralph

**Symptoms:**
- `/lisa ralph` fails even with prerequisites met
- Ralph gate blocks Lisa-initiated requests

**Solutions:**
1. Check `setRalphInitiated(true)` is called before invocation
2. Verify flag isn't being reset prematurely
3. Check timing - flag might expire if there's delay
4. Add logging to trace flag state

### Ralph loop doesn't start

**Symptoms:**
- Lisa confirms but Ralph doesn't begin
- `/ralph-loop` command not found

**Solutions:**
1. Verify ralph-wiggum plugin is installed
2. Check plugin dependency declaration
3. Verify prompt synthesis isn't producing invalid output
4. Check completion promise isn't empty

### Ralph loop runs forever

**Symptoms:**
- Loop doesn't stop at max iterations
- Completion promise never matched

**Solutions:**
1. Check completion promise extraction is correct
2. Verify prompt includes clear completion criteria
3. Check max-iterations is being passed correctly
4. Use `/cancel-ralph` to stop runaway loop

---

## File & Artifact Issues

### Artifacts not being created

**Symptoms:**
- Character conversations don't create .springfield/*.md files
- Files exist but are empty

**Solutions:**
1. Check springfieldDir path is correct
2. Verify writeArtifact function has write permissions
3. Check artifact generation logic is being called
4. Verify character-to-artifact mapping is correct

### Prompt synthesis produces garbage

**Symptoms:**
- Ralph receives malformed prompt
- Missing sections in synthesized prompt

**Solutions:**
1. Check file reading functions handle errors
2. Verify section separators are correct
3. Check for encoding issues (ensure UTF-8)
4. Add validation before synthesis

### Template files missing after init

**Symptoms:**
- `.springfield/` created but some files missing
- Files exist but are empty

**Solutions:**
1. Verify all template files exist in plugin's templates/ directory
2. Check file copy logic handles all files
3. Verify template paths are correct
4. Check for errors during copy operation

---

## Testing Issues

### Tests fail with module errors

**Symptoms:**
- "Cannot find module" errors in tests
- Import resolution failures

**Solutions:**
1. Check vitest.config.ts has correct settings
2. Verify test files use correct import paths
3. Ensure dependencies are installed
4. Check TypeScript compilation succeeds before tests

### Tests pass but commands fail

**Symptoms:**
- All tests green but actual usage broken
- Mock behavior doesn't match reality

**Solutions:**
1. Add integration tests that don't mock filesystem
2. Test in actual Claude Code environment
3. Check mocks accurately represent real behavior
4. Add end-to-end test workflow

---

## Phase-Specific Issues

### Phase 0 won't complete

**Common causes:**
- Missing package.json fields
- Invalid tsconfig.json
- Plugin.json validation failures

**Debug steps:**
1. Run each verification command individually
2. Check JSON syntax with a validator
3. Compare against CLAUDE.md templates

### Phase 2-5 agent issues

**Common causes:**
- Agent markdown doesn't follow structure
- Missing required sections
- Character name mismatch

**Debug steps:**
1. Verify agent file matches template in spec
2. Check all required sections present
3. Verify character name in filename matches code

### Phase 8 Lisa-Ralph issues

**Common causes:**
- Prerequisites check too strict
- Prompt synthesis errors
- Hook integration timing

**Debug steps:**
1. Add verbose logging to verification function
2. Test synthesis with known-good input files
3. Trace hook flag through execution

---

## Recovery Procedures

### Complete Reset

When everything is broken:
```bash
# 1. Clean build artifacts
rm -rf node_modules dist .springfield

# 2. Reinstall dependencies
npm install

# 3. Rebuild
npm run build

# 4. Reinitialize Springfield
/springfield reset
```

### Checkpoint Recovery

When context expires mid-phase:
1. Check git log for last commit
2. Review PROGRESS_LOG.md for state
3. Check IMPLEMENTATION_PLAN.md for current phase
4. Re-read PROMPT.md and continue

### Blocker Recovery

When stuck on a phase:
1. Review BLOCKERS.md for details
2. Try alternative approach listed
3. Check if spec needs clarification
4. Break phase into smaller steps
5. If truly stuck, mark BLOCKED and continue

---

## Getting Help

### What to Include in Bug Reports

1. Phase number and task
2. Error message (full text)
3. Steps to reproduce
4. What you expected vs what happened
5. Relevant file contents
6. Environment (Node version, OS)

### Debug Logging

Enable verbose logging:
```typescript
// Add to commands for debugging
console.log("[DEBUG]", { phase, step, state });
```

### Common Patterns That Fix Things

1. **File not found**: Check path separators (use path.join)
2. **Type errors**: Run `npm run build` to catch early
3. **Hook not firing**: Check event type matches exactly
4. **State issues**: Add logging to trace state changes
5. **Timing issues**: Add async/await where needed

---

## Prevention Checklist

Before marking a phase complete:

- [ ] Verification command passes
- [ ] No TypeScript errors
- [ ] Tests pass (if applicable)
- [ ] Manual test in Claude Code
- [ ] Code committed to git
- [ ] PROGRESS_LOG.md updated
