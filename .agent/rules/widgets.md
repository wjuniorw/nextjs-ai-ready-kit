# Cross-Feature Widget Rules

## Classification Criteria — it is a widget if any of the following is true:
- It has its own persistence endpoint
- It has its own collection/resource on the backend
- It depends on data from multiple features
- It persists without a parent form submit

## Structure
- Reside in `src/features/` as independent features — never inside another feature
- Follow exactly the same standard feature anatomy

## Public Interface
- Root component accepts only strict identifiers (`entityId`, `cardId`)
- Zero external state callbacks — they are self-sufficient black boxes

## Persistence
- Auto-save is mandatory — zero dependency on parent form submit
- Persists immediately upon interaction

## Encapsulation
- Dedicated ErrorBoundary in the root component
- Suspense with fallback at the point of consumption

```typescript
<ErrorBoundary fallback={<WidgetError />}>
  <Suspense fallback={<WidgetSkeleton />}>
    <MyWidget entityId={entity.id} />
  </Suspense>
</ErrorBoundary>
```
