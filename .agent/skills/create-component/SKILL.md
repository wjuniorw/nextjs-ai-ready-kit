---
name: create-component
description: Scaffold and implement a new React component following project anatomy. Use when building UI primitives or feature-specific components.
---

# create-component

Creates a component following the mandatory project anatomy.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `components.md` | Anatomy, styles, primitives vs feature |
| `code-style.md` | Exports, semicolons, quotes |
| `naming.md` | File naming |
| `imports.md` | Path aliases, style exceptions |
| `presentation.md` | Separation of responsibilities |
| `antipatterns.md` | Pre-delivery verification |

## Expected Input

- [ ] Component name in kebab-case
- [ ] Destination: feature + slice or `core/ui/primitives`
- [ ] Expected props (name and type)
- [ ] Style library: `tamagui` or `vanilla` (default)

## Step 1 — Decision: feature vs primitive

| Criterion | Feature component | Core primitive |
|---|---|---|
| Knows domain | yes | no |
| Reused across features | rarely | always |

- Primitive → `src/core/ui/primitives/[name]/`
- Feature → `src/features/[feature]/presentation/[slice]/components/[name]/`

## Step 2 — Scaffold via tool

```bash
bash .agent/harness/tools/scaffold-component.sh [comp-name] [dest-dir] [tamagui|vanilla]
```

**Criterion:** `index.ts`, `.tsx`, `.styles.ts` (or `.css.ts`) files exist.

## Step 3 — Fill the component

Edit the generated `.tsx`:
- Typed props
- Implemented render
- Import styles with relative path (exception)
- Zero business logic, zero use cases/factories/stores imports

## Step 4 — Parent barrel

Add export in `index.ts` of the slice components or primitives folder.

## Final Verification

Go through `antipatterns.md` — focus on:
- Zero default exports
- If primitive: zero `src/features/` imports
- Styles in separate file

## Output

1. Created files
2. If primitive: indicate addition in `core/ui/primitives/index.ts` barrel