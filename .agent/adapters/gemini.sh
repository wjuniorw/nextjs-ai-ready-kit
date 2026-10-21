#!/bin/bash
# Adapter: Gemini
# Modo 1 — instalar commands: bash .agent/adapters/gemini.sh install
# Modo 2 — iniciar CLI com skill: bash .agent/adapters/gemini.sh [skill]
#
# Exemplos:
#   bash .agent/adapters/gemini.sh install
#   bash .agent/adapters/gemini.sh specify
#   bash .agent/adapters/gemini.sh plan

set -e

AGENT_DIR=".agent"
ARG=${1:-""}

if [ "$ARG" = "install" ]; then
  bash "$(dirname "$0")/install.sh" gemini
  exit 0
fi

# Modo CLI — iniciar sessão com system-prompt + skill opcional
SYSTEM=$(cat "$AGENT_DIR/system-prompt.md")

if [ -n "$ARG" ] && [ -f "$AGENT_DIR/skills/$ARG.md" ]; then
  SKILL_CONTENT=$(cat "$AGENT_DIR/skills/$ARG.md")
  FULL_PROMPT="$SYSTEM

---

$SKILL_CONTENT"
  echo "→ Iniciando Gemini CLI com skill: $ARG"
else
  FULL_PROMPT="$SYSTEM"
  if [ -n "$ARG" ]; then
    echo "⚠️  Skill não encontrada: $ARG"
    echo "   Skills disponíveis:"
    ls "$AGENT_DIR/skills/" | sed 's/\.md//' | sed 's/^/   /'
    echo ""
  fi
  echo "→ Iniciando Gemini CLI sem skill específica"
  echo "   Dica: bash .agent/adapters/gemini.sh [skill]"
fi

gemini --system-prompt "$FULL_PROMPT"
