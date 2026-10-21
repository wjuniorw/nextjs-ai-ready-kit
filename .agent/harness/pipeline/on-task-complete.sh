#!/bin/bash
# Pipeline: on-task-complete
# Executado após cada task de implementação.
# Fluxo: lint → testes → commit (semi-automático)
#
# Uso: bash .agent/harness/pipeline/on-task-complete.sh [feature] [task-id?]
#
# Exemplos:
#   bash .agent/harness/pipeline/on-task-complete.sh auth
#   bash .agent/harness/pipeline/on-task-complete.sh auth 3

set -e

FEATURE=${1:-""}
TASK_ID=${2:-""}
HARNESS_DIR=".agent/harness"
TOOLS_DIR="$HARNESS_DIR/tools"
LOG_DIR="$HARNESS_DIR/logs"
MAX_FIX_ATTEMPTS=2

if [ -z "$FEATURE" ]; then
  echo "Uso: bash .agent/harness/pipeline/on-task-complete.sh [feature] [task-id?]"
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PIPELINE_LOG="$LOG_DIR/pipeline-$FEATURE-$TIMESTAMP.log"
mkdir -p "$LOG_DIR"

# ─────────────────────────────────────────
print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

print_step() {
  echo ""
  echo "  ▶ $1"
  echo ""
}

log() {
  echo "$1" | tee -a "$PIPELINE_LOG"
}
# ─────────────────────────────────────────

print_header "PIPELINE: on-task-complete"
log "Feature:  $FEATURE"
log "Task:     ${TASK_ID:-'não especificada'}"
log "Log:      $PIPELINE_LOG"
log "Início:   $(date '+%Y-%m-%d %H:%M:%S')"

# ─────────────────────────────────────────
# ETAPA 1 — LINT
# ─────────────────────────────────────────
print_step "ETAPA 1 — Lint + Type Check"

LINT_ATTEMPT=0
LINT_OK=false

while [ $LINT_ATTEMPT -lt $((MAX_FIX_ATTEMPTS + 1)) ]; do
  if bash "$TOOLS_DIR/lint.sh" "$FEATURE" 2>&1 | tee -a "$PIPELINE_LOG"; then
    LINT_OK=true
    log "  ✅ Lint passou na tentativa $((LINT_ATTEMPT + 1))"
    break
  else
    LINT_ATTEMPT=$((LINT_ATTEMPT + 1))
    if [ $LINT_ATTEMPT -le $MAX_FIX_ATTEMPTS ]; then
      log "  ⚠️  Lint falhou — tentativa $LINT_ATTEMPT/$MAX_FIX_ATTEMPTS"
      log "     Aguardando correção automática pelo agente..."
      echo ""
      echo "  → Lint falhou. O agente deve corrigir os erros acima."
      echo "    Pressione ENTER após a correção para tentar novamente..."
      read -r
    fi
  fi
done

if [ "$LINT_OK" = false ]; then
  print_header "❌ PIPELINE INTERROMPIDO"
  log "Lint falhou após $MAX_FIX_ATTEMPTS tentativas."
  log "Ação necessária: corrija os erros manualmente e rode o pipeline novamente."
  echo ""
  echo "  bash .agent/harness/pipeline/on-task-complete.sh $FEATURE $TASK_ID"
  exit 1
fi

# ─────────────────────────────────────────
# ETAPA 2 — TESTES
# ─────────────────────────────────────────
print_step "ETAPA 2 — Testes"

TEST_ATTEMPT=0
TEST_OK=false

while [ $TEST_ATTEMPT -lt $((MAX_FIX_ATTEMPTS + 1)) ]; do
  if bash "$TOOLS_DIR/test-runner.sh" "$FEATURE" 2>&1 | tee -a "$PIPELINE_LOG"; then
    TEST_OK=true
    log "  ✅ Testes passaram na tentativa $((TEST_ATTEMPT + 1))"
    break
  else
    TEST_ATTEMPT=$((TEST_ATTEMPT + 1))
    if [ $TEST_ATTEMPT -le $MAX_FIX_ATTEMPTS ]; then
      log "  ⚠️  Testes falharam — tentativa $TEST_ATTEMPT/$MAX_FIX_ATTEMPTS"
      echo ""
      echo "  → Testes falharam. O agente deve corrigir os erros acima."
      echo "    Pressione ENTER após a correção para tentar novamente..."
      read -r
    fi
  fi
done

if [ "$TEST_OK" = false ]; then
  print_header "❌ PIPELINE INTERROMPIDO"
  log "Testes falharam após $MAX_FIX_ATTEMPTS tentativas."
  log "Ação necessária: corrija os testes manualmente e rode o pipeline novamente."
  echo ""
  echo "  bash .agent/harness/pipeline/on-task-complete.sh $FEATURE $TASK_ID"
  exit 1
fi

# ─────────────────────────────────────────
# ETAPA 3 — COMMIT (semi-automático)
# ─────────────────────────────────────────
print_step "ETAPA 3 — Commit"

# Verificar se há arquivos para commitar
STAGED=$(git diff --cached --name-only 2>/dev/null)
UNSTAGED=$(git diff --name-only src/features/"$FEATURE" 2>/dev/null)

if [ -z "$STAGED" ] && [ -z "$UNSTAGED" ]; then
  log "  ℹ️  Nenhum arquivo modificado em src/features/$FEATURE"
  log "     Nada a commitar."
else
  # Stage arquivos da feature se não estiverem staged
  if [ -z "$STAGED" ] && [ -n "$UNSTAGED" ]; then
    echo "  → Arquivos modificados detectados:"
    echo "$UNSTAGED" | sed 's/^/    /'
    echo ""
    read -p "  Adicionar todos ao stage? [s/N] " ADD_CONFIRM
    if [ "$ADD_CONFIRM" = "s" ] || [ "$ADD_CONFIRM" = "S" ]; then
      git add "src/features/$FEATURE"
      log "  ✅ Arquivos adicionados ao stage"
    else
      log "  ⚠️  Stage cancelado pelo usuário"
    fi
  fi

  # Gerar commit message com conventional commits
  TASK_SUFFIX=""
  [ -n "$TASK_ID" ] && TASK_SUFFIX=" [task-$TASK_ID]"

  CHANGED_COUNT=$(git diff --cached --name-only | wc -l | tr -d ' ')
  COMMIT_MSG="feat($FEATURE): implement task${TASK_SUFFIX} (${CHANGED_COUNT} files)"

  # Commit semi-automático — mostra e aguarda confirmação
  bash "$TOOLS_DIR/git.sh" commit "$FEATURE" "$COMMIT_MSG"
fi

# ─────────────────────────────────────────
# RELATÓRIO FINAL
# ─────────────────────────────────────────
print_header "✅ PIPELINE CONCLUÍDO"
log "Feature:  $FEATURE"
log "Task:     ${TASK_ID:-'não especificada'}"
log "Término:  $(date '+%Y-%m-%d %H:%M:%S')"
log "Log:      $PIPELINE_LOG"
echo ""
echo "  Próximos passos:"
echo "  1. Marque a task como ✅ em .agent/tasks/$FEATURE.tasks.md"
echo "  2. Execute a próxima task"
echo "  3. Quando todas as tasks estiverem ✅:"
echo "     bash .agent/harness/pipeline/on-feature-complete.sh $FEATURE"
echo ""
