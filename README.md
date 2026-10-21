# Next.js AI-Ready Kit

> Template frontend de alta performance para Next.js 16 (App Router + Turbopack + Partial Prefetching), estruturado com **Clean Architecture**, **DDD**, **Feature-Sliced Design (FSD)**, **MVVM** e **Vanilla Extract puro**. Projetado para permitir que agentes de IA (Claude, Cursor, Gemini, OpenCode) operem com máxima assertividade e zero deriva de padrões.

---

## Destaques Arquiteturais

- **Pure Vanilla Extract (`.css.ts`):** Zero Tailwind e zero Tamagui. CSS-in-JS com tipagem estrita de design tokens (`tokens.css.ts`, `themes.css.ts`), compilado em build-time para performance máxima e zero overhead de runtime.
- **Clean Architecture & DDD:** Separação estrita em camadas:
  - `domain/`: Entidades (`Object.assign`), Value Objects (validações intrínsecas), Interfaces de Repositório.
  - `application/`: Casos de uso puros com injeção de dependência e DTOs tipados com Zod (`z.infer`).
  - `infra/`: Implementações de repositórios HTTP (`HttpClient`), repositórios em memória para testes unitários e fábricas (`factories/`).
  - `presentation/`: MVVM (`containers/`, `view-models/`, `components/`) e Server Actions (`actions/`).
- **Feature de Exemplo (`auth`):**
  - Fluxos completos de **Entrar (`/signin`)**, **Criar Conta (`/signup`)** e **Recuperar Senha (`/recovery`)**.
  - Value Objects de `Email` e `Password`.
  - View-models reativos (`useSigninViewModel`, `useSignupViewModel`, `useRecoveryViewModel`).
- **Core UI & Design System:**
  - Componentes primitivos em `@core/ui`: `Button`, `Input`, `Card`, `Select`, `Badge`, `TabBar`, `Table`, `ConfirmModal`, `ConfirmApply`.
  - Design tokens canônicos em `@core/ds`.

---

## O Meta-Harness (`.agent/` vs `.agents/`)

Este projeto adota uma **separação conceitual deliberada**:

- **`.agent/` (Meta-Harness do Projeto):**
  - Contém a **Constituição (`system-prompt.md`)**, as regras temáticas (`rules/`), registros de decisões (`ADR.md`), lições aprendidas (`LESSONS.md`) e as ferramentas de scaffold (`harness/tools/`).
  - Abriga as skills proprietárias do repositório (`create-feature`, `create-use-case`, `create-component`, `analyze`, `tlc-spec-driven`, etc.).
- **`.agents/` ou `.cursor/skills/` (Skills Externas / CLI):**
  - A pasta `.agent/` **não substitui nem conflita** com diretórios criados ao instalar skills de terceiros via Vercel Skills CLI ou extensões de IDE. Elas coexistem harmonicamente.

---

## Integração TLC Spec-Driven com as Skills Nativas

O projeto amarra o fluxo estruturado da TLC com as skills de desenvolvimento do repositório:

1. **`spec`**: Define escopo e critérios em notação EARS.
2. **`design`**: Modela entidades, interfaces de repositório e contratos.
3. **`tasks`**: O validador determinístico (`validate_tasks.py`) garante que toda tarefa de código declare uma skill do projeto (`create-feature`, `create-use-case`, `create-component`).
4. **`execute`**: O agente lê a skill antes de codificar e aciona obrigatoriamente as ferramentas do harness:
   ```bash
   # Criar nova feature completa
   bash .agent/harness/tools/scaffold-feature.sh [nome] [slice1,slice2]

   # Criar caso de uso com DTO
   bash .agent/harness/tools/scaffold-use-case.sh [feature] [action-name]

   # Criar componente Vanilla Extract
   bash .agent/harness/tools/scaffold-component.sh [nome] [dest-dir]
   ```
5. **`audit`**: As skills `analyze` e `audit-rounds` auditam regras de código (proibição de `import React from 'react'`, ausência de imports relativos e testes íntegros).

---

## Scripts Disponíveis

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm run dev

# Build de produção (Turbopack + Partial Prefetching)
pnpm run build

# Type check estrito
pnpm exec tsc --noEmit

# Testes unitários (Vitest com Vanilla Extract Plugin)
pnpm run test:run

# Linter rápido
pnpm run lint:ox
```

---

## Licença

MIT
