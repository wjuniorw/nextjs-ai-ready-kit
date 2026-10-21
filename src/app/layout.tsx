import './globals.css'
import '@core/ds/themes.css'

import { Toaster } from 'sonner'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Next.js AI-Ready Kit',
  description:
    'Next.js 16 Starter Kit with Clean Architecture, DDD, FSD and Vanilla Extract',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
