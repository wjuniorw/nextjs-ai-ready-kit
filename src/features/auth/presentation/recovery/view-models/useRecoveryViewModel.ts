import { useState } from 'react'
import { makeForgotPasswordUseCase } from '@auth/infra/factories'

export function useRecoveryViewModel() {
  const recoveryUseCase = makeForgotPasswordUseCase('front')

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setError(null)

    try {
      await recoveryUseCase.execute({ email })
      setIsSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Erro ao enviar e-mail. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    email,
    setEmail,
    isLoading,
    isSuccess,
    error,
    onSubmit,
  }
}
