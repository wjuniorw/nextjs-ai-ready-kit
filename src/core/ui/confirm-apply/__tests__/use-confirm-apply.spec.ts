import { it, vi, expect, describe } from 'vitest'
// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'

import { useConfirmApply } from '../use-confirm-apply'

describe('useConfirmApply hook (PADM-81, 82, 83)', () => {
  it('PADM-81: inicia no estado idle, sem relatório', () => {
    const simulate = vi.fn()
    const apply = vi.fn()

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    expect(result.current.state).toBe('idle')
    expect(result.current.report).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('PADM-81: start() executa simulate e transiciona para ready com o relatório', async () => {
    const mockReport = { candidates: 10, toFix: 3 }
    const simulate = vi.fn().mockResolvedValue(mockReport)
    const apply = vi.fn()

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    await act(async () => {
      await result.current.start()
    })

    expect(simulate).toHaveBeenCalledTimes(1)
    expect(apply).not.toHaveBeenCalled()
    expect(result.current.state).toBe('ready')
    expect(result.current.report).toEqual(mockReport)
    expect(result.current.error).toBeNull()
  })

  it('PADM-82: confirm() a partir de ready chama apply() e volta para idle', async () => {
    const simulate = vi.fn().mockResolvedValue({ ok: true })
    const apply = vi.fn().mockResolvedValue({ written: 3 })

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.state).toBe('ready')

    await act(async () => {
      await result.current.confirm()
    })

    expect(apply).toHaveBeenCalledTimes(1)
    expect(result.current.state).toBe('idle')
    expect(result.current.report).toBeNull()
  })

  it('PADM-83: confirm() fora de ready NÃO dispara apply()', async () => {
    const simulate = vi.fn()
    const apply = vi.fn()

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    // Chamando confirm enquanto ainda em idle
    await act(async () => {
      await result.current.confirm()
    })

    expect(apply).not.toHaveBeenCalled()
    expect(result.current.state).toBe('idle')
  })

  it('PADM-83: falha em simulate leva a failed com erro, e confirm() não chama apply()', async () => {
    const simulate = vi.fn().mockRejectedValue(new Error('Simulação falhou na API'))
    const apply = vi.fn()

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    await act(async () => {
      await result.current.start()
    })

    expect(result.current.state).toBe('failed')
    expect(result.current.error).toBe('Simulação falhou na API')

    await act(async () => {
      await result.current.confirm()
    })

    expect(apply).not.toHaveBeenCalled()
  })

  it('cancel() redefine o estado para idle sem chamar apply()', async () => {
    const simulate = vi.fn().mockResolvedValue({ test: 1 })
    const apply = vi.fn()

    const { result } = renderHook(() => useConfirmApply({ simulate, apply }))

    await act(async () => {
      await result.current.start()
    })
    expect(result.current.state).toBe('ready')

    act(() => {
      result.current.cancel()
    })

    expect(result.current.state).toBe('idle')
    expect(result.current.report).toBeNull()
    expect(apply).not.toHaveBeenCalled()
  })
})
