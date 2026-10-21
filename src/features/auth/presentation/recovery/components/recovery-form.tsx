'use client'

import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@core/ui/input'
import { Button } from '@core/ui/button'
import { useRecoveryViewModel } from '@auth/presentation/recovery/view-models/useRecoveryViewModel'
import * as styles from './recovery-form.css'

export function RecoveryForm() {
  const { email, setEmail, isLoading, isSuccess, error, onSubmit } =
    useRecoveryViewModel()

  if (isSuccess) {
    return (
      <div className={styles.successCard}>
        <CheckCircle2 size={48} color="var(--color-success, #10b981)" />
        <h2 className={styles.successTitle}>E-mail enviado!</h2>
        <p className={styles.successSubtitle}>
          Verifique sua caixa de entrada para instruções de recuperação de senha.
        </p>
        <Link href="/signin" className={styles.backLink}>
          Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recuperar senha</h2>
        <p className={styles.subtitle}>
          Digite seu e-mail para receber instruções de recuperação de senha.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'contents' }}>
        <div className={styles.fields}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
            />
          </div>

          <Button
            type="submit"
            buttonSize="lg"
            isDisabled={!email}
            isLoading={isLoading}
          >
            Enviar instruções
          </Button>
        </div>
      </form>

      <div className={styles.backRow}>
        <span>Lembrou a senha?</span>
        <Link href="/signin" className={styles.backLink}>
          Voltar para o login
        </Link>
      </div>
    </div>
  )
}
