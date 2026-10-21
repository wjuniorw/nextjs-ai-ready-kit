# Architecture Rules (Frontend) — Consolidated

## Feature Structure

```
src/features/[feature-name]/
├── application/
│   ├── dtos/           # Schemas Zod + z.infer
│   └── use-cases/      # One class per business action
├── domain/
│   ├── entities/       # Pure TS classes
│   ├── repositories/   # Contract interfaces
│   └── value-objects/  # Intrinsic validation
├── infra/
│   ├── factories/      # Functions injecting dependencies
│   └── repositories/   # Concrete implementations
└── presentation/
    ├── actions/        # Server Actions
    ├── containers/     # Framework adapters
    ├── contexts/       # React Context (low frequency)
    ├── stores/         # Zustand (high frequency)
    └── [slice]/
        ├── components/
        └── view-models/
```

## Structure Rules
- One folder per feature in `src/features/`
- `index.ts` is mandatory in `dtos/`, `use-cases/`, `value-objects/`, `factories/`
- `pages/`, `hooks/`, `services/`, `utils/` are forbidden in `src/` root
- Business logic only in `application/` or `domain/`
- HTTP call only in `infra/repositories/`

## Entity
- Attributes declared in the class + `Object.assign(this, props)`
- Zero getters, zero setters, zero individual parameters in the constructor

## Next.js Cache
- `'use cache'` ONLY in a standalone asynchronous function in a `.rsc.ts` file
- NEVER in a class method, usecase, or repository

## Routing & Security (Next.js)
- **Protected Routes:** Whenever creating a new logged-in feature or route, you MUST add its path to the protected routes configuration inside `src/proxy.ts`. Failure to do so will expose the route or break authentication logic.

## Feature Communication
- **Zero Cross-Imports in the Frontend:** A feature NEVER imports `UseCases` or `Repositories` from another feature in its Server Actions or Components.
- **BFF Aggregation:** If Feature A needs data from Feature B, the communication must happen in the real backend, or through a **Route Handler (BFF)** (`app/api/...`) in the frontend that orchestrates the dependencies and returns the composed data.
- Shared data resides in `src/shared/`

## Mandatory Path Aliases

```json
{
  "@[feature]/*": "src/features/[feature]/*",
  "@shared/*":    "src/shared/*",
  "@factories/*": "src/shared/factories/*",
  "@adapters/*":  "src/shared/adapters/*",
  "@domain/*":    "src/shared/domain/*",
  "@core/*":      "src/core/*"
}
```

**Rules origin:** ARCH-001, ARCH-002 in `LESSONS.md`
