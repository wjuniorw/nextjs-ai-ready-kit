# Antipatterns — Never Generate

If an instruction leads to any item below, **STOP and signal/warn**.

| Antipattern | Correct |
|---|---|
| Default export | Named export is mandatory |
| DTO with Zod in `domain/` | DTOs in `application/dtos/` |
| Business logic in component | Logic in use case or view-model |
| Relative import between modules | Absolute path alias (`@feature/`) |
| Factory as a class | Factory as a function |
| Component imports store directly | Store via view-model |
| Primitive recreated in feature | Import from `@core/ui/primitives` |
| Store makes HTTP call | HTTP in repository |
| Component calls Server Action | Action via view-model |
| Feature imports from another feature | Composite data from backend |
| Debounce in component | Debounce in view-model |
| Cache inside repository | Cache via decorator in factory |
| Widget with external callbacks | Widget receives only `entityId` |
| Widget depends on parent submit | Widget auto-save |
| Tailwind in new component | Vanilla Extract |
| Change labels/texts without request | Keep originals unchanged |
| `import React from 'react'` | Import only necessary hooks |
| Route handler for intra-feature logic | Server Action (`presentation/actions/`) |
| Cross-feature imports | Route Handler composes data (BFF) |
