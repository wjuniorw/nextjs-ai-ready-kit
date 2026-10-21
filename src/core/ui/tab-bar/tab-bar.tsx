import type { ReactNode } from 'react'

import * as styles from './tab-bar.css'

export interface TabBarItem<Id extends string> {
  id: Id
  label: string
  /** Número que pede atenção; escondido quando 0 ou ausente. */
  badge?: number
}

export interface TabBarProps<Id extends string> {
  items: TabBarItem<Id>[]
  value: Id
  onChange: (id: Id) => void
  /** Descrição da barra para leitores de tela. */
  label: string
  /** Controles à direita, na mesma linha. */
  trailing?: ReactNode
}

/**
 * Abas em barra, com o traço ativo sobre a linha: o mesmo desenho do cockpit da
 * empresa (Products, Drafts, Activity). Serve a qualquer tela que troque de
 * assunto sem trocar de rota.
 */
export const TabBar = <Id extends string>({ items, value, onChange, label, trailing }: TabBarProps<Id>) => (
  <div className={styles.bar}>
    <div role="tablist" aria-label={label} style={{ display: 'contents' }}>
      {items.map((item) => (
        <button
          role="tab"
          key={item.id}
          type="button"
          aria-selected={value === item.id}
          onClick={() => onChange(item.id)}
          className={value === item.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}>
          {item.label}
          {!!item.badge && item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
        </button>
      ))}
    </div>

    {trailing && <div className={styles.trailing}>{trailing}</div>}
  </div>
)
