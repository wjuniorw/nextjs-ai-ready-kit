import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const card = style({
  backgroundColor: tokens.color.surface,
  border: `1px solid ${tokens.color.stroke}`,
  borderRadius: tokens.radius['2'],
  padding: tokens.space[4],
})
