import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterDto } from '@auth/application/dtos'
import { makeSignupUseCase } from '@auth/infra/factories'

const passRules = [
  { label: 'Mínimo de 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Pelo menos uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Pelo menos um número', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Pelo menos um caractere especial', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export function useSignupViewModel() {
  const registerUseCase = makeSignupUseCase('front')
  const router = useRouter()

  const [form, setForm] = useState<RegisterDto & { confirmPassword?: string }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterDto | 'root', string>>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const passChecks = passRules.map((rule) => ({
    label: rule.label,
    valid: rule.test(form.password),
  }))

  const isPasswordStrong = passChecks.every((c) => c.valid)

  function setField(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMsg(null)

    const newErrors: typeof errors = {}
    if (!form.firstName) newErrors.firstName = 'Primeiro nome é obrigatório'
    if (!form.lastName) newErrors.lastName = 'Último nome é obrigatório'
    if (!form.email) newErrors.email = 'E-mail é obrigatório'
    if (!form.password) newErrors.password = 'Senha é obrigatória'
    else if (!isPasswordStrong) newErrors.password = 'Senha não atende aos requisitos'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      await registerUseCase.execute({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
      setSuccessMsg('Conta criada com sucesso!')
      setTimeout(() => router.push('/signin'), 2000)
    } catch (err: any) {
      setErrors({ root: err?.message || 'Erro ao criar conta. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    setField,
    errors,
    successMsg,
    isLoading,
    isPasswordVisible,
    setIsPasswordVisible,
    passChecks,
    onSubmit,
  }
}
