---
name: sync-snapshot
description: Generate or update the domain context snapshot. Use when a feature's structure, entities, or use cases change to keep context fresh.
---

# sync-snapshot

Generates or updates snapshot — compressed replacement for reading real files.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `tokens-economy.md` | Snapshot purpose and hierarchy |
| `architecture.md` | Layers and structure to map |

## Expected Input

- [ ] Feature name
- [ ] Mode: `create` | `update`
- [ ] If `update`: list of modified files

## Step 1 — Read real files

Read `src/features/[feature]/`:
- `domain/` → entities, VOs, interface
- `application/` → DTOs, use cases
- `infra/` → factories, repos
- `presentation/` → slices, containers, stores

## Step 2 — Generate snapshot

```markdown
# [Feature] — Snapshot v[N] ([date])

## Domain
- **Entity:** `[Entity]` { field: type }
- **VOs:** `[VO]` ([rule])
- **Interface:** `I[Domain]Repository` { method(params): ReturnType }

## Use Cases
| Use Case | Input | Output | Status |
|---|---|---|---|
| `[Action]UseCase` | `[Action]Dto` | `[Type]` | ✅ |

## Infra
- **Repo:** `[Domain]Repository` → `[path]/*`
- **In-Memory:** ✅ | 🚧
- **Factories:** `make[Domain]Repository`, `make[Action]UseCase`

## Presentation
- **Slices:** `[slice]` (screen + viewModel)
- **Container / Store / Actions:** as implemented

## Tests
- Use cases: ✅ | 🚧
- View-models: ✅ | 🚧

## Pendings
- [ ] [pending]

## History
| Version | Date | Change |
|---|---|---|
```

## Step 3 — If `update`

1. Read existing snapshot
2. Present diff
3. Wait for confirmation
4. Increment version + history

## Step 4 — Save

`.agent/context/[feature].snapshot.md`

## Output

1. Complete snapshot
2. If update: summarized diff