import { IAuthRepository } from '@auth/domain/repositories'
import { RefreshTokenDto, RefreshTokenResponseDto } from '@auth/application/dtos'
export class RefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RefreshTokenDto): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = data
    return this.authRepository.refreshToken(refreshToken)
  }
}
