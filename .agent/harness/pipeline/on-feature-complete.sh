#!/bin/bash
# Pipeline: on-feature-complete
# Executado quando todas as tasks de uma feature estão ✅.
# Fluxo: lint full → testes full → push → PR/MR
#
# Uso: bash .agent/harness/pipeline/on-feature-complete.sh [feature]

set -e

FEATURE=${1:-""}
HARNESS_DIR=".agent/harness"
TOOLS_DIR="$HARNESS_DIR/tools"
LOG_DIR="$HARNESS_DIR/logs"

if [ -z "$FEATURE" ]; then
  echo "Uso: bash .agent/harness/pipeline/on-feature-complete.sh [feature]"
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PIPELINE_LOG="$LOG_DIR/feature-complete-$FEATURE-$TIMESTAMP.log"
mkdir -p "$LOG_DIR"

print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

print_header "PIPELINE: on-feature-complete"
echo "  Feature: $FEATURE"
echo "  Branch:  $(git branch --show-current)"
echo "  Log:     $PIPELINE_LOG"

# ─────────────────────────────────────────
# ETAPA 1 — Lint completo (projeto inteiro)
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 1 — Lint completo"
echo ""

if ! bash "$TOOLS_DIR/lint.sh" 2>&1 | tee -a "$PIPELINE_LOG"; then
  print_header "❌ PIPELINE INTERROMPIDO — Lint falhou"
  echo "  Corrija os erros e rode novamente."
  exit 1
fi

# ─────────────────────────────────────────
# ETAPA 2 — Testes completos
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 2 — Testes completos"
echo ""

if ! bash "$TOOLS_DIR/test-runner.sh" 2>&1 | tee -a "$PIPELINE_LOG"; then
  print_header "❌ PIPELINE INTERROMPIDO — Testes falharam"
  echo "  Corrija os testes e rode novamente."
  exit 1
fi

# ─────────────────────────────────────────
# ETAPA 3 — Sync snapshot
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 3 — Sync snapshot"
echo ""
echo "  → Execute manualmente para atualizar o snapshot antes do PR:"
echo "    /sync-snapshot $FEATURE update"
echo ""
read -p "  Snapshot já atualizado? [s/N] " SNAP_OK

if [ "$SNAP_OK" != "s" ] && [ "$SNAP_OK" != "S" ]; then
  echo ""
  echo "  ⚠️  Atualize o snapshot antes de abrir o PR."
  echo "     /sync-snapshot $FEATURE update"
  echo ""
  echo "  Depois rode novamente: bash .agent/harness/pipeline/on-feature-complete.sh $FEATURE"
  exit 0
fi

# ─────────────────────────────────────────
# ETAPA 4 — Push + PR/MR
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 4 — Push + PR/MR"
echo ""

BRANCH=$(git branch --show-current)
SPEC_FILE=".agent/specs/$FEATURE.spec.md"
TITLE="feat($FEATURE): $(head -2 "$SPEC_FILE" 2>/dev/null | tail -1 | sed 's/^#*//' | xargs || echo "implement $FEATURE")"

echo "  Branch: $BRANCH"
echo "  Título: $TITLE"
echo ""

bash "$TOOLS_DIR/git.sh" pr "$FEATURE" "$TITLE"

# ─────────────────────────────────────────
print_header "✅ FEATURE COMPLETA"
echo "  Feature:  $FEATURE"
echo "  Término:  $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "  Artefatos gerados:"
[ -f ".agent/specs/$FEATURE.spec.md" ]    && echo "    ✅ .agent/specs/$FEATURE.spec.md"
[ -f ".agent/plans/$FEATURE.plan.md" ]    && echo "    ✅ .agent/plans/$FEATURE.plan.md"
[ -f ".agent/tasks/$FEATURE.tasks.md" ]   && echo "    ✅ .agent/tasks/$FEATURE.tasks.md"
[ -f ".agent/context/$FEATURE.snapshot.md" ] && echo "    ✅ .agent/context/$FEATURE.snapshot.md"
echo ""
