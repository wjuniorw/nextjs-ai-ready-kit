# Risk Register — envolvati-payments-gateway

> Registro mestre e cumulativo de todas as rodadas de auditoria. IDs (`RISK-XXX`) são permanentes e nunca reaproveitados, mesmo quando o item é fechado. Ver `.agent/skills/audit-rounds/SKILL.md` para o processo que mantém este arquivo.

## Fontes

> Preencher na primeira rodada e atualizar só se os nomes/caminhos das skills mudarem.

| Dimensão | Nome/caminho da skill ou prompt no harness |
|---|---|
| Análise Arquitetural | _(preencher)_ |
| Boas Práticas de Segurança | _(preencher)_ |
| Modelagem de Ameaças | _(preencher)_ |

## Registro

| ID | Título | Severidade | Categoria | Localização | Status | Primeira rodada | Última rodada verificada | Fontes originais | Notas |
|---|---|---|---|---|---|---|---|---|---|
| RISK-001 | _exemplo_ | Critical | Security | `path/to/file.go:123` | open | round-01 | round-01 | SEC-001 (round-01) | _histórico cumulativo aqui, uma linha por rodada com o que mudou_ |

## Convenções de Status

- `open` — identificado, sem correção confirmada.
- `fixed` — corrigido com evidência citada (commit hash, nome de teste, trecho de diff) na coluna Notas.
- `needs-verification` — estava `open`/`fixed` numa rodada anterior e não foi mencionado explicitamente na rodada mais recente. Precisa de confirmação manual ou de uma rodada dedicada antes de mudar de status.
- `accepted-risk` — decisão consciente de não corrigir agora, com justificativa e responsável registrados em Notas.
- `wontfix` — decisão de nunca corrigir (ex.: risco teórico sem exploração viável no contexto do produto), com justificativa registrada.

## Log de Rodadas

> Uma linha por rodada, para navegação rápida sem abrir cada `round-N/summary.md`.

| Rodada | Data | Veredito Segurança | Veredito Arquitetura | Veredito Threat Model | Novos RISK-XXX | Fechados (com evidência) | needs-verification |
|---|---|---|---|---|---|---|---|
| round-01 | _AAAA-MM-DD_ | | | | | | |
