# Detection Catalog

## Dead Code
- **High Confidence:** Exported functions/variables never imported anywhere.
- **Ignore (Not Dead):** Next.js routes (`page.tsx`, `layout.tsx`, `route.ts`), Storybook stories, Vitest tests, Server Actions exported for direct client use.

## Duplication
- **Component Duplication:** Re-implementing a UI primitive instead of importing from `@core/ui/primitives`.
- **Logic Duplication:** Same Zod schema defined in multiple DTOs.
- **State Duplication:** Storing derived state in Zustand instead of computing it on the fly.

## Anti-Patterns (Frontend Specific)
Also refer to `.agent/rules/antipatterns.md`.
- **Prop Drilling:** Passing props more than 3 levels deep instead of using Context or Zustand.
- **Huge View-Models:** `useViewModel` hook exceeding 150 lines or managing more than 4 separate domains of state.
- **Client/Server Bleed:** Importing `Server Actions` into a standard utility file instead of directly into the view-model.

## Type Issues
- **Masking:** Using `as any` to bypass domain entity constraints.
- **Implicit Any:** Missing return types on Use Cases.

## Code Smells
- **Long Parameter List:** More than 3 parameters (should use an object/DTO).
- **Complex Conditionals:** Deeply nested ternary operators in JSX.