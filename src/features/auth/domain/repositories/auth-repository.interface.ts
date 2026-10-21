import { LoginDto, LogoutDto, RegisterDto, LoginResponseDto, ResetPasswordDto, RegisterResponseDto, RefreshTokenResponseDto, RequestPasswordResetDto } from '@auth/application/dtos'

export interface IAuthRepository {
  login(data: LoginDto): Promise<LoginResponseDto>
  logout(data?: LogoutDto): Promise<any>
  register(data: RegisterDto): Promise<RegisterResponseDto>
  refreshToken(refresh: string): Promise<RefreshTokenResponseDto>
  requestPasswordReset(data: RequestPasswordResetDto): Promise<void>
  resetPassword(data: ResetPasswordDto): Promise<void>
}
