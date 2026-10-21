import { redirect } from 'next/navigation'
import axios, { AxiosInstance } from 'axios'
import { HttpClient } from '@shared/interfaces/http-client.interface'

export class AxiosHttpClient implements HttpClient {
  private readonly client: AxiosInstance
  constructor(baseURL: string, tokens?: { access?: string; refresh?: string; clientIp?: string; userAgent?: string }) {
    this.client = axios.create({
      baseURL,
      adapter: 'fetch',
      timeout: 120000, // 120 seconds timeout to prevent AI responses from timing out
      headers: {
        'Content-Type': undefined,
        ...(tokens?.access ? { Authorization: `Bearer ${tokens?.access}` } : {}),
        ...(tokens?.refresh ? { 'X-Refresh-Token': tokens?.refresh } : {}),
        ...(tokens?.clientIp ? { 'X-Forwarded-For': tokens.clientIp } : {}),
        ...(tokens?.userAgent ? { 'User-Agent': tokens.userAgent } : {}),
        ...(typeof window === 'undefined' ? { Connection: 'close' } : {}),
      },
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (typeof window === 'undefined' && error.response?.status === 401) {
          redirect('/signin?expired=true')
        }
        return Promise.reject(error)
      }
    )

    this.client.defaults.baseURL = baseURL
  }

  async get<T>(url: string, config?: any): Promise<T> {
    // console.log('geting via axios =====>', url)
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }
}
