# Naming Rules

## Files

| Type | Pattern | Example |
|---|---|---|
| Use Case | `[action].use-case.ts` | `signin.use-case.ts` |
| Entity | `[domain].entity.ts` | `auth-user.entity.ts` |
| Value Object | `[name].value-object.ts` | `email.value-object.ts` |
| Repo Interface | `[domain]-repository.interface.ts` | `auth-repository.interface.ts` |
| Repository | `[domain].repository.ts` | `auth.repository.ts` |
| In-Memory Repo | `[domain].repository.in-memory.ts` | `auth.repository.in-memory.ts` |
| DTO | `[domain].dto.ts` | `auth.dto.ts` |
| Factory | `[scope].factory.ts` | `repo.factory.ts` |
| Store | `[domain].store.ts` | `task-grid.store.ts` |
| View-Model | `use[Slice]ViewModel.ts` | `useSigninViewModel.ts` |
| Componente | `[name].tsx` | `signin-form.tsx` |
| Styles Tamagui | `[name].styles.ts` | `signin-form.styles.ts` |
| Styles VE | `[name].css.ts` | `signin-form.css.ts` |

## Factories
- `make[Domain]Repository` for repositories
- `make[Action]UseCase` for use cases

## Barrels
- `index.ts` is mandatory in every folder with multiple exports
- Use `export * from './[file]'` — no re-exports with aliases
- Barrels MUST use relative paths (`./`)
