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

export const nameRow = style({
  display: 'flex',
  gap: tokens.space[4],
  flexDirection: 'column',
  '@media': {
    'screen and (min-width: 640px)': {
      flexDirection: 'row',
    },
  },
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[1],
  flex: 1,
})

export const label = style({
  fontSize: tokens.fontSize.bodySm,
  fontWeight: 500,
  color: tokens.color.content,
})

export const errorText = style({
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.danger,
})

export const passwordWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
})

export const passwordToggle = style({
  position: 'absolute',
  right: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: tokens.color.content_muted,
})

export const strengthList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[1],
  marginTop: tokens.space[2],
})

export const strengthItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space[2],
  fontSize: tokens.fontSize.bodySm,
})

export const promptRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.space[2],
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.content_muted,
})

export const signinLink = style({
  color: tokens.color.primary[500],
  fontWeight: 600,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
})

export const globalError = style({
  padding: `${tokens.space[2]} ${tokens.space[3]}`,
  borderRadius: tokens.radius['2'],
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  color: tokens.color.danger,
  fontSize: tokens.fontSize.bodySm,
})

export const successMessage = style({
  padding: `${tokens.space[2]} ${tokens.space[3]}`,
  borderRadius: tokens.radius['2'],
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  color: tokens.color.success,
  fontSize: tokens.fontSize.bodySm,
})
