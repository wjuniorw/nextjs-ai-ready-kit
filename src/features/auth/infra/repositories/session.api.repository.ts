import { HttpClient } from '@shared/interfaces'
import { SessionResponseDto } from '@auth/application/dtos'
import { ISessionRepository } from '@auth/domain/repositories'
export class SessionApiRepository implements ISessionRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async listMySessions(): Promise<SessionResponseDto[]> {
    return this.httpClient.get<SessionResponseDto[]>('/sessions')
  }

  async revokeSession(id: string): Promise<{ success: boolean }> {
    return this.httpClient.delete<{ success: boolean }>(`/sessions/${id}`)
  }
}
