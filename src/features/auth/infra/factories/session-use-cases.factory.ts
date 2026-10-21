import { makeHttpClient } from '@factories/http-client.factory'
import { SessionApiRepository } from '@auth/infra/repositories'
import { ListSessionsUseCase, RevokeSessionUseCase } from '@auth/application/use-cases'

type RepositoryContext = 'bff' | 'front'

const makeSessionRepository = (context: RepositoryContext, tokens?: any) => {
  const httpClient = makeHttpClient(
    context === 'front' ? { strategy: 'fetch' } : { strategy: 'axios', tokens }
  )
  return new SessionApiRepository(httpClient)
}

export const makeListSessionsUseCase = (context: RepositoryContext, tokens?: any) => {
  const repository = makeSessionRepository(context, tokens)
  return new ListSessionsUseCase(repository)
}

export const makeRevokeSessionUseCase = (context: RepositoryContext, tokens?: any) => {
  const repository = makeSessionRepository(context, tokens)
  return new RevokeSessionUseCase(repository)
}
