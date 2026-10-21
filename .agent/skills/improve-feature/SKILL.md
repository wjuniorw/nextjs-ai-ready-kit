---
name: improve-feature
description: Evolve and improve an existing feature. Use when refactoring for performance, UX, DX, or adding non-breaking steps to a flow. Don't use for bugs.
---

# improve-feature

Improvements and evolutions in existing features — not a bugfix, not a new feature.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `architecture.md` | Layers and structure |
| `code-style.md` | Formatting and exports |
| `imports.md` | Path aliases |
| `presentation.md` | MVVM, view-models |
| `antipatterns.md` | Pre-delivery verification |

## Expected Input

- [ ] Feature to improve
- [ ] Current behavior
- [ ] Desired behavior
- [ ] Motivation: UX, performance, security, DX
- [ ] Restrictions: breaking change allowed?

Read the domain snapshot before proceeding.

## Step 1 — Understand current state

1. Snapshot: `.agent/context/[feature].snapshot.md`
2. Plan (if any): `.agent/plans/[feature].plan.md`
3. **Only** the files that will be touched

## Step 2 — Proposal

```
IMPROVEMENT: [short name]
FILE(S): [list]
CHANGE: [what changes]
PRESERVES: [what stays the same]
BREAKING CHANGE: yes/no
EFFORT: small / medium / large
```

Simple improvements → proceed directly. Medium/large → wait for approval.

## Step 3 — Impact on adjacent layers

| Change | Impact |
|---|---|
| New DTO output field | Frontend notified |
| New DTO input field | Validation updated |
| New dependency | Factory/provider updated |
| New Zod schema | Barrel updated |

## Step 4 — Implementation

Order: domain → application → infra → presentation → barrels.
Follow all rules listed above.

## Step 5 — Verification

```bash
bash .agent/harness/tools/lint.sh [feature]
bash .agent/harness/tools/test-runner.sh [feature]
```

## Output

1. Proposal (if medium/large scope)
2. Modified files
3. Cascading impact
4. Lint/tests: result
5. Signal snapshot update