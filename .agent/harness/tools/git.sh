#!/bin/bash
# Tool: git
# Wrapper git agnóstico de plataforma (GitHub / GitLab)
# Uso: bash .agent/harness/tools/git.sh [comando] [args]
#
# Comandos:
#   branch   [feature] [type?]   → cria e checkout branch (type: feature|fix|chore)
#   commit   [feature] [msg?]    → staged files + commit message gerado
#   pr       [feature] [title]   → abre PR/MR (GitHub ou GitLab)
#   status                       → mostra status atual
#   platform                     → detecta GitHub ou GitLab

set -e

CMD=${1:-"status"}
FEATURE=${2:-""}
EXTRA=${3:-""}

# Detectar plataforma pelo remote
detect_platform() {
  REMOTE=$(git config --get remote.origin.url 2>/dev/null || echo "")
  if echo "$REMOTE" | grep -q "github"; then
    echo "github"
  elif echo "$REMOTE" | grep -q "gitlab"; then
    echo "gitlab"
  else
    echo "unknown"
  fi
}

PLATFORM=$(detect_platform)

case $CMD in
  platform)
    echo "Plataforma: $PLATFORM"
    echo "Remote: $(git config --get remote.origin.url)"
    ;;

  status)
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  GIT STATUS"
    echo "  Branch: $(git branch --show-current)"
    echo "  Plataforma: $PLATFORM"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    git status --short
    echo ""
    echo "Commits à frente do origin:"
    git log --oneline origin/$(git branch --show-current)..HEAD 2>/dev/null || echo "  (branch nova ou sem tracking)"
    ;;

  branch)
    TYPE=${EXTRA:-"feature"}
    BRANCH="$TYPE/$FEATURE"

    echo "→ Criando branch: $BRANCH"

    # Garantir que está atualizado antes de criar
    git fetch origin main --quiet 2>/dev/null || git fetch origin master --quiet 2>/dev/null || true

    git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
    echo "✅ Branch ativa: $(git branch --show-current)"
    ;;

  commit)
    MSG=${EXTRA:-""}

    if [ -z "$(git diff --cached --name-only)" ]; then
      echo "⚠️  Nenhum arquivo em stage."
      echo "   Adicione os arquivos: git add src/features/$FEATURE"
      exit 1
    fi

    # Gerar commit message se não fornecida
    # Segue COMMIT_CONVENTION.md: <tipo>(<escopo>): <descrição>
    # Tipos: feat | fix | docs | style | refactor | perf | test | build | ci | chore
    # Regras: tempo presente, max 72 chars, descreve O QUE faz (não como)
    if [ -z "$MSG" ]; then
      CHANGED_COUNT=$(git diff --cached --name-only | wc -l | tr -d ' ')
      HAS_TEST=$(git diff --cached --name-only | grep -c "spec\|test" || true)
      HAS_DOCS=$(git diff --cached --name-only | grep -c "\.md" || true)

      if [ "$HAS_TEST" -gt 0 ] && [ "$HAS_TEST" = "$CHANGED_COUNT" ]; then
        TYPE="test"
      elif [ "$HAS_DOCS" -gt 0 ] && [ "$HAS_DOCS" = "$CHANGED_COUNT" ]; then
        TYPE="docs"
      else
        TYPE="feat"
      fi

      MSG="$TYPE($FEATURE): implement feature changes"
      echo ""
      echo "  💡 Commit message gerada automaticamente."
      echo "     Edite antes de confirmar para descrever o que a alteração faz."
    fi

    # Validar tamanho (max 72 chars)
    if [ ${#MSG} -gt 72 ]; then
      echo "  ⚠️  Commit message excede 72 caracteres (${#MSG})."
      echo "     Considere encurtar antes de confirmar."
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  COMMIT PENDENTE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  Branch:  $(git branch --show-current)"
    echo "  Message: $MSG"
    echo ""
    echo "  Arquivos em stage:"
    git diff --cached --name-only | sed 's/^/    /'
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "  Confirmar commit? [s/N] " CONFIRM

    if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
      git commit -m "$MSG"
      echo ""
      echo "✅ Commit realizado: $MSG"
    else
      echo "  Commit cancelado."
      exit 0
    fi
    ;;

  pr)
    TITLE=${EXTRA:-"feat($FEATURE): implement feature"}
    BRANCH=$(git branch --show-current)
    BASE="main"

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  ABRIR PR / MR"
    echo "  Plataforma: $PLATFORM"
    echo "  Branch: $BRANCH → $BASE"
    echo "  Título: $TITLE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if [ "$PLATFORM" = "github" ]; then
      # Requer GitHub CLI (gh)
      if ! command -v gh &> /dev/null; then
        echo "⚠️  GitHub CLI (gh) não encontrado."
        echo "   Instale: https://cli.github.com"
        echo ""
        echo "   Alternativa manual:"
        echo "   git push origin $BRANCH"
        echo "   Abra o PR em: $(git config --get remote.origin.url | sed 's/.git$//')/compare/$BRANCH"
        exit 1
      fi

      read -p "  Confirmar abertura do PR? [s/N] " CONFIRM
      if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
        git push origin "$BRANCH" --set-upstream
        gh pr create --title "$TITLE" --base "$BASE" --fill
        echo "✅ PR aberto no GitHub"
      else
        echo "  PR cancelado."
      fi

    elif [ "$PLATFORM" = "gitlab" ]; then
      # Requer GitLab CLI (glab)
      if ! command -v glab &> /dev/null; then
        echo "⚠️  GitLab CLI (glab) não encontrado."
        echo "   Instale: https://gitlab.com/gitlab-org/cli"
        echo ""
        echo "   Alternativa manual:"
        echo "   git push origin $BRANCH"
        echo "   Abra o MR em: $(git config --get remote.origin.url | sed 's/.git$//')/-/merge_requests/new?merge_request[source_branch]=$BRANCH"
        exit 1
      fi

      read -p "  Confirmar abertura do MR? [s/N] " CONFIRM
      if [ "$CONFIRM" = "s" ] || [ "$CONFIRM" = "S" ]; then
        git push origin "$BRANCH" --set-upstream
        glab mr create --title "$TITLE" --target-branch "$BASE" --fill
        echo "✅ MR aberto no GitLab"
      else
        echo "  MR cancelado."
      fi

    else
      echo "⚠️  Plataforma não reconhecida. Push manual:"
      echo "   git push origin $BRANCH"
      exit 1
    fi
    ;;

  *)
    echo "Comando não reconhecido: $CMD"
    echo "Uso: bash .agent/harness/tools/git.sh [branch|commit|pr|status|platform]"
    exit 1
    ;;
esac
