/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button component (Pure Vanilla Extract)', () => {
  it('renderiza o botão com texto filho', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeDefined()
  })

  it('aciona onClick ao ser clicado', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Ação</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Ação' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('desabilita o botão quando isDisabled for true', () => {
    render(<Button isDisabled>Bloqueado</Button>)
    expect(screen.getByRole('button', { name: 'Bloqueado' })).toHaveProperty(
      'disabled',
      true,
    )
  })

  it('exibe reticências e desabilita quando isLoading for true', () => {
    render(<Button isLoading>Enviando</Button>)
    const button = screen.getByRole('button')
    expect(button.textContent).toBe('...')
    expect(button).toHaveProperty('disabled', true)
  })
})
