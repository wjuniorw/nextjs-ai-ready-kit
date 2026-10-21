---
name: create-widget
description: Create a cross-feature widget with autonomous persistence. Use when a component has its own endpoint and saves data without a parent form.
---

# create-widget

Creates a Cross-Feature Widget — independent feature with auto-save and total encapsulation.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `widgets.md` | Classification criteria, public interface, auto-save |
| `architecture.md` | Feature structure |
| `domain.md` | Entities, repositories, DTOs |
| `use-cases.md` | Factories, cache |
| `components.md` | Component anatomy |
| `presentation.md` | MVVM, view-models |
| `naming.md` | Naming |
| `code-style.md` | Exports, formatting |
| `antipatterns.md` | Pre-delivery verification |

## Expected Input

- [ ] Widget name in kebab-case
- [ ] Anchor entity (`cardId`, `entityId`)
- [ ] Own persistence endpoint
- [ ] Auto-save behavior

### Confirmation — it is a widget if:
- [ ] Has own endpoint
- [ ] Has collection/resource in backend
- [ ] Persists without parent submit

If not → use `create-component`.

## Step 1 — Scaffold via tool

```bash
bash .agent/harness/tools/scaffold-widget.sh [widget-name]
```

**Criterion:** complete structure + root component `[widget]-widget` exist.

## Step 2 — Domain and Application

Follow steps 2-4 of `create-feature` skill.
Use `scaffold-use-case.sh` for each action (fetch, add, remove).

## Step 3 — Root component

Edit the `[widget]-widget.tsx` stub:
- Props: `entityId` only — per `widgets.md`
- Own ErrorBoundary + Suspense
- Zero external state callbacks

## Step 4 — View-Model with auto-save

`use[Widget]ViewModel.ts` — persists immediately on interaction, without external submit.

## Step 5 — Container

`[widget]-container.tsx` — promise via Context if Server Component.

## Step 6 — Barrels and imports

```bash
bash .agent/harness/tools/fix-imports.sh [widget-name]
```

## Final Verification

- [ ] Props: `entityId` only — zero callbacks
- [ ] Auto-save implemented
- [ ] Own ErrorBoundary
- [ ] Suspense with fallback
- [ ] Independent feature in `src/features/`
- [ ] Zero antipatterns

## Output

1. Created files
2. Consumption example in another feature
3. Signal snapshot creation