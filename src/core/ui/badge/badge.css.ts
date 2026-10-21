import { style, styleVariants } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${tokens.space[1]} ${tokens.space[3]}`,
  borderRadius: tokens.radius.full,
  fontFamily: tokens.fontFamily.labelSm,
  fontSize: tokens.fontSize.labelSm,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const variants = styleVariants({
  primary: {
    backgroundColor: 'rgba(186, 246, 0, 0.1)', // primary-fixed with opacity
    color: tokens.color.primary[500],
    border: `1px solid rgba(186, 246, 0, 0.2)`,
  },
  secondary: {
    backgroundColor: 'rgba(80, 221, 173, 0.1)',
    color: tokens.color.secondary[500],
    border: `1px solid rgba(80, 221, 173, 0.2)`,
  },
  accent: {
    backgroundColor: 'rgba(193, 255, 0, 0.1)',
    color: tokens.color.accent[500],
    border: `1px solid rgba(193, 255, 0, 0.2)`,
  },
  danger: {
    backgroundColor: tokens.color.danger_bg,
    color: tokens.color.danger_fg,
  },
  outline: {
    backgroundColor: 'transparent',
    color: tokens.color.content_muted,
    border: `1px solid ${tokens.color.stroke}`,
  },
})
