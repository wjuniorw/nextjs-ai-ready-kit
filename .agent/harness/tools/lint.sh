#!/bin/bash
# Tool: lint
# Roda OXLint (rápido), ESLint (para fix/plugins) + TypeScript check
# Uso: bash .agent/harness/tools/lint.sh [feature?]
#
# Exemplos:
#   bash .agent/harness/tools/lint.sh
#   bash .agent/harness/tools/lint.sh auth

set -e

FEATURE=${1:-""}
LOG_DIR=".agent/harness/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$LOG_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LINT + TYPE CHECK"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
[ -n "$FEATURE" ] && echo "  Feature: $FEATURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

LOG_FILE="$LOG_DIR/lint-$TIMESTAMP.log"
ERRORS=0

# TARGET
TARGET=${FEATURE:+"src/features/$FEATURE"}
TARGET=${TARGET:-"src/"}

# OXLint check
echo "→ OXLint (Fast Detection)..."
set +e
pnpm oxlint "$TARGET" 2>&1 | tee -a "$LOG_FILE"
OXLINT_EXIT=${PIPESTATUS[0]}
set -e

if [ $OXLINT_EXIT -ne 0 ]; then
  echo "  ⚠️ OXLint: problemas detectados. Tentando fixar com ESLint..."
  
  echo "→ ESLint (Auto Fix)..."
  set +e
  ESLINT_USE_FLAT_CONFIG=false pnpm eslint "$TARGET" --fix --max-warnings=0 2>&1 | tee -a "$LOG_FILE"
  ESLINT_EXIT=${PIPESTATUS[0]}
  set -e

  if [ $ESLINT_EXIT -ne 0 ]; then
    echo "  ❌ ESLint: não foi possível corrigir todos os problemas"
    ERRORS=$((ERRORS + 1))
  else
    echo "  ✅ ESLint: problemas corrigidos automaticamente"
  fi
else
  echo "  ✅ OXLint: ok"
fi

echo ""

# TypeScript check
echo "→ TypeScript check..."
set +e
pnpm tsc --noEmit 2>&1 | tee -a "$LOG_FILE"
TSC_EXIT=${PIPESTATUS[0]}
set -e

if [ $TSC_EXIT -ne 0 ]; then
  echo "  ❌ TypeScript: erros encontrados"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ TypeScript: ok"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
  echo "  ✅ LINT PASSOU"
  echo "  Log: $LOG_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
else
  echo "  ❌ LINT FALHOU ($ERRORS problema(s))"
  echo "  Log: $LOG_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 1
fi
