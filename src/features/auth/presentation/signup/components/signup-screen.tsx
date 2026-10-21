'use client'

import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { SignupForm } from '@auth/presentation/signup/components/signup-form'
export function SignupScreen() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}
