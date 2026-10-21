# Import Rules — Consolidated

## Mandatory Double Rule
1. **Absolute** — never relative (`../`) between modules
2. **Barrel** — path ends at the folder when `index.ts` exists, never at the file

```typescript
// ✅ correct
import { SigninUseCase } from '@auth/application/use-cases'

// ❌ forbidden — direct file
import { SigninUseCase } from '@auth/application/use-cases/signin.use-case'

// ❌ forbidden — relative
import { SigninUseCase } from '../../use-cases/signin.use-case'
```

## Exceptions (mandatory relative paths)
1. **Barrels** (`index.ts`): `export * from './my-component'`
2. **Estilos colocalizados** (`.css`, `.css.ts`, `.styles.ts`): `import * as styles from './comp.css'`

## Ordering
- By ascending line length (asc)
- Style imports grouped and isolated at the end of the block

## Pre-delivery verification
```
❓ Do any imports start with './' or '../'?
   → If it's a barrel or co-located style: OK
   → Otherwise: REPLACE with the path alias
```

## Automatic Fix
```bash
bash .agent/harness/tools/fix-imports.sh [feature-name]
```

****Rules origin**:** IMP-001, IMP-002 em `LESSONS.md`
