'use client'

import Link from 'next/link'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { Input } from '@core/ui/input'
import { Button } from '@core/ui/button'
import { useSignupViewModel } from '@auth/presentation/signup/view-models/useSignupViewModel'
import * as styles from './signup-form.css'

export function SignupForm() {
  const {
    form,
    setField,
    errors,
    successMsg,
    isLoading,
    isPasswordVisible,
    setIsPasswordVisible,
    passChecks,
    onSubmit,
  } = useSignupViewModel()

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Criar conta</h2>
        <p className={styles.subtitle}>Preencha os dados para se registrar</p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'contents' }}>
        <div className={styles.fields}>
          {errors.root && (
            <div className={styles.globalError}>{errors.root}</div>
          )}
          {successMsg && (
            <div className={styles.successMessage}>{successMsg}</div>
          )}

          <div className={styles.nameRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nome</label>
              <Input
                value={form.firstName}
                onChange={(e) => setField('firstName')(e.target.value)}
                placeholder="Seu nome"
              />
              {errors.firstName && (
                <span className={styles.errorText}>{errors.firstName}</span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Sobrenome</label>
              <Input
                value={form.lastName}
                onChange={(e) => setField('lastName')(e.target.value)}
                placeholder="Seu sobrenome"
              />
              {errors.lastName && (
                <span className={styles.errorText}>{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>E-mail</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setField('email')(e.target.value)}
              placeholder="voce@empresa.com"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passwordWrapper}>
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setField('password')(e.target.value)}
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
              <span className={styles.errorText}>{errors.password}</span>
            )}

            <div className={styles.strengthList}>
              {passChecks.map((check) => (
                <div key={check.label} className={styles.strengthItem}>
                  {check.valid ? (
                    <Check size={14} color="var(--color-success, #10b981)" />
                  ) : (
                    <X size={14} color="var(--color-danger, #ef4444)" />
                  )}
                  <span
                    style={{
                      color: check.valid
                        ? 'var(--color-success, #10b981)'
                        : 'var(--color-content-muted, #888)',
                    }}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" buttonSize="lg" isLoading={isLoading}>
            Criar Conta
          </Button>
        </div>
      </form>

      <div className={styles.promptRow}>
        <span>Já tem conta?</span>
        <Link href="/signin" className={styles.signinLink}>
          Entrar
        </Link>
      </div>
    </div>
  )
}
