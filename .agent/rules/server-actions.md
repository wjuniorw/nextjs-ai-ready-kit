# Server Actions and Front/BFF Context Rules

## Server Actions vs Route Handlers
- **Preference for Server Actions:** All intra-feature operations (simple CRUD, listings belonging to the feature itself) MUST use Server Actions in `presentation/actions/`.
- **Role of Route Handlers (BFF):** Route Handlers (`app/api/...`) are strictly reserved to act as a BFF. Only create one when a screen needs to aggregate data from **two or more different features**, avoiding cross-feature imports in the frontend.

## `front` Context Rule
- `makeUseCase('front')` only if the feature has a Route Handler in `app/api/...`
- Most features **do not** have native Route Handlers

## `bff` Context Rule — Server Actions
- Features without Route Handlers use Server Actions in `presentation/actions/`
- Action retrieves token via `getServerAuthToken()`, instantiates usecase with `'bff'`
- Returns pure JSON via `JSON.parse(JSON.stringify(result))`

```typescript
// presentation/actions/[feature].actions.ts
'use server'
import { make[Action]UseCase } from '@feature/infra/factories'
import { getServerAuthToken } from '@/lib/auth/server-auth'

export async function [action](dto: [Dto]) {
  const tokens = await getServerAuthToken()
  const useCase = make[Action]UseCase('bff', tokens)
  const result = await useCase.execute(dto)
  return JSON.parse(JSON.stringify(result))
}
```

## Consumption
- View-model calls the action — never the component directly
- Actions contain no business logic — only token extraction and orchestration

## `'use cache'`
- Only in a standalone asynchronous function in a `.rsc.ts` file
- Never in a class method, usecase, or repository
