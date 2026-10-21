import { HttpClient, HttpClientOptions } from '@shared/interfaces/http-client.interface'

export class FetchHttpClient implements HttpClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(url: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options)
  }

  async post<T>(url: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>('POST', url, body, options)
  }

  async put<T>(url: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>('PUT', url, body, options)
  }

  async patch<T>(url: string, body: any, options?: HttpClientOptions): Promise<T> {
    return this.request<T>('PATCH', url, body, options)
  }

  async delete<T>(url: string, options?: HttpClientOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options)
  }

  private async request<T>(method: string, url: string, body?: any, options?: HttpClientOptions): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }

    const res = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      // @ts-ignore
      next: options?.next,
    })
    
    if (options?.onResponse) {
      await options.onResponse(res)
    }

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} ${res.statusText}`)
    }

    return res?.json() as Promise<T>
  }
}
