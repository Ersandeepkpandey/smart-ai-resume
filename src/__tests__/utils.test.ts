describe('String utilities', () => {
  describe('email validation', () => {
    const isValidEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    }

    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('rejects invalid email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false)
    })

    it('rejects invalid email without domain', () => {
      expect(isValidEmail('test@')).toBe(false)
    })

    it('rejects empty string', () => {
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('phone formatting', () => {
    const formatPhone = (phone: string): string => {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      }
      return phone
    }

    it('formats 10 digit phone number', () => {
      expect(formatPhone('5551234567')).toBe('(555) 123-4567')
    })

    it('returns original for invalid phone', () => {
      expect(formatPhone('123')).toBe('123')
    })

    it('handles phone with existing formatting', () => {
      expect(formatPhone('555-123-4567')).toBe('(555) 123-4567')
    })
  })

  describe('text truncation', () => {
    const truncate = (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text
      return text.slice(0, maxLength - 3) + '...'
    }

    it('returns original text if shorter than max', () => {
      expect(truncate('hello', 10)).toBe('hello')
    })

    it('truncates long text with ellipsis', () => {
      expect(truncate('hello world', 8)).toBe('hello...')
    })

    it('handles empty string', () => {
      expect(truncate('', 10)).toBe('')
    })
  })
})

describe('Array utilities', () => {
  describe('unique items', () => {
    const unique = <T>(arr: T[]): T[] => [...new Set(arr)]

    it('removes duplicates from array', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('handles empty array', () => {
      expect(unique([])).toEqual([])
    })

    it('handles strings', () => {
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b'])
    })
  })

  describe('chunk array', () => {
    const chunk = <T>(arr: T[], size: number): T[][] => {
      const result: T[][] = []
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result
    }

    it('chunks array into specified size', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    })

    it('handles empty array', () => {
      expect(chunk([], 2)).toEqual([])
    })
  })
})
