export class Password {
  private readonly value: string

  constructor(value: string) {
    if (!this.isValidPassword(value)) {
      // throw new Error('Password must be at least 8 characters long, has at lest one Upper letter...')
      throw new Error('Password invalid!')
    }
    this.value = value
  }

  getValue(): string {
    return this.value
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    return passwordRegex.test(password)
  }

  passwordMatch(password: string): boolean {
    return this.value === password
  }
}
