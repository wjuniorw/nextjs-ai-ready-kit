import { style, styleVariants } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space[2],
  fontWeight: 600,
  borderRadius: tokens.radius['2'],
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s, opacity 0.2s',
  textDecoration: 'none',
  fontFamily: 'inherit',
  ':focus-visible': {
    outline: `2px solid ${tokens.color.primary[500]}`,
    outlineOffset: 2,
  },
})

export const variants = styleVariants({
  primary: {
    backgroundColor: tokens.color.primary[500],
    color: '#ffffff',
    ':hover': { backgroundColor: tokens.color.primary[600] },
    ':active': { backgroundColor: tokens.color.primary[700] },
  },
  secondary: {
    backgroundColor: tokens.color.surface_alt,
    color: tokens.color.content,
    borderColor: tokens.color.stroke,
    ':hover': { backgroundColor: tokens.color.surface },
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: tokens.color.stroke,
    color: tokens.color.content,
    ':hover': { borderColor: tokens.color.primary[500] },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: tokens.color.content,
    ':hover': { backgroundColor: tokens.color.surface_alt },
  },
  danger: {
    backgroundColor: tokens.color.danger,
    color: '#ffffff',
    ':hover': { opacity: 0.9 },
  },
})

export const sizes = styleVariants({
  sm: {
    padding: `${tokens.space[1]} ${tokens.space[3]}`,
    fontSize: tokens.fontSize.bodySm,
    minHeight: '32px',
  },
  md: {
    padding: `${tokens.space[2]} ${tokens.space[4]}`,
    fontSize: tokens.fontSize.bodyMd,
    minHeight: '40px',
  },
  lg: {
    padding: `${tokens.space[3]} ${tokens.space[6]}`,
    fontSize: tokens.fontSize.bodyLg,
    minHeight: '48px',
  },
})

export const disabled = style({
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
})

export const loading = style({
  opacity: 0.7,
  cursor: 'wait',
})
