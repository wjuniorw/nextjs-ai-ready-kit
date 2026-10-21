---
name: audit-rounds
description: Orquestra rodadas de auditoria de segurança e arquitetura do envolvati-payments-gateway, disparando as skills de análise arquitetural, boas práticas de segurança e modelagem de ameaças (em subagentes paralelos quando o harness suportar), e mantém um registro mestre de riscos com IDs estáveis entre rodadas em audits-rounds/risk-register.md. Use esta skill sempre que o usuário pedir para "rodar as auditorias de novo", "nova rodada de auditoria", "rechecar as skills de segurança/arquitetura", "conferir se as correções da feature X foram validadas", ou depois de qualquer ciclo de remediação em que os 3 relatórios (architectural_analysis_report, security_best_practices_report, threat_model) precisem ser regerados e comparados contra a rodada anterior. Não use para uma auditoria pontual de um único arquivo isolado — é para o ciclo completo do repositório.
---

# Audit Rounds — Orquestrador de Auditoria Contínua

## Por que essa skill existe

Rodar as três análises (arquitetura, boas práticas de segurança, modelagem de ameaças) isoladamente, rodada após rodada, tem dois problemas observados na prática deste projeto:

1. **IDs reciclados**: cada rodada nova gera `TM-001..TM-00N` / `SEC-001..N` / `ARCH-001..N` do zero. Um "TM-003" da rodada 1 pode significar algo completamente diferente do "TM-003" da rodada 2 — quebra rastreabilidade histórica.
2. **Fechamento por silêncio**: um achado que estava aberto na rodada anterior e simplesmente não é mencionado no resumo da rodada nova é fácil de interpretar como "resolvido" quando na verdade pode só ter sido esquecido pelo subagente que gerou o relatório.

Esta skill resolve os dois problemas com um **registro mestre** (`risk-register.md`) com IDs próprios e estáveis, e uma regra explícita: **nenhum achado é fechado sem evidência citada**.

## O que essa skill NÃO faz

- Não substitui as três skills/prompts de análise em si (arquitetural, segurança, threat model) — ela só orquestra, persiste e reconcilia o que elas produzem.
- Não decide sozinha se um achado está "de fato" corrigido — isso é sempre uma leitura do relatório + evidência (commit, teste, trecho de código), nunca uma suposição.
- Não roda como parte do fluxo normal de `tlc-spec-driven` Execute — é um passo à parte, tipicamente disparado depois que um ciclo de remediação (`remediation-tasks.md`) termina.

## Pré-requisitos e assunções

- Assume a estrutura de pastas descrita em `project_structure.md` / `.agent/rules/`. Se o seu harness guarda skills em outro lugar que não `.agent/skills/`, ajuste o caminho antes de instalar.
- Assume que as três análises (arquitetural, boas práticas de segurança, modelagem de ameaças) já existem como skills/prompts no seu catálogo local. Esta skill não as recria — ela referencia pelo nome. **Confirme com o usuário, na primeira execução, qual é o nome/caminho exato de cada uma no harness dele**, e grave essa correspondência no topo de `audits-rounds/risk-register.md` (seção `## Fontes`) para não precisar perguntar de novo nas próximas rodadas.
- Se o harness não suportar subagentes (sem ferramenta tipo `Task`/delegação paralela), rode as três análises sequencialmente no mesmo turno em vez de em paralelo — o resto do fluxo é idêntico.

## Fluxo de execução

### Passo 0 — Descobrir o número da rodada

```
ls audits-rounds/ 2>/dev/null | grep -E '^round-[0-9]+' | sort -V | tail -1
```

Próxima rodada = último número + 1. Se `audits-rounds/` não existir, esta é a `round-01` — crie a pasta e inicialize `risk-register.md` a partir de `assets/risk-register-template.md`.

### Passo 1 — Disparar as três análises

Se o harness suporta subagentes: dispare os três em paralelo, cada um com uma instrução curta e auto-contida (não injete o `risk-register.md` inteiro no prompt do subagente — ele não precisa disso, só precisa gerar o relatório da sua especialidade). Cada subagente deve:

1. Rodar a análise completa contra o estado atual do código (branch atual, salvo instrução em contrário do usuário).
2. Escrever o relatório bruto em `audits-rounds/round-{N}-{YYYY-MM-DD}/{nome-do-relatorio}.md`.
3. Retornar ao orquestrador **só um resumo estruturado**, não o relatório inteiro: para cada achado, `{titulo, severidade, localização (arquivo:linha), status declarado (novo/residual/corrigido), evidência citada}`. Isso mantém o contexto do orquestrador enxuto mesmo com relatórios grandes.

Se não há subagentes: rode as três análises uma de cada vez, salvando cada relatório no mesmo caminho, e monte você mesmo o resumo estruturado de cada uma antes de passar ao Passo 2.

### Passo 2 — Reconciliar contra o registro mestre

Abra `audits-rounds/risk-register.md`. Para cada achado retornado no Passo 1:

- **Faça match por conteúdo (localização + descrição), nunca por ID do relatório de origem.** IDs tipo `TM-003`/`SEC-007`/`ARCH-002` são efêmeros por rodada; o `RISK-XXX` do registro mestre é que é estável.
- Se bate com uma entrada existente: atualize `Status`, `Última rodada verificada`, e anexe a evidência nova em `Notas` (não sobrescreva o histórico, adicione).
- Se não bate com nada: crie uma entrada nova com o próximo `RISK-XXX` livre, `Primeira rodada` = rodada atual.
- Se um achado da rodada anterior estava `open` e **não foi mencionado em nenhum dos três relatórios novos**: NÃO marque como corrigido. Marque como `NEEDS-VERIFICATION` e liste explicitamente na seção "Itens órfãos" do resumo da rodada (Passo 4). Só vira `fixed` quando alguém — humano ou uma rodada de auditoria futura — confirmar com evidência.
- Um achado só vira `fixed` quando o relatório da rodada afirma explicitamente que foi corrigido **e** cita evidência verificável (commit hash, nome de teste, trecho de diff). "Não apareceu mais no relatório" não é evidência.

### Passo 3 — Cross-checar contradições entre os três relatórios

Antes de fechar a reconciliação, releia os três resumos estruturados procurando por:
- O mesmo problema descrito por dois relatórios diferentes (ex.: um bug de concorrência aparecendo tanto na Análise Arquitetural quanto no Threat Model) — isso é sinal de severidade real, não duplicata a descartar. No registro mestre, uma entrada `RISK-XXX` pode citar múltiplas fontes em `Notas`.
- Um relatório dizendo "corrigido" e outro citando o mesmo local como ainda vulnerável — isso é bloqueante, precisa aparecer em destaque no resumo da rodada, não silenciosamente resolvido a favor de um dos dois.

### Passo 4 — Gerar o resumo da rodada

Escreva `audits-rounds/round-{N}-{YYYY-MM-DD}/summary.md` a partir de `assets/round-summary-template.md`, preenchendo:
- Veredito por dimensão (igual ao `audit-summary` que o usuário já produz manualmente).
- **Delta explícito vs. rodada anterior**: quantos `RISK-XXX` abriram, quantos fecharam (com evidência), quantos viraram `NEEDS-VERIFICATION`.
- Seção "Itens órfãos" (do Passo 2) — sempre presente, mesmo que vazia (aí diga explicitamente "nenhum item órfão nesta rodada").
- Seção "Contradições entre relatórios" (do Passo 3) — idem, sempre presente.

### Passo 5 — (Opcional) Gerar remediation-tasks.md

Se houver `RISK-XXX` com status `open` ou `NEEDS-VERIFICATION` e o usuário quiser seguir pro ciclo de remediação, gere um `remediation-tasks.md` no formato já usado no projeto (Execution Protocol + Test Coverage Matrix + Gate Check Commands + Execution Plan por fases de severidade + Task Breakdown com `Requirement` apontando para o `RISK-XXX` do registro mestre, não para o ID efêmero do relatório). Pergunte antes de gerar — nem toda rodada termina em remediação imediata.

## Formato do risk-register.md

Ver `assets/risk-register-template.md` para o template completo. Estrutura da tabela principal:

| Campo | Descrição |
|---|---|
| `ID` | `RISK-XXX`, sequencial, nunca reaproveitado mesmo se o item for fechado |
| `Título` | Curto, estável entre rodadas (não reescreva a cada rodada) |
| `Severidade` | Critical / High / Medium / Low — usa a maior severidade já atribuída entre as rodadas, nunca rebaixa sem justificativa explícita |
| `Categoria` | Security / Architecture / Threat-Model / Concurrency / etc. |
| `Localização` | Arquivo:linha (atualize se o código se moveu) |
| `Status` | `open` / `fixed` / `needs-verification` / `accepted-risk` / `wontfix` |
| `Primeira rodada` | Ex.: `round-01` |
| `Última rodada verificada` | Ex.: `round-03` |
| `Fontes originais` | Ex.: `TM-003 (round-01), SEC-007 (round-01), ARCH-001 (round-02)` |
| `Notas` | Histórico cumulativo — cada rodada adiciona, nunca substitui |

## Regras críticas (não negociáveis)

- Nunca use o ID de um relatório individual (`TM-xxx`, `SEC-xxx`, `ARCH-xxx`) como identificador permanente de um risco — sempre traduza para `RISK-XXX` no registro mestre.
- Nunca marque algo como `fixed` sem uma evidência citável explicitamente na entrada do registro.
- Um item aberto que desaparece de um relatório novo vira `needs-verification`, nunca `fixed` por omissão.
- Achados críticos ou altos que ficaram fora do escopo de uma feature específica (ex.: bug pré-existente em outro módulo) continuam no registro mestre com sua severidade real — não ganham automaticamente um rebaixamento de prioridade só porque "não é desta feature".
- Ao final de cada rodada, o resumo (Passo 4) deve ser legível sozinho — alguém que só lê o `summary.md` da rodada N não deveria precisar abrir os três relatórios brutos pra saber o que mudou.
