# Knowledge: SecOps — Vulnerabilidades em SaaS
**Tipo:** referencial + checklist
**Status:** ativo
**Fonte:** OWASP API Security Top 10, CVEs frequentes, experiência em SaaS multi-tenant

> Consultado automaticamente pelo `/specify` quando a feature tem endpoints HTTP,
> operações sobre recursos de outros usuários, uploads ou acesso multi-tenant.
> Consultado pelo `/audit-security` para auditoria independente de features existentes.
> NÃO é uma skill de execução — define conhecimento e critérios de validação.

---

## Como usar este documento

Durante o `/specify`:
- Identifique quais categorias se aplicam à feature
- Liste as vulnerabilidades aplicáveis como **restrições obrigatórias** da spec
- Para cada vulnerabilidade aplicável, registre a mitigação esperada

Durante o `/audit-security`:
- Percorra todas as categorias
- Para cada item, classifique: ✅ mitigado | ⚠️ risco parcial | ❌ vulnerável | N/A

---

## 1. BOLA — Broken Object Level Authorization

**O que é:** endpoint aceita IDs de recursos sem verificar se pertencem ao usuário autenticado.

**Exemplo de falha:**
```
GET /api/cards/{cardId}
→ retorna o card independente de quem é o dono
→ qualquer usuário autenticado acessa qualquer card pelo ID
```

**Checklist:**
- [ ] Todo endpoint que recebe um ID de recurso valida ownership antes de retornar dados
- [ ] A validação ocorre no backend — não confiar em filtros do frontend
- [ ] IDs incrementais (1, 2, 3...) são evitados — usar UUIDs
- [ ] Erro retornado é 404 (não 403) para não confirmar existência do recurso

**Mitigação recomendada:**
```typescript
// No use case ou repositório — sempre filtrar por userId + resourceId
const card = await repo.findByIdAndOwner(cardId, currentUserId)
if (!card) throw new NotFoundError()
```

---

## 2. BFLA — Broken Function Level Authorization

**O que é:** endpoints de funções privilegiadas (admin, moderação) acessíveis por usuários sem a role adequada.

**Exemplo de falha:**
```
DELETE /api/company/{id}  → sem verificação de role admin
POST /api/users/{id}/promote → qualquer usuário pode promover outros
```

**Checklist:**
- [ ] Endpoints administrativos têm middleware de verificação de role
- [ ] Roles são verificadas no backend — nunca apenas no frontend
- [ ] Funções de moderação/admin têm auditoria de acesso (log)
- [ ] Princípio do menor privilégio — roles granulares por função

**Mitigação recomendada:**
```typescript
// Guard de role no use case
if (currentUser.role !== 'admin') throw new ForbiddenError()
```

---

## 3. Race Conditions

**O que é:** operações concorrentes sobre o mesmo recurso produzem estado inconsistente.

**Casos frequentes em SaaS:**
- Duplo clique em botão de submit cria dois recursos
- Duas sessões simultâneas editando o mesmo registro
- Decremento de créditos/quota sem lock

**Checklist:**
- [ ] Operações de criação têm idempotência (ex: chave única no banco)
- [ ] Operações de débito/quota usam transação atômica com lock
- [ ] Frontend desabilita botão após primeiro clique (mas backend valida também)
- [ ] Webhooks e eventos externos têm deduplicação por ID

**Mitigação recomendada:**
```sql
-- Idempotência via constraint único
INSERT INTO assignments (card_id, user_id)
VALUES ($1, $2)
ON CONFLICT (card_id, user_id) DO NOTHING
```

---

## 4. RLS Failures — Row Level Security

**O que é:** falha na política de isolamento de dados multi-tenant. Usuário de uma empresa acessa dados de outra.

**Checklist:**
- [ ] Toda query filtra por `company_id` ou `tenant_id`
- [ ] RLS está habilitado no banco (Postgres: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- [ ] Políticas RLS testadas com usuários de tenants diferentes
- [ ] Joins não "vazam" dados de outros tenants por relacionamento transitivo
- [ ] Migrações não desabilitam RLS temporariamente em produção

**Mitigação recomendada:**
```sql
-- Política RLS no Postgres
CREATE POLICY tenant_isolation ON cards
  USING (company_id = current_setting('app.current_tenant')::uuid);
```

---

## 5. SQL Injection

**O que é:** input do usuário interpolado diretamente em queries SQL.

**Checklist:**
- [ ] Zero interpolação de string em queries — sempre queries parametrizadas
- [ ] ORMs usados corretamente — sem raw queries com input do usuário
- [ ] Inputs validados antes de chegarem ao repositório (DTO + Zod)
- [ ] Nomes de colunas e tabelas dinâmicos usam allowlist — nunca input direto

**Mitigação recomendada:**
```typescript
// ✅ parametrizado
await db.query('SELECT * FROM cards WHERE id = $1', [cardId])

// ❌ vulnerável
await db.query(`SELECT * FROM cards WHERE id = '${cardId}'`)
```

---

## 6. NoSQL Injection

**O que é:** input do usuário manipula operadores de query NoSQL (MongoDB, etc).

**Checklist:**
- [ ] Inputs de objeto são validados — não passar req.body diretamente para queries
- [ ] Operadores `$where`, `$regex` com input do usuário são evitados
- [ ] Schemas de validação (Zod) rejeitam objetos onde strings são esperadas

**Exemplo de falha:**
```javascript
// ❌ vulnerável — input { "username": { "$gt": "" } } bypassa autenticação
db.users.findOne({ username: req.body.username })
```

---

## 7. Rate Limiting Breaches

**O que é:** ausência ou bypass de limitação de requisições permite abuso, brute force ou DoS.

**Checklist:**
- [ ] Endpoints de autenticação têm rate limit agressivo (ex: 5 req/min por IP)
- [ ] Endpoints de envio de email/SMS têm rate limit por usuário
- [ ] Rate limit aplicado no edge/gateway — não apenas no app server
- [ ] Rate limit por IP E por usuário autenticado (evitar bypass com múltiplos IPs)
- [ ] Resposta de rate limit não revela informações internas (apenas 429)

---

## 8. Mass Assignment

**O que é:** endpoint aceita campos que não deveria, permitindo alterar campos protegidos.

**Exemplo de falha:**
```javascript
// ❌ vulnerável — usuário pode enviar { "role": "admin" } no body
await userRepo.update(userId, req.body)
```

**Checklist:**
- [ ] DTOs definem explicitamente os campos aceitos — nunca spread do body completo
- [ ] Campos protegidos (role, companyId, createdAt) nunca aceitam input externo
- [ ] Zod schema rejeita campos extras com `.strict()` quando necessário

---

## 9. Insecure Direct Object Reference (IDOR)

**O que é:** IDs previsíveis ou expostos permitem enumerar recursos.

**Checklist:**
- [ ] IDs expostos em URLs e respostas são UUIDs — não sequenciais
- [ ] Endpoints de listagem não expõem IDs de recursos de outros tenants
- [ ] Referências internas (foreign keys) não são expostas desnecessariamente na API

---

## 10. Sensitive Data Exposure

**O que é:** dados sensíveis expostos em respostas, logs ou erros.

**Checklist:**
- [ ] Passwords, tokens e secrets nunca aparecem em respostas de API
- [ ] Logs não registram bodies de requisição com dados sensíveis
- [ ] Mensagens de erro não revelam stack trace, queries SQL ou estrutura interna
- [ ] Dados PII (email, CPF, telefone) são mascarados em logs
- [ ] Tokens de reset de senha têm expiração curta e são invalidados após uso

---

## 11. Broken Authentication

**O que é:** falhas no fluxo de autenticação permitem acesso não autorizado.

**Checklist:**
- [ ] Tokens JWT têm expiração curta (access: 15min, refresh: 7d)
- [ ] Refresh tokens são rotacionados a cada uso (rotation)
- [ ] Logout invalida o refresh token no servidor — não apenas no cliente
- [ ] Tokens não carregam dados sensíveis no payload
- [ ] Fluxo de reset de senha usa token de uso único com expiração

---

## 12. Security Misconfiguration

**O que é:** configurações padrão inseguras em produção.

**Checklist:**
- [ ] CORS configurado com allowlist explícita — não `*` em produção
- [ ] Headers de segurança presentes: `X-Content-Type-Options`, `X-Frame-Options`, `CSP`
- [ ] Variáveis de ambiente sensíveis não commitadas no repositório
- [ ] Debug/stack trace desabilitado em produção
- [ ] Endpoints de health/metrics não expostos publicamente sem autenticação

---

## Aplicabilidade por tipo de feature

Use esta tabela durante o `/specify` para identificar rapidamente quais categorias verificar:

| Tipo de feature | Vulnerabilidades prioritárias |
|---|---|
| CRUD de recursos | BOLA, IDOR, Mass Assignment, RLS |
| Autenticação / sessão | Broken Auth, Rate Limiting, Sensitive Data |
| Upload de arquivos | Sensitive Data, Security Misconfig |
| Multi-tenant / company | RLS, BOLA, BFLA |
| Operações financeiras / quota | Race Conditions, BOLA |
| Admin / moderação | BFLA, Broken Auth |
| Listagens com filtro | SQL/NoSQL Injection, RLS, BOLA |
| Webhooks / eventos externos | Race Conditions, Broken Auth |
| Diagramas / canvas colaborativo | Race Conditions, BOLA, RLS |
