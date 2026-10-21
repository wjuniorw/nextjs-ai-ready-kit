import { SessionResponseDto } from '@auth/application/dtos'
import { ISessionRepository } from '@auth/domain/repositories'
export class ListSessionsUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(): Promise<SessionResponseDto[]> {
    return this.sessionRepository.listMySessions()
  }
}
