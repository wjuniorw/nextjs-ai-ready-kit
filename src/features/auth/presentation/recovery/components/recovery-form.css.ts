import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const formContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[6],
  width: '100%',
})

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[1],
})

export const title = style({
  fontSize: '1.75rem',
  fontWeight: 600,
  color: tokens.color.content,
})

export const subtitle = style({
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.content_muted,
})

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[4],
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[1],
})

export const label = style({
  fontSize: tokens.fontSize.bodySm,
  fontWeight: 500,
  color: tokens.color.content,
})

export const backRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space[2],
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.content_muted,
})

export const backLink = style({
  color: tokens.color.primary[500],
  fontWeight: 600,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const errorMessage = style({
  padding: `${tokens.space[2]} ${tokens.space[3]}`,
  borderRadius: tokens.radius['2'],
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  color: tokens.color.danger,
  fontSize: tokens.fontSize.bodySm,
})

export const successCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: tokens.space[3],
  padding: tokens.space[6],
})

export const successTitle = style({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: tokens.color.content,
})

export const successSubtitle = style({
  fontSize: tokens.fontSize.bodyMd,
  color: tokens.color.content_muted,
  lineHeight: '1.5rem',
})
