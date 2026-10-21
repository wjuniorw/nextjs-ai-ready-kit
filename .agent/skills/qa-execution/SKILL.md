---
name: qa-execution
description: Run real-user dogfooding sessions through public interfaces based on qa-report plans. Use when validating a release candidate, diff, or UI change.
---

# qa-execution

QA the product the way a real person meets it. A **persona** walks a journey through the UI, hits the edges, and reports what happened.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `../../rules/presentation.md` | Expected UI behaviors |
| `references/session-protocol.md` | The execution loop and evidence standard |

## Expected Input

- Scope of execution (which charters to run).
- Target environment (local dev server, staging).

## Step 1 — Resolve scope

Read `.agent/qa/charters/CH-[slug].md` to determine what needs to be walked.
Ensure the local server is running and accessible.

## Step 2 — Create the report

Create `.agent/qa/reports/[YYYY-MM-DD]-[scope].md`.

## Step 3 — Walk each journey in persona

For each charter:
- Adopt the persona.
- Walk the journey verb by verb to its end state.
- Hunt for paper cuts (friction that isn't a hard functional failure).

*Note: Since the agent operates in a headless or text environment, use tools like `curl`, API inspection, or specifically instruct the human user to perform manual visual checks if a browser tool is unavailable.*

## Step 4 — Experiential lens pass

Record `pass` / `friction` / `fail` for the journey based on the persona's experience.

## Step 5 — File findings

If any issues arise, generate the bug data and instruct the use of `qa-report` to file them into the bug registry.

## Output

1. Written report in `.agent/qa/reports/`
2. List of findings/paper cuts
3. Final status of the execution