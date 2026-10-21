import { SelectHTMLAttributes, forwardRef } from 'react'
import * as styles from './select.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, children, ...props }, ref) => {
    return (
      <div className={styles.selectWrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={`${styles.selectField} ${className || ''}`}
          {...props}
        >
          {children}
        </select>
      </div>
    )
  },
)

Select.displayName = 'Select'
