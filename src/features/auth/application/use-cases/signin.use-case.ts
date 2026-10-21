import { IAuthRepository } from '@auth/domain/repositories'
import { LoginDto, LoginResponseDto } from '@auth/application/dtos'
export class SigninUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: LoginDto): Promise<LoginResponseDto> {
    return this.authRepository.login(data)
  }
}
