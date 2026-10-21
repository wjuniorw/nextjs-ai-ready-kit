# Testing Rules

## Use Cases

- Vitest with in-memory repositories implementing the interface from `domain/`
- Zero framework, HTTP, or database dependency

```typescript
const repo = new [Domain]RepositoryInMemory()
const useCase = new [Action]UseCase(repo)
const result = await useCase.execute({ ... })
expect(result).toBeDefined()
```

## View-Models

- `renderHook` do Testing Library + Vitest
- Test factories inject in-memory repos

## In-Memory Repositories

- File: `infra/repositories/[domain].repository.in-memory.ts`
- Implement the exact same interface as the production repository
- Resettable state — expose `clear()` or `reset()`
- Reset in `beforeEach` of each suite
