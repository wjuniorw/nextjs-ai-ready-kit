#!/bin/bash
# Tool: test-runner
# Roda os testes do projeto e retorna resultado estruturado
# Uso: bash .agent/harness/tools/test-runner.sh [feature?]
#
# Exemplos:
#   bash .agent/harness/tools/test-runner.sh
#   bash .agent/harness/tools/test-runner.sh auth
#   bash .agent/harness/tools/test-runner.sh auth --watch

set -e

FEATURE=${1:-""}
MODE=${2:-""}
LOG_DIR=".agent/harness/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$LOG_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TEST RUNNER"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
[ -n "$FEATURE" ] && echo "  Feature: $FEATURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Montar comando
if [ -n "$FEATURE" ] && [ "$MODE" = "--watch" ]; then
  CMD="pnpm test --reporter=verbose src/features/$FEATURE"
  echo "→ Modo watch — feature: $FEATURE"
elif [ -n "$FEATURE" ]; then
  CMD="pnpm test:run --reporter=verbose src/features/$FEATURE"
  echo "→ Rodando testes da feature: $FEATURE"
else
  CMD="pnpm test:run --reporter=verbose"
  echo "→ Rodando todos os testes"
fi

echo ""

# Executar e capturar output
LOG_FILE="$LOG_DIR/test-$TIMESTAMP.log"
set +e
$CMD 2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}
set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $EXIT_CODE -eq 0 ]; then
  echo "  ✅ TESTES PASSARAM"
  echo "  Log: $LOG_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "  ❌ TESTES FALHARAM (exit: $EXIT_CODE)"
  echo "  Log: $LOG_FILE"
  echo ""
  echo "  Últimas linhas do erro:"
  echo "  ─────────────────────────────────────"
  tail -20 "$LOG_FILE" | sed 's/^/  /'
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
