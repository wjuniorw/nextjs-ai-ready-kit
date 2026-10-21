# Meta-Harness: Automatic Agent Initialization

When starting a session in this repository, you MUST process this file and register the following contexts without needing manual instruction from the developer:

## 1. Project Rules (Constitution & Guidelines)
- Read **immediately** `.agent/system-prompt.md`. It contains the project's constitution and indexes all architectural and styling rules located in `.agent/rules/`.
- Strictly follow these rules in all code suggestions, refactoring, or creations:
  - Clean Architecture & DDD (`domain/`, `application/`, `infra/`, `presentation/`).
  - Feature-Sliced Design (FSD) and MVVM (`containers/`, `view-models/`, `components/`).
  - Pure Vanilla Extract (`.css.ts`) — Tamagui and Tailwind are not used in this web kit.
  - Semicolons are forbidden, single quotes are mandatory, and `import React from 'react'` is strictly forbidden.
  - Zero relative imports across modules (always use absolute path aliases: `@/*`, `@core/*`, `@shared/*`, `@domain/*`, etc.).

## 2. Skill Registration & Conceptual Separation (.agent vs .agents)
- Scan and register in your context the skills available in `.agent/skills/`.
- **Important Conceptual Separation**:
  - `.agent/` is this project's internal **Meta-Harness and SDD Core** (Constitution, Rules, ADRs, Lessons, and custom domain skills).
  - `.agent/` **DOES NOT REPLACE OR CONFLICT** with `.agents/` or `.cursor/skills` directories that may exist in projects when skills are installed via the Vercel Skills CLI or external tooling. This is purely a deliberate conceptual separation:
    - `.agent/`: project-local architecture, SDD harness, and internal domain skills.
    - `.agents/` / `.cursor/skills/`: external/third-party skills installed via community package managers or IDE extensions.
- **TLC Spec-Driven Integration**:
  - Use `tlc-spec-driven` to drive feature development through its phased lifecycle: `spec` -> `design` -> `tasks` -> `execute` -> `audit`.
  - **Mandatory TLC-to-Skill Binding**:
    - During the `tasks` phase of TLC: every code task MUST declare its specific SDD skill (`create-feature`, `create-use-case`, `create-component`). `Skill: NONE` is forbidden for frontend code tasks.
    - During the `execute` phase of TLC: the agent MUST read `skill://<name>` before writing code and run the harness scaffold script (`scaffold-feature.sh`, `scaffold-component.sh`, etc.) first instead of manually scaffolding files.
- **Audit & Validation**:
  - Use `audit-rounds` and `analyze` upon implementation completion to audit clean code, verify imports, and ensure robust regression tests.

## 3. Dynamic Context & Contracts
- Before generating or altering code, check if there is a snapshot of the current domain in `.agent/context/[feature].snapshot.md` and load it.
- When modeling repositories, validate if there are pre-defined API contracts in `.agent/api/contracts/[feature].json`.
