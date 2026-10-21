# ADR: Arquitetura Frontend — Vertical Slice + Clean Architecture + DDD

**Status:** Aceito
**Data:** 2025
**Contexto:** Aplicações frontend com Next.js (React), com possibilidade de migração de framework no futuro

---

## Contexto

Projetos frontend tendem a crescer acoplados ao framework, às rotas e à estrutura de pastas genérica (`components/`, `pages/`, `hooks/`), tornando difícil entender o domínio do negócio só de olhar o repositório.

O objetivo é que qualquer desenvolvedor novo consiga identificar **o que o sistema faz** antes de entender **como ele é entregue** — princípio diretamente inspirado em *Screaming Architecture* (Robert C. Martin) e no trabalho de Ivar Jacobson sobre arquiteturas orientadas a casos de uso.

---

## Decisão

Adotar uma arquitetura baseada em **Vertical Slice**, com influências de **Clean Architecture** e **Domain-Driven Design (DDD)**, organizada por feature/domínio em vez de por tipo técnico.

---

## Estrutura de Pastas

```
src/features/[feature-name]/
├── application/          # Casos de uso e contratos de IO — orquestram domínio e infra
│   ├── dtos/             # Schemas Zod + inferência de tipos — IO dos use cases
│   └── use-cases/
├── domain/               # Núcleo do negócio: entidades, VOs, interfaces
│   ├── entities/
│   ├── repositories/     # Interfaces (contratos), não implementações
│   └── value-objects/
├── infra/                # Implementações técnicas e integrações externas
│   ├── factories/        # DI: instancia repos e use cases
│   └── repositories/     # Implementações concretas dos contratos do domain/
└── presentation/         # Tudo relacionado à UI
    ├── components/       # Componentes genéricos da feature
    ├── containers/       # Adaptadores de framework (Server Components, Suspense, Providers)
    ├── contexts/         # Context Providers para estado autônomo da feature
    ├── stores/           # Stores Zustand para estado reativo pesado da feature
    └── [slice]/          # Sub-módulo lógico da UI (ex: signin, signup, recovery)
        ├── components/   # Componentes do slice
        └── view-models/  # Custom hooks (MVVM): orquestram estado e use cases
```

### Exemplo real: feature `auth`

```
src/features/auth/
├── application/
│   ├── dtos/
│   │   ├── auth.dto.ts
│   │   └── index.ts
│   └── use-cases/
│       ├── index.ts
│       ├── signin.use-case.ts
│       ├── signup.use-case.ts
│       ├── logout.use-case.ts
│       ├── recovery.use-case.ts
│       ├── refresh-token.use-case.ts
│       ├── request-resetpass.use-case.ts
│       └── reset-password.use-case.ts
├── domain/
│   ├── entities/
│   │   ├── auth.entity.ts
│   │   └── index.ts
│   ├── repositories/
│   │   └── auth-repository.interface.ts
│   └── value-objects/
│       ├── email.value-object.ts
│       └── password.value-object.ts
├── infra/
│   ├── factories/
│       ├── index.ts
│   │   ├── repo.factory.ts
│   │   └── use-cases.factory.ts
│   └── repositories/
│       └── auth.repository.ts
└── presentation/
    ├── actions/
    │   └── auth.actions.ts
    ├── components/
    │   └── auth-layout.tsx
    ├── containers/
    │   └── login-container.tsx
    ├── signin/
    │   ├── components/
    │   │   ├── signin-form.tsx
    │   │   └── signin-screen.tsx
    │   └── view-models/
    │       └── useSigninViewModel.ts
    ├── signup/
    │   └── ...
    └── recovery/
        └── ...
```

---

## Decisões Específicas e Suas Justificativas

### 1. Organização por Feature, não por Tipo Técnico

**Decisão:** A unidade organizacional primária é a feature/domínio, não o tipo do arquivo.

**Justificativa:** Permite que a estrutura de diretórios comunique o domínio do negócio. Um desenvolvedor novo vê `features/auth`, `features/billing`, `features/reports` — não `components/`, `hooks/`, `services/`.

**Consequência:** Cada feature é um módulo coeso e relativamente autossuficiente.

---

### 2. Domínio no Frontend

**Decisão:** Manter `domain/` no frontend com entidades, value objects e interfaces de repositório próprios. DTOs **não** pertencem ao `domain/` — ficam em `application/dtos/`.

**Justificativa:** O `domain/` deve ser estável e agnóstico a dependências externas. DTOs são definidos com Zod (schema validator), o que já os desqualifica da camada de domínio — Zod é um detalhe de aplicação, não de negócio. Além disso, DTOs são o IO direto dos use cases, portanto sua casa natural é `application/`, próximo de onde são consumidos.

Se amanhã Zod for substituído por Valibot ou Arktype, apenas `application/dtos/` é afetado — o `domain/` permanece intacto.

**Estrutura de um DTO:**
```typescript
// application/dtos/signin.dto.ts
import { z } from 'zod'

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SigninDto = z.infer<typeof SigninSchema>
```

**Consequência:** O `domain/` contém apenas entidades, value objects e interfaces de repositório — zero dependências externas. Os DTOs vivem em `application/dtos/` junto aos use cases que os consomem.

---

### 3. Dependency Inversion via Interfaces + Factories

**Decisão:** O `domain/repositories/` define interfaces. A `infra/repositories/` implementa. A `infra/factories/` instancia e injeta via **funções factory** — não classes.

**Justificativa:** Os casos de uso dependem de abstrações, não de implementações concretas. Isso segue o princípio de Inversão de Dependência (SOLID) e é o que viabiliza testes com repositórios in-memory sem alterar nenhum código de produção. Funções simples são preferidas a classes porque factories são apenas construtoras de instâncias — não carregam estado nem comportamento próprio.

**Padrão de nomenclatura:** `make[Domain]Repository` e `make[UseCase]UseCase`.

**Decisão de contexto de execução (`RepositoryContext`):** As factories recebem um parâmetro de contexto (`'front' | 'bff'`) que determina qual cliente HTTP será usado. Isso permite que o mesmo use case rode no browser (via `fetch` apontando ao BFF) ou no servidor/BFF (via `axios` apontando à API externa) — sem que o use case saiba onde está sendo executado.

```typescript
// repo.factory.ts
type RepositoryContext = 'front' | 'bff'

export const makeAuthRepository = (context: RepositoryContext): IAuthRepository => {
  const httpClient = context === 'bff'
    ? makeHttpClient('axios')  // BFF → API externa
    : makeHttpClient('fetch')  // Front → BFF

  return new AuthRepository(httpClient)
}

// use-cases.factory.ts
export const makeSigninUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new SigninUseCase(authRepository)
}

// view-model (consumidor final)
const signinUseCase = makeSigninUseCase('front')
await signinUseCase.execute(data)
```

**Fluxo de dependências:**
```
view-model
    ↓ makeSigninUseCase('front')
SigninUseCase
    ↓ makeAuthRepository('front')
AuthRepository + fetchHttpClient   ← decisão de infra resolvida aqui
    ↓ implementa
IAuthRepository                    ← única coisa que o use case conhece
```

**Para testes:** A factory de teste injeta um `AuthRepositoryInMemory` diretamente, sem passar pelo contexto de execução — o use case nem sabe a diferença.

```typescript
const repo = new AuthRepositoryInMemory()
const useCase = new SigninUseCase(repo)
```

---

### 4. Padrão MVVM nos Slices de Apresentação

**Decisão:** Cada slice da UI tem seus próprios `view-models/` implementados como custom hooks.

**Justificativa:** Separa a lógica de orquestração (estado, chamadas a use cases, efeitos) dos componentes React, que ficam responsáveis apenas por renderização. Componentes sem lógica são mais fáceis de testar, compor e reutilizar.

**Regra:** View-models chamam use cases. Componentes chamam view-models. Componentes não acessam use cases diretamente.

---

### 5. Containers como Adaptadores de Framework

**Decisão:** A pasta `containers/` existe dentro de `presentation/` como ponto de integração com o framework (Next.js).

**Justificativa:** Isola tudo que é específico do framework num único lugar:
- Recebimento de props de Server Components
- Configuração de Context Providers
- Definição de boundaries de Suspense e Error Boundaries

**Consequência:** Os componentes internos dos slices são React puro e agnósticos ao framework. A troca de Next.js por Astro ou outro framework exige reescrever apenas os containers e os pontos de rota — o restante da feature sobrevive intacto.

**Fluxo de uma feature:**
```
Router (page.tsx do Next.js)
        ↓
  [container]          ← único ponto que conhece o framework
  Server data + Providers + Suspense
        ↓
  [slice]/screen       ← React puro
        ↓
  useSliceViewModel    ← orquestra lógica, chama use cases
        ↓
  use-cases            ← orquestram domínio e repositórios
        ↓
  domain / infra       ← zero dependência de UI ou framework
```

---

### 6. Context Providers para Estado Autônomo

**Decisão:** Features que possuem interações de UI independentes do ciclo de submit de um formulário podem ter uma pasta `presentation/contexts/` com seus próprios Context Providers.

**Justificativa:** Nem toda interação do usuário faz parte de um fluxo linear de formulário. Algumas ações têm autonomia própria — por exemplo, um campo `assignee` que atribui uma entidade a alguém diretamente, sem depender de um submit maior. Forçar esse estado dentro de um view-model de formulário geraria acoplamento artificial entre responsabilidades distintas.

**Quando usar:**
- A interação tem ciclo de vida próprio, independente de outros elementos da tela
- O estado precisa ser compartilhado entre múltiplos componentes de uma mesma feature
- A ação pode ser disparada fora de um fluxo de formulário

**Integração com containers:** Os contexts podem ser instanciados nos `containers/`, que já são o ponto natural de configuração de providers — mantendo a lógica de "quem conhece o framework" centralizada.

**Fluxo:**
```
[container]
  └── <AssigneeProvider>            ← context instanciado aqui
        └── feature-screen
              └── <AssigneeField /> ← consome o context diretamente
```

**Consequência:** Estado global da feature fica explícito e localizado — sem prop drilling, sem misturar responsabilidades em view-models de formulário.

---

### 7. Estado Reativo Pesado com Zustand

**Decisão:** Features com estado de UI complexo, reativo e de alta frequência de atualização usam Zustand via pasta `presentation/stores/`. O store é consumido pelos view-models, nunca diretamente pelos componentes.

**Justificativa:** React Context e estado local não são adequados para features com grids, drag & drop, resize e interações contínuas com a API. Zustand resolve isso sem introduzir acoplamento de domínio, pois permanece inteiramente na camada `presentation/`. Ferramentas como SWR e TanStack Query foram descartadas pois introduzem acoplamento na arquitetura — cache e ciclo de vida de chamadas HTTP já são responsabilidade dos use cases e do HttpClient.

**Quando usar `stores/` em vez de `contexts/`:**

| | `contexts/` | `stores/` |
|---|---|---|
| Volume de atualizações | Baixo | Alto / contínuo |
| Escopo | Subárvore de componentes | Feature inteira |
| Exemplos | Assignee field, providers de dados | Grid, drag & drop, resize, layout |

**Regra:** view-models consomem o store. Componentes consomem view-models. Nenhum componente importa um store diretamente.

```typescript
// task-grid.store.ts — estado puro, sem lógica de negócio
interface TaskGridStore {
  columns: Column[]
  dragging: TaskId | null
  resizing: ColumnId | null
  setDragging: (id: TaskId | null) => void
  commitResize: (columnId: ColumnId, height: number) => void
}

// useTaskGridViewModel.ts — orquestra store + use cases + debounce
export const useTaskGridViewModel = () => {
  const { columns, commitResize } = useTaskGridStore()
  const updateTaskUseCase = makeUpdateTaskUseCase('front')

  const handleResize = useDebouncedCallback(
    async (columnId: ColumnId, height: number) => {
      commitResize(columnId, height)         // atualiza UI imediatamente (optimistic)
      await updateTaskUseCase.execute(...)   // sincroniza com backend
    },
    300
  )

  return { columns, handleResize }
}
```

**Consequência:** Zustand gerencia a verdade local da UI. Os use cases gerenciam a sincronização com o backend. Debounce fica no view-model — nem no componente, nem no store.

---

### 8. Estratégia de Cache: Local vs. Externo

**Decisão:** O cache do Next.js (Vercel) é usado apenas para dados verdadeiramente compartilhados entre usuários. Dados individuais ou de alta mutação usam cache in-memory via decorator no HttpClient.

**Justificativa:** Cache por usuário na Vercel escala pessimamente — cada entrada é individual, gera custo e complexidade de invalidação sem benefício de compartilhamento. Um cache local in-memory resolve chamadas repetidas sem custo externo.

**Critério de decisão:**

| Tipo de dado | Estratégia | Motivo |
|---|---|---|
| Company, feature flags, config global | Cache Next.js (Vercel) | Compartilhado entre todos os usuários |
| User profile | Cache in-memory no cliente (TTL curto) | Individual, quase imutável, descartado no logout |
| Dados de grid / tasks | Sem cache — estado reativo (Zustand) | Alta frequência de mutação |

**Implementação via decorator no HttpClient:**

```typescript
// O use case não sabe que existe cache — é detalhe de infra
export const makeHttpClient = (
  adapter: 'fetch' | 'axios',
  options?: { cache?: 'memory'; ttl?: number }
) => {
  const client = adapter === 'axios' ? new AxiosClient() : new FetchClient()
  return options?.cache
    ? new CachedHttpClient(client, options.ttl)
    : client
}

// Na factory do repositório de perfil
export const makeProfileRepository = (context: RepositoryContext): IProfileRepository => {
  const httpClient = makeHttpClient('fetch', { cache: 'memory', ttl: 300 })
  return new ProfileRepository(httpClient)
}
```

**Consequência:** Nenhuma chamada redundante para dados estáveis. Nenhum custo de cache externo para dados individuais. A decisão de cache é invisível para use cases e view-models.

---

### 9. Desacoplamento entre Features

**Decisão:** Features do frontend não se importam diretamente entre si. Quando uma feature precisa de dados de outra (ex: relatório que agrega dados de múltiplos domínios), o backend é responsável por compor e expor um endpoint do domínio solicitante.

**Justificativa:** Evita que o grafo de dependências entre features do frontend se torne incontrolável. Mantém cada feature com fronteiras limpas e responsabilidade única.

---

### 10. Slices Internos Compartilham o Mesmo Domínio da Feature

**Decisão:** Sub-módulos de UI dentro de uma feature (ex: `signin/`, `signup/`, `recovery/` dentro de `auth`) compartilham o `domain/`, `application/` e `infra/` da feature-pai.

**Justificativa:** São partes do mesmo contexto delimitado — faz sentido compartilharem o mesmo modelo. A separação em slices é organizacional e de UI, não de domínio.

---

## Estratégia de Testes

**Decisão:** Usar Vitest com repositórios in-memory para testes de casos de uso e view-models.

**Abordagem:**
- Implementar `[Feature]RepositoryInMemory` que respeita a interface do `domain/repositories/`
- Injetar via factories de teste (análogas às factories de produção)
- Testar use cases sem nenhuma dependência de framework, banco de dados ou HTTP
- Testar view-models com `renderHook` do Testing Library

**Princípio:** Se a arquitetura está correta, os testes não resistem — eles fluem naturalmente a partir das interfaces já definidas.

```typescript
// Exemplo conceitual
const repo = new AuthRepositoryInMemory();
const useCase = new SigninUseCase(repo);

const result = await useCase.execute({ email: 'user@test.com', password: '123456' });
expect(result.token).toBeDefined();
```

---

## Consequências

### Positivas
- A estrutura comunica o domínio do negócio imediatamente
- Troca de framework é cirúrgica — afeta apenas containers e rotas
- Testes de use cases não dependem de infraestrutura
- Cada camada tem responsabilidade clara e bem definida
- Novas features seguem o mesmo padrão previsível

### Negativas / Trade-offs
- Mais estrutura inicial para features simples
- Alguma duplicação intencional de conceitos entre front e back
- Curva de aprendizado para desenvolvedores não familiarizados com Clean Arch / DDD

---

---

## Decisão 11 — Anatomia de Componentes

**Decisão:** Todo componente não-trivial segue uma estrutura de arquivos fixa com separação entre estilos, lógica e composição. Todos os exports são **named exports** — default exports são proibidos.

**Justificativa:** Default exports permitem que cada desenvolvedor escolha um nome diferente ao importar, quebrando a rastreabilidade e a consistência do codebase. Named exports tornam o nome canônico do componente parte do contrato público.

A separação em arquivos distintos segue o mesmo princípio de responsabilidade única aplicado às camadas arquiteturais: estilos não conhecem lógica, lógica não conhece estilos, e o arquivo principal apenas os compõe.

```
presentation/[slice]/components/[comp-name]/
├── index.ts          # exporta o componente principal e seus tipos públicos (Props)
├── comp-name.tsx     # composição — une sub-componentes, aplica estilos e lógica
├── comp-name.styles.ts   # estilos via Tamagui: const CompName = styled(Generic, {...})
└── comp-name.css.ts  # caso específico: estilos via Vanilla Extract
```

**Regras:**
- `index.ts` exporta o componente e os types públicos (`type Props`) — nada mais
- `comp-name.tsx` é o arquivo de composição — não define estilos, não tem lógica de estado
- Estilos ficam em `.styles.ts` (Tamagui) ou `.css.ts` (Vanilla Extract) — nunca inline no `.tsx`
- **Default exports são proibidos** em qualquer arquivo do projeto

```typescript
// ✅ correto — index.ts
export { SigninForm } from './signin-form'
export type { SigninFormProps } from './signin-form'

// ✅ correto — signin-form.tsx
export const SigninForm = ({ onSubmit }: SigninFormProps) => { ... }

// ❌ errado — default export
export default SigninForm
```

**Consequência:** O nome do componente é imutável e rastreável em todo o codebase. Refatorações de import são previsíveis e seguras.

---

## Decisão 12 — Camada Core UI

**Decisão:** Componentes primitivos (Button, Input, Select, etc.) e tokens do Design System (tema, cores, tipografia, espaçamentos) residem em `src/core/ui/` — fora de qualquer feature.

**Justificativa:** Primitivos e tokens são compartilhados por todas as features e não pertencem a nenhum domínio específico. Isolá-los em `core/ui/` evita duplicação, garante consistência visual e cria um contrato claro entre o Design System e a aplicação.

```
src/core/ui/
          ├── ds/               # Tokens do Design System: cores, tipografia, espaçamentos, breakpoints
          ├── theme/            # Configuração de tema (Tamagui config, CSS variables, etc.)
          └── primitives/       # Componentes base reutilizáveis
              ├── button/
              │   ├── index.ts
              │   ├── button.tsx
              │   └── button.styles.ts
              ├── input/
              ├── select/
              └── ...
```

**Regras:**
- Primitivos DEVEM seguir a mesma anatomia de componentes (`index.ts`, `.tsx`, `.styles.ts`)
- Primitivos NÃO DEVEM importar nada de `src/features/`
- Features DEVEM importar primitivos de `@core/ui/primitives` — nunca recriar botões, inputs ou selects localmente
- Tokens do DS DEVEM ser consumidos via `@core/ui/ds` ou `@core/ui/theme`

**Consequência:** Mudanças visuais globais (cores, tipografia, espaçamentos) têm um único ponto de alteração. Features são consumidoras do DS, não criadoras de variações paralelas.

---

---

## Decisão 13 — Cross-Feature Widgets

**Decisão:** Features que possuem domínio, endpoint e coleção próprios, mas que se manifestam visualmente como componentes injetáveis dentro de outras features, são tratadas como **Cross-Feature Widgets** — features autônomas em `src/features/`, não como componentes de outra feature.

**Justificativa:** A aparência visual engana. Um campo `Assignees` parece um select num formulário, mas por trás ele depende de múltiplas outras features (staff de company, colaboradores de squad, futuramente squads inteiras), tem endpoint próprio de persistência e ciclo de vida de dados independente. Colocá-lo dentro de outra feature criaria acoplamento de domínio indevido e impediria o reuso.

O critério de decisão não é a aparência visual — é a autonomia de domínio:

| Critério | Componente comum | Cross-Feature Widget |
|---|---|---|
| Endpoint próprio | ❌ | ✅ |
| Coleção/recurso próprio | ❌ | ✅ |
| Depende de múltiplas features | ❌ | ✅ |
| Persiste sem submit de formulário pai | ❌ | ✅ |
| Reutilizado em múltiplos contextos | Raramente | ✅ |

**Exemplos:**
- `assignees` — atribui staff/squads a um card; depende de `company`, `squad` e `card`
- `files` — engine de assets da aplicação; armazena avatares, logos, documentos e entrega URL pública
- `references` — salva URLs nomeadas por card; coleção própria com chave estrangeira

**Estrutura:** Seguem exatamente a mesma anatomia de uma feature padrão em `src/features/`. A diferença é comportamental, não estrutural.

**Como são consumidos:** Recebem apenas identificadores estritos via props (`entityId`, `cardId`) e são inteiramente responsáveis pelo próprio ciclo de dados — fetch, mutação, cache e persistência imediata.

```typescript
// ✅ correto — feature pai injeta apenas o identificador
<AssigneesWidget cardId={card.id} />

// ❌ errado — feature pai gerencia o estado do widget
<AssigneesWidget
  assignees={assignees}
  onAdd={handleAdd}
  onRemove={handleRemove}
/>
```

**Consequência:** A feature pai não sabe como o widget persiste seus dados — apenas fornece o contexto (o `id` da entidade). O widget é uma caixa-preta autossuficiente.

---

## Decisão 14 — Widgets Autônomos: UX e Resiliência

**Decisão:** Cross-Feature Widgets e componentes com persistência própria DEVEM seguir o padrão de **interação imediata** — auto-save on blur/interaction end — sem depender de um submit de formulário superior na hierarquia.

**Justificativa:** Forçar o usuário a submeter um formulário maior para persistir uma atribuição ou um arquivo quebra a expectativa de ferramentas modernas (Notion, Linear, Jira) e introduz risco de perda de dados. A persistência imediata é parte do contrato de UX desses componentes.

**Regras obrigatórias:**

- DEVEM exportar e encapsular sua lógica em um `ErrorBoundary` próprio
- DEVEM utilizar a `Suspense API` para carregamento de dados e resolução de promises
- Promises pendentes DEVEM ser injetadas via `Context API` da feature — tipicamente via container
- DEVEM receber apenas identificadores estritos via props (`entityId`) — sem callbacks de estado externo
- NÃO DEVEM depender de um submit de formulário pai para persistir

```typescript
// Estrutura de um widget autônomo no container da feature consumidora
<ErrorBoundary fallback={<AssigneesError />}>
  <Suspense fallback={<AssigneesSkeleton />}>
    <AssigneesWidget cardId={card.id} />
  </Suspense>
</ErrorBoundary>
```

**Consequência:** Cada widget falha e carrega de forma isolada — um erro no `AssigneesWidget` não derruba o restante da tela.

---

## Decisão 15 — Server Actions como Adaptador de Framework

**Decisão:** Server Actions (Next.js) ou equivalentes de outros frameworks (server functions, lambdas, edge functions) são isoladas em `presentation/actions/` e consumidas **exclusivamente** via view-models — nunca diretamente por componentes.

**Justificativa:** Server Actions são um detalhe do framework — o equivalente de um controller de BFF. Assim como containers isolam Server Components, `actions/` isola as funções de servidor. View-models as consomem como qualquer outro efeito colateral, sem expor o detalhe do framework para a camada de componentes. Em outros frameworks, o mesmo slot seria ocupado por server functions, lambdas ou route handlers.

```
presentation/
    ├── actions/               # Server Actions — detalhe de framework, não lógica de negócio
    │   ├── signin.action.ts
    │   └── index.ts
    └── [slice]/
        └── view-models/
            └── useSigninViewModel.ts  # consome a action — componente não sabe que ela existe
```

```typescript
// ✅ correto — view-model consome a action
export const useSigninViewModel = () => {
  const handleSubmit = async (dto: SigninDto) => {
    await signinAction(dto)  // detalhe de framework isolado aqui
  }
  return { handleSubmit }
}

// ❌ errado — componente chama action diretamente
const SigninForm = () => {
  const handleSubmit = () => signinAction(data) // não fazer
}
```

**Consequência:** Trocar Next.js por outro framework com server functions afeta apenas `presentation/actions/` — view-models e componentes sobrevivem intactos.

---

## Convenções de Código

> Esta seção complementa as decisões arquiteturais com convenções de estilo e organização de código adotadas no projeto. Não são decisões de arquitetura, mas contribuem diretamente para a legibilidade e consistência da base de código.

---

### Nomenclatura: kebab-case com sufixo técnico ou de domínio

Todos os arquivos seguem kebab-case com um sufixo que comunica sua natureza técnica ou de domínio.

```
signin.use-case.ts
auth-user.entity.ts
email.value-object.ts
auth-repository.interface.ts
repo.factory.ts
auth.dto.ts
useSigninViewModel.ts   ← exceção: hooks seguem camelCase por convenção React
```

**Justificativa:** O sufixo permite identificar a responsabilidade do arquivo sem abri-lo. Em projetos com muitos arquivos, `auth.repository.ts` e `auth-repository.interface.ts` comunicam imediatamente o que são e a qual camada pertencem.

---

### Barrel Exports via `index.ts`

Cada pasta expõe seus membros públicos através de um `index.ts`.

```typescript
// auth/application/use-cases/index.ts
export * from './signin.use-case'
export * from './signup.use-case'
export * from './logout.use-case'
```

**Justificativa:** O sufixo técnico no nome do arquivo gera verbosidade nos imports quando referenciados diretamente. O barrel resolve isso sem abrir mão da clareza nos nomes dos arquivos.

```typescript
// ❌ sem barrel
import { SigninUseCase } from '@auth/application/use-cases/signin.use-case'
import { SignupUseCase } from '@auth/application/use-cases/signup.use-case'

// ✅ com barrel
import { SigninUseCase, SignupUseCase } from '@auth/application/use-cases'
```

---

### Absolute Imports com Path Aliases

Imports relativos (`../../../`) são evitados. Todos os imports entre módulos usam aliases absolutos configurados no `tsconfig.json`.

```typescript
// ❌ evitar
import { IAuthRepository } from '../../../domain/repositories/auth-repository.interface'

// ✅ preferir
import { IAuthRepository } from '@auth/domain/repositories'
```

**Convenção de aliases:**
```json
{
  "paths": {
    "@shared/*": ["src/shared/*"],
    "@auth/*": ["src/features/auth/*"],
    "@factories/*": ["src/shared/factories/*"]
  }
}
```

**Justificativa:** Imports absolutos são resilientes a refatorações de estrutura de pastas e comunicam explicitamente a origem do recurso — de qual feature ou módulo compartilhado ele vem.

---

### Ordenação de Imports por Comprimento de Linha (asc)

Dentro de cada bloco de imports, as linhas são ordenadas do menor para o maior comprimento.

```typescript
import { z } from 'zod'
import { SigninUseCase } from '@auth/application/use-cases'
import { IAuthRepository } from '@auth/domain/repositories'
import { makeHttpClient } from '@factories/http-client.factory'
import { makeAuthRepository } from '@auth/infra/factories/repo.factory'
```

**Justificativa:** O padrão visual criado pela ordenação por tamanho permite localizar imports por intuição — o cérebro estima a posição aproximada pelo comprimento do nome antes mesmo de ler a linha. Reduz o tempo de scanning em arquivos com muitos imports.

---

## Referências

- Robert C. Martin — *Screaming Architecture* (Clean Coder Blog)
- Ivar Jacobson — *Object Oriented Software Engineering: A Use Case Driven Approach*
- Robert C. Martin — *Clean Architecture*
- Eric Evans — *Domain-Driven Design*
- Padrão MVVM aplicado a React com custom hooks
