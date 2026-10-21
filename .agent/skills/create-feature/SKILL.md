---
name: create-feature
description: Scaffold and implement a complete vertical feature. Use when starting a new domain module with entities, use cases, and repositories.
---

# create-feature

Creates a complete vertical feature following the project's clean architecture.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `architecture.md` | Folder structure, path aliases |
| `domain.md` | Entities, VOs, interfaces, DTOs |
| `use-cases.md` | Use cases, factories, repos, cache |
| `naming.md` | Naming and barrels |
| `code-style.md` | Exports, semicolons, quotes |
| `imports.md` | Path aliases, ordering, exceptions |
| `presentation.md` | MVVM, view-models, stores, containers |
| `server-actions.md` | Front/bff context |
| `antipatterns.md` | Pre-delivery verification |

## Expected Input

- [ ] Feature name in kebab-case
- [ ] Domain entities with fields
- [ ] List of use cases
- [ ] UI Slices
- [ ] `RepositoryContext`: `front` | `bff` | both
- [ ] If Cross-Feature Widget → use `create-widget` instead

If input is missing, ask before proceeding.

## Step 1 — Scaffold via tool

```bash
bash .agent/harness/tools/scaffold-feature.sh [feature-name] [slice1,slice2]
```

**Criterion:** all folders and `index.ts` exist. Confirm via script output.

## Step 2 — Domain

Fill the created stubs:

1. **Entity** in `domain/entities/[domain].entity.ts` — per `domain.md`
2. **Value Objects** in `domain/value-objects/` (if any)
3. **Repository interface** in `domain/repositories/[domain]-repository.interface.ts`

**Criterion:** entity with `Object.assign`, interface with intent-based methods.

## Step 3 — Application

For each use case, auxiliary scaffold + fill:

```bash
bash .agent/harness/tools/scaffold-use-case.sh [feature-name] [action-name]
```

1. Fill the **DTO** with Zod schema + `z.infer`
2. Fill the **Use Case** with constructor injection, depending only on interface

**Criterion:** each use case depends only on domain interface.

## Step 4 — Infra

1. **Concrete repository** in `infra/repositories/[domain].repository.ts`
2. **In-memory repository** in `infra/repositories/[domain].repository.in-memory.ts`
3. **Factories** in `infra/factories/repo.factory.ts` and `use-cases.factory.ts`

**Criterion:** factories are functions returning interfaces.

## Step 5 — Presentation

For each slice:

1. **Components** via scaffold:
```bash
bash .agent/harness/tools/scaffold-component.sh [comp-name] [dest-dir]
```
2. **View-Model** in `[slice]/view-models/use[Slice]ViewModel.ts` — per `presentation.md`
3. **Container** in `containers/` (if Server Components)
4. **Server Actions** in `actions/` if `bff` context — per `server-actions.md`

**Criterion:** no component imports use case/factory/store directly.

## Step 6 — Barrels and imports

Trigger barrel-updater + validate imports:

```bash
bash .agent/harness/tools/fix-imports.sh [feature-name]
```

## Step 7 — Final Verification

Go through `antipatterns.md` item by item against generated code.

## Output

1. List of created files
2. Required path alias in `tsconfig.json`
3. Signal snapshot creation (`/sync-snapshot [feature] create`)