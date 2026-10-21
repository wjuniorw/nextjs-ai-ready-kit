import { Suspense } from 'react'
import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { SigninForm } from '@auth/presentation/signin/components/signin-form'

export const metadata = {
  title: 'Entrar | Next.js AI-Ready Kit',
}

export default function SigninPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SigninForm />
      </Suspense>
    </AuthLayout>
  )
}
