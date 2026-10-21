import { SessionResponseDto } from '@auth/application/dtos'

export interface ISessionRepository {
  listMySessions(): Promise<SessionResponseDto[]>
  revokeSession(id: string): Promise<{ success: boolean }>
}
