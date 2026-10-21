import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { SessionResponseDto } from '@auth/application/dtos'
import { revokeSessionAction, listMySessionsAction } from '@auth/presentation/actions'

export function useMyDevices() {
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<SessionResponseDto[]>([])

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await listMySessionsAction()
      setSessions(data)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar os dispositivos')
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async (id: string) => {
    setRevokingId(id)
    try {
      await revokeSessionAction(id)

      setSessions((prev) => prev.filter((s) => s.id !== id))
      toast.success('Sessão desconectada com sucesso')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao desconectar dispositivo')
    } finally {
      setRevokingId(null)
    }
  }

  return {
    loading,
    sessions,
    revokingId,
    handleRevoke
  }
}
