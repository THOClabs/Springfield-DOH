# Iteration Configuration

Prepared By: Lisa Simpson
Date: 2026-01-03

---

## Max Iterations

```
20
```

Ralph, you have up to 20 iterations to complete this task. This should be MORE than enough for 4 small fixes.

---

## Expected Progress

| Iteration | Expected State |
|-----------|----------------|
| 1-2 | Read and understand the files |
| 3-5 | Fix NaN validation in parseValue() |
| 6-8 | Add validateConfig() call to getConfig() |
| 9-11 | Add logging to JSON parse catch |
| 12-14 | Add logging to skill registration |
| 15-17 | Run tests, fix any issues |
| 18-20 | Final verification, output DONE |

---

## Stuck Protocol

### At 50% (Iteration 10)
If you haven't completed at least 2 of the 4 fixes:
1. Document which fixes are blocking you
2. Try a different fix (they're independent)
3. Re-read the task.md for hints

### At 75% (Iteration 15)
If you haven't completed at least 3 of the 4 fixes:
1. Document blocking issues in detail
2. List all attempted approaches
3. Suggest what help you need
4. Continue trying until iteration 20

### At 100% (Iteration 20)
If not complete:
1. Output what you DID complete
2. Document what's still blocking
3. Provide specific file:line references
4. Suggest next steps

---

## Early Completion

If you complete all success criteria BEFORE iteration 20:
1. Verify all conditions are met
2. Run tests one final time
3. Output: `DONE`

Early completion is GOOD! Don't pad iterations.

---

## If Something is Wrong

### File doesn't exist
The actual files might be in a different path. Search for:
- `config.ts`
- `skills/index.ts`

### Function doesn't exist
The function names might be different. Search for:
- `parseInt` usage
- `catch` blocks
- `validation` functions

### Tests fail
Read the error message carefully. It usually tells you:
- Which file
- Which line
- What's wrong

---

## Remember

- 4 fixes in 20 iterations = plenty of time
- Each fix is independent
- Partial progress is still progress
- When done, say DONE

---

*Prepared by Lisa Simpson - Iteration Configuration*
*"Persistence with patience."*
