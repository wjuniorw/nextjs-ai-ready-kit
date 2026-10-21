# Auth — Snapshot v1 (2026-05-16)

## Domínio
- **Entidade:** `AuthUser` { id: string, email: string, userName?: string, firstName?: string, lastName?: string }
- **VOs:** 
  - `Email` (validação de formato regex)
  - `Password` (validação de força: 8+ chars, maiúscula, minúscula, número, especial)
- **Interface:** `IAuthRepository`
  - `login(data: LoginDto): Promise<LoginResponseDto>`
  - `logout(data?: LogoutDto): Promise<any>`
  - `register(data: RegisterDto): Promise<RegisterResponseDto>`
  - `refreshToken(refresh: string): Promise<RefreshTokenResponseDto>`
  - `requestPasswordReset(data: RequestPasswordResetDto): Promise<void>`
  - `resetPassword(data: ResetPasswordDto): Promise<void>`

## Use Cases

| Use Case | Input | Output | Status |
|---|---|---|---|
| `SigninUseCase` | `LoginDto` | `LoginResponseDto` | ✅ |
| `SignupUseCase` | `RegisterDto` | `RegisterResponseDto` | ✅ |
| `Logout` | `LogoutDto` | `void` | ✅ |
| `RecoveryUseCase` | `RequestPasswordResetDto` | `void` | ✅ |
| `RefreshTokenUseCase` | `RefreshTokenDto` | `RefreshTokenResponseDto` | ✅ |
| `ResetPasswordUseCase` | `ResetPasswordDto` | `void` | ✅ |
| `RequestPasswordResetUseCase` | `RequestPasswordResetDto` | `void` | ✅ |

## Infra
- **Repo:** `AuthRepository` via `HttpClient` (axios/fetch) → `/auth/*`
- **Endpoints:** `/auth/login`, `/auth/signup`, `/auth/logout`, `/auth/refresh-tokens`, `/auth/forgot-password`, `/auth/reset-password`
- **In-Memory:** 🚧 pendente
- **Factories:** `makeAuthRepository`, `makeSigninUseCase`, `makeSignupUseCase`, `makeRefreshTokenUseCase`, `makeLogoutUseCase`, `makeRecoveryUseCase`, `makeForgotPasswordUseCase`, `makeResetPasswordUseCase`

## Presentation
- **Slices:** 
  - `signin` (SigninScreen + useSigninViewModel)
  - `signup` (SignupScreen + useSignupViewModel)
  - `recovery` (RecoveryScreen + view-models)
- **Container:** `login-container` (🚧 vazio)
- **Store:** `useAuthStore` (Zustand) em `src/contexts/AuthZustand.tsx`
- **Context:** `AuthProvider` em `src/contexts/AuthZustand.tsx`

## Testes
- [ ] Use cases — 🚧 pendente
- [ ] View-models — 🚧 pendente
- [ ] In-memory implementado — 🚧

## Pendências
- [ ] Mover DTOs de `domain/dtos` para `application/dtos` (CONSTITUTION 5.1)
- [ ] Implementar `login-container.tsx` ou remover se desnecessário
- [ ] Remover chamadas HTTP de dentro da store Zustand (CONSTITUTION 7.5)
- [ ] Unificar factories (duplicadas entre feature e `src/factories/use-case/`)
- [ ] Adicionar testes unitários para use cases e VOs

## Histórico
| Versão | Data | Mudança |
|---|---|---|
| v1 | 2026-05-16 | Snapshot inicial da feature auth |
