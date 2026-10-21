#!/bin/bash
# Adapter: OpenCode
# Modo 1 — instalar estrutura: bash .agent/adapters/opencode.sh install
# Modo 2 — iniciar CLI com skill: bash .agent/adapters/opencode.sh [skill]
#
# Exemplos:
#   bash .agent/adapters/opencode.sh install
#   bash .agent/adapters/opencode.sh plan
#   bash .agent/adapters/opencode.sh create-feature

set -e

AGENT_DIR=".agent"
ARG=${1:-""}

if [ "$ARG" = "install" ]; then
  bash "$(dirname "$0")/install.sh" opencode
  exit 0
fi

# Modo CLI — iniciar sessão com system-prompt + skill opcional
SYSTEM=$(cat "$AGENT_DIR/system-prompt.md")

if [ -n "$ARG" ] && [ -f "$AGENT_DIR/skills/$ARG.md" ]; then
  SKILL_CONTENT=$(cat "$AGENT_DIR/skills/$ARG.md")
  FULL_PROMPT="$SYSTEM

---

$SKILL_CONTENT"
  echo "→ Iniciando OpenCode CLI com skill: $ARG"
else
  FULL_PROMPT="$SYSTEM"
  if [ -n "$ARG" ]; then
    echo "⚠️  Skill não encontrada: $ARG"
    echo "   Skills disponíveis:"
    ls "$AGENT_DIR/skills/" | sed 's/\.md//' | sed 's/^/   /'
    echo ""
  fi
  echo "→ Iniciando OpenCode CLI sem skill específica"
  echo "   Dica: bash .agent/adapters/opencode.sh [skill]"
fi

opencode --instructions <(echo "$FULL_PROMPT")
