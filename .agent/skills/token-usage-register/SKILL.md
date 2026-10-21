---
name: token-usage-register
description: Register token consumption in the usage report. Use when the user provides output from a /context command to track costs.
---

# token-usage-register

Registers consumed tokens from a session in the `.agent/token-usage.md` report.

## Expected Input

Token data pasted by the user (output of `/context` or similar):
- Input Tokens
- Output Tokens
- Related task (if not provided, deduce from context)

## Step 1 — Extract data

- Input tokens, Output tokens
- Total = Input + Output
- Task: name or "General Activity"

## Step 2 — Read report

Read `.agent/token-usage.md`. If it doesn't exist, create with initial structure.

## Step 3 — Update tables

1. Add row in **Tarefas Realizadas**
2. Recalculate aggregated **Totais**

## Step 4 — Save and confirm

Save in `.agent/token-usage.md`.
Reply with the total of the insertion and the updated general balance.