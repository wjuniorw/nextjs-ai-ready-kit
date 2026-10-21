import { IAuthRepository } from '@auth/domain/repositories'
import { RequestPasswordResetDto } from '@auth/application/dtos'
export class RecoveryUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RequestPasswordResetDto): Promise<void> {
    return this.authRepository.requestPasswordReset(data)
  }
}
