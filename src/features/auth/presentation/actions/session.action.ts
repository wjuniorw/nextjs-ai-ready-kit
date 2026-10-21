'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getServerAuthToken } from '@/lib/auth/server-auth'

async function handleBffError(error: unknown) {
  const isUnauthorized =
    (typeof error === 'object' && error !== null && 'response' in error && typeof (error as Record<string, unknown>).response === 'object' && ((error as Record<string, Record<string, unknown>>).response?.status === 401)) ||
    (typeof error === 'object' && error !== null && 'status' in error && (error as Record<string, unknown>).status === 401) ||
    (error instanceof Error && error.message.includes('401'))

  if (isUnauthorized) {
    const cookieStore = await cookies()
    cookieStore.delete('session_token')
    redirect('/signin?from=/my-devices')
  }
  throw error
}
import { makeListSessionsUseCase, makeRevokeSessionUseCase } from '@auth/infra/factories'
export async function listMySessionsAction() {
  try {
    const tokens = await getServerAuthToken()
    const useCase = makeListSessionsUseCase('bff', tokens)
    const result = await useCase.execute()
    return JSON.parse(JSON.stringify(result))
  } catch (error: unknown) {
    await handleBffError(error)
  }
}

export async function revokeSessionAction(id: string) {
  try {
    const tokens = await getServerAuthToken()
    const useCase = makeRevokeSessionUseCase('bff', tokens)
    const result = await useCase.execute(id)
    return JSON.parse(JSON.stringify(result))
  } catch (error: unknown) {
    await handleBffError(error)
  }
}
