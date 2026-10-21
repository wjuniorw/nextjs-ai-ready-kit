'use client'

import { useMyDevices } from '@auth/presentation/view-models/use-my-devices'
import { Globe, Laptop, Smartphone, Monitor } from 'lucide-react'

import * as styles from './my-devices.css'

function parseUserAgent(ua: string) {
  const browser = /chrome|crios/i.test(ua) && !/edg/i.test(ua) ? 'Chrome' 
                : /safari/i.test(ua) && !/chrome|crios/i.test(ua) ? 'Safari'
                : /firefox|fxios/i.test(ua) ? 'Firefox'
                : /edg/i.test(ua) ? 'Edge'
                : /axios|fetch|node/i.test(ua) ? 'Server/BFF'
                : 'Browser Desconhecido'

  // Importante checar iOS/Android antes de Mac/Linux (pois mobile as vezes tem Mac OS X no UA)
  const os = /windows/i.test(ua) ? 'Windows'
           : /iphone|ipad|ipod|ios/i.test(ua) ? 'iOS'
           : /mac/i.test(ua) ? 'Mac OS'
           : /android/i.test(ua) ? 'Android'
           : /linux/i.test(ua) ? 'Linux'
           : 'Desconhecido'

  return { browser, os }
}

function getBrowserIcon(_browser: string) {
  return <Globe size={20} />
}

function getOSIcon(os: string) {
  if (os === 'iOS' || os === 'Android') {
    return <Smartphone size={16} />
  }
  if (os === 'Windows' || os === 'Mac OS' || os === 'Linux') {
    return <Laptop size={16} />
  }
  return <Monitor size={16} />
}

export function MyDevicesList() {
  const { sessions, loading, revokingId, handleRevoke } = useMyDevices()

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sessões e Dispositivos</h2>
        <p className={styles.description}>
          Gerencie os dispositivos onde sua conta está autenticada atualmente.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className={styles.emptyState}>Nenhuma sessão encontrada.</div>
      ) : (
        <div className={styles.list}>
          {sessions.map((session, index) => {
            const { browser, os } = parseUserAgent(session.metadata.userAgent || '')
            const isCurrentSession = index === 0 

            return (
              <div key={session.id} className={styles.row}>
                <div className={styles.rowLeft}>
                  <div className={styles.iconWrapper}>
                    {getBrowserIcon(browser)}
                  </div>
                  
                  <div className={styles.infoCol}>
                    <span className={styles.osBrowser}>
                      {getOSIcon(os)} {os} <span>•</span> {browser}
                    </span>
                    <div className={styles.metaData}>
                      <span>IP: {session.metadata.ip || 'Desconhecido'}</span>
                      <span className={styles.dotDesktop}>•</span>
                      <span>Login: {new Date(session.metadata.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.rowRight}>
                  {isCurrentSession ? (
                    <span className={styles.badge}>
                      Sessão Atual
                    </span>
                  ) : (
                    <button
                      className={styles.disconnectBtn}
                      disabled={revokingId === session.id}
                      onClick={() => handleRevoke(session.id)}
                    >
                      {revokingId === session.id ? 'Desconectando...' : 'Desconectar'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
