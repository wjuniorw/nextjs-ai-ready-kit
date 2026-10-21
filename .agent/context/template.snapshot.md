# [Feature] — Snapshot v1 (criado: YYYY-MM-DD)

> Resumo compactado do estado atual desta feature.
> Use este arquivo em vez de ler os arquivos reais — economiza tokens.
> Atualize com `/sync-snapshot [feature] update` após mudanças estruturais.

---

## Domínio

- **Entidade principal:** `[Entity]` { campo: tipo, campo: tipo }
- **Value Objects:** `[VO]` (regra encapsulada)
- **Interface:** `I[Domain]Repository` { método(params): ReturnType }

---

## Use Cases

| Use Case | Input DTO | Output | Status |
|---|---|---|---|
| `[Action]UseCase` | `[Action]Dto` | `[Domain]` | ✅ implementado |
| `[Action2]UseCase` | `[Action2]Dto` | `void` | ✅ implementado |
| `[Action3]UseCase` | — | `[Domain][]` | 🚧 pendente |

---

## Infra

- **Repositório:** `[Domain]Repository` via `[FetchHttpClient|AxiosHttpClient]` → `[path sem base URL]`
- **Repositório In-Memory:** ✅ implementado | 🚧 pendente
- **Estratégia de sprint:** factory aponta para `[InMemory|Concreto]` — endpoint `[disponível|em construção]`
- **Cache:** `fetch-cached` TTL [N]ms | `'use cache'` + `cacheTag('[prefixo]:[key]')` | não aplicável
- **Factories:**
  - `make[Domain]Repository(context)` — aceita `'front' | 'bff'` | `'server' | 'test'`
  - `make[Action]UseCase(context)`

---

## Presentation

- **Slices:** `[slice1]` (screen + viewModel), `[slice2]`
- **Container:** `[feature]-container.tsx` — [o que injeta/configura]
- **RSC Helpers:** `[arquivo].rsc.ts` — [funções exportadas] | não aplicável
- **Server Actions:** `[action].action.ts` — [o que faz + invalidações de cache] | não aplicável
- **Stores:** `[domain].store.ts` — [estado gerenciado] | não aplicável
- **Contexts:** `[context].context.tsx` — [o que distribui] | não aplicável

---

## Contrato de API

- **Arquivo:** `.agent/api/contracts/[feature].contract.json` | não existe ainda
- **Status:** disponível | draft | sem contrato
- **Endpoints principais:**
  - `[METHOD] /[path]` → `[use case]`

---

## Segurança (secops)

- **Categorias verificadas:** BOLA | BFLA | RLS | Race Conditions | outro | não verificado
- **Findings abertos:** [descrição] | nenhum

---

## Testes

- [ ] Use cases com repositório in-memory
- [ ] View-models com `renderHook`
- [ ] Repositório in-memory implementado

---

## Pendências conhecidas

- [ ] [pendência 1]
- [ ] [pendência 2]

---

## Histórico de versões

| Versão | Data | O que mudou |
|---|---|---|
| v1 | YYYY-MM-DD | Criação inicial |
