import { HttpClient, HttpClientOptions, CacheableHttpClient } from '@shared/interfaces/http-client.interface'

interface CacheEntry {
  data: unknown
  tags: string[]
  expiresAt: number
}

export class CacheHttpClientDecorator implements CacheableHttpClient {
  private cache = new Map<string, CacheEntry>()

  constructor(
    private readonly httpClient: HttpClient,
    private readonly defaultTtl: number = 300_000 // 5 min em ms
  ) {}

  async get<T>(url: string, options?: HttpClientOptions & { tags?: string[]; ttl?: number }): Promise<T> {
    const cached = this.cache.get(url)
    const now = Date.now()

    if (cached && cached.expiresAt > now) {
      return cached.data as T
    }

    const data = await this.httpClient.get<T>(url, options)

    this.cache.set(url, {
      data,
      tags: options?.tags ?? [],
      expiresAt: now + (options?.ttl ?? this.defaultTtl),
    })

    return data
  }

  // Mutations — delegam pro client real e invalidam por tag
  async post<T>(url: string, body: unknown, options?: HttpClientOptions & { invalidates?: string[] }): Promise<T> {
    const result = await this.httpClient.post<T>(url, body, options)
    options?.invalidates?.forEach((tag) => this.revalidate(tag))
    return result
  }

  async put<T>(url: string, body: unknown, options?: HttpClientOptions & { invalidates?: string[] }): Promise<T> {
    const result = await this.httpClient.put<T>(url, body, options)
    options?.invalidates?.forEach((tag) => this.revalidate(tag))
    return result
  }

  async patch<T>(url: string, body: unknown, options?: HttpClientOptions & { invalidates?: string[] }): Promise<T> {
    const result = await this.httpClient.patch<T>(url, body, options)
    options?.invalidates?.forEach((tag) => this.revalidate(tag))
    return result
  }

  async delete<T>(url: string, options?: HttpClientOptions & { invalidates?: string[] }): Promise<T> {
    const result = await this.httpClient.delete<T>(url, options)
    options?.invalidates?.forEach((tag) => this.revalidate(tag))
    return result
  }

  revalidate(tag: string): void {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
      }
    }
  }

  revalidateAll(): void {
    this.cache.clear()
  }
}
