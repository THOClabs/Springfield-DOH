# Groundskeeper Willie's Infrastructure Manual

*rolls up sleeves, revealing biceps*

ARGH! YE CALL THIS A BUILD SYSTEM?! Back in Scotland, we built castles with our bare hands! But FINE, I'll show ye how to set up proper infrastructure for this Springfield Code contraption.

Listen here, ye coddled developers - infrastructure isn't just running `npm install` and hoping for the best. It's about DISCIPLINE! And PIPES! Lots of pipes!

---

## Build System Overview

*brandishes rake threateningly*

### Current Build Pipeline

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Source     │───►│   TypeScript │───►│   Output     │
│   (src/)     │    │   Compiler   │    │   (dist/)    │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Type Check │
                    │   Errors     │
                    └──────────────┘
```

### Build Commands

```bash
# Compile TypeScript to JavaScript
npm run build

# Watch mode for development (recompiles on change)
npm run build:watch

# Clean build (delete dist, rebuild from scratch)
npm run clean && npm run build

# Type check without emitting files
npm run typecheck
```

---

## CI/CD Pipeline Configuration

*draws in the dirt with rake*

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: Springfield Code CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run typecheck

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Check for secrets
        run: npx secretlint "**/*"
```

### PR Checks Required

```yaml
# Branch protection settings (configure in GitHub)
required_checks:
  - build-and-test (18.x)
  - build-and-test (20.x)
  - security-scan
  - lint
```

---

## Changes Required for These Fixes

*spits on hands, grabs shovel*

### Fix #1: New Utility Files

The fixes add new utility modules. We need to ensure they're included in the build:

```typescript
// tsconfig.json - Verify these paths are included
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": [
    "src/**/*",
    "src/utils/**/*"  // Make sure utils are included!
  ]
}
```

### Fix #2: Logger Import

New files import `logger`. Ensure the logger is available:

```typescript
// src/utils/logger.ts must be:
// 1. Part of the build
// 2. Exported properly
// 3. Available before other modules load

// Check: src/index.ts should initialize logger first
import { initializeLogger } from './utils/logger';
initializeLogger();  // BEFORE other imports!
```

### Fix #3: Test Configuration

New tests need to run in CI:

```javascript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts'
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
```

---

## Environment Configuration

*grumbles about "soft" modern developers*

### Development Environment

```bash
# .env.development
NODE_ENV=development
SPRINGFIELD_LOG_LEVEL=debug
SPRINGFIELD_TOKEN_TTL_MS=30000
SPRINGFIELD_RATE_LIMIT_WINDOW_MS=60000
SPRINGFIELD_MAX_TOKENS_PER_WINDOW=100
```

### Production Environment

```bash
# .env.production
NODE_ENV=production
SPRINGFIELD_LOG_LEVEL=warn
SPRINGFIELD_TOKEN_TTL_MS=30000
SPRINGFIELD_RATE_LIMIT_WINDOW_MS=60000
SPRINGFIELD_MAX_TOKENS_PER_WINDOW=10
```

### CI Environment

```yaml
# In GitHub Actions
env:
  NODE_ENV: test
  SPRINGFIELD_LOG_LEVEL: error  # Less noise in CI
  SPRINGFIELD_TOKEN_TTL_MS: 30000
```

---

## Build Verification Checklist

*inspects boiler with flashlight*

Before merging ANY PR, verify:

```bash
# Step 1: Clean build
rm -rf dist node_modules
npm install
npm run build

# Step 2: Type check passes
npm run typecheck
# Should exit with code 0, no errors

# Step 3: Lint passes
npm run lint
# Should exit with code 0, no warnings

# Step 4: All tests pass
npm test
# Should show: "X tests passed, 0 failed"

# Step 5: No security vulnerabilities
npm audit
# Should show: "found 0 vulnerabilities"

# Step 6: Package can be created
npm pack --dry-run
# Should list all expected files
```

---

## Infrastructure Changes for Logging

*checks pipes for leaks*

### Log File Management

New logging means MORE log files. Handle them properly:

```bash
# Log rotation configuration (logrotate)
# /etc/logrotate.d/springfield
/home/*/.springfield/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 $USER $USER
}
```

### Disk Space Considerations

```
Before fixes: Minimal logging, small files
After fixes: Comprehensive logging, larger files

Estimated log growth:
- Normal usage: ~1MB/day
- Heavy usage: ~10MB/day
- Debug mode: ~100MB/day (DON'T RUN DEBUG IN PROD!)

Recommendation: Implement log rotation from day one
```

---

## Deployment Pipeline

*sharpens axe*

### Release Process

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Verify version matches tag
        run: |
          PACKAGE_VERSION=$(node -p "require('./package.json').version")
          TAG_VERSION=${GITHUB_REF#refs/tags/v}
          if [ "$PACKAGE_VERSION" != "$TAG_VERSION" ]; then
            echo "Version mismatch! Package: $PACKAGE_VERSION, Tag: $TAG_VERSION"
            exit 1
          fi

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Version Sync Check

This addresses the version mismatch (3.0.2 vs 3.0.3):

```yaml
# Add to CI pipeline
- name: Verify version consistency
  run: |
    PKG_VERSION=$(node -p "require('./package.json').version")
    INDEX_VERSION=$(grep -oP "version: '\K[^']*" src/index.ts)
    if [ "$PKG_VERSION" != "$INDEX_VERSION" ]; then
      echo "Version mismatch detected!"
      echo "package.json: $PKG_VERSION"
      echo "index.ts: $INDEX_VERSION"
      exit 1
    fi
```

---

## Rollback Procedures

*keeps emergency whisky hidden*

### Quick Rollback

```bash
# If something goes wrong after deployment
npm unpublish springfield-code@3.0.4  # Remove bad version (within 72 hours)

# Or publish previous version as new
git checkout v3.0.3
npm version 3.0.5 --no-git-tag-version
npm publish
```

### Database/State Rollback

Springfield Code doesn't have a traditional database, but it does have:

```
~/.springfield/
├── config.json      # User config (don't lose this!)
├── stats.json       # Usage statistics
└── logs/            # Log files
```

**Backup Before Deploy:**
```bash
cp -r ~/.springfield ~/.springfield.backup.$(date +%Y%m%d)
```

---

## Monitoring and Alerts

*sets up tripwire around server*

### Health Check Endpoint (if applicable)

```typescript
// src/health.ts
export async function healthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean>;
}> {
  const checks = {
    configLoaded: await checkConfig(),
    skillsRegistered: await checkSkills(),
    loggerWorking: await checkLogger(),
  };

  const allPassing = Object.values(checks).every(Boolean);

  return {
    status: allPassing ? 'healthy' : 'degraded',
    checks,
  };
}
```

### Metrics to Track

| Metric | What It Means | Alert Threshold |
|--------|---------------|-----------------|
| Config load failures | Config system broken | > 0 |
| Skill registration failures | Skills not loading | > 5% |
| Ralph authorization rate | Security activity | > 100/hour (unusual) |
| Log file size | Logging volume | > 100MB/day |
| Error log count | Things breaking | > 10/hour |

---

## Disaster Recovery

*loads shotgun*

### Scenario 1: NPM Package Corrupted

```bash
# Reinstall from scratch
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Scenario 2: Build Won't Complete

```bash
# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

### Scenario 3: Tests Mysteriously Failing

```bash
# Clear test cache
rm -rf node_modules/.vitest

# Run tests with full output
npm test -- --reporter=verbose

# Run single test for isolation
npm test -- tests/config.test.ts
```

### Scenario 4: Everything Is On Fire

```bash
# The nuclear option
git stash           # Save local changes
git checkout main   # Get known-good state
rm -rf node_modules dist
npm install
npm run build
npm test

# If that works, your changes broke something
git stash pop       # Get changes back
# Binary search for the problem commit
```

---

## Willie's Golden Rules of Infrastructure

*stands atop pile of raked leaves*

### Rule 1: Automate Everything
If ye do it twice, automate it. Humans make mistakes. Machines don't forget.

### Rule 2: Trust Nothing
Verify the build. Verify the tests. Verify the version. TRUST BUT VERIFY!

### Rule 3: Log Everything (But Not Too Much)
After these fixes, we'll have proper logging. Don't drown in it. Set appropriate levels.

### Rule 4: Have a Rollback Plan
Before ye deploy, know how to UN-deploy. Always have an escape route.

### Rule 5: Test in Production-Like Environments
Dev machine works fine? DOESN'T MATTER. Test it somewhere that looks like production.

---

## Infrastructure Checklist for These Fixes

*checks off with muddy finger*

```
□ New utility files added to tsconfig include
□ Logger import order verified in index.ts
□ New tests added to vitest config
□ Log rotation configured for production
□ Version consistency check added to CI
□ Disk space monitoring for logs
□ All new files included in npm package (check .npmignore)
□ Environment variables documented
□ CI workflow updated for new tests
□ Rollback procedure tested
```

---

## Final Warning

*shakes fist at clouds*

YE THINK INFRASTRUCTURE IS BORING?! Try debugging a production outage at 3am without proper logging! Try figuring out why the build broke without proper CI! Try rolling back without a proper deployment pipeline!

These fixes we're making - they're not just code changes. They're INFRASTRUCTURE changes. More logging means more disk. More tests means longer CI. More validation means more failure points.

Plan for it. Budget for it. Or SUFFER for it.

BACK TO WORK, YE LAZY CODE MONKEYS!

---

*Generated by Groundskeeper Willie - Infrastructure and DevOps*
*"Grease me up, woman! ...Wait, wrong context."*
