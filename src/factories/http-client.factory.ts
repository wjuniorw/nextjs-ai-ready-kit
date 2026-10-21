import { AxiosHttpClient } from '@adapters/http/axios-client.http'
import { FetchHttpClient } from '@adapters/http/fetch-client.http'
import { CacheHttpClientDecorator } from '@adapters/http/cache-decorator.http'
import { FetchStreamableClient } from '@adapters/http/fetch-streamable-client.http'
import { HttpClient, CacheableHttpClient } from '@shared/interfaces/http-client.interface'
import { HttpStreamableClient } from '@shared/interfaces/http-streamable-client.interface'

type HttpClientConfig =
  | { strategy: 'axios'; tokens?: { access?: string; refresh?: string; clientIp?: string; userAgent?: string } }
  | { strategy: 'fetch'; isServer?: boolean }
  | { strategy: 'fetch-cached'; isServer?: boolean; ttl?: number }

type HttpClientResult<T extends HttpClientConfig> = T extends { strategy: 'fetch-cached' }
  ? CacheableHttpClient
  : HttpClient

export const makeHttpClient = <T extends HttpClientConfig>(config: T): HttpClientResult<T> => {
  const isServer =
    'isServer' in config ? (config.isServer ?? typeof window === 'undefined') : typeof window === 'undefined'

  const externalUrl = process.env.API_URL || 'http://localhost:8000'
  const internalUrl = isServer ? process.env.INTERNAL_API_URL || 'http://localhost:3000/api' : '/api'

  switch (config.strategy) {
    case 'axios':
      return new AxiosHttpClient(externalUrl, config.tokens) as unknown as HttpClientResult<T>
    case 'fetch':
      return new FetchHttpClient(internalUrl) as unknown as HttpClientResult<T>
    case 'fetch-cached':
      return new CacheHttpClientDecorator(new FetchHttpClient(internalUrl), config.ttl) as HttpClientResult<T>
    default:
      throw new Error('Estratégia de HTTP inválida')
  }
}

export const makeHttpStreamableClient = (config: {
  strategy: 'bff' | 'front'
  tokens?: { access?: string; refresh?: string }
}): HttpStreamableClient => {
  const isServer = typeof window === 'undefined'

  const externalUrl = process.env.API_URL || 'http://localhost:8000'
  const internalUrl = isServer ? process.env.INTERNAL_API_URL || 'http://localhost:3000/api' : '/api'

  const baseUrl = config.strategy === 'bff' ? externalUrl : internalUrl

  return new FetchStreamableClient(baseUrl, config.tokens)
}
