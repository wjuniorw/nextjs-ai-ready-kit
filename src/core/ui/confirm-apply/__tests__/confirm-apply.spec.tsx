/** @vitest-environment jsdom */
import { it, vi, expect, describe, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@core/ui/button', () => ({
  Button: ({
    children,
    onClick,
    isDisabled,
    isLoading,
  }: {
    children?: React.ReactNode
    onClick?: () => void
    isDisabled?: boolean
    isLoading?: boolean
  }) => (
    <button type="button" onClick={onClick} disabled={isDisabled || isLoading}>
      {children}
    </button>
  ),
}))

vi.mock('@core/ui/confirm-modal/confirm-modal.css', () => ({
  overlay: 'overlay',
  content: 'content',
  title: 'title',
  description: 'description',
  actions: 'actions',
}))

import { ConfirmApply } from '../confirm-apply'

describe('ConfirmApply component (PADM-83, 84)', () => {
  const defaultProps = {
    open: true,
    title: 'Confirmar Manutenção',
    renderReport: (rep: { items: number }) => (
      <div data-testid="report-content">Itens afetados: {rep.items}</div>
    ),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('PADM-84: em estado ready com relatório, exibe o conteúdo e botão Aplicar habilitado', () => {
    render(
      <ConfirmApply
        {...defaultProps}
        state="ready"
        report={{ items: 5 }}
        confirmText="Aplicar rotina"
      />,
    )

    expect(screen.getByTestId('report-content')).toBeDefined()
    expect(screen.getByText('Itens afetados: 5')).toBeDefined()

    const confirmBtn = screen.getByRole('button', { name: 'Aplicar rotina' })
    expect(confirmBtn).toBeDefined()
    expect(confirmBtn).toHaveProperty('disabled', false)

    fireEvent.click(confirmBtn)
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('PADM-83: em estado failed, exibe mensagem de erro e NÃO renderiza o botão Aplicar', () => {
    render(
      <ConfirmApply
        {...defaultProps}
        report={null}
        state="failed"
        confirmText="Aplicar rotina"
        error="Falha de conexão com a API"
      />,
    )

    expect(screen.getByText('Falha de conexão com a API')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Aplicar rotina' })).toBeNull()
  })

  it('em estado applying, o botão fica desabilitado (carregando)', () => {
    render(
      <ConfirmApply
        {...defaultProps}
        state="applying"
        report={{ items: 5 }}
        confirmText="Aplicar rotina"
      />,
    )

    expect(screen.getByText(/Aplicando alterações/i)).toBeDefined()
    const confirmBtn = screen.getByRole('button', { name: 'Aplicar rotina' })
    expect(confirmBtn).toHaveProperty('disabled', true)
  })

  it('em estado simulating, o botão fica desabilitado (carregando)', () => {
    render(
      <ConfirmApply
        {...defaultProps}
        report={null}
        state="simulating"
        confirmText="Aplicar rotina"
      />,
    )

    expect(screen.getByText(/Simulando rotina/i)).toBeDefined()
    const confirmBtn = screen.getByRole('button', { name: 'Aplicar rotina' })
    expect(confirmBtn).toHaveProperty('disabled', true)
  })

  it('clicar em Cancelar aciona onCancel', () => {
    render(
      <ConfirmApply
        {...defaultProps}
        state="ready"
        cancelText="Voltar"
        report={{ items: 1 }}
      />,
    )

    const cancelBtn = screen.getByRole('button', { name: 'Voltar' })
    fireEvent.click(cancelBtn)
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
  })
})
