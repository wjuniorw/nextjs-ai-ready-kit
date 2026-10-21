---
name: create-use-case
description: Add a new use case, DTO, and repository method to an existing feature. Use when expanding an existing domain with new business actions.
---

# create-use-case

Adds a use case to an existing feature — DTO, class, factory, and repo.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `use-cases.md` | Structure, factories, cache |
| `domain.md` | Repository interface, DTOs |
| `naming.md` | File naming |
| `code-style.md` | Exports, semicolons |
| `imports.md` | Path aliases and barrels |

## Expected Input

- [ ] Feature name
- [ ] Action name in kebab-case (e.g. `assign-task`)
- [ ] DTO fields (name and type)
- [ ] Return type
- [ ] If new repository method is needed

Read the domain snapshot first (`.agent/context/[feature].snapshot.md`).

## Step 1 — Scaffold via tool

```bash
bash .agent/harness/tools/scaffold-use-case.sh [feature-name] [action-name]
```

**Criterion:** DTO and use case stubs exist.

## Step 2 — Fill DTO

Edit `application/dtos/[action].dto.ts` — Zod + `z.infer`.
Add export in `application/dtos/index.ts`.

## Step 3 — Repository interface (if new method)

Add in `domain/repositories/[domain]-repository.interface.ts`.
Name by business intent.

## Step 4 — Fill use case

Edit `application/use-cases/[action].use-case.ts` — type with interface, implement `execute()`.
Add export in `application/use-cases/index.ts`.

## Step 5 — Concrete + in-memory repository (if new method)

Implement the method in both repositories.

## Step 6 — Factory

Add `make[Action]UseCase` in `infra/factories/use-cases.factory.ts`.
Add export in `infra/factories/index.ts`.

## Final Verification

- [ ] DTO uses Zod + `z.infer`
- [ ] Use case depends only on interface
- [ ] In-memory repo updated
- [ ] Factory is a function returning interface
- [ ] Barrels updated

## Output

1. Created/modified files
2. Signal snapshot update