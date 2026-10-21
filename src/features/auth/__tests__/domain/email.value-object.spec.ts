import { describe, it, expect } from 'vitest'
import { Email } from '@auth/domain/value-objects'

describe('Email Value Object (DDD pattern)', () => {
  it('cria uma instância válida quando o formato de e-mail é correto', () => {
    const email = new Email('usuario@empresa.com')
    expect(email.getValue()).toBe('usuario@empresa.com')
    expect(email.toString()).toBe('usuario@empresa.com')
  })

  it('lança exceção ao tentar instanciar com e-mail inválido', () => {
    expect(() => new Email('invalido')).toThrow('Invalid email format')
    expect(() => new Email('sem-arroba.com')).toThrow('Invalid email format')
    expect(() => new Email('@semusuario.com')).toThrow('Invalid email format')
  })
})
