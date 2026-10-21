import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { SignupForm } from '@auth/presentation/signup/components/signup-form'

export const metadata = {
  title: 'Criar Conta | Next.js AI-Ready Kit',
}

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}
