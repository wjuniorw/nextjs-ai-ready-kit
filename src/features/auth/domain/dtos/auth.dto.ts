export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  tokens: {
    access: {
      token: string
      expiresIn: number
    }
    refresh: {
      token: string
      expiresIn: number
    }
  }
  user: {
    id: string
    email: string
    userName: string
  }
}

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LogoutDto {
  access: string
  refresh: string
}

export interface RegisterResponseDto {
  tokens: {
    access: string
    refresh: string
  }
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface RequestPasswordResetDto {
  email: string
}

export interface NewPasswordDto {
  password: string
}

export interface ResetPasswordDto {
  token: string
  password: string
}

export interface ResetPasswordResponseDto {
  message: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface RefreshTokenResponseDto {
  access: string
  refresh: string
}
