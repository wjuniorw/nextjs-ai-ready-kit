# Harness Checkpoints
# Define o nível de autonomia do agente em cada tipo de ação
#
# AUTÔNOMO   → agente executa sem perguntar
# ASSISTIDO  → agente mostra o que vai fazer e aguarda confirmação
# BLOQUEANTE → requer aprovação humana explícita — agente para e espera

---

## Autônomo — executa sem perguntar

- Criar arquivos em `src/features/`
- Criar arquivos em `.agent/`
- Rodar lint
- Rodar testes
- Ler qualquer arquivo do projeto
- Atualizar `index.ts` de barrels
- Gerar commit message
- Criar branch de feature

---

## Assistido — mostra e aguarda confirmação

- **Stage de arquivos** — mostra lista antes de `git add`
- **Commit** — mostra branch + message gerada + arquivos → aguarda `s/N`
- **Push** — mostra branch e destino → aguarda confirmação
- **Abrir PR/MR** — mostra título e base branch → aguarda confirmação
- **Atualizar snapshot** — mostra diff → aguarda confirmação
- **Instalar dependência** — mostra pacote e versão → aguarda confirmação
- **Modificar arquivo fora de `src/features/`** — mostra o que vai mudar

---

## Bloqueante — requer aprovação explícita antes de prosseguir

- **Deploy em produção** — sempre manual, nunca automático
- **Rodar migrations** — nunca sem confirmação e backup verificado
- **Alterar schema do banco** — requer review de DBA ou tech lead
- **Merge para main** — sempre via PR/MR aprovado
- **Alterar arquivos de CI/CD** — requer review humano
- **Alterar regras em `.agent/rules/` ou `system-prompt.md`** — requer decisão de arquitetura
- **Deletar arquivos** — sempre confirma, nunca automático
- **Alterar variáveis de ambiente** — nunca toca em `.env` sem confirmação

---

## Escalonamento — quando o agente para e chama humano

O agente deve parar e escalar para humano quando:

- Lint falhar mais de `2` vezes na mesma tentativa
- Testes falharem mais de `2` vezes na mesma tentativa
- Identificar conflito de arquitetura com as regras estabelecidas
- Identificar vulnerabilidade de segurança durante implementação
- Precisar de decisão que não está documentada em nenhum artefato
- Receber erro de permissão ou autenticação em qualquer tool
- Identificar que uma task do `.agent/tasks/` tem dependência não resolvida

---

## Como referenciar nos pipelines

```bash
# Verificar se ação é permitida antes de executar
# Consulte este arquivo antes de qualquer ação não trivial

CHECKPOINT="assistido"  # autônomo | assistido | bloqueante

if [ "$CHECKPOINT" = "bloqueante" ]; then
  echo "⛔ Ação bloqueante — aguardando aprovação humana"
  exit 1
fi

if [ "$CHECKPOINT" = "assistido" ]; then
  read -p "Confirmar? [s/N] " CONFIRM
  [ "$CONFIRM" != "s" ] && exit 0
fi
```
