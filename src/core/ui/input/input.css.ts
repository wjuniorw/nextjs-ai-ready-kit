import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const inputWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[1],
  width: '100%',
})

export const label = style({
  fontSize: tokens.fontSize.bodySm,
  fontWeight: 500,
  color: tokens.color.content,
})

export const inputField = style({
  width: '100%',
  padding: `${tokens.space[2]} ${tokens.space[3]}`,
  borderRadius: tokens.radius['2'],
  border: `1px solid ${tokens.color.stroke}`,
  backgroundColor: tokens.color.surface_alt,
  color: tokens.color.content,
  fontSize: tokens.fontSize.bodyMd,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
  ':focus': {
    borderColor: tokens.color.primary[500],
  },
  '::placeholder': {
    color: tokens.color.content_muted,
  },
})

export const inputError = style({
  borderColor: tokens.color.danger,
})

export const errorMessage = style({
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.danger,
})
