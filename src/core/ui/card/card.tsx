import { HTMLAttributes, ReactNode } from 'react'
import * as styles from './card.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`} {...props}>
      {children}
    </div>
  )
}
