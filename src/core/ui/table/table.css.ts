import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const tableContainer = style({
  width: '100%',
  overflowX: 'auto',
  backgroundColor: tokens.color.surface,
  borderRadius: tokens.radius.xl,
  border: `1px solid ${tokens.color.stroke}`,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
})

export const table = style({
  width: '100%',
  textAlign: 'left',
  borderCollapse: 'collapse',
})

export const thead = style({
  backgroundColor: tokens.color.surface_alt,
  borderBottom: `1px solid ${tokens.color.stroke}`,
})

export const th = style({
  padding: `${tokens.space[4]} ${tokens.space[6]}`,
  fontFamily: tokens.fontFamily.labelMd,
  fontSize: tokens.fontSize.labelMd,
  color: tokens.color.content_muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const tbody = style({
  // can use a global style for tr below
})

export const tr = style({
  borderBottom: `1px solid ${tokens.color.stroke}`,
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const td = style({
  padding: `${tokens.space[5]} ${tokens.space[6]}`,
  fontFamily: tokens.fontFamily.bodyMd,
  fontSize: tokens.fontSize.bodyMd,
  color: tokens.color.content,
})
