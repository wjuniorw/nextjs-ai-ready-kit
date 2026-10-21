'use client'

import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@core/ui/input'
import { Button } from '@core/ui/button'
import { useSigninViewModel } from '@auth/presentation/signin/view-models/useSigninViewModel'
import * as styles from './signin-form.css'

export function SigninForm() {
  const {
    errors,
    onSubmit,
    isLoading,
    emailInput,
    passwordInput,
    isPasswordVisible,
    setIsPasswordVisible,
  } = useSigninViewModel()

  const hasGlobalError = Boolean(errors.email || errors.password)

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Entrar</h2>
        <p className={styles.subtitle}>Acesse sua conta para continuar</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'contents' }}>
        <div className={styles.fields}>
          {hasGlobalError && (
            <div className={styles.globalError}>
              Credenciais inválidas. Verifique seu e-mail e senha.
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>E-mail</label>
            <Input
              {...emailInput}
              type="email"
              placeholder="voce@empresa.com"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordWrapper}>
              <Input
                {...passwordInput}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                aria-label={isPasswordVisible ? 'Ocultar senha' : 'Ver senha'}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.footerRow}>
            <Link href="/recovery" className={styles.forgotLink}>
              Esqueci minha senha
            </Link>
          </div>

          <Button type="submit" buttonSize="lg" isLoading={isLoading}>
            Entrar
          </Button>
        </div>
      </form>

      <div className={styles.promptRow}>
        <span>Não tem conta?</span>
        <Link href="/signup" className={styles.signupLink}>
          Criar conta
        </Link>
      </div>
    </div>
  )
}
