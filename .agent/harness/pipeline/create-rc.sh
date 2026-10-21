#!/bin/bash
# Pipeline: create-rc
# Cria uma Release Candidate a partir do estado atual de staging
# Fluxo: bump de versão → tag RC → push → notifica Telegram
#
# Uso:
#   bash .agent/harness/pipeline/create-rc.sh          # bump patch automático
#   bash .agent/harness/pipeline/create-rc.sh minor    # bump minor
#   bash .agent/harness/pipeline/create-rc.sh major    # bump major
#   bash .agent/harness/pipeline/create-rc.sh 1.5.0    # versão específica

set -e

BUMP=${1:-"patch"}
HARNESS_DIR=".agent/harness"
LOG_DIR="$HARNESS_DIR/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PIPELINE_LOG="$LOG_DIR/create-rc-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

log() { echo "$1" | tee -a "$PIPELINE_LOG"; }

# ─────────────────────────────────────────
# Calcular próxima versão
# ─────────────────────────────────────────
get_latest_version() {
  git tag --list 'v*' --sort=-version:refname | grep -v '\-rc\.' | head -1 | sed 's/^v//'
}

bump_version() {
  local version=$1
  local bump=$2
  local major minor patch

  IFS='.' read -r major minor patch <<< "$version"

  case $bump in
    major) echo "$((major + 1)).0.0" ;;
    minor) echo "$major.$((minor + 1)).0" ;;
    patch) echo "$major.$minor.$((patch + 1))" ;;
    *)     echo "$bump" ;; # versão explícita passada como argumento
  esac
}

get_next_rc_number() {
  local version=$1
  local latest_rc

  latest_rc=$(git tag --list "v${version}-rc.*" --sort=-version:refname | head -1)
  if [ -z "$latest_rc" ]; then
    echo "1"
  else
    local rc_num
    rc_num=$(echo "$latest_rc" | sed "s/v${version}-rc\.//")
    echo "$((rc_num + 1))"
  fi
}

CURRENT_VERSION=$(get_latest_version)
CURRENT_VERSION=${CURRENT_VERSION:-"0.0.0"}

NEXT_VERSION=$(bump_version "$CURRENT_VERSION" "$BUMP")
RC_NUMBER=$(get_next_rc_number "$NEXT_VERSION")
RC_TAG="v${NEXT_VERSION}-rc.${RC_NUMBER}"

BRANCH=$(git branch --show-current)
COMMIT=$(git rev-parse --short HEAD)
AUTHOR=$(git log -1 --pretty=%an)

print_header "PIPELINE: create-rc"
log "Versão atual: v$CURRENT_VERSION"
log "Próxima RC:   $RC_TAG"
log "Branch:       $BRANCH"
log "Commit:       $COMMIT"
log "Log:          $PIPELINE_LOG"

# ─────────────────────────────────────────
# Confirmação — RC é um checkpoint humano
# ─────────────────────────────────────────
echo ""
echo "  Commits incluídos nesta RC:"
git log "v${CURRENT_VERSION}..HEAD" --oneline 2>/dev/null | sed 's/^/    /' || \
  git log --oneline -10 | sed 's/^/    /'
echo ""

print_header "⚠️  CHECKPOINT HUMANO"
echo ""
echo "  Você está prestes a criar: $RC_TAG"
echo "  Esta RC será candidata para deploy em PRODUÇÃO"
echo ""
read -p "  Confirmar criação da RC? [s/N] " CONFIRM
[ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ] && { echo "  RC cancelada."; exit 0; }

# ─────────────────────────────────────────
# ETAPA 1 — Criar e push da tag RC
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 1 — Tag RC"

RC_MSG="Release Candidate $RC_TAG

Commits incluídos:
$(git log "v${CURRENT_VERSION}..HEAD" --oneline 2>/dev/null || git log --oneline -10)"

git tag -a "$RC_TAG" -m "$RC_MSG"
git push origin "$RC_TAG"
log "  ✅ Tag criada e publicada: $RC_TAG"

# ─────────────────────────────────────────
# ETAPA 2 — Notificação Telegram
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 2 — Notificação Telegram"

if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  COMMITS_LIST=$(git log "v${CURRENT_VERSION}..HEAD" --pretty="• %s" 2>/dev/null | head -10 || echo "• (sem commits anteriores)")

  MESSAGE="🏷️ *Release Candidate criada*

*Tag:* \`$RC_TAG\`
*Branch:* \`$BRANCH\`
*Commit:* \`$COMMIT\`
*Autor:* $AUTHOR

*Commits incluídos:*
$COMMITS_LIST

_Valide em staging antes de promover para produção._
_Deploy em produção: sempre manual._"

  TOPIC_PARAM=""
  [ -n "$TELEGRAM_TOPIC_ID" ] && TOPIC_PARAM="-d message_thread_id=$TELEGRAM_TOPIC_ID"

  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d "chat_id=$TELEGRAM_CHAT_ID" \
    $TOPIC_PARAM \
    -d "parse_mode=Markdown" \
    -d "text=$MESSAGE" > /dev/null

  log "  ✅ Notificação enviada"
fi

# ─────────────────────────────────────────
print_header "✅ RC CRIADA: $RC_TAG"
echo ""
echo "  Próximos passos:"
echo "  1. Valide a RC em staging"
echo "  2. Para promover para produção:"
echo "     bash .agent/harness/pipeline/promote-rc.sh $RC_TAG"
echo ""
