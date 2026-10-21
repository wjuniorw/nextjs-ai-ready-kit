import { createGlobalTheme } from '@vanilla-extract/css'

import { tokens } from './tokens.css'

const sharedPalettes = {
  primary: { 50: '#ecf6f3', 100: '#D7FFF2', 200: '#A6F7DE', 300: '#6FE9C9', 400: '#37D6B0', 500: '#00B386', 600: '#009E79', 700: '#007A5E', 800: '#00624B', 900: '#004E3B' },
  secondary: { 50: '#E8F8FF', 100: '#D4F1FF', 200: '#A4E9FF', 300: '#66DBFF', 400: '#29B3E0', 500: '#00A8DC', 600: '#008FBB', 700: '#007799', 800: '#005C75', 900: '#004252' },
  accent: { 100: '#F4FFD2', 200: '#E4FFA8', 500: '#C1FF00', 600: '#A5E000', 700: '#8EBF00' },
  support: { 100: '#F3E8FF', 200: '#E9D5FF', 300: '#D8B4FE', 400: '#C084FC', 500: '#A78BFA', 600: '#8B5CF6', 700: '#7C3AED', 800: '#6D28D9', 900: '#581C87' },
}

const sharedDimensions = {
  space: { '0': '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 7: '28px', 8: '32px', 9: '36px', 10: '40px', 12: '48px', 14: '56px', 16: '64px', 20: '80px', 24: '96px', 28: '112px', 32: '128px', 36: '144px', true: '16px' },
  size: { '0': '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 7: '28px', 8: '32px', 9: '36px', 10: '40px', 12: '48px', 14: '56px', 16: '64px', 20: '80px', 24: '96px', 28: '112px', 32: '128px', 36: '144px', true: '16px', full: '100%', half: '50%', large: '25%', third: '33.333%' },
  radius: { '0': '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', sm: '4px', md: '8px', lg: '12px', DEFAULT: '8px', xl: '1rem', '2xl': '1.5rem', full: '9999px', true: '4px' },
  zIndex: { '0': '0', 10: '10', 20: '20', 30: '30', 40: '40', 50: '50', auto: 'auto' },
}

export const light = 'light'
export const dark = 'dark'

/**
 * Fundo fixo pede texto fixo.
 *
 * `info`, `warn`, `danger` e `success` têm os mesmos valores nos dois temas, e
 * isso é intencional: `*_bg` e `*_fg` formam **pares fixos**, legíveis em
 * qualquer tema justamente por não mudarem. Um alerta vermelho é vermelho no
 * claro e no escuro.
 *
 * O que quebra é misturar os dois mundos — usar `danger_bg` como fundo e
 * `content` como cor do texto. `content` muda com o tema: fica branco no
 * escuro, sobre um fundo rosa-claro que não mudou. O texto some, e o defeito só
 * aparece para quem usa o tema escuro.
 *
 * Duas saídas, ambas válidas:
 *
 * - **par fixo** — `backgroundColor: danger_bg` com `color: danger_fg`;
 * - **tingir o tom** — `color-mix(in srgb, ${danger} 8%, transparent)` como
 *   fundo, deixando o texto usar `content`. Serve quando o fundo deve ser
 *   discreto e acompanhar o tema.
 *
 * O que não vale é um de cada.
 */

createGlobalTheme(':root, .light', tokens, {
  color: {
    ...sharedPalettes,
    info: '#29B3E0', info_fg: '#003E52', info_bg: '#D4F1FF',
    warn: '#FBBF24', warn_fg: '#653D00', warn_bg: '#FFF7E0',
    danger: '#EF4444', danger_fg: '#7A1C1C', danger_bg: '#FDE8E8',
    success: '#00B386', success_fg: '#004B40', success_bg: '#E6FAF5',
    surface: '#FFFFFF', surface_alt: '#F1F5F9', canvas: '#F8FAFB',
    surface_container: '#F1F5F9', surface_container_low: '#F8FAFB', surface_container_high: '#E2E8F0',
    content: '#0F172A', content_muted: '#64748B',
    stroke: '#E2E8F0', stroke_subtle: 'rgba(0,0,0,0.1)', sidebar: 'rgba(255,255,255,0.95)', white: '#FFFFFF',
    primary_tint: `color-mix(in srgb, ${sharedPalettes.primary[500]} 15%, transparent)`,
    accent_tint: `color-mix(in srgb, ${sharedPalettes.accent[500]} 15%, transparent)`,
  },
  fontFamily: {
    displayLg: 'Hanken Grotesk, sans-serif',
    headlineLg: 'Hanken Grotesk, sans-serif',
    headlineMd: 'Hanken Grotesk, sans-serif',
    headlineSm: 'Hanken Grotesk, sans-serif',
    bodyLg: 'Inter, sans-serif',
    bodyMd: 'Inter, sans-serif',
    bodySm: 'Inter, sans-serif',
    labelMd: 'Inter, sans-serif',
    labelSm: 'Inter, sans-serif',
  },
  fontSize: {
    displayLg: '48px',
    headlineLg: '32px',
    headlineMd: '24px',
    headlineSm: '20px',
    bodyLg: '16px',
    bodyMd: '14px',
    bodySm: '13px',
    labelMd: '12px',
    labelSm: '11px',
  },
  ...sharedDimensions,
})

createGlobalTheme('.dark', tokens, {
  color: {
    ...sharedPalettes,
    info: '#29B3E0', info_fg: '#003E52', info_bg: '#D4F1FF',
    warn: '#FBBF24', warn_fg: '#653D00', warn_bg: '#FFF7E0',
    danger: '#EF4444', danger_fg: '#7A1C1C', danger_bg: '#FDE8E8',
    success: '#00B386', success_fg: '#004B40', success_bg: '#E6FAF5',
    surface: '#152E2B', surface_alt: '#111C20', canvas: '#0B1215',
    surface_container: '#1E3A39', surface_container_low: '#152E2B', surface_container_high: '#2A4B49',
    content: '#F3FAF8', content_muted: '#9CA3AF',
    stroke: '#1E3A39', stroke_subtle: 'rgba(255,255,255,0.1)', sidebar: 'rgba(21,46,43,0.95)', white: '#FFFFFF',
    primary_tint: `color-mix(in srgb, ${sharedPalettes.primary[500]} 15%, transparent)`,
    accent_tint: `color-mix(in srgb, ${sharedPalettes.accent[500]} 15%, transparent)`,
  },
  fontFamily: {
    displayLg: 'Hanken Grotesk, sans-serif',
    headlineLg: 'Hanken Grotesk, sans-serif',
    headlineMd: 'Hanken Grotesk, sans-serif',
    headlineSm: 'Hanken Grotesk, sans-serif',
    bodyLg: 'Inter, sans-serif',
    bodyMd: 'Inter, sans-serif',
    bodySm: 'Inter, sans-serif',
    labelMd: 'Inter, sans-serif',
    labelSm: 'Inter, sans-serif',
  },
  fontSize: {
    displayLg: '48px',
    headlineLg: '32px',
    headlineMd: '24px',
    headlineSm: '20px',
    bodyLg: '16px',
    bodyMd: '14px',
    bodySm: '13px',
    labelMd: '12px',
    labelSm: '11px',
  },
  ...sharedDimensions,
})
