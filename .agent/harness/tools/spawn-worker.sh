# .agent/harness/tools/spawn-worker.sh
SKILL=$1      # ex: sync-snapshot
FEATURE=$2     # ex: auth
MODEL=$3      # ex: qwen-free (modelo barato)

PROMPT="$(cat .agent/skills/$SKILL.md)"
CONTEXT="$(cat .agent/context/$FEATURE.snapshot.md 2>/dev/null || echo '')"
FILES="$(find src/features/$FEATURE -name '*.ts' | head -20)"

$CLI_TOOL --model $MODEL \
          --system-prompt "$PROMPT" \
          --message "Execute para o feature $FEATURE. Contexto: $CONTEXT. Arquivos: $FILES"
