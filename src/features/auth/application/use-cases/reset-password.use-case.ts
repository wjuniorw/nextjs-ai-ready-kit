import { Password } from '@auth/domain/value-objects'
import { ResetPasswordDto } from '@auth/application/dtos'
import { IAuthRepository } from '@auth/domain/repositories'
export class ResetPasswordUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: ResetPasswordDto): Promise<void> {
    const updatedPass = new Password(data.password)
    // const confirmPass = updatedPass.passwordMatch(data.confirmPassword)
    const password = updatedPass.getValue()

    await this.authRepository.resetPassword({ token: data.token, password })
  }
}
