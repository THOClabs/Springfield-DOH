# Migration Guide

This document tracks deprecated APIs and their migration paths for future major versions.

---

## v2.0.0 → v3.0.0 (Planned)

### Removed: `setRalphInitiated()`

**Deprecated in:** v2.0.0
**Removal planned:** v3.0.0

The `setRalphInitiated()` function is deprecated and will be removed in v3.0.0. It was replaced with a secure token-based authorization system.

#### Why It Changed

The original `setRalphInitiated()` used a simple boolean flag that could be manipulated by any code path, creating a security vulnerability where Ralph could be invoked without proper Lisa verification.

#### Migration Path

**Before (v1.x):**
```typescript
import { setRalphInitiated } from "springfield-code";

// Insecure: any code could enable Ralph
setRalphInitiated(true);
if (canInvokeRalph()) {
  // invoke Ralph
}
```

**After (v2.0.0+):**
```typescript
import { 
  requestRalphAuthorization, 
  authorizeRalph, 
  canInvokeRalph 
} from "springfield-code";

// Step 1: Request a token (returns SecureToken)
const token = requestRalphAuthorization();
if (!token) {
  // Rate limited or other error
  return;
}

// Step 2: User confirms (e.g., "yes" input)
const authorized = authorizeRalph(token);
if (!authorized) {
  // Invalid or expired token
  return;
}

// Step 3: Check authorization
if (canInvokeRalph()) {
  // Safe to invoke Ralph - token was validated
}
```

#### Backward Compatibility

In v2.x, `setRalphInitiated(true)` still works but:
- Logs a deprecation warning
- Bypasses token security (not recommended)
- Will be removed in v3.0.0

---

### Removed: `LISA_TOKEN` Environment Variable

**Deprecated in:** v2.0.0
**Removal planned:** v3.0.0

The `LISA_TOKEN` environment variable is no longer used for Ralph authorization. The new system uses cryptographically generated single-use tokens.

#### Migration Path

**Before (v1.x):**
```bash
# Set in environment
export LISA_TOKEN="my-secret-token"
```

**After (v2.0.0+):**
```typescript
// Tokens are generated programmatically
const token = requestRalphAuthorization();
// Token is a SecureToken branded type, cryptographically random
```

No environment variable configuration is needed. Tokens are:
- 256-bit cryptographically random
- Single-use (consumed on authorization)
- Time-limited (5-minute TTL)
- Rate-limited (10 tokens/minute)

---

## Breaking Changes Summary

| Version | Change | Alternative |
|---------|--------|-------------|
| v3.0.0 | Remove `setRalphInitiated()` | Use `requestRalphAuthorization()` + `authorizeRalph()` |
| v3.0.0 | Remove `LISA_TOKEN` env var | Tokens auto-generated |

---

## Deprecation Timeline

| API | Deprecated | Warning Added | Removed |
|-----|------------|---------------|---------|
| `setRalphInitiated()` | v2.0.0 | v2.0.0 | v3.0.0 |
| `LISA_TOKEN` env var | v2.0.0 | v2.0.0 | v3.0.0 |

---

## Future Deprecations (Planned)

### v3.0.0 Candidates

No additional deprecations planned for v3.0.0 at this time.

### v4.0.0 Candidates

- Potential character name standardization (TBD)
- Possible artifact format versioning (TBD)

---

## Getting Help

If you encounter issues during migration:

1. Check the [CHANGELOG.md](CHANGELOG.md) for version-specific notes
2. Review the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
3. Open an issue with the `migration` label
