# Presentation Rules (MVVM)

## Mandatory Data Flow

```
Router (page.tsx) → Container → [Slice] Screen → useSliceViewModel → Use Cases / Store → Domain / Infra
```

## View-Models
- Custom hooks in `[slice]/view-models/use[Slice]ViewModel.ts`
- ONLY point that instantiates use cases (via factories)
- ONLY point that consumes Zustand stores
- Debounce and timing reside in the view-model — never in the component or store
- Do not return instances of use cases or repositories

## Containers
- ONLY point that is aware of Server Components, Suspense, and Providers
- ErrorBoundary configuration point
- Zero business logic or significant UI

## Zustand Stores
- Only state and setters — zero business logic
- Zero HTTP calls — HTTP is the repository's responsibility
- Components do not import stores directly — only via view-models
- Use when: high frequency (drag/drop, resize, grids), shared state, optimistic updates

## Contexts
- Autonomous state with a smaller scope than a store
- Use when: distinct lifecycle, low update frequency
- Do not use for high frequency — use Store instead

## Components
- Receive data via props or view-models
- Zero importing of use cases, factories, or stores
- Zero business logic
