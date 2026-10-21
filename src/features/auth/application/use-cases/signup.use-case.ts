import { IAuthRepository } from '@auth/domain/repositories'
import { RegisterDto, RegisterResponseDto } from '@auth/application/dtos'
export class SignupUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterDto): Promise<RegisterResponseDto> {
    return this.authRepository.register(data)
  }
}
