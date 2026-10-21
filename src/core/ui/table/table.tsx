import { HTMLAttributes, TableHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import * as styles from './table.css'

export const TableContainer = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.tableContainer} ${className || ''}`} {...props}>{children}</div>
)

export const Table = ({ children, className, ...props }: TableHTMLAttributes<HTMLTableElement>) => (
  <table className={`${styles.table} ${className || ''}`} {...props}>{children}</table>
)

export const Thead = ({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`${styles.thead} ${className || ''}`} {...props}>{children}</thead>
)

export const Th = ({ children, className, align = 'left', ...props }: ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'center' | 'right' }) => (
  <th className={`${styles.th} ${className || ''}`} style={{ textAlign: align, ...(props.style || {}) }} {...props}>{children}</th>
)

export const Tbody = ({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`${styles.tbody} ${className || ''}`} {...props}>{children}</tbody>
)

export const Tr = ({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`${styles.tr} ${className || ''}`} {...props}>{children}</tr>
)

export const Td = ({ children, className, align = 'left', ...props }: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'center' | 'right' }) => (
  <td className={`${styles.td} ${className || ''}`} style={{ textAlign: align, ...(props.style || {}) }} {...props}>{children}</td>
)
