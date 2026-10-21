import { HttpClientOptions } from '@shared/interfaces/http-client.interface'
import { HttpStreamableClient } from '@shared/interfaces/http-streamable-client.interface'

export class FetchStreamableClient implements HttpStreamableClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultTokens?: { access?: string; refresh?: string }
  ) {}

  async postStream(url: string, data?: any, config?: HttpClientOptions): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config?.headers,
    }

    const token = config?.accessToken || this.defaultTokens?.access
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.statusText}`)
    }

    return response
  }
}
