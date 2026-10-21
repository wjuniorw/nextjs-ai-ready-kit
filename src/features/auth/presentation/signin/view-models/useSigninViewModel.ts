import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoginSchema, LoginDto } from '@auth/application/dtos'
import { useSearchParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { makeSigninUseCase } from '@auth/infra/factories'

export function useSigninViewModel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signinUseCase = makeSigninUseCase('front')

  const {
    register,
    setError,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true)
    try {
      await signinUseCase.execute(data)
      const from = searchParams.get('from')
      const destination = from && from !== '/' ? from : '/lobby'
      // console.log('destination url ===>', destination)
      router.replace(destination)
    } catch {
      setError('email', { message: 'Credenciais inválidas' })
      setError('password', { message: 'Credenciais inválidas' })
    } finally {
      setIsLoading(false)
    }
  }

  const emailInput = register('email', { required: 'Email é obrigatório' })
  const passwordInput = register('password', { required: 'Senha é obrigatória' })

  const handleSignin = (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    onSubmit({ email: formData.get('email') as string, password: formData.get('password') as string })
  }

  return {
    errors,
    isLoading,
    emailInput,
    isPasswordVisible,
    setIsPasswordVisible,
    onSubmit: handleSignin,
    passwordInput: { ...passwordInput, type: isPasswordVisible ? 'text' : 'password' },
  }
}
