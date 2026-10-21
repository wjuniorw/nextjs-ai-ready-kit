import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const authRoot = style({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: tokens.color.canvas,
  alignItems: 'center',
  justifyContent: 'center',
  padding: tokens.space[6],
})

export const authCard = style({
  width: '100%',
  maxWidth: '960px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: tokens.radius['4'],
  border: `1px solid ${tokens.color.stroke}`,
  backgroundColor: tokens.color.surface,
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
    },
  },
})

export const authBrandPanel = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space[5],
  padding: tokens.space[8],
  background: `linear-gradient(135deg, ${tokens.color.primary[500]}, ${tokens.color.secondary[500]})`,
  '@media': {
    'screen and (min-width: 768px)': {
      flex: 1,
    },
  },
})

export const authBrandTitle = style({
  color: '#ffffff',
  fontSize: '2.5rem',
  fontWeight: 700,
  letterSpacing: '4px',
  textAlign: 'center',
})

export const authBrandTagline = style({
  color: '#ffffff',
  fontSize: '1rem',
  opacity: 0.85,
  textAlign: 'center',
  lineHeight: '1.5rem',
  whiteSpace: 'pre-line',
})

export const authFormPanel = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: tokens.space[6],
  padding: tokens.space[8],
  backgroundColor: tokens.color.surface,
  '@media': {
    'screen and (min-width: 768px)': {
      flex: 1,
    },
  },
})
