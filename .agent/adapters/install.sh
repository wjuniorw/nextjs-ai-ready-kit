#!/bin/bash
# Adapter unificado — instala commands para qualquer ferramenta suportada
# Uso: bash .agent/adapters/install.sh [claude|qwen|gemini|cursor|opencode]
#
# Ferramentas suportadas:
#   claude  → .claude/commands/  (.toml) + CLAUDE.md na raiz
#   gemini  → .gemini/commands/  (.toml) + GEMINI.md na raiz
#   qwen    → .qwen/commands/    (.md)   + QWEN.md na raiz
#   cursor  → .cursorrules       (system-prompt como arquivo único)
#   opencode→ .opencode/commands/ + agents/ + skills/ + opencode.json

set -e

AGENT_DIR=".agent"
TARGET=${1:-""}

if [ -z "$TARGET" ]; then
  echo "Uso: bash .agent/adapters/install.sh [claude|qwen|gemini|cursor|opencode]"
  echo ""
  echo "Ferramentas disponíveis:"
  echo "  claude  → .claude/commands/ (.toml) + CLAUDE.md"
  echo "  gemini  → .gemini/commands/ (.toml) + GEMINI.md"
  echo "  qwen    → .qwen/commands/   (.md)   + QWEN.md"
  echo "  cursor  → .cursorrules"
  echo "  opencode→ .opencode/commands/ + agents/ + skills/ + opencode.json"
  exit 1
fi

case $TARGET in
  claude)
    DEST=".claude/commands"
    EXT="toml"
    INSTR_FILE="CLAUDE.md"
    ;;
  gemini)
    DEST=".gemini/commands"
    EXT="toml"
    INSTR_FILE="GEMINI.md"
    ;;
  qwen)
    DEST=".qwen/commands"
    EXT="md"
    INSTR_FILE="QWEN.md"
    ;;
  cursor)
    DEST=""
    EXT=""
    INSTR_FILE=""
    ;;
  opencode)
    DEST=".opencode"
    EXT=""
    INSTR_FILE=""
    ;;
  *)
    echo "❌ Ferramenta não reconhecida: $TARGET"
    echo "   Use: claude | gemini | qwen | cursor | opencode"
    exit 1
    ;;
esac

# Cursor — gera .cursorrules e encerra
if [ "$TARGET" = "cursor" ]; then
  echo "→ Gerando .cursorrules para Cursor/Windsurf..."
  {
    cat "$AGENT_DIR/system-prompt.md"
    echo ""
    echo "---"
    echo ""
    echo "# Skills disponíveis"
    echo "Injete a skill correspondente no chat antes de cada tarefa:"
    for skill in "$AGENT_DIR"/skills/*.md; do
      name=$(basename "$skill" .md)
      echo "- @.agent/skills/$name.md"
    done
  } > .cursorrules
  echo "✅ .cursorrules gerado"
  echo "   Injete skills manualmente: @.agent/skills/[skill].md"
  exit 0
fi

# ──────────────────────────────────────────────────
# OpenCode — estrutura completa .opencode/
# ──────────────────────────────────────────────────
if [ "$TARGET" = "opencode" ]; then
  echo "→ Instalando estrutura para OpenCode..."

  # ── 1. Commands ──────────────────────────────
  mkdir -p "$DEST/commands"
  count=0
  for file in "$AGENT_DIR"/commands/*.md; do
    [ -f "$file" ] || continue
    name=$(basename "$file")
    cp "$file" "$DEST/commands/$name"
    echo "  ✓ command: $name"
    count=$((count + 1))
  done

  # ── 2. Agents ────────────────────────────────
  mkdir -p "$DEST/agents"
  agent_count=0
  for file in "$AGENT_DIR"/agents/*.md; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .md)

    # Extrai a description do frontmatter original
    desc=$(awk '/^description:/ {sub(/^description: /,""); print; exit}' "$file")

    # Mapeia tools → permissions
    has_read=false
    has_write=false
    has_edit=false
    has_glob=false
    has_bash=false
    has_task=false

    while IFS= read -r line; do
      case "$line" in
        *read_file*|*read_many_files*) has_read=true ;;
        *write_file*) has_write=true ;;
        *edit*) has_edit=true ;;
        *apply_patch*) has_edit=true ;;
        *glob*) has_glob=true ;;
        *run_shell_command*) has_bash=true ;;
        *task*) has_task=true ;;
      esac
    done < <(sed -n '/^tools:/,/^---/p' "$file" | sed $d)

    OPENCODE_PERMS=""
    [ "$has_read" = true ] && OPENCODE_PERMS="${OPENCODE_PERMS}  read: allow"$'\n'
    [ "$has_write" = true ] || [ "$has_edit" = true ] && OPENCODE_PERMS="${OPENCODE_PERMS}  edit: allow"$'\n'
    [ "$has_glob" = true ] && OPENCODE_PERMS="${OPENCODE_PERMS}  glob: allow"$'\n'
    [ "$has_bash" = true ] && OPENCODE_PERMS="${OPENCODE_PERMS}  bash: allow"$'\n'

    # Extrai o conteúdo após o frontmatter (corpo do prompt do agente)
    # body extraction fixed below

    # Gera o arquivo .opencode/agents/<name>.md
    cat > "$DEST/agents/$name.md" << AGENT
---
description: $desc
mode: subagent
permission:
${OPENCODE_PERMS}---
$body
AGENT
    echo "  ✓ agent: $name"
    agent_count=$((agent_count + 1))
  done

  # ── 3. Skills ────────────────────────────────
  mkdir -p "$DEST/skills"
  skill_count=0
  for file in "$AGENT_DIR"/skills/*.md; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .md)

    # Valida nome para OpenCode (lowercase, hífens, sem espaços)
    safe_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g')

    mkdir -p "$DEST/skills/$safe_name"

    # Extrai primeira linha como description
    first_line=$(head -n 15 "$file" | grep -v '^$' | grep -v '^# Skill:' | grep -v '^#' | head -n 1)

    cat > "$DEST/skills/$safe_name/SKILL.md" << SKILL
---
name: $safe_name
description: $first_line
---

$(cat "$file")
SKILL
    echo "  ✓ skill: $safe_name"
    skill_count=$((skill_count + 1))
  done

  # ── 4. opencode.json (se não existir) ────────
  if [ ! -f "opencode.json" ] && [ ! -f "opencode.jsonc" ]; then
    cat > opencode.json << 'CONFIG'
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    "AGENTS.md",
    ".agent/system-prompt.md"
  ]
}
CONFIG
    echo "  ✓ opencode.json gerado"
  else
    echo "  ∼ opencode.json já existe — mantido"
  fi

  # ── 5. AGENTS.md (se não existir) ────────────
  if [ ! -f "AGENTS.md" ]; then
    cat > AGENTS.md << 'INSTR'
# Instruções do Agente

Antes de qualquer ação, leia e siga:
- `.agent/system-prompt.md` — regras inegociáveis de arquitetura e comportamento
- `.agent/rules/` — regras e convenções indexadas no system-prompt
- `.agent/skills/[skill].md` — skill correspondente à tarefa atual

Se existir snapshot em `.agent/context/[feature].snapshot.md`, leia antes de gerar código.
Se existir contrato de API em `.agent/api/contracts/[feature].json`, leia antes de modelar repositórios.
INSTR
    echo "  ✓ AGENTS.md gerado"
  fi

  echo ""
  echo "✅ OpenCode configurado"
  echo "   $count commands instalados"
  echo "   $agent_count agents instalados"
  echo "   $skill_count skills instaladas"
  echo ""
  echo "Commands disponíveis:"
  for f in "$DEST/commands"/*.md; do
    [ -f "$f" ] || continue
    name=$(basename "$f" .md)
    echo "   /$name"
  done
  exit 0
fi

# ──────────────────────────────────────────────────
# Claude Code — estrutura nativa otimizada
# ──────────────────────────────────────────────────
if [ "$TARGET" = "claude" ]; then
  echo "→ Instalando estrutura nativa para Claude Code..."
  
  # 1. Commands
  mkdir -p .claude/commands
  count=0
  for file in "$AGENT_DIR"/commands/*.toml; do
    [ -f "$file" ] || continue
    name=$(basename "$file")
    cp "$file" .claude/commands/"$name"
    echo "  ✓ command: $name"
    count=$((count + 1))
  done

  # 2. Rules auto-carregáveis (preserva os arquivos em inglês do projeto)
  echo "→ Configurando regras de contexto..."
  rm -rf .claude/rules
  mkdir -p .claude/rules
  rule_count=0
  for file in "$AGENT_DIR"/rules/*.md; do
    [ -f "$file" ] || continue
    name=$(basename "$file")
    cp "$file" .claude/rules/"$name"
    echo "  ✓ rule: $name"
    rule_count=$((rule_count + 1))
  done

  # 3. Configurações e Enforcement
  cat > .claude/settings.json << 'CONFIG'
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": [
      "Bash(git add .)",
      "Bash(git add -A)",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  }
}
CONFIG
  echo "  ✓ settings.json (enforcement hooks)"

  # 4. CLAUDE.md com @imports inteligentes
  if [ -d "src/modules" ]; then
    PROJECT_TYPE="Backend (NestJS)"
  else
    PROJECT_TYPE="Frontend (Next.js)"
  fi

  cat > CLAUDE.md << CLAUDE_MD
# Sigapro $PROJECT_TYPE — Regras do Projeto

> LEIA TUDO ABAIXO. Estas regras são inegociáveis e aplicam-se a TODO código gerado.

## Imports das regras detalhadas

@.agent/system-prompt.md
@.agent/COMMIT_CONVENTION.md

## Regras Críticas (NUNCA violar)
As regras detalhadas sobre arquitetura, imports, code-style, testes e infraestrutura estão em \`.claude/rules/\` (em inglês) e são carregadas automaticamente pelo contexto.

**NUNCA viole as seguintes restrições:**
- NUNCA faça \`git add .\` ou \`git add -A\`. Sempre faça staging de arquivos específicos.
- Use apenas **pnpm**. \`npm\` ou \`yarn\` são expressamente proibidos.
- NUNCA modifique o modelo de IA ou prompt configurado no código.
- Semicolons (\`;\`) são PROIBIDOS. Aspas simples (\`'\`) são obrigatórias.
- Default exports são PROIBIDOS — use named exports.
- **Import Duplo Obrigatório**: Use aliases (\`@[feature]/\` ou \`@[module]/\`) e importe SEMPRE do barrel (\`index.ts\`).

## Skills e Snapshots
Ao executar tarefas, leia a skill correspondente em \`.agent/skills/[skill]/SKILL.md\`.
Se existir snapshot em \`.agent/context/[feature].snapshot.md\`, leia-o ANTES de gerar código.
CLAUDE_MD

  echo "  ✓ CLAUDE.md (entrypoint com @imports)"
  echo ""
  echo "✅ Claude Code configurado com sucesso para $PROJECT_TYPE!"
  echo "   $count commands instalados"
  echo "   $rule_count rules instaladas (herdadas de .agent/rules/)"
  exit 0
fi

# ──────────────────────────────────────────────────
# Gemini / Qwen — instalação padrão
# ──────────────────────────────────────────────────

# Instalar commands
echo "→ Instalando commands para $TARGET ($EXT)..."
mkdir -p "$DEST"

count=0
for file in "$AGENT_DIR"/commands/*.$EXT; do
  [ -f "$file" ] || continue
  name=$(basename "$file")
  cp "$file" "$DEST/$name"
  echo "  ✓ $name"
  count=$((count + 1))
done

# Gerar arquivo de instrução persistente
echo "→ Gerando $INSTR_FILE na raiz..."
cat > "$INSTR_FILE" << 'INSTR'
# Instruções do Agente

Antes de qualquer ação, leia e siga:
- `.agent/system-prompt.md` — regras inegociáveis de arquitetura e comportamento
- `.agent/rules/` — regras e convenções indexadas no system-prompt
- `.agent/skills/[skill].md` — skill correspondente à tarefa atual

Se existir snapshot em `.agent/context/[feature].snapshot.md`, leia antes de gerar código.
Se existir contrato de API em `.agent/api/contracts/[feature].json`, leia antes de modelar repositórios.
INSTR

echo "→ $INSTR_FILE gerado"
echo ""
echo "✅ $TARGET configurado — $count commands instalados"
echo ""
echo "Commands disponíveis:"
for f in "$DEST"/*.$EXT; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .$EXT)
  echo "   /$name"
done
