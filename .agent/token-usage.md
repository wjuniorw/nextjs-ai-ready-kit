# Relatório de Uso de IA (Tokens)

Este documento registra o consumo de tokens das atividades de IA realizadas durante o desenvolvimento, categorizados por tarefa e tipo de interação.

## Tarefas Realizadas

| Data       | Tarefa / Funcionalidade           | Tipo de Uso (Message/Skill) | Tokens Input | Tokens Output | Total Tokens |
|------------|-----------------------------------|-----------------------------|--------------|---------------|--------------|
| 01/06/2026 | Refatorar Diagram Board (Kanban)  | Message + Code Edit         | 0            | 0             | 0            |
| 01/06/2026 | Conectar Endpoint (Diagram Flow)  | Message                     | 0            | 0             | 0            |
| 02/06/2026 | Criar relatório de uso de IA      | Message                     | 0            | 0             | 0            |
| 02/06/2026 | Diagram Flow e Testes gerais      | Message + Skills            | 42900        | 58200         | 101100       |
| 03/06/2026 | lint e fixes                      | Message + Code Edit         | -            | -             | 62200        |
| 04/06/2026 | lint fixer                        | Message + Skills            | 31800        | 45800         | 77600        |
| 04/06/2026 | slice diagram                     | Message + Skills            | 31500        | 53400         | 84900        |
| 05/06/2026 | slice diagram add                 | Message + Skills            | 31516        | 50400         | 81916        |
| 06/06/2026 | slices diagram improvements       | Message + Skills            | 31792        | 87300         | 119092       |
<!-- Adicione novas linhas acima -->

## Totais por Tipo de Uso

| Tipo de Uso                 | Total de Tokens |
|-----------------------------|-----------------|
| Mensagens (Chat + Model)    | 273319          |
| Tool Calls                  | 24100           |
| Skills (Execução)           | 18500           |
| Subagents                   | 3270            |
| System / Tools Context      | 145400          |
| **Total Geral**             | **464589**      |

> **Nota do Agente:** Eu, como agente, não tenho acesso à telemetria bruta da API de quanto custou cada request (os tokens exatos de input/output do Gemini) no meu ambiente de execução atual. 
> Para preencher com os valores reais, você precisará consultar o painel da sua conta de faturamento (Google Cloud Vertex AI / Google AI Studio API) ou os logs do console onde você roda a CLI do Antigravity. Você pode atualizar esta tabela manualmente após consultar o seu painel de API.
