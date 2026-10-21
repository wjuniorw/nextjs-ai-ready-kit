import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'
export const container = style({
  backgroundColor: tokens.color.surface,
  border: `1px solid ${tokens.color.stroke}`,
  borderRadius: tokens.radius.md,
  padding: tokens.space[6],
  maxWidth: '56rem',
  margin: '0 auto',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
})

export const header = style({
  marginBottom: tokens.space[6]
})

export const title = style({
  fontFamily: tokens.fontFamily.headlineSm,
  fontSize: tokens.fontSize.headlineSm,
  fontWeight: 600,
  color: tokens.color.content
})

export const description = style({
  fontFamily: tokens.fontFamily.bodySm,
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.content_muted,
  marginTop: tokens.space[1]
})

export const emptyState = style({
  textAlign: 'center',
  padding: `${tokens.space[6]} 0`,
  color: tokens.color.content_muted
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[4]
})

export const row = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: tokens.space[4],
  border: `1px solid ${tokens.color.stroke_subtle}`,
  borderRadius: tokens.radius.md,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: tokens.color.canvas
  },
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center'
    }
  }
})

export const rowLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space[4],
  marginBottom: tokens.space[4],
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: 0
    }
  }
})

export const iconWrapper = style({
  backgroundColor: tokens.color.surface_container_low,
  padding: tokens.space[3],
  borderRadius: tokens.radius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export const infoCol = style({
  display: 'flex',
  flexDirection: 'column'
})

export const osBrowser = style({
  fontFamily: tokens.fontFamily.bodyMd,
  fontSize: tokens.fontSize.bodyMd,
  fontWeight: 600,
  color: tokens.color.content,
  display: 'flex',
  alignItems: 'center',
  gap: tokens.space[2]
})

export const metaData = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: tokens.fontFamily.bodySm,
  fontSize: tokens.fontSize.bodySm,
  color: tokens.color.content_muted,
  marginTop: tokens.space[1],
  gap: tokens.space[1],
  '@media': {
    'screen and (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.space[3]
    }
  }
})

export const dotDesktop = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 640px)': {
      display: 'inline',
      color: tokens.color.stroke
    }
  }
})

export const rowRight = style({
  display: 'flex',
  alignItems: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      justifyContent: 'flex-end'
    }
  }
})

export const badge = style({
  padding: `${tokens.space[1]} ${tokens.space[3]}`,
  backgroundColor: tokens.color.primary_tint,
  color: tokens.color.primary[600],
  fontFamily: tokens.fontFamily.bodySm,
  fontSize: tokens.fontSize.bodySm,
  fontWeight: 600,
  borderRadius: tokens.radius.sm
})

export const disconnectBtn = style({
  padding: `${tokens.space[2]} ${tokens.space[4]}`,
  border: `1px solid ${tokens.color.danger}`,
  color: tokens.color.danger,
  backgroundColor: 'transparent',
  fontFamily: tokens.fontFamily.bodySm,
  fontSize: tokens.fontSize.bodySm,
  fontWeight: 500,
  borderRadius: tokens.radius.md,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: tokens.color.danger_bg
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
})

export const loadingWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: tokens.space[10]
})
