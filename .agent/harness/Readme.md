# Harness — Infraestrutura de Execução Autônoma

Camada de automação que envolve o ambiente SDD.
Permite ao agente agir no mundo real com loops de feedback e checkpoints humanos.

---

## Estrutura

```
.agent/harness/
├── tools/
│   ├── test-runner.sh         # Roda Vitest — por feature ou projeto inteiro
│   ├── lint.sh                # ESLint + TypeScript check
│   ├── git.sh                 # Branch, commit, PR/MR (GitHub + GitLab agnóstico)
│   └── feature-flag.sh        # Toggle de flags via CLI (trunk based)
├── pipeline/
│   ├── on-task-complete.sh    # lint → test → commit (semi-auto, por task)
│   ├── on-feature-complete.sh # lint → test → snapshot → PR/MR (fim de feature)
│   ├── on-pr-merged.sh        # tag staging → deploy → Telegram (pós-merge)
│   ├── create-rc.sh           # cria Release Candidate com bump de versão
│   └── promote-rc.sh          # promove RC validada para produção
├── checkpoints/
│   └── require-human.md       # Define autônomo vs assistido vs bloqueante
├── ci/
│   ├── github/
│   │   └── ci.yml             # GitHub Actions — lint + test + build + Telegram
│   └── gitlab/
│       ├── .gitlab-ci.yml     # GitLab CI principal (pronto para migração)
│       └── rc.yml             # Pipeline de Release Candidate (incluir no principal)
└── logs/                      # Logs de execução gerados automaticamente
```

---

## Nível de autonomia

```
AUTÔNOMO               ASSISTIDO                  BLOQUEANTE
──────────────         ──────────────────         ──────────────────────
criar arquivos         stage + commit             deploy produção
rodar lint             push + PR/MR               migrations
rodar testes           instalar dependências      merge para main
criar branch           atualizar snapshot         alterar CI/CD
toggle feature flag    abrir RC                   promover RC para prod
```

Consulte `checkpoints/require-human.md` para a lista completa.

---

## Fluxo completo SDD + Harness + Trunk Based

```
┌─────────────────────────────────────────────────────────────┐
│  DESENVOLVIMENTO (trunk based)                               │
│                                                              │
│  /specify → /plan → /tasks                                   │
│       ↓                                                      │
│  [por task]                                                  │
│    /create-* → on-task-complete.sh [feature] [task-id]      │
│    ✅ marcar task em .agent/tasks/[feature].tasks.md         │
│       ↓                                                      │
│  [todas as tasks ✅]                                         │
│    on-feature-complete.sh [feature]                          │
│    → lint + testes + snapshot + PR/MR                        │
├─────────────────────────────────────────────────────────────┤
│  PÓS-MERGE (main/trunk)                                      │
│                                                              │
│    on-pr-merged.sh [feature]                                 │
│    → tag staging → deploy staging → Telegram                 │
├─────────────────────────────────────────────────────────────┤
│  RELEASE CANDIDATE                                           │
│                                                              │
│    create-rc.sh [patch|minor|major]                          │
│    → bump versão → tag v1.2.0-rc.1 → push                   │
│    → GitLab CI: lint + test + deploy staging + Telegram      │
│       ↓                                                      │
│  [validado em staging pela equipe]                           │
│                                                              │
│    promote-rc.sh v1.2.0-rc.1                                 │
│    → confirmação explícita → tag v1.2.0 → deploy prod        │
│    → Telegram "🎉 Release em produção" com changelog         │
├─────────────────────────────────────────────────────────────┤
│  FEATURE FLAGS (trunk based)                                 │
│                                                              │
│    feature-flag.sh enable  new-diagram-engine               │
│    feature-flag.sh disable stripe-checkout-v2               │
│    → updateTag no cache → efeito imediato em produção        │
└─────────────────────────────────────────────────────────────┘
```

---

## Uso — pipelines

### Por task de implementação
```bash
bash .agent/harness/pipeline/on-task-complete.sh [feature] [task-id]
# lint → testes (até 2 tentativas cada) → commit semi-auto
```

### Fim de feature
```bash
bash .agent/harness/pipeline/on-feature-complete.sh [feature]
# lint completo → testes → sync snapshot → push → PR/MR
```

### Pós-merge na main
```bash
bash .agent/harness/pipeline/on-pr-merged.sh [feature]
# tag staging → deploy → Telegram
```

### Release Candidate
```bash
bash .agent/harness/pipeline/create-rc.sh          # bump patch
bash .agent/harness/pipeline/create-rc.sh minor    # bump minor
bash .agent/harness/pipeline/create-rc.sh major    # bump major
bash .agent/harness/pipeline/create-rc.sh 2.0.0   # versão explícita
```

### Promover RC para produção
```bash
bash .agent/harness/pipeline/promote-rc.sh v1.2.0-rc.1
# confirmação explícita digitando o nome da tag
# → tag v1.2.0 → deploy prod → Telegram com changelog
```

---

## Uso — tools individuais

```bash
# Testes
bash .agent/harness/tools/test-runner.sh                    # todos
bash .agent/harness/tools/test-runner.sh feature-flags      # feature específica
bash .agent/harness/tools/test-runner.sh auth --watch       # modo watch

# Lint
bash .agent/harness/tools/lint.sh                           # projeto inteiro
bash .agent/harness/tools/lint.sh auth                      # feature específica

# Git
bash .agent/harness/tools/git.sh status
bash .agent/harness/tools/git.sh branch auth fix            # cria fix/auth
bash .agent/harness/tools/git.sh commit auth
bash .agent/harness/tools/git.sh pr auth "feat(auth): implement signin"
bash .agent/harness/tools/git.sh platform                   # detecta GitHub/GitLab

# Feature Flags
bash .agent/harness/tools/feature-flag.sh list
bash .agent/harness/tools/feature-flag.sh status  new-diagram-engine
bash .agent/harness/tools/feature-flag.sh enable  new-diagram-engine
bash .agent/harness/tools/feature-flag.sh disable stripe-checkout-v2
```

---

## CI/CD

Entrega via **Coolify** (VPS) por ambiente. Deploy = build de imagem no Coolify
disparado por webhook após lint/testes passarem. GitHub Actions e GitLab CI
mantidos em paridade (o `git.sh` detecta a plataforma pelo remote).

O front sai da **Vercel** e passa a rodar no Coolify via Docker.

### Modelo híbrido (trunk + RC) → ambientes

```
push/merge  staging          → deploy HOMOLOG    (trunk, entregas diárias)
push        feature/** fix/** → deploy PREVIEW    (inclui hotfixes)
tag         v*-rc.*           → deploy HOMOLOG    (validar a Release Candidate)
merge       main              → deploy PRODUCTION (manual — só via PR, sem commit direto)
tag         v* (sem -rc)      → deploy PRODUCTION (manual)
```

### Ativação

```bash
# GitHub Actions
cp .agent/harness/ci/github/ci.yml .github/workflows/ci.yml

# GitLab CI (o rc.yml já é incluído pelo .gitlab-ci.yml)
cp .agent/harness/ci/gitlab/.gitlab-ci.yml .gitlab-ci.yml
```

No Coolify: crie 3 apps (production/homolog/preview) apontando repo+branch+Dockerfile,
ligue **API Access**, gere um **API token** (permissão Deploy) e copie o **Deploy
webhook** de cada app. Desligue o auto-deploy-on-push do Coolify — quem dispara é o
CI, depois dos testes.

No GitHub, crie o **Environment `production`** com *Required reviewers* (gate manual).

**Secrets / Variables necessários (nos dois: GitHub e GitLab):**
```
COOLIFY_TOKEN             → API token do Coolify (permissão Deploy)
COOLIFY_WEBHOOK_HOMOLOG   → Deploy webhook do app homolog
COOLIFY_WEBHOOK_PREVIEW   → Deploy webhook do app preview
COOLIFY_WEBHOOK_PROD      → Deploy webhook do app production
HOMOLOG_URL               → URL do ambiente de homolog
PRODUCTION_URL            → URL do ambiente de produção
PREVIEW_URL               → URL base do ambiente de preview
TELEGRAM_BOT_TOKEN        → token do bot (@BotFather)
TELEGRAM_CHAT_ID          → ID do grupo
TELEGRAM_TOPIC_ID         → ID do tópico de releases
```

> Preview usa um app único (webhook, último push vence). Preview isolado por
> branch requer o recurso nativo *Preview Deployments* do Coolify (evolução futura).

---

## Migração GitHub → GitLab

1. O `.gitlab-ci.yml` e `rc.yml` já estão preparados
2. Notificação Telegram por tópico já configurada nos dois
3. Deploy produção sempre manual nos dois
4. `git.sh` detecta plataforma automaticamente via remote URL
5. Troque `gh` CLI por `glab` CLI — `git.sh` já lida com os dois

```bash
bash .agent/harness/tools/git.sh platform  # verifica detecção atual
```
