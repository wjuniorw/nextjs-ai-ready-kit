---
name: architectural-analysis
description: Architectural audit that hunts dead code, duplicated functionality, anti-patterns, and code smells across the codebase. Use to assess codebase health or plan a refactor.
---

# architectural-analysis

Read-only audit of an entire codebase or specific module. Report findings only — make no edits.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `../../rules/antipatterns.md` | Primary list of forbidden architecture patterns |
| `references/detection-catalog.md` | Classification depth for dimensions |

## Expected Input

- Target scope (entire project or specific `src/features/[feature]`)

## Step 1 — Map the codebase

List directories and count source files. Glob every source file to build a todo list.
Note the entry points: `page.tsx`, `layout.tsx`, public `index.ts` barrels.

**Criterion:** every source file has a todo entry.

## Step 2 — Detect dead code

For each file in the todo: list its exports, then search every export for imports or usages elsewhere.
*Exception:* Components exported in `page.tsx` or `layout.tsx` are dynamically used by Next.js.
Record each finding as `file:line`, category, and confidence.

**Criterion:** every todo file's exports are usage-checked.

## Step 3 — Detect duplication

Surface candidates by similar names, repeated blocks, and competing implementations of one concept (e.g., two different `Button` primitives, or duplicated validation logic).
Classify using `references/detection-catalog.md`.

**Criterion:** candidate groups are read and classified.

## Step 4 — Detect anti-patterns

Check findings against `.agent/rules/antipatterns.md`.
Trace import chains for forbidden cross-feature imports or relative paths escaping modules.
Check for Next.js specific anti-patterns (e.g., `'use cache'` inside classes, components importing stores directly).

**Criterion:** architectural rules are verified against the target scope.

## Step 5 — Detect type issues & smells

Scan for `: any`, `: unknown`, `as any`, `@ts-ignore`.
Sweep for long view-models, huge component trees without composition, and magic strings.

**Criterion:** types and smells are judged.

## Step 6 — Write the report

Populate `assets/report-template.md` and write it to `.agent/audits/architectural-analysis-[timestamp].md`.
Replace every placeholder from steps 2–5.

## Step 7 — Summarize

Populate `assets/summary-template.md` and emit it inline in chat, linking to the full report.