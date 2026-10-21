import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { RecoveryForm } from '@auth/presentation/recovery/components/recovery-form'

export const metadata = {
  title: 'Recuperar Senha | Next.js AI-Ready Kit',
}

export default function RecoveryPage() {
  return (
    <AuthLayout>
      <RecoveryForm />
    </AuthLayout>
  )
}
