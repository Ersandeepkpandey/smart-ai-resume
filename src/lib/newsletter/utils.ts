import type {
  Subscriber,
  SubscriberPreferences,
  Newsletter,
  NewsletterStats,
  AnalyticsSummary,
  SegmentCondition
} from './types'

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function generateSubscriberId(): string {
  const timestamp = Date.now().toString(36)
  let random = ''
  for (let i = 0; i < 8; i++) {
    random += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return `sub_${timestamp}${random}`
}

export function generateNewsletterId(): string {
  const timestamp = Date.now().toString(36)
  let random = ''
  for (let i = 0; i < 8; i++) {
    random += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return `nl_${timestamp}${random}`
}

export function generateUnsubscribeToken(subscriberId: string): string {
  const timestamp = Date.now().toString(36)
  let random = ''
  for (let i = 0; i < 16; i++) {
    random += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return Buffer.from(`${subscriberId}:${timestamp}:${random}`).toString('base64url')
}

export function parseUnsubscribeToken(token: string): { subscriberId: string; timestamp: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [subscriberId, timestamp] = decoded.split(':')
    if (!subscriberId || !timestamp) return null
    return { subscriberId, timestamp }
  } catch {
    return null
  }
}

export function generateConfirmationToken(email: string): string {
  const timestamp = Date.now().toString(36)
  let random = ''
  for (let i = 0; i < 24; i++) {
    random += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  const emailHash = simpleHash(email)
  return Buffer.from(`${emailHash}:${timestamp}:${random}`).toString('base64url')
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export function getDefaultPreferences(): SubscriberPreferences {
  return {
    resumeTips: true,
    careerAdvice: true,
    jobSearchStrategies: true,
    industryNews: false,
    productUpdates: true,
    weeklyDigest: true,
    frequency: 'weekly'
  }
}

export function mergePreferences(
  existing: SubscriberPreferences,
  updates: Partial<SubscriberPreferences>
): SubscriberPreferences {
  return {
    ...existing,
    ...updates
  }
}

export function calculateOpenRate(opened: number, delivered: number): number {
  if (delivered === 0) return 0
  return Math.round((opened / delivered) * 10000) / 100
}

export function calculateClickRate(clicked: number, opened: number): number {
  if (opened === 0) return 0
  return Math.round((clicked / opened) * 10000) / 100
}

export function calculateBounceRate(bounced: number, totalRecipients: number): number {
  if (totalRecipients === 0) return 0
  return Math.round((bounced / totalRecipients) * 10000) / 100
}

export function calculateUnsubscribeRate(unsubscribed: number, delivered: number): number {
  if (delivered === 0) return 0
  return Math.round((unsubscribed / delivered) * 10000) / 100
}

export function createNewsletterStats(partial: Partial<NewsletterStats> = {}): NewsletterStats {
  const stats: NewsletterStats = {
    totalRecipients: partial.totalRecipients || 0,
    delivered: partial.delivered || 0,
    opened: partial.opened || 0,
    clicked: partial.clicked || 0,
    bounced: partial.bounced || 0,
    unsubscribed: partial.unsubscribed || 0,
    openRate: 0,
    clickRate: 0
  }

  stats.openRate = calculateOpenRate(stats.opened, stats.delivered)
  stats.clickRate = calculateClickRate(stats.clicked, stats.opened)

  return stats
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 10000) / 100
}

export function createAnalyticsSummary(data: {
  totalSubscribers: number
  activeSubscribers: number
  newThisPeriod: number
  unsubscribesThisPeriod: number
  previousPeriodSubscribers: number
  totalOpens: number
  totalClicks: number
  totalDelivered: number
}): AnalyticsSummary {
  return {
    totalSubscribers: data.totalSubscribers,
    activeSubscribers: data.activeSubscribers,
    newSubscribersThisPeriod: data.newThisPeriod,
    unsubscribesThisPeriod: data.unsubscribesThisPeriod,
    averageOpenRate: calculateOpenRate(data.totalOpens, data.totalDelivered),
    averageClickRate: calculateClickRate(data.totalClicks, data.totalOpens),
    growthRate: calculateGrowthRate(data.totalSubscribers, data.previousPeriodSubscribers)
  }
}

export function formatSubscriberName(subscriber: Subscriber): string {
  if (subscriber.firstName && subscriber.lastName) {
    return `${subscriber.firstName} ${subscriber.lastName}`
  }
  if (subscriber.firstName) {
    return subscriber.firstName
  }
  return subscriber.email.split('@')[0]
}

export function getStatusLabel(status: Subscriber['status']): string {
  const labels: Record<Subscriber['status'], string> = {
    pending: 'Pending Confirmation',
    active: 'Active',
    unsubscribed: 'Unsubscribed',
    bounced: 'Bounced'
  }
  return labels[status]
}

export function getStatusColor(status: Subscriber['status']): string {
  const colors: Record<Subscriber['status'], string> = {
    pending: 'yellow',
    active: 'green',
    unsubscribed: 'gray',
    bounced: 'red'
  }
  return colors[status]
}

export function getNewsletterStatusLabel(status: Newsletter['status']): string {
  const labels: Record<Newsletter['status'], string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    sending: 'Sending',
    sent: 'Sent',
    cancelled: 'Cancelled'
  }
  return labels[status]
}

export function getNewsletterStatusColor(status: Newsletter['status']): string {
  const colors: Record<Newsletter['status'], string> = {
    draft: 'gray',
    scheduled: 'blue',
    sending: 'yellow',
    sent: 'green',
    cancelled: 'red'
  }
  return colors[status]
}

export function evaluateSegmentCondition(
  subscriber: Subscriber,
  condition: SegmentCondition
): boolean {
  const { field, operator, value } = condition

  let fieldValue: unknown

  switch (field) {
    case 'status':
      fieldValue = subscriber.status
      break
    case 'source':
      fieldValue = subscriber.source
      break
    case 'createdAt':
      fieldValue = subscriber.createdAt
      break
    case 'preferences':
      fieldValue = subscriber.preferences
      break
    default:
      return false
  }

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'contains':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return fieldValue.includes(value)
      }
      if (Array.isArray(value)) {
        return value.includes(fieldValue as string)
      }
      return false
    case 'before':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return new Date(fieldValue) < new Date(value)
      }
      return false
    case 'after':
      if (typeof fieldValue === 'string' && typeof value === 'string') {
        return new Date(fieldValue) > new Date(value)
      }
      return false
    default:
      return false
  }
}

export function filterSubscribersBySegment(
  subscribers: Subscriber[],
  conditions: SegmentCondition[]
): Subscriber[] {
  return subscribers.filter((subscriber) =>
    conditions.every((condition) => evaluateSegmentCondition(subscriber, condition))
  )
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`

  return formatDate(dateString)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function parseCSVSubscribers(csvContent: string): Array<{
  email: string
  firstName?: string
  lastName?: string
}> {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].toLowerCase().split(',').map((h) => h.trim())
  const emailIndex = headers.findIndex((h) => h.includes('email'))
  const firstNameIndex = headers.findIndex((h) => h.includes('first') && h.includes('name'))
  const lastNameIndex = headers.findIndex((h) => h.includes('last') && h.includes('name'))

  if (emailIndex === -1) return []

  const subscribers: Array<{ email: string; firstName?: string; lastName?: string }> = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''))
    const email = values[emailIndex]

    if (email && validateEmail(email)) {
      subscribers.push({
        email: normalizeEmail(email),
        firstName: firstNameIndex !== -1 ? values[firstNameIndex] : undefined,
        lastName: lastNameIndex !== -1 ? values[lastNameIndex] : undefined
      })
    }
  }

  return subscribers
}

export function generateCSVExport(subscribers: Subscriber[]): string {
  const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Created At']
  const rows = subscribers.map((sub) => [
    sub.email,
    sub.firstName || '',
    sub.lastName || '',
    sub.status,
    sub.source,
    sub.createdAt
  ])

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

export function sanitizeHtmlContent(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

export function extractTemplateVariables(template: string): string[] {
  const regex = /{{\s*(\w+)\s*}}/g
  const variables: string[] = []
  let match

  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1])
    }
  }

  return variables
}
