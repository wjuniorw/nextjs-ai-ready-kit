import { AuthRepository } from '@auth/infra/repositories'
import { IAuthRepository } from '@auth/domain/repositories'
import { makeHttpClient } from '@factories/http-client.factory'

type RepositoryContext = 'bff' | 'front'

export const makeAuthRepository = (
  context: RepositoryContext,
  auth?: { access: string; refresh: string }
): IAuthRepository => {
  switch (context) {
    case 'front': {
      const frontHttpClient = makeHttpClient({ strategy: 'fetch' }) // Usar fetch para APIs internas
      return new AuthRepository(frontHttpClient) // Frontend usa o BFF
    }
    case 'bff': {
      const bffHttpClient = makeHttpClient({ strategy: 'axios', tokens: auth }) // Usar axios para APIs externas
      return new AuthRepository(bffHttpClient) // BFF usa a API externa
    }
    default:
      throw new Error('Contexto de repositório inválido')
  }
}
