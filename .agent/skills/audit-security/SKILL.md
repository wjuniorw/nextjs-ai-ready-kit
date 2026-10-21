---
name: audit-security
description: Audit an existing feature for security vulnerabilities using SecOps knowledge. Use when evaluating BOLA, RLS, or injection risks.
---

# audit-security

Security audit using `.agent/knowledge/secops.md` as baseline.

## Rules — read before executing

| Rule | Scope |
|---|---|
| `architecture.md` | Layers and data flow |
| `server-actions.md` | Front/bff context and tokens |
| `use-cases.md` | Injection and repositories |

## Expected Input

- [ ] Feature name
- [ ] Scope: `full` | `[category]` (e.g. `bola`, `rls`)
- [ ] Context: endpoints, sensitive data, roles

Read the domain snapshot before proceeding.

## Step 1 — Reading

1. `.agent/knowledge/secops.md`
2. `.agent/context/[feature].snapshot.md`
3. Feature files (repos, use cases, DTOs) if necessary

## Step 2 — Attack surface

| Endpoint | Method | Auth | Sensitive data | Multi-tenant |
|---|---|---|---|---|
| `[path]` | GET/POST | yes/no | yes/no | yes/no |

## Step 3 — Audit by category

Classify: `✅ mitigated` | `⚠️ partial risk` | `❌ vulnerable` | `N/A`

Categories: BOLA, BFLA, Race Conditions, RLS, Injection, Rate Limiting, Mass Assignment, IDOR, Sensitive Data, Broken Auth, Misconfiguration.

## Step 4 — Report

Save in `.agent/audits/[feature]-[date].audit.md`:
Summary, results by category, critical findings, recommendations.

## Output

1. Report in `.agent/audits/`
2. Prioritized findings
3. Suggested tests for `/write-tests`