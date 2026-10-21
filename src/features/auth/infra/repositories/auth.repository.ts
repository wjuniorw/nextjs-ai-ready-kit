import { HttpClient } from '@shared/interfaces'
import { IAuthRepository } from '@auth/domain/repositories'
import {
  LoginDto,
  LogoutDto,
  RegisterDto,
  LoginResponseDto,
  ResetPasswordDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  RequestPasswordResetDto,
} from '@auth/application/dtos'

export class AuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async login(data: LoginDto): Promise<LoginResponseDto> {
    return this.httpClient.post<LoginResponseDto>('/auth/login', data)
  }

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    return this.httpClient.post<RegisterResponseDto>('/auth/signup', data)
  }

  async logout(data?: LogoutDto): Promise<void> {
    await this.httpClient.post('/auth/logout', data)
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    return this.httpClient.post<RefreshTokenResponseDto>('/auth/refresh-tokens', { refreshToken })
  }

  async requestPasswordReset(data: RequestPasswordResetDto): Promise<void> {
    return this.httpClient.post('/auth/forgot-password', data)
  }

  async resetPassword({ password, token }: ResetPasswordDto): Promise<void> {
    return this.httpClient.post(`/auth/reset-password?token=${token}`, { password })
  }
}
