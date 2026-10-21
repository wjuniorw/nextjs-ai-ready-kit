import { z } from 'zod'
import { Email, Password } from '@auth/domain/value-objects'

// --- Auth VOs Schemas ---
const EmailSchema = z.string().refine((val) => {
  try {
    const mail = new Email(val)
    return !!mail.getValue()
  } catch (e) {
    console.error(e)
    return false
  }
}, 'Email inválido')

const PasswordSchema = z.string().refine((val) => {
  try {
    const pass = new Password(val)
    return !!pass.getValue()
  } catch (e: any) {
    console.error(e)
    return false
  }
}, 'Senha inválida')

// --- Schemas & DTOs ---

export const LoginSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(1, 'A senha é obrigatória')
})
export type LoginDto = z.infer<typeof LoginSchema>

export const LoginResponseSchema = z.object({
  phantomToken: z.string()
})
export type LoginResponseDto = z.infer<typeof LoginResponseSchema>

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: z.string().min(3, 'Primeiro nome é obrigatório'),
  lastName: z.string().min(3, 'Último nome é obrigatório'),
})
export type RegisterDto = z.infer<typeof RegisterSchema>

// Alias de compatibilidade com o formato legado
export const RegisterUserSchema = RegisterSchema
export type RegisterUserSchemaType = RegisterDto

export const RegisterResponseSchema = z.object({
  phantomToken: z.string()
})
export type RegisterResponseDto = z.infer<typeof RegisterResponseSchema>

export const LogoutSchema = z.object({
  access: z.string(),
  refresh: z.string()
})
export type LogoutDto = z.infer<typeof LogoutSchema>

export const RequestPasswordResetSchema = z.object({
  email: EmailSchema
})
export type RequestPasswordResetDto = z.infer<typeof RequestPasswordResetSchema>

export const NewPasswordSchema = z.object({
  password: PasswordSchema
})
export type NewPasswordDto = z.infer<typeof NewPasswordSchema>

export const ResetPasswordSchema = z.object({
  token: z.string(),
  password: PasswordSchema
})
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>

export const ResetPasswordResponseSchema = z.object({
  message: z.string()
})
export type ResetPasswordResponseDto = z.infer<typeof ResetPasswordResponseSchema>

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
})
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>

export const RefreshTokenResponseSchema = z.object({
  phantomToken: z.string()
})
export type RefreshTokenResponseDto = z.infer<typeof RefreshTokenResponseSchema>
