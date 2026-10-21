'use client'

import { ReactNode } from 'react'
import { Button } from '@core/ui/button'
import * as Dialog from '@radix-ui/react-dialog'

import * as styles from './confirm-modal.css'

export type ConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isLoading?: boolean
  variant?: 'danger' | 'primary' | 'secondary'
  hideCancel?: boolean
  hideConfirm?: boolean
}

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  isLoading = false,
  variant = 'danger',
  hideCancel = false,
  hideConfirm = false,
}: ConfirmModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={isLoading ? undefined : onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.description}>
            {description}
          </Dialog.Description>
          <div className={styles.actions}>
            {!hideCancel && (
              <Button
                variant="outline"
                isDisabled={isLoading}
                onClick={() => onOpenChange(false)}
              >
                {cancelText}
              </Button>
            )}
            {!hideConfirm && (
              <Button
                variant={variant}
                onClick={onConfirm}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
