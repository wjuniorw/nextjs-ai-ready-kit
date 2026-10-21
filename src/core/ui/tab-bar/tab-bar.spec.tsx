/** @vitest-environment jsdom */
import { it, vi, expect, describe } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { TabBar } from './tab-bar'

vi.mock('./tab-bar.css', () => ({
  bar: 'bar',
  tab: 'tab',
  tabActive: 'tabActive',
  badge: 'badge',
  trailing: 'trailing',
}))

const items = [
  { id: 'a', label: 'First', badge: 3 },
  { id: 'b', label: 'Second', badge: 0 },
  { id: 'c', label: 'Third' },
]

describe('TabBar', () => {
  it('marca a aba ativa para leitores de tela', () => {
    render(<TabBar value="b" items={items} label="Topics" onChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveProperty('ariaSelected', 'true')
    expect(screen.getByRole('tab', { name: /First/ })).toHaveProperty('ariaSelected', 'false')
  })

  it('o selo só aparece quando há algo esperando', () => {
    render(<TabBar value="a" items={items} label="Topics" onChange={vi.fn()} />)

    expect(screen.getByRole('tab', { name: /First/ }).textContent).toContain('3')
    expect(screen.getByRole('tab', { name: 'Second' }).textContent).toBe('Second')
    expect(screen.getByRole('tab', { name: 'Third' }).textContent).toBe('Third')
  })

  it('clicar avisa qual aba foi escolhida', () => {
    const onChange = vi.fn()
    render(<TabBar value="a" items={items} label="Topics" onChange={onChange} />)

    fireEvent.click(screen.getByRole('tab', { name: 'Third' }))

    expect(onChange).toHaveBeenCalledWith('c')
  })

  it('mostra os controles à direita, na mesma barra', () => {
    render(<TabBar value="a" items={items} label="Topics" onChange={vi.fn()} trailing={<span>Right side</span>} />)

    expect(screen.getByText('Right side')).toBeTruthy()
  })
})
