---
name: qa-report
description: Plan real-user QA as living repo docs. Use to plan a cycle before execution, map journeys as flows, and register bugs into the durable bug registry.
---

# qa-report

Plan QA as journeys real people walk, not test cases that accumulate. Owns the project's **living QA docs** in `.agent/qa/`.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `../../rules/tokens-economy.md` | Keep QA docs lean and focused |
| `references/qa-docs-layout.md` | Structure of the `.agent/qa/` tree |

## Expected Input

- Target feature or release scope.
- Read `.agent/specs/[feature].spec.md` as the source of truth for planning.

## Step 1 — Resolve or bootstrap the tree

Verify `.agent/qa/`. If it doesn't exist, bootstrap the directories: `journeys/`, `charters/`, `reports/`, `bugs/`.

## Step 2 — Map journeys as flows

Read `.agent/specs/[feature].spec.md`. For each user flow, write or update `.agent/qa/journeys/J-[slug].md`.
Include a brief textual flowchart from entry → actions → side effects → true end state.

## Step 3 — Plan session charters

Write one charter per session to `.agent/qa/charters/CH-[slug].md`.
A charter defines:
- **Persona:** Who is testing (e.g., Admin, Guest).
- **Journey:** Which journey to walk.
- **Time-box:** Max time to spend.

## Step 4 — Register bugs (If reporting)

If bugs are found and provided in the input, file them in `.agent/qa/bugs/BUG-[YYYYMMDD]-[slug].md`.
Dedup before filing.

## Output

1. List of Journeys mapped
2. List of Charters planned
3. Ready for `qa-execution` to run the sessions