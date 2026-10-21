import { HttpClientOptions } from './http-client.interface'

export interface HttpStreamableClient {
  postStream(url: string, data?: any, config?: HttpClientOptions): Promise<Response>
}
