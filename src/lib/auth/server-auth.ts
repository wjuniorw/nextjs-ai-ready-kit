import { cookies, headers } from 'next/headers'

export const getServerAuthToken = async () => {
  const cookieStore = await cookies()
  const headersList = await headers()
  
  const accessToken = cookieStore.get('session_token')
  const refreshToken = cookieStore.get('refresh_token')
  
  const clientIp = headersList.get('cf-connecting-ip') || headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || ''
  const userAgent = headersList.get('user-agent') || ''

  return {
    access: accessToken?.value ?? '',
    refresh: refreshToken?.value ?? '',
    clientIp,
    userAgent,
  }
}
