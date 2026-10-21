# Resumo da Rodada {N} — {YYYY-MM-DD}

**Rodada anterior**: round-{N-1} ({data}) — ou "primeira rodada" se N=1.

## Veredito por dimensão

| Dimensão | Veredito | Comparado à rodada anterior |
|---|:---:|---|
| Segurança e Boas Práticas | 🟢/🟡/🔴 | melhorou / piorou / estável |
| Arquitetura & Engenharia | 🟢/🟡/🔴 | melhorou / piorou / estável |
| Modelagem de Ameaças | 🟢/🟡/🔴 | melhorou / piorou / estável |

## Delta desde a rodada anterior

- **Novos riscos abertos**: `RISK-XXX`, `RISK-YYY` — (título curto de cada um)
- **Fechados com evidência**: `RISK-ZZZ` (commit/teste que comprova)
- **Rebaixados para needs-verification**: (deveria ser raro — todo item aqui é um item que a rodada anterior deu como resolvido e esta rodada não confirmou)

## Itens órfãos (sempre presente, mesmo vazia)

> Itens que estavam `open` na rodada anterior e não foram mencionados em nenhum dos três relatórios desta rodada. Continuam `needs-verification` até confirmação explícita — nunca fechados por omissão.

- _(nenhum item órfão nesta rodada — ou listar)_

## Contradições entre relatórios (sempre presente, mesmo vazia)

> Casos em que dois dos três relatórios discordam sobre o mesmo achado (ex.: um diz "corrigido", outro cita o mesmo local como vulnerável).

- _(nenhuma contradição nesta rodada — ou listar, com ambas as citações)_

## Achados novos desta rodada (defesa em profundidade / backlog)

| RISK-XXX | Severidade | Resumo |
|---|---|---|
| | | |

## Recomendação de próximo passo

- [ ] Gerar `remediation-tasks.md` para os itens `open`/`needs-verification`?
- [ ] Ou aguardar próxima rodada?
