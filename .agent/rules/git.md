# Git Rules — Consolidated

> Active rules derived from `LESSONS.md`. Quick reference without reading the full history.

## Stage
- NEVER `git add .` or `git add -A`
- ALWAYS list files explicitly: `git add [exact-path]`

## Commit
- NEVER direct `git commit`
- ALWAYS via `bash .agent/harness/pipeline/on-task-complete.sh [feature] [task-id]`

## Push / PR
- NEVER direct `git push` to main
- ALWAYS via `bash .agent/harness/pipeline/on-feature-complete.sh [feature]`

## Branch
- Naming: `feat/[name]`, `fix/[name]`, `chore/[name]`
- Trunk-based — short branches, frequent merge
- Branch off `staging` and open PRs against `staging` — never `main`

### Why `staging` is the trunk
Our workflow protects production while keeping integration speed high in homologation. We follow Trunk Based Development, but our day-to-day "trunk" is not `main`.
- **`staging` is the trunk** — our homologation environment. All ongoing development converges here continuously.
- **`main` is sacred** — it mirrors production. No direct commits are made to `main`; code only reaches it through a consolidated release PR from `staging`.

## AI-Assisted Development (SDD)
This project has a Meta-Harness in `.agent/` designed for pairing with AI models (Claude, Cursor, Gemini). Expected path:
1. **`/specify`** — never start coding directly; use the agent to detail the screen/hook requirements.
2. **`/plan`** — the agent uses `.agent/rules/` (MVVM, Feature-Sliced, Vanilla Extract) to design the needed components.
3. **`/create-feature` or `/create-component`** — code is generated already respecting the architecture.
4. **Rigorous validation** — test isomorphism (per the `extreme-software-optimization` skill); check for accessibility regressions and render-time (TTI) regressions.

## Pull Request
- ALWAYS follow `.github/pull_request_template.md` — never a free-form description
- Title MUST match the Issue name; link the Issue under `## Issue #`
- Write it in **Portuguese**, even though the product UI is in English: PRs are read by the partners, one of whom does not speak English fluently

### Filling the template
- **Descrição** — state what was *broken before*, not only what changed. That is what makes a large diff reviewable
- **Screenshots** — required whenever the change is visible on screen. They MUST be uploaded through the GitHub UI: a pre-filled compare link cannot carry images, so leave an HTML comment marking the spot
- **Tipos de Mudanças / Checklist** — tick every box that applies; do not leave the section untouched

### Always declare
- What was verified **in the browser** versus only type-checked — and what was **not** verified, with the reason
- Cross-repo dependencies: a frontend PR that needs an API fix must name the branch and whether it is already merged

**Rules origin:** GIT-001, GIT-002 in `LESSONS.md`; PR conventions adopted 2026-08-24, from the PR of the company collaboration cycle; branch naming (`feat/`) and the staging/main rationale merged in from `CONTRIBUTION_GUIDE.md` during Fase 2 Etapa 2 of the docs reorganization.
