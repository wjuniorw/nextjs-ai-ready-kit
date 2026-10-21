# Use Case Rules

## Structure

- One usecase = one business action
- Dependencies exclusively via constructor injection
- Depends only on interfaces from `domain/` — never on concrete implementations
- Zero imports from `presentation/`, UI frameworks, or HTTP
- Zero persistent internal state between executions

```typescript
export class [Action]UseCase {
  constructor(private readonly repository: I[Domain]Repository) {}
  async execute(dto: [Action]Dto): Promise<[ReturnType]> { ... }
}
```

## Factories

- Functions — never classes
- Accept `RepositoryContext` (`'front' | 'bff'`)
- Typed return based on the domain interface, not the implementation

```typescript
export const make[Action]UseCase = (context: RepositoryContext) => {
  const repository = make[Domain]Repository(context)
  return new [Action]UseCase(repository)
}
```

## Concrete Repositories

- Implement the interface from `domain/repositories/`
- Only translation between domain and API — zero business logic
- Instantiated only inside factories
- HttpClient injected via factory — never instantiated inside the repository

## Cache

- Cache via `CacheHttpClientDecorator` in the factory — never inside the repository
- `'fetch-cached'` for individual stable data
- Next.js cache for data shared between users
- Highly mutable data: reactive state (Zustand) — no cache
- Cache tags as named constants — never string literals
