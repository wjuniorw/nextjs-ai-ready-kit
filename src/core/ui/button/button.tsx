import { ButtonHTMLAttributes, ReactNode } from 'react'
import * as styles from './button.css'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: ButtonVariant
  buttonSize?: ButtonSize
  isLoading?: boolean
  isDisabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  buttonSize = 'md',
  isLoading = false,
  isDisabled = false,
  className,
  disabled: htmlDisabled,
  ...props
}: ButtonProps) {
  const isEffectiveDisabled = isDisabled || htmlDisabled || isLoading

  const classNames = [
    styles.baseButton,
    styles.variants[variant],
    styles.sizes[buttonSize],
    isEffectiveDisabled ? styles.disabled : '',
    isLoading ? styles.loading : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button {...props} disabled={isEffectiveDisabled} className={classNames}>
      {isLoading ? '...' : children}
    </button>
  )
}
