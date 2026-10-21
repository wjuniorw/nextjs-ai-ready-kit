'use client'

import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { RecoveryForm } from '@auth/presentation/recovery/components/recovery-form'
export function RecoveryScreen() {
  return (
    <AuthLayout>
      <RecoveryForm />
    </AuthLayout>
  )
}
