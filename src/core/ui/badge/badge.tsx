import { ReactNode } from 'react'
import * as styles from './badge.css'

export type BadgeProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline'
  className?: string
}

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles.variants[variant]} ${className || ''}`}>
      {children}
    </span>
  )
}
