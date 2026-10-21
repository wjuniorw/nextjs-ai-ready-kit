import Link from 'next/link'
import { Sparkles, Shield, Cpu, Layers } from 'lucide-react'
import { Button } from '@core/ui/button'
import { Card } from '@core/ui/card'
import { Badge } from '@core/ui/badge'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <header
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={28} color="var(--color-primary-500, #10b981)" />
          <Badge variant="accent">Next.js 16 + Pure Vanilla Extract</Badge>
        </div>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.5px',
          }}
        >
          Next.js AI-Ready Kit
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-content-muted, #94a3b8)',
            maxWidth: '640px',
            lineHeight: 1.6,
          }}
        >
          Template frontend com Clean Architecture, DDD, FSD, MVVM e
          Meta-Harness configurado para LLMs operarem com precisão cirúrgica.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Link href="/signin">
            <Button buttonSize="lg">Testar Auth (Login)</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" buttonSize="lg">
              Criar Conta
            </Button>
          </Link>
        </div>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <Layers size={22} color="var(--color-primary-500, #10b981)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Clean Architecture & DDD
            </h2>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-content-muted, #94a3b8)',
              lineHeight: 1.5,
            }}
          >
            Camadas estritas: Domain (Entities, VOs, Repo Interfaces),
            Application (Use Cases, DTOs), Infra (Repositories, Factories) e
            Presentation (MVVM, Actions).
          </p>
        </Card>

        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <Cpu size={22} color="var(--color-primary-500, #10b981)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Pure Vanilla Extract
            </h2>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-content-muted, #94a3b8)',
              lineHeight: 1.5,
            }}
          >
            Zero Tailwind e zero Tamagui. CSS-in-JS compilado em build time
            (`.css.ts`), tipos estritos de tokens e performance nativa máxima.
          </p>
        </Card>

        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.5rem',
            }}
          >
            <Shield size={22} color="var(--color-primary-500, #10b981)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              AI Meta-Harness
            </h2>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-content-muted, #94a3b8)',
              lineHeight: 1.5,
            }}
          >
            Metodologia TLC Spec-Driven integrada com as skills `create-feature`,
            `create-use-case`, `create-component` e scripts determinísticos do
            harness.
          </p>
        </Card>
      </section>
    </main>
  )
}
