#!/bin/bash
# Pipeline: on-pr-merged
# Executado após merge na branch principal (main/trunk)
# Fluxo: tag de build → deploy staging → smoke test → notifica Telegram
#
# Uso: bash .agent/harness/pipeline/on-pr-merged.sh [feature]
# Normalmente chamado pelo CI após merge — pode ser chamado manualmente também
#
# Pré-requisitos:
#   - git.sh configurado e autenticado
#   - TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_TOPIC_ID no ambiente
#   - DEPLOY_WEBHOOK_URL e DEPLOY_TOKEN configurados (Vercel, Railway, Fly.io)

set -e

FEATURE=${1:-""}
HARNESS_DIR=".agent/harness"
TOOLS_DIR="$HARNESS_DIR/tools"
LOG_DIR="$HARNESS_DIR/logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PIPELINE_LOG="$LOG_DIR/pr-merged-$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

print_header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

log() { echo "$1" | tee -a "$PIPELINE_LOG"; }

BRANCH=$(git branch --show-current)
COMMIT=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%s)
AUTHOR=$(git log -1 --pretty=%an)

print_header "PIPELINE: on-pr-merged"
log "Feature:  ${FEATURE:-'(não especificada)'}"
log "Branch:   $BRANCH"
log "Commit:   $COMMIT"
log "Autor:    $AUTHOR"
log "Mensagem: $COMMIT_MSG"
log "Log:      $PIPELINE_LOG"
log "Início:   $(date '+%Y-%m-%d %H:%M:%S')"

# ─────────────────────────────────────────
# ETAPA 1 — Garantir que está na main
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 1 — Verificar branch"
echo ""

if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
  echo "  ⚠️  Não está na branch principal ($BRANCH)"
  read -p "  Continuar mesmo assim? [s/N] " CONFIRM
  [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ] && exit 0
fi

git pull origin "$BRANCH" --quiet
log "  ✅ Branch atualizada: $BRANCH @ $COMMIT"

# ─────────────────────────────────────────
# ETAPA 2 — Build tag de staging
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 2 — Tag de staging"
echo ""

STAGING_TAG="staging-$TIMESTAMP"
git tag "$STAGING_TAG"
log "  ✅ Tag criada: $STAGING_TAG"

# ─────────────────────────────────────────
# ETAPA 3 — Deploy staging
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 3 — Deploy staging"
echo ""

if [ -z "$DEPLOY_WEBHOOK_URL" ]; then
  echo "  ⚠️  DEPLOY_WEBHOOK_URL não configurado"
  echo "     Configure a variável de ambiente ou adapte este step"
  echo "     para seu provider (Vercel, Railway, Fly.io, etc)"
  log "  ⚠️  Deploy pulado — DEPLOY_WEBHOOK_URL não configurado"
else
  echo "  → Disparando deploy em staging..."
  DEPLOY_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$DEPLOY_WEBHOOK_URL" \
    -H "Authorization: Bearer $DEPLOY_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"environment\": \"staging\", \"commit\": \"$COMMIT\", \"tag\": \"$STAGING_TAG\"}")

  HTTP_CODE=$(echo "$DEPLOY_RESPONSE" | tail -1)
  RESPONSE_BODY=$(echo "$DEPLOY_RESPONSE" | head -1)

  if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
    log "  ✅ Deploy disparado (HTTP $HTTP_CODE)"
  else
    log "  ❌ Deploy falhou (HTTP $HTTP_CODE): $RESPONSE_BODY"
    print_header "❌ PIPELINE INTERROMPIDO — Deploy falhou"
    exit 1
  fi
fi

# ─────────────────────────────────────────
# ETAPA 4 — Notificação Telegram
# ─────────────────────────────────────────
echo ""
echo "  ▶ ETAPA 4 — Notificação Telegram"
echo ""

if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
  FEATURE_INFO=""
  [ -n "$FEATURE" ] && FEATURE_INFO="
*Feature:* \`$FEATURE\`"

  MESSAGE="🚀 *Deploy staging disparado*

*Projeto:* $(basename $(git rev-parse --show-toplevel))
*Branch:* \`$BRANCH\`
*Commit:* \`$COMMIT\`
*Autor:* $AUTHOR
*Mensagem:* $COMMIT_MSG$FEATURE_INFO
*Tag:* \`$STAGING_TAG\`"

  TOPIC_PARAM=""
  [ -n "$TELEGRAM_TOPIC_ID" ] && TOPIC_PARAM="-d message_thread_id=$TELEGRAM_TOPIC_ID"

  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
    -d "chat_id=$TELEGRAM_CHAT_ID" \
    $TOPIC_PARAM \
    -d "parse_mode=Markdown" \
    -d "text=$MESSAGE" > /dev/null

  log "  ✅ Notificação enviada"
else
  log "  ⚠️  Telegram não configurado — notificação pulada"
fi

# ─────────────────────────────────────────
print_header "✅ PIPELINE CONCLUÍDO"
log "Término: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "  Próximos passos:"
echo "  → Valide o deploy em staging"
echo "  → Quando pronto para produção:"
echo "    bash .agent/harness/pipeline/create-rc.sh"
echo ""
