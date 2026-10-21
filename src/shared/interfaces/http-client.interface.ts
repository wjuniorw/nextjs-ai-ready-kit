type Config = any & HttpClientOptions
export interface HttpClient {
  get<T = any>(url: string, config?: Config): Promise<T>
  post<T = any>(url: string, data?: any, config?: Config): Promise<T>
  put<T = any>(url: string, data?: any, config?: Config): Promise<T>
  patch<T = any>(url: string, data?: any, config?: Config): Promise<T>
  delete<T = any>(url: string, config?: Config): Promise<T>
}

export type HttpClientOptions = {
  headers?: Record<string, string>
  accessToken?: string
  refreshToken?: string
  onResponse?: (response: Response) => void
  next?: {
    tags?: string[]
    revalidate?: number
    cache?: 'no-store' | 'force-cache' | 'default'
  }
}

export interface CacheableHttpClient extends HttpClient {
  revalidate(tag: string): void
  revalidateAll(): void
}

export function isCacheable(client: HttpClient): client is CacheableHttpClient {
  return 'revalidate' in client
}
