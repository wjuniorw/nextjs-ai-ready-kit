# LESSONS.md — Lições Aprendidas

> Arquivo de memória do agente. Registra erros reais ocorridos em sessões anteriores
> e as regras derivadas para não repeti-los.
>
> **Lido automaticamente no início de cada sessão via Autoload Hook.**
> **Atualizado pelo agente após qualquer erro identificado — nunca pelo usuário.**

---

## Como registrar uma nova lição

Ao cometer um erro ou receber correção do usuário, o agente DEVE:
1. Parar a execução atual
2. Escrever a lição no formato abaixo ANTES de continuar
3. Confirmar ao usuário que a lição foi registrada

```markdown
## [CATEGORIA]-[NNN] — [título curto]
**Erro:** [o que foi feito de errado]
**Contexto:** [em qual situação ocorreu]
**Regra derivada:** [regra clara e imperativa para não repetir]
**Verificação:** [como checar antes de agir]
```

---

## GERENCIAMENTO DE PACOTES (PACKAGE MANAGER)

### PKG-001 — Uso exclusivo do pnpm
**Erro:** Executado `yarn lint` e comandos baseados no Yarn, desperdiçando tokens com erros de ambiente (Corepack/yarn).
**Contexto:** Ao tentar rodar validações/linter localmente para confirmar as alterações no código.
**Regra derivada:** NUNCA usar `yarn` ou `npm` neste projeto. A Constituição define o uso **exclusivo** do **`pnpm`**.
**Verificação:** Sempre que for rodar um script do `package.json` ou instalar dependências, revise o comando para assegurar o uso do `pnpm` (ex: `pnpm run lint`).

---

## GIT

### GIT-001 — `git add .` é proibido

**Erro:** Executado `git add .` incluindo arquivos de configuração local, `.env` e outros arquivos não versionados que estavam fora de stage intencionalmente.

**Contexto:** Durante pipeline de commit após implementação de feature.

**Regra derivada:** NUNCA usar `git add .` ou `git add -A`. Adicionar APENAS os arquivos criados ou modificados na sessão atual, um por um ou por pasta específica da feature:
```bash
# ✅ correto
git add src/features/feature-flags/
git add src/features/feature-flags/domain/entities/feature-flag.entity.ts

# ❌ proibido
git add .
git add -A
git add --all
```

**Verificação:** Antes de qualquer `git add`, listar mentalmente os arquivos criados/modificados na sessão e adicioná-los explicitamente por caminho.

---

### GIT-002 — Commit direto sem harness é proibido

**Erro:** Executado `git commit -m "..."` diretamente sem usar o script do harness, pulando lint, testes e a validação da commit convention.

**Contexto:** Ao finalizar implementação de uma task.

**Regra derivada:** TODO commit DEVE passar pelo harness:
```bash
# ✅ correto — sempre
bash .agent/harness/pipeline/on-task-complete.sh [feature] [task-id]

# ❌ proibido — nunca
git commit -m "feat: ..."
git commit --amend
```

**Verificação:** Se surgir vontade de digitar `git commit`, parar imediatamente e chamar `on-task-complete.sh`.

---

## IMPORTS

### IMP-001 — Import do arquivo direto ignorando barrel

**Erro:** Gerado import apontando para o arquivo diretamente em vez do barrel `index.ts`:
```typescript
// gerado erroneamente
import { SigninUseCase } from '@auth/application/use-cases/signin.use-case'

// correto
import { SigninUseCase } from '@auth/application/use-cases'
```

**Contexto:** Geração de use cases e view-models que importam de outras camadas.

**Regra derivada:** Se a pasta tem `index.ts`, o import SEMPRE termina na pasta. Nunca no arquivo.

**Verificação:** Após gerar cada arquivo, varrer todos os imports e checar se algum path termina em `.ts` — se sim, remover o nome do arquivo e manter só a pasta.

---

### IMP-002 — Import relativo entre módulos

**Erro:** Gerado import relativo (`../`) entre módulos ou features diferentes.

**Contexto:** Geração de repositórios e use cases que dependem de interfaces de domínio.

**Regra derivada:** Zero imports relativos entre módulos. Sempre path alias absoluto.

**Verificação:** Antes de entregar, checar se algum import começa com `../` ou `../../`. Se sim, substituir pelo alias correspondente.

---

## HARNESS

### HAR-001 — Lint fixer chamado sem harness

**Erro:** Tentativa de corrigir erros de lint editando arquivos diretamente em vez de delegar ao `lint-fixer` subagente ou ao pipeline.

**Contexto:** Após erro de TypeScript durante geração de código.

**Regra derivada:** Erros de lint/tsc DEVEM ser delegados ao `lint-fixer` via `invoke_subagent` ou via `on-task-complete.sh` que já trata isso automaticamente.

**Verificação:** Ao ver erro de lint, não editar diretamente — disparar o hook.

---

## ARQUITETURA

### ARCH-001 — `'use cache'` em método de classe

**Erro:** Diretiva `'use cache'` colocada dentro de método de classe em vez de função assíncrona standalone.

**Contexto:** Geração de serviço de cache para feature-flags.

**Regra derivada:** `'use cache'` SOMENTE em funções assíncronas standalone — nunca em métodos de classe, nunca em use cases, nunca em repositórios.

**Verificação:** Ao gerar qualquer arquivo com cache, checar se a diretiva está em função top-level de arquivo `.rsc.ts`.

---

### ARCH-002 — Entity com getters/setters

**Erro:** Gerada entity com `get campo()` e parâmetros individuais no constructor.

**Contexto:** Geração de entidades de domínio em múltiplos testes com modelos diferentes.

**Regra derivada:** Entities SEMPRE seguem o padrão:
```typescript
export class MyEntity {
  id: string        // atributo declarado diretamente
  name: string

  constructor(props: MyEntityProps) {
    Object.assign(this, props)  // sem getters, sem setters
  }
}
```

**Verificação:** Após gerar entity, checar se existe `get ` ou `set ` — se sim, refatorar.

---

### ARCH-003 — Leitura de features vizinhas para "manter consistência"

**Erro:** ListDir em features vizinhas + spawn de subagente para pesquisar implementações existentes, consumindo tokens desnecessariamente.

**Contexto:** Durante `/plan` e `/create-feature` de nova feature de diagrama.

**Regra derivada:** Para referência de estilo e consistência, usar APENAS snapshots em `.agent/context/`. Se snapshot não existir → sinalizar ao usuário, não explorar arquivos reais.

**Verificação:** Se surgir vontade de fazer `ListDir src/features/` ou `ListDir src/modules/` — parar e verificar se existe snapshot correspondente.

---

## BACKEND (NestJS)

### BACK-001 — Provider com classe no `provide`

**Erro:** Provider gerado como `{ provide: UseCase, useClass: UseCase }` usando a classe diretamente.

**Contexto:** Geração de providers em módulos NestJS.

**Regra derivada:** `provide` SEMPRE recebe token string:
```typescript
// ✅ correto
{ provide: CREATE_FLAG_USE_CASE, useClass: CreateFlagUseCase }

// ❌ proibido
{ provide: CreateFlagUseCase, useClass: CreateFlagUseCase }
```

**Verificação:** Após gerar `providers/index.ts`, checar se algum `provide:` contém uma classe — se sim, substituir pelo token.

---

### BACK-002 — Entity vazando para o controller

**Erro:** Controller retornando entity diretamente em vez de chamar `.toJson()`.

**Contexto:** Geração de controllers NestJS.

**Regra derivada:** Controllers NUNCA retornam entities. Sempre `entity.toJson()` ou o retorno do use case que já chama `.toJson()`.

**Verificação:** Checar se o tipo de retorno do controller é uma Entity — se sim, ajustar para DTO.

---

### BACK-003 — Listener sem try/catch

**Erro:** Listener gerado sem tratamento de erro, podendo derrubar o fluxo principal se o handler falhar.

**Contexto:** Geração de listeners de eventos cross-module.

**Regra derivada:** Todo `@OnEvent()` DEVE ter try/catch com log do erro — fire-and-forget:
```typescript
@OnEvent(TOKEN)
async handle(event: MyEvent): Promise<void> {
  try {
    await this.useCase.execute(event)
  } catch (error) {
    console.error(`[${TOKEN}] Falha:`, error)
  }
}
```

**Verificação:** Após gerar listener, checar se existe try/catch — se não, adicionar.
