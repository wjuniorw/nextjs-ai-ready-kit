import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(2px)',
  animation: 'fadeIn 0.2s ease-out',
})

export const content = style({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10000,
  width: '90vw',
  maxWidth: '450px',
  backgroundColor: tokens.color.surface,
  borderRadius: tokens.radius.lg,
  padding: tokens.space[6],
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  border: `1px solid ${tokens.color.stroke}`,
  animation: 'scaleIn 0.2s ease-out',
})

export const title = style({
  margin: 0,
  fontSize: tokens.fontSize.headlineMd,
  fontWeight: 600,
  color: tokens.color.content,
})

export const description = style({
  margin: `${tokens.space[3]} 0 ${tokens.space[6]}`,
  fontSize: tokens.fontSize.bodyMd,
  color: tokens.color.content_muted,
  lineHeight: 1.5,
})

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: tokens.space[3],
})
