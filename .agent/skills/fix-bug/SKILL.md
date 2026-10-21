---
name: fix-bug
description: Diagnose and fix bugs systematically. Use when encountering incorrect behavior, stack traces, or failing validations. Don't use for enhancements.
---

# fix-bug

Diagnose before fixing. Never skip straight to the fix.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `architecture.md` | Identify affected layer |
| `code-style.md` | Keep conventions in fix |
| `imports.md` | If fix alters imports |
| `antipatterns.md` | Do not introduce antipatterns |

## Expected Input

- [ ] Description of incorrect behavior
- [ ] Expected behavior
- [ ] Where it was observed (route, component, action)
- [ ] Error message / stack trace
- [ ] Affected feature

Read the domain snapshot before proceeding.

## Step 1 — Diagnosis: identify layer

| Symptom | Probable layer |
|---|---|
| Incorrect data from API | `infra/repositories` |
| Validation fails | `application/dtos` |
| Wrong logic | `application/use-cases` |
| Inconsistent UI state | `presentation/view-models` or `stores` |
| Incorrect render | `presentation/components` |
| Runtime typing | `domain/entities` or `dtos` |
| Uninjected dependency | `infra/factories` |

**Criterion:** layer identified, relevant files read.

## Step 2 — Hypothesis

*"The bug occurs because [cause] in layer [layer], file [file]. It causes [effect] when [condition]."*

Present to user. Wait for confirmation.

## Step 3 — Impact on adjacent layers

- Interface change → concrete repo + in-memory
- DTO change → consumer use cases
- Factory change → consumer view-models

## Step 4 — Minimal fix

Only what is necessary — no refactoring beyond scope.

## Step 5 — Validation

- Do existing tests pass? (`bash .agent/harness/tools/test-runner.sh [feature]`)
- Is scenario covered by new test?
- If no tests → flag and ask if should create via `write-tests`

## Output

1. Diagnosis: layer + root cause
2. Modified files
3. Impact on other layers
4. Test coverage status