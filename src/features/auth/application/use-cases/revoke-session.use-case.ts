import { ISessionRepository } from '@auth/domain/repositories'

export class RevokeSessionUseCase {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async execute(id: string): Promise<{ success: boolean }> {
    return this.sessionRepository.revokeSession(id)
  }
}
