import { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import * as styles from './auth-layout.css'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.authRoot}>
      <div className={styles.authCard}>
        <div className={styles.authBrandPanel}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <Sparkles size={36} color="#ffffff" />
          </div>
          <h1 className={styles.authBrandTitle}>AI KIT</h1>
          <p className={styles.authBrandTagline}>
            Next.js 16 + Clean Architecture{'\n'}AI-Ready Starter
          </p>
        </div>

        <div className={styles.authFormPanel}>{children}</div>
      </div>
    </div>
  )
}
