import { useState } from 'react'

export type ConfirmApplyState =
  | 'idle'
  | 'simulating'
  | 'ready'
  | 'failed'
  | 'applying'

export interface UseConfirmApplyOptions<R> {
  simulate: () => Promise<R>
  apply: () => Promise<unknown>
}

export interface UseConfirmApplyResult<R> {
  state: ConfirmApplyState
  report: R | null
  error: string | null
  start: () => Promise<void>
  confirm: () => Promise<void>
  cancel: () => void
}

/**
 * Hook para orquestrar o contrato de manutenção "simulação -> confirmar -> aplicar".
 * Garante que a escrita (`apply`) só seja chamada deliberadamente após a simulação
 * ter retornado sucesso e o operador ter confirmado.
 */
export function useConfirmApply<R>({
  simulate,
  apply,
}: UseConfirmApplyOptions<R>): UseConfirmApplyResult<R> {
  const [state, setState] = useState<ConfirmApplyState>('idle')
  const [report, setReport] = useState<R | null>(null)
  const [error, setError] = useState<string | null>(null)

  const start = async () => {
    setState('simulating')
    setError(null)
    try {
      const res = await simulate()
      setReport(res)
      setState('ready')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      setState('failed')
    }
  }

  const confirm = async () => {
    if (state !== 'ready') {
      return
    }

    setState('applying')
    setError(null)
    try {
      await apply()
      setState('idle')
      setReport(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      setState('failed')
    }
  }

  const cancel = () => {
    setState('idle')
    setError(null)
    setReport(null)
  }

  return {
    state,
    report,
    error,
    start,
    confirm,
    cancel,
  }
}
