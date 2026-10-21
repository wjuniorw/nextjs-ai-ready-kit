import { LogoutDto } from '@auth/application/dtos'
import { IAuthRepository } from '@auth/domain/repositories'

export class Logout {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data?: LogoutDto): Promise<void> {
    return this.authRepository.logout(data)
  }
}
