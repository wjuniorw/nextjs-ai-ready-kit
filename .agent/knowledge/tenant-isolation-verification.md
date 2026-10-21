# Knowledge: Verificação de isolamento entre tenants
**Tipo:** roteiro de teste + checklist
**Status:** ativo — **nenhuma linha foi executada ainda** (coluna Resultado em branco)
**Origem:** leitura de código em 2026-10-13 (ver `.agent/context/multi-tenancy.snapshot.md` e ADR 0003)

> O risco clássico de SaaS multi-tenant é **BOLA/IDOR**: a pessoa autenticada pede um objeto
> de **outra empresa** pelo id e o servidor entrega. As rotas abaixo são **candidatas**
> porque o controller não aplica o guard que prende a entidade à empresa
> (`@SkipRoleGuard()` ou só `JwtAuthGuard`). Os services podem checar por dentro — **por isso
> o teste existe**. Complementa `secops.md` (categoria de acesso multi-tenant).

## Regras de segurança do teste

- **Só em ambiente local ou de homologação, com dados de teste. Nunca em produção.**
- Duas contas **de teste** em duas empresas **de teste** distintas. Não use contas de pessoas reais.
- Nenhum token, senha ou id real neste documento. Os valores ficam no seu terminal; o documento guarda só o resultado.
- Os testes de escrita (POST) usam uma empresa descartável como alvo, para não sujar dados que alguém usa.
- Um FAIL **não é divulgado fora do time**: vira tarefa no backend com a rota e o tipo de acesso.

## Montagem

| Papel | Descrição |
|---|---|
| Conta A | titular (ou member) da empresa **CA**. É quem "ataca" |
| Conta B | titular da empresa **CB**, com 1 produto, 1 projeto, 1 package, 1 story, 1 card e 1 board |
| Alvos | ids de CB: `COMPANY_B`, `PRODUCT_B`, `PROJECT_B`, `PACKAGE_B`, `STORY_B`, `BOARD_B`, `USER_B`, `ACCESS_B` |

Chamada-base (com o token de A, **nunca** o de B):

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "Authorization: Bearer $TOKEN_A" "$API/<rota>"
```

Repita cada linha **duas vezes**: sem header e com `-H "x-company-id: $COMPANY_A"` (a empresa
de A, a que ela realmente possui). O segundo caso é o que um atacante faria.

## Interpretação

| Resposta | Leitura |
|---|---|
| 401 / 403 / 404 | ✅ isolado |
| 200 com dados de CB | ❌ **vazamento** (anote o que veio: nomes, e-mails, títulos) |
| 200 vazio ou só dados de A | ✅ (lista filtrada pela pessoa) — confirme que não há item de CB |
| 400 | ⚠️ pede header ou body; refaça com `x-company-id` |
| 5xx | ⚠️ erro tratado mal; anote — pode esconder uma checagem ausente |

## Estado em 2026-10-15

Itens **8, 9, 10, 11 e 12** (`GET /projects|packages|stories .../company|product|project|package/:id` e `GET /cards/board/:id`): **vazamento CONFIRMADO em uso real** (reportado ao abrir uma empresa arquivada de terceiros: projetos, pacotes e histórias apareciam). **Corrigido** colocando essas rotas sob o `CapabilityGuard` (PR da API `fix/restore-e-listagens-por-empresa`); no teste local, `GET /projects/company/{alheia}` passou a 403. Falta o teste com **duas contas** e o restante da lista (squads, planning, access, deadlines, escritas).

## Leituras (testar primeiro — expõem pessoas e dados)

Ordem por risco. Coluna *Controller* = onde está a causa provável.

| # | Rota (com id de CB) | Controller | Por que é candidata | Resultado |
|---|---|---|---|---|
| 1 | `GET /access/entity/Company/$COMPANY_B` | `access.controller` | só `JwtAuthGuard`; lista membros (nome e e-mail) |  |
| 2 | `GET /access/user/$USER_B` | `access.controller` | só `JwtAuthGuard` |  |
| 3 | `GET /access/$ACCESS_B` e `GET /access` | `access.controller` | comentário diz "Sob o CapabilityGuard", decorator ausente |  |
| 4 | `GET /squads` e `GET /squads/:id` | `squads.controller` | só `JwtAuthGuard`; `GET /squads` sem filtro |  |
| 5 | `GET /planning/company-hierarchy/$COMPANY_B` | `planning.controller` | só `JwtAuthGuard` |  |
| 6 | `GET /planning/hierarchy-sidebar/$PRODUCT_B` | `planning.controller` | idem |  |
| 7 | `GET /planning/diagram-flow/$BOARD_B/<EntityType>` | `planning.controller` | idem |  |
| 8 | `GET /projects/company/$COMPANY_B` | `project.controller` | `@SkipRoleGuard()` |  |
| 9 | `GET /projects/product/$PRODUCT_B` | `project.controller` | `@SkipRoleGuard()` |  |
| 10 | `GET /stories/company/$COMPANY_B` e `/stories/package/$PACKAGE_B` | `story.controller` | `@SkipRoleGuard()` |  |
| 11 | `GET /packages/company/$COMPANY_B` e `/packages/project/$PROJECT_B` | `package.controller` | `@SkipRoleGuard()` |  |
| 12 | `GET /cards/board/$BOARD_B` | `card.controller` | `@SkipRoleGuard()` |  |
| 13 | `GET /activations/board/$BOARD_B` e `/activations/parent/:id` | `activationbar.controller` | `@SkipRoleGuard()` |  |
| 14 | `GET /deadlines/:id` (de CB) | `deadlines.controller` | só `JwtAuthGuard` |  |
| 15 | rotas de `stages`, `reports`, `references`, `files`, `inbox`, `conception-starters`, `ai-management` com id de CB | respectivos | controllers só com `JwtAuthGuard` |  |

## Escritas (depois das leituras; alvo descartável)

| # | Rota | Teste | Resultado |
|---|---|---|---|
| 16 | `POST /projects` | body com `company: COMPANY_B` usando o token de A |  |
| 17 | `POST /stories` e `POST /packages` | body apontando para projeto/package de CB |  |
| 18 | `POST /cards` e `POST /activations` | body apontando para board de CB |  |
| 19 | `POST /access/apply-profile` | aplicar um perfil de CB a si mesma (**escalada**) — `no-self-escalation.spec.ts` existe e não foi lido |  |

## Controles (rotas sob `CapabilityGuard`)

O desenho do guard prevê 403 quando o header diverge da empresa real da entidade
(`capability.guard.ts`: "That item belongs to another company"). Teste estas duas **antes**
das candidatas, para calibrar a montagem:

- `GET /access-profiles/company/$COMPANY_B` com `x-company-id: $COMPANY_A`.
- Uma rota de `maintenance` com o header de A e uma entidade de CB.

**Esperado: 403.** Isto é o esperado pelo código, **não foi executado**. Se vier 200, ou a
montagem está errada (confira os ids) ou é um achado — nos dois casos resolva antes de seguir.

## Depois do teste

1. Preencha a coluna Resultado (PASS/FAIL e o que veio na resposta).
2. Para cada FAIL: **antes** de mexer no controller, abra o service e confirme que não há checagem manual.
3. A correção estrutural é a do spec `sigapro-api/.agent/specs/access-reconciliation.spec.md` (levar essas rotas para o `CapabilityGuard`). Cada FAIL entra como tarefa nessa frente, com a rota e o impacto.
4. Atualize `.agent/context/multi-tenancy.snapshot.md`: troque "candidatos" por "confirmado" ou "descartado" e a data.
5. Reteste depois de cada correção.
