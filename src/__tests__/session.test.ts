describe('Session utilities', () => {
  describe('session ID generation', () => {
    const generateRandomHex = (bytes: number): string => {
      const array = new Uint8Array(bytes)
      crypto.getRandomValues(array)
      return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
    }

    it('generates hex string of correct length', () => {
      const result = generateRandomHex(32)
      expect(result.length).toBe(64)
    })

    it('generates unique values', () => {
      const id1 = generateRandomHex(16)
      const id2 = generateRandomHex(16)
      expect(id1).not.toBe(id2)
    })

    it('contains only hex characters', () => {
      const result = generateRandomHex(8)
      expect(result).toMatch(/^[0-9a-f]+$/)
    })
  })

  describe('session expiration', () => {
    const SESSION_DURATION_HOURS = 24

    const isExpired = (expiresAt: string): boolean => {
      return new Date(expiresAt) < new Date()
    }

    const createExpirationDate = (): string => {
      return new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString()
    }

    it('creates expiration 24 hours in future', () => {
      const expiration = createExpirationDate()
      const expirationDate = new Date(expiration)
      const now = new Date()
      const diffHours = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      expect(Math.round(diffHours)).toBe(24)
    })

    it('detects expired session', () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      expect(isExpired(pastDate)).toBe(true)
    })

    it('detects valid session', () => {
      const futureDate = new Date(Date.now() + 10000).toISOString()
      expect(isExpired(futureDate)).toBe(false)
    })
  })

  describe('cookie settings', () => {
    const getCookieSettings = (isProduction: boolean) => ({
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60,
      sameSite: 'lax' as const,
      secure: isProduction,
    })

    it('sets secure flag in production', () => {
      const settings = getCookieSettings(true)
      expect(settings.secure).toBe(true)
    })

    it('does not set secure flag in development', () => {
      const settings = getCookieSettings(false)
      expect(settings.secure).toBe(false)
    })

    it('always sets httpOnly', () => {
      expect(getCookieSettings(true).httpOnly).toBe(true)
      expect(getCookieSettings(false).httpOnly).toBe(true)
    })

    it('sets correct maxAge', () => {
      const settings = getCookieSettings(true)
      expect(settings.maxAge).toBe(86400)
    })
  })
})
