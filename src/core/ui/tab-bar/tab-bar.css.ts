import { style } from '@vanilla-extract/css'
import { tokens } from '@core/ds/tokens.css'

export const bar = style({
  gap: tokens.space[6],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  borderBottom: `1px solid ${tokens.color.stroke}`,
})

export const tab = style({
  gap: tokens.space[2],
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  // A linha ativa sobrepõe a borda da barra: a aba parece "acender" no traço.
  marginBottom: -1,
  padding: `0 0 ${tokens.space[3]}`,
  fontWeight: 500,
  fontSize: tokens.fontSize.bodyMd,
  color: tokens.color.content_muted,
  borderBottom: '2px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
  ':hover': { color: tokens.color.content },
  ':focus-visible': { outline: `2px solid ${tokens.color.primary[500]}`, outlineOffset: 4 },
})

export const tabActive = style({
  fontWeight: 600,
  color: tokens.color.content,
  borderBottomColor: tokens.color.success,
})

/** Um número que pede atenção, como as decisões que esperam a pessoa. */
export const badge = style({
  minWidth: 20,
  height: 20,
  display: 'flex',
  padding: '0 6px',
  fontWeight: 700,
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.6875rem',
  // O lima do destaque é o mesmo nos dois temas, então o texto é sempre escuro.
  color: '#0A0F0D',
  borderRadius: tokens.radius.full,
  backgroundColor: tokens.color.accent[500],
})

/** Itens à direita da barra, como o Settings do cockpit. */
export const trailing = style({
  marginLeft: 'auto',
  paddingBottom: tokens.space[2],
})
