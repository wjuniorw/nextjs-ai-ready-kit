# Regras de Domain

# Domain Rules

## Entities
- Pure TypeScript classes — zero dependencies on frameworks, UI, HTTP, or validators
- Attributes declared in the class + `Object.assign(this, props)`
- Zero getters, zero setters, zero individual parameters in the constructor

```typescript
class MyEntity {
  id: string
  name: string
  constructor(props: MyEntityProps) {
    Object.assign(this, props)
  }
}
```

## Value Objects
- Encapsulate frontend-specific validation (format, range, business rule)
- Zero external dependencies — no Zod, no frameworks
- Validation in constructor via `this.validate()`

## Repository Interfaces
- Defined in `domain/repositories/`
- Describe contract only — no reference to HTTP, database, or implementation
- Methods named by business intent, not HTTP verb

## DTOs
- **Reside in `application/dtos/`** — never in `domain/`
- Zod schemas with type inferred via `z.infer`
- Format validation only — zero business rules
