# Code Style Rules

## Formatting
- Semicolons (`;`) are **forbidden**
- Single quotes (`'`) are mandatory — never double quotes
- Package manager: **pnpm** — npm or yarn is forbidden

## React
- `import React from 'react'` is **forbidden** — import only necessary hooks (`import { useState } from 'react'`)

## Exports
- **Default exports are forbidden** in any file
- Named exports are mandatory — the name is the public contract

## Comments
- Code must be self-explanatory — zero explanatory comments in generated output
