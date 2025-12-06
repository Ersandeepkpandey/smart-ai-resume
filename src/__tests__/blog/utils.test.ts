import {
  generateSlug,
  calculateReadingTime,
  truncateText,
  formatDate,
  getRelativeTime,
  extractExcerpt,
  validateEmail,
  generateId
} from '@/lib/blog/utils'

describe('Blog Utils', () => {
  describe('generateSlug', () => {
    it('converts text to lowercase slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
    })

    it('removes special characters', () => {
      expect(generateSlug('Hello! World?')).toBe('hello-world')
    })

    it('handles multiple spaces', () => {
      expect(generateSlug('Hello   World')).toBe('hello-world')
    })

    it('handles leading and trailing spaces', () => {
      expect(generateSlug('  Hello World  ')).toBe('hello-world')
    })

    it('truncates long slugs to 100 characters', () => {
      const longText = 'a'.repeat(150)
      expect(generateSlug(longText).length).toBeLessThanOrEqual(100)
    })

    it('handles empty string', () => {
      expect(generateSlug('')).toBe('')
    })

    it('converts unicode to ascii equivalent', () => {
      expect(generateSlug('Café au Lait')).toBe('caf-au-lait')
    })
  })

  describe('calculateReadingTime', () => {
    it('returns 1 minute for short content', () => {
      const shortContent = 'Hello world this is a test.'
      expect(calculateReadingTime(shortContent)).toBe(1)
    })

    it('calculates correct time for longer content', () => {
      const words = Array(400).fill('word').join(' ')
      expect(calculateReadingTime(words)).toBe(2)
    })

    it('returns 1 for empty content', () => {
      expect(calculateReadingTime('')).toBe(1)
    })

    it('rounds up partial minutes', () => {
      const words = Array(250).fill('word').join(' ')
      expect(calculateReadingTime(words)).toBe(2)
    })
  })

  describe('truncateText', () => {
    it('returns original text if shorter than max length', () => {
      expect(truncateText('Hello', 10)).toBe('Hello')
    })

    it('truncates at word boundary', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...')
    })

    it('adds ellipsis when truncating', () => {
      const result = truncateText('Hello World Test', 10)
      expect(result.endsWith('...')).toBe(true)
    })

    it('handles single long word', () => {
      expect(truncateText('Supercalifragilistic', 10)).toBe('Supercalif...')
    })
  })

  describe('formatDate', () => {
    it('formats date with default options', () => {
      const date = '2024-03-15T10:00:00Z'
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('March')
    })

    it('uses custom format options', () => {
      const date = '2024-03-15T10:00:00Z'
      const formatted = formatDate(date, { month: 'short' })
      expect(formatted).toContain('Mar')
    })
  })

  describe('getRelativeTime', () => {
    it('returns "just now" for recent timestamps', () => {
      const now = new Date().toISOString()
      expect(getRelativeTime(now)).toBe('just now')
    })

    it('returns minutes ago for timestamps within an hour', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(getRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('returns hours ago for timestamps within a day', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(twoHoursAgo)).toBe('2 hours ago')
    })

    it('returns days ago for timestamps within a week', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(threeDaysAgo)).toBe('3 days ago')
    })

    it('uses singular form for 1 unit', () => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      expect(getRelativeTime(oneDayAgo)).toBe('1 day ago')
    })
  })

  describe('extractExcerpt', () => {
    it('removes HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>'
      expect(extractExcerpt(html)).toBe('Hello World')
    })

    it('truncates to specified length', () => {
      const longText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod'
      const excerpt = extractExcerpt(longText, 30)
      expect(excerpt.length).toBeLessThanOrEqual(33) // 30 + "..."
    })

    it('collapses multiple whitespace', () => {
      const text = 'Hello    World'
      expect(extractExcerpt(text)).toBe('Hello World')
    })
  })

  describe('validateEmail', () => {
    it('returns true for valid emails', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('returns false for invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('test@domain')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('generates string IDs', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('generates IDs with expected format', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
    })
  })
})
