---
name: write-tests
description: Write Vitest unit tests using in-memory repositories. Use when adding test coverage to use cases or view-models.
---

# write-tests

Unit tests with Vitest and in-memory repositories.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `testing.md` | Test patterns, in-memory, renderHook |
| `use-cases.md` | Use cases and factories structure |
| `naming.md` | Test file naming |
| `code-style.md` | Formatting |

## Expected Input

- [ ] Target feature
- [ ] Use cases and/or view-models to test
- [ ] Scenarios: happy path + edge cases

Read the domain snapshot before proceeding.

## Step 1 — In-memory repo

Verify if `infra/repositories/[domain].repository.in-memory.ts` exists.
If not, create implementing the same interface, with `clear()`.

## Step 2 — Use case tests

File: `application/use-cases/__tests__/[action].use-case.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

const repo = new [Domain]RepositoryInMemory()
const useCase = new [Action]UseCase(repo)

beforeEach(() => repo.clear())

it('should [happy scenario]', async () => {
  const result = await useCase.execute({ ... })
  expect(result).toBeDefined()
})
```

**Criterion:** zero framework/HTTP dependency.

## Step 3 — View-model tests (if requested)

File: `presentation/[slice]/view-models/__tests__/use[Slice]ViewModel.spec.ts`
Uses `renderHook` + test factory with in-memory.

## Step 4 — Run tests

```bash
bash .agent/harness/tools/test-runner.sh [feature]
```

**Criterion:** all pass.

## Output

1. Created test files
2. Execution result
3. Coverage: happy + edge cases