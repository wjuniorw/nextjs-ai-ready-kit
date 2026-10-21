---
name: analyze
description: Analyze generated files against rules and LESSONS.md. Use when an implementation step finishes to ensure compliance. Don't use for planning.
---

# analyze

Post-implementation analysis — scan generated files against rules and LESSONS.md.

> Called automatically via hook after implementation. Can be invoked manually.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `antipatterns.md` | Verification checklist |
| `code-style.md` | Semicolons, quotes, exports |
| `imports.md` | Path aliases, barrels |
| `architecture.md` | Layers, structure |

Also read `.agent/LESSONS.md` — real past mistakes.

## Expected Input

- `[feature]` — feature name
- `[files]` — explicit list of files generated/modified

**Never analyze files outside the provided list.**

## Step 1 — Per-file checks

### Check A — Code style (`code-style.md` + `imports.md`)

| Forbidden pattern | What to look for |
|---|---|
| Default export | `export default` |
| Semicolons | `;` at the end of statements |
| Double quotes | `"` where `'` should be |
| Relative import between modules | `../` (except barrels and styles) |
| Direct file import | Path ending in `.ts` when barrel exists |
| `import React from 'react'` | Import without destructuring hooks |

### Check B — Architecture (`antipatterns.md`)

| Forbidden pattern | What to look for |
|---|---|
| DTO with Zod in `domain/` | `import { z }` in `domain/` |
| Logic in component | `fetch`, `axios`, use case in `.tsx` |
| Factory as class | `class [Name]Factory` |
| Store with HTTP | `fetch`/`axios` in zustand `create(` |
| Component imports store | `useStore` in `.tsx` |
| Feature imports another feature | `@[other-feature]/` |

### Check C — Lessons (`LESSONS.md`)

Go through each lesson and execute the documented verification.

## Step 2 — Classify

```
✅ PASS      — zero violations
⚠️ WARNING   — minor violation (style) — fix and proceed
❌ VIOLATION — severe violation (architecture) — fix before continuing
```

## Step 3 — Actions

- **PASS** → log and exit
- **WARNING/VIOLATION** → fix (or delegate to lint-fixer), re-check
- **New error** → add lesson in `.agent/LESSONS.md`
- **VIOLATION** → do not mark task as completed until fixed

## Step 4 — Save log

`.agent/harness/logs/analyze-[feature]-[timestamp].log`

## Output

```
✅ analyze completed — [feature]
Files: [N] | Result: [PASS|N warnings|N violations]
[violations, if any]
[actions taken]
```