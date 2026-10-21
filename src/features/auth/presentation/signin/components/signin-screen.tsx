'use client'

import { AuthLayout } from '@auth/presentation/components/auth-layout'
import { SigninForm } from '@auth/presentation/signin/components/signin-form'
export function SigninScreen() {
  return (
    <AuthLayout>
      <SigninForm />
    </AuthLayout>
  )
}
