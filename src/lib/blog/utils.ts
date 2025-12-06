export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options || {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffYear > 0) return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`
  if (diffMonth > 0) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`
  if (diffWeek > 0) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  return 'just now'
}

export function extractExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return truncateText(plainText, maxLength)
}

export function sanitizeHtml(html: string): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code']

  return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    return allowedTags.includes(tag.toLowerCase()) ? match : ''
  })
}

export function generateTableOfContents(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[1-6]>/gi
  const toc: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    toc.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].trim()
    })
  }

  return toc
}

export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery) return text
  const terms = searchQuery.split(/\s+/).filter(Boolean)
  let result = text

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    result = result.replace(regex, '<mark>$1</mark>')
  })

  return result
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`
}
