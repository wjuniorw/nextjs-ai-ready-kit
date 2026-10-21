'use client'

import type { ReactNode } from 'react'

import { ConfirmModal } from '@core/ui/confirm-modal'

import type { ConfirmApplyState } from './use-confirm-apply'

export interface ConfirmApplyProps<R> {
  open: boolean
  state: ConfirmApplyState
  report: R | null
  error?: string | null
  title: string
  confirmText?: string
  cancelText?: string
  renderReport: (report: R) => ReactNode
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Componente modal para confirmação e execução de rotinas de manutenção em dois passos.
 * Sobre o ConfirmModal:
 * - Em `ready`: exibe o relatório da simulação via `renderReport` e botão "Aplicar" ativo.
 * - Em `failed`: exibe mensagem de erro e suprime o botão "Aplicar".
 * - Em `simulating` / `applying`: exibe indicador de carregamento e desabilita controles.
 */
export function ConfirmApply<R>({
  open,
  state,
  report,
  error,
  title,
  confirmText = 'Aplicar alterações',
  cancelText = 'Cancelar',
  renderReport,
  onConfirm,
  onCancel,
}: ConfirmApplyProps<R>) {
  const isFailed = state === 'failed'
  const isBusy = state === 'simulating' || state === 'applying'
  const isReady = state === 'ready'

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {isFailed && (
        <div
          style={{
            color: 'var(--color-error, #f87171)',
            padding: '0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          <strong>Falha na simulação:</strong>
          <p style={{ marginTop: '0.25rem' }}>
            {error || 'Não foi possível completar a simulação na API.'}
          </p>
        </div>
      )}

      {isBusy && (
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-content-muted, #888)',
          }}
        >
          {state === 'simulating'
            ? 'Simulando rotina de manutenção...'
            : 'Aplicando alterações no banco...'}
        </p>
      )}

      {isReady && report && renderReport(report)}
    </div>
  )

  return (
    <ConfirmModal
      open={open}
      title={title}
      variant="primary"
      isLoading={isBusy}
      description={content}
      onConfirm={onConfirm}
      hideConfirm={isFailed}
      cancelText={cancelText}
      confirmText={confirmText}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel()
      }}
    />
  )
}
