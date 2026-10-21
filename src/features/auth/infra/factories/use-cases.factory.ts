import { makeAuthRepository } from '@auth/infra/factories'
import {
  Logout,
  SigninUseCase,
  SignupUseCase,
  RecoveryUseCase,
  RefreshTokenUseCase,
  ResetPasswordUseCase,
  RequestPasswordResetUseCase,
} from '@auth/application/use-cases'

type RepositoryContext = 'front' | 'bff'

export const makeSigninUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new SigninUseCase(authRepository)
}

export const makeSignupUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new SignupUseCase(authRepository)
}

export const makeRefreshTokenUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new RefreshTokenUseCase(authRepository)
}

export const makeLogoutUseCase = (context: RepositoryContext, auth?: { access: string; refresh: string }) => {
  const authRepository = makeAuthRepository(context, auth)
  return new Logout(authRepository)
}

export const makeRecoveryUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new RecoveryUseCase(authRepository)
}

export const makeForgotPasswordUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new RequestPasswordResetUseCase(authRepository)
}

export const makeResetPasswordUseCase = (context: RepositoryContext) => {
  const authRepository = makeAuthRepository(context)
  return new ResetPasswordUseCase(authRepository)
}
