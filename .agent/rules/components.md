# Component Rules

## Mandatory Anatomy

```
[comp-name]/
├── index.ts              # exports component + public types
├── comp-name.tsx         # composition — joins styles and sub-components
└── comp-name.css.ts      # Vanilla Extract styles
```

## Styles
- Styles MUST be in `.css.ts` (Vanilla Extract). Tamagui and Tailwind are not used in this web kit.
- Zero inline styles in `.tsx`
- Tokens consumed via `@core/ds/tokens.css` or `@core/ds/themes.css`
- Import of co-located styles MUST be relative (`import * as styles from './comp-name.css'`) and grouped at the end of imports
## Separation of Concerns
- Zero business logic
- Zero calls to use cases, factories, or stores
- Receives data via props or via view-model
- Named export is mandatory

## Core UI — Primitives
- Primitives (Button, Input, Select) reside in `src/core/ui/primitives/`
- Features import via `@core/ui/primitives` — never recreate locally
- Primitives do not import anything from `src/features/`
- Tokens consumed via `@core/ds` or `@core/ds/theme`
