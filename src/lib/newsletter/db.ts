import client from '@/lib/turso'
import type {
  Subscriber,
  SubscriberPreferences,
  Newsletter,
  NewsletterStats,
  EmailTemplate,
  NewsletterSegment,
  SubscriberFilters,
  NewsletterFilters,
  PaginatedSubscribers,
  PaginatedNewsletters
} from './types'
import {
  generateSubscriberId,
  generateNewsletterId,
  normalizeEmail,
  getDefaultPreferences,
  createNewsletterStats
} from './utils'

export async function initNewsletterTables(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      source TEXT NOT NULL DEFAULT 'website',
      preferences TEXT NOT NULL DEFAULT '{}',
      confirmed_at TEXT,
      unsubscribed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletters (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      preheader TEXT,
      content TEXT NOT NULL,
      html_content TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_at TEXT,
      sent_at TEXT,
      author_id TEXT NOT NULL,
      target_segment_id TEXT,
      stats TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      newsletters TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'draft',
      start_date TEXT,
      end_date TEXT,
      stats TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_segments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      conditions TEXT NOT NULL DEFAULT '[]',
      subscriber_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'custom',
      html_content TEXT NOT NULL,
      variables TEXT NOT NULL DEFAULT '[]',
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_sends (
      id TEXT PRIMARY KEY,
      newsletter_id TEXT NOT NULL,
      subscriber_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      sent_at TEXT,
      opened_at TEXT,
      clicked_at TEXT,
      bounced_at TEXT,
      unsubscribed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (newsletter_id) REFERENCES newsletters(id),
      FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id)
    )
  `)

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email)
  `)

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers(status)
  `)

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status)
  `)

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_newsletter_sends_newsletter ON newsletter_sends(newsletter_id)
  `)
}

export async function getSubscribers(
  filters: SubscriberFilters = {}
): Promise<PaginatedSubscribers> {
  const {
    status,
    source,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 20
  } = filters

  let whereClause = '1=1'
  const args: (string | number)[] = []

  if (status) {
    whereClause += ' AND status = ?'
    args.push(status)
  }

  if (source) {
    whereClause += ' AND source = ?'
    args.push(source)
  }

  if (search) {
    whereClause += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)'
    const searchPattern = `%${search}%`
    args.push(searchPattern, searchPattern, searchPattern)
  }

  if (startDate) {
    whereClause += ' AND created_at >= ?'
    args.push(startDate)
  }

  if (endDate) {
    whereClause += ' AND created_at <= ?'
    args.push(endDate)
  }

  const countResult = await client.execute({
    sql: `SELECT COUNT(*) as total FROM newsletter_subscribers WHERE ${whereClause}`,
    args
  })

  const total = Number(countResult.rows[0].total)
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit

  const result = await client.execute({
    sql: `SELECT * FROM newsletter_subscribers
          WHERE ${whereClause}
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, limit, offset]
  })

  const subscribers: Subscriber[] = result.rows.map((row) => ({
    id: row.id as string,
    email: row.email as string,
    firstName: row.first_name as string | undefined,
    lastName: row.last_name as string | undefined,
    status: row.status as Subscriber['status'],
    source: row.source as Subscriber['source'],
    preferences: JSON.parse(row.preferences as string || '{}') as SubscriberPreferences,
    confirmedAt: row.confirmed_at as string | undefined,
    unsubscribedAt: row.unsubscribed_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }))

  return {
    data: subscribers,
    total,
    page,
    limit,
    totalPages
  }
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const normalizedEmail = normalizeEmail(email)

  const result = await client.execute({
    sql: `SELECT * FROM newsletter_subscribers WHERE email = ?`,
    args: [normalizedEmail]
  })

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id as string,
    email: row.email as string,
    firstName: row.first_name as string | undefined,
    lastName: row.last_name as string | undefined,
    status: row.status as Subscriber['status'],
    source: row.source as Subscriber['source'],
    preferences: JSON.parse(row.preferences as string || '{}') as SubscriberPreferences,
    confirmedAt: row.confirmed_at as string | undefined,
    unsubscribedAt: row.unsubscribed_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }
}

export async function getSubscriberById(id: string): Promise<Subscriber | null> {
  const result = await client.execute({
    sql: `SELECT * FROM newsletter_subscribers WHERE id = ?`,
    args: [id]
  })

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id as string,
    email: row.email as string,
    firstName: row.first_name as string | undefined,
    lastName: row.last_name as string | undefined,
    status: row.status as Subscriber['status'],
    source: row.source as Subscriber['source'],
    preferences: JSON.parse(row.preferences as string || '{}') as SubscriberPreferences,
    confirmedAt: row.confirmed_at as string | undefined,
    unsubscribedAt: row.unsubscribed_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }
}

export async function createSubscriber(data: {
  email: string
  firstName?: string
  lastName?: string
  source?: Subscriber['source']
  preferences?: Partial<SubscriberPreferences>
}): Promise<Subscriber> {
  const id = generateSubscriberId()
  const normalizedEmail = normalizeEmail(data.email)
  const now = new Date().toISOString()
  const preferences = {
    ...getDefaultPreferences(),
    ...data.preferences
  }

  await client.execute({
    sql: `INSERT INTO newsletter_subscribers
          (id, email, first_name, last_name, status, source, preferences, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      normalizedEmail,
      data.firstName || null,
      data.lastName || null,
      'pending',
      data.source || 'website',
      JSON.stringify(preferences),
      now,
      now
    ]
  })

  return {
    id,
    email: normalizedEmail,
    firstName: data.firstName,
    lastName: data.lastName,
    status: 'pending',
    source: data.source || 'website',
    preferences,
    createdAt: now,
    updatedAt: now
  }
}

export async function updateSubscriber(
  id: string,
  data: Partial<{
    firstName: string
    lastName: string
    status: Subscriber['status']
    preferences: SubscriberPreferences
  }>
): Promise<Subscriber | null> {
  const existing = await getSubscriberById(id)
  if (!existing) {
    return null
  }

  const now = new Date().toISOString()
  const updates: string[] = ['updated_at = ?']
  const args: (string | null)[] = [now]

  if (data.firstName !== undefined) {
    updates.push('first_name = ?')
    args.push(data.firstName || null)
  }

  if (data.lastName !== undefined) {
    updates.push('last_name = ?')
    args.push(data.lastName || null)
  }

  if (data.status !== undefined) {
    updates.push('status = ?')
    args.push(data.status)

    if (data.status === 'active' && existing.status === 'pending') {
      updates.push('confirmed_at = ?')
      args.push(now)
    }

    if (data.status === 'unsubscribed') {
      updates.push('unsubscribed_at = ?')
      args.push(now)
    }
  }

  if (data.preferences !== undefined) {
    updates.push('preferences = ?')
    args.push(JSON.stringify(data.preferences))
  }

  args.push(id)

  await client.execute({
    sql: `UPDATE newsletter_subscribers SET ${updates.join(', ')} WHERE id = ?`,
    args
  })

  return getSubscriberById(id)
}

export async function confirmSubscriber(id: string): Promise<Subscriber | null> {
  return updateSubscriber(id, { status: 'active' })
}

export async function unsubscribe(id: string): Promise<Subscriber | null> {
  return updateSubscriber(id, { status: 'unsubscribed' })
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  const result = await client.execute({
    sql: `DELETE FROM newsletter_subscribers WHERE id = ?`,
    args: [id]
  })

  return (result.rowsAffected ?? 0) > 0
}

export async function getNewsletters(
  filters: NewsletterFilters = {}
): Promise<PaginatedNewsletters> {
  const {
    status,
    authorId,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 20
  } = filters

  let whereClause = '1=1'
  const args: (string | number)[] = []

  if (status) {
    whereClause += ' AND status = ?'
    args.push(status)
  }

  if (authorId) {
    whereClause += ' AND author_id = ?'
    args.push(authorId)
  }

  if (search) {
    whereClause += ' AND (title LIKE ? OR subject LIKE ?)'
    const searchPattern = `%${search}%`
    args.push(searchPattern, searchPattern)
  }

  if (startDate) {
    whereClause += ' AND created_at >= ?'
    args.push(startDate)
  }

  if (endDate) {
    whereClause += ' AND created_at <= ?'
    args.push(endDate)
  }

  const countResult = await client.execute({
    sql: `SELECT COUNT(*) as total FROM newsletters WHERE ${whereClause}`,
    args
  })

  const total = Number(countResult.rows[0].total)
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit

  const result = await client.execute({
    sql: `SELECT * FROM newsletters
          WHERE ${whereClause}
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?`,
    args: [...args, limit, offset]
  })

  const newsletters: Newsletter[] = result.rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    subject: row.subject as string,
    preheader: row.preheader as string | undefined,
    content: row.content as string,
    htmlContent: row.html_content as string | undefined,
    status: row.status as Newsletter['status'],
    scheduledAt: row.scheduled_at as string | undefined,
    sentAt: row.sent_at as string | undefined,
    authorId: row.author_id as string,
    stats: JSON.parse(row.stats as string || '{}') as NewsletterStats,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }))

  return {
    data: newsletters,
    total,
    page,
    limit,
    totalPages
  }
}

export async function getNewsletterById(id: string): Promise<Newsletter | null> {
  const result = await client.execute({
    sql: `SELECT * FROM newsletters WHERE id = ?`,
    args: [id]
  })

  if (result.rows.length === 0) {
    return null
  }

  const row = result.rows[0]
  return {
    id: row.id as string,
    title: row.title as string,
    subject: row.subject as string,
    preheader: row.preheader as string | undefined,
    content: row.content as string,
    htmlContent: row.html_content as string | undefined,
    status: row.status as Newsletter['status'],
    scheduledAt: row.scheduled_at as string | undefined,
    sentAt: row.sent_at as string | undefined,
    authorId: row.author_id as string,
    stats: JSON.parse(row.stats as string || '{}') as NewsletterStats,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }
}

export async function createNewsletter(data: {
  title: string
  subject: string
  preheader?: string
  content: string
  htmlContent?: string
  authorId: string
  targetSegmentId?: string
}): Promise<Newsletter> {
  const id = generateNewsletterId()
  const now = new Date().toISOString()
  const stats = createNewsletterStats()

  await client.execute({
    sql: `INSERT INTO newsletters
          (id, title, subject, preheader, content, html_content, status, author_id, target_segment_id, stats, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.title,
      data.subject,
      data.preheader || null,
      data.content,
      data.htmlContent || null,
      'draft',
      data.authorId,
      data.targetSegmentId || null,
      JSON.stringify(stats),
      now,
      now
    ]
  })

  return {
    id,
    title: data.title,
    subject: data.subject,
    preheader: data.preheader,
    content: data.content,
    htmlContent: data.htmlContent,
    status: 'draft',
    authorId: data.authorId,
    stats,
    createdAt: now,
    updatedAt: now
  }
}

export async function updateNewsletter(
  id: string,
  data: Partial<{
    title: string
    subject: string
    preheader: string
    content: string
    htmlContent: string
    status: Newsletter['status']
    scheduledAt: string
  }>
): Promise<Newsletter | null> {
  const existing = await getNewsletterById(id)
  if (!existing) {
    return null
  }

  const now = new Date().toISOString()
  const updates: string[] = ['updated_at = ?']
  const args: (string | null)[] = [now]

  if (data.title !== undefined) {
    updates.push('title = ?')
    args.push(data.title)
  }

  if (data.subject !== undefined) {
    updates.push('subject = ?')
    args.push(data.subject)
  }

  if (data.preheader !== undefined) {
    updates.push('preheader = ?')
    args.push(data.preheader || null)
  }

  if (data.content !== undefined) {
    updates.push('content = ?')
    args.push(data.content)
  }

  if (data.htmlContent !== undefined) {
    updates.push('html_content = ?')
    args.push(data.htmlContent || null)
  }

  if (data.status !== undefined) {
    updates.push('status = ?')
    args.push(data.status)

    if (data.status === 'sent') {
      updates.push('sent_at = ?')
      args.push(now)
    }
  }

  if (data.scheduledAt !== undefined) {
    updates.push('scheduled_at = ?')
    args.push(data.scheduledAt || null)
  }

  args.push(id)

  await client.execute({
    sql: `UPDATE newsletters SET ${updates.join(', ')} WHERE id = ?`,
    args
  })

  return getNewsletterById(id)
}

export async function deleteNewsletter(id: string): Promise<boolean> {
  const result = await client.execute({
    sql: `DELETE FROM newsletters WHERE id = ?`,
    args: [id]
  })

  return (result.rowsAffected ?? 0) > 0
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const result = await client.execute({
    sql: `SELECT * FROM email_templates ORDER BY is_default DESC, name ASC`,
    args: []
  })

  return result.rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    category: row.category as EmailTemplate['category'],
    htmlContent: row.html_content as string,
    variables: JSON.parse(row.variables as string || '[]'),
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  }))
}

export async function getSegments(): Promise<NewsletterSegment[]> {
  const result = await client.execute({
    sql: `SELECT * FROM newsletter_segments ORDER BY name ASC`,
    args: []
  })

  return result.rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string | undefined,
    conditions: JSON.parse(row.conditions as string || '[]'),
    subscriberCount: Number(row.subscriber_count),
    createdAt: row.created_at as string
  }))
}

export async function getActiveSubscriberCount(): Promise<number> {
  const result = await client.execute({
    sql: `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'`,
    args: []
  })

  return Number(result.rows[0].count)
}

export async function getTotalSubscriberCount(): Promise<number> {
  const result = await client.execute({
    sql: `SELECT COUNT(*) as count FROM newsletter_subscribers`,
    args: []
  })

  return Number(result.rows[0].count)
}

export async function getSubscriberStats(): Promise<{
  total: number
  active: number
  pending: number
  unsubscribed: number
  bounced: number
}> {
  const result = await client.execute({
    sql: `SELECT
            status,
            COUNT(*) as count
          FROM newsletter_subscribers
          GROUP BY status`,
    args: []
  })

  const stats = {
    total: 0,
    active: 0,
    pending: 0,
    unsubscribed: 0,
    bounced: 0
  }

  for (const row of result.rows) {
    const status = row.status as string
    const count = Number(row.count)
    stats.total += count

    switch (status) {
      case 'active':
        stats.active = count
        break
      case 'pending':
        stats.pending = count
        break
      case 'unsubscribed':
        stats.unsubscribed = count
        break
      case 'bounced':
        stats.bounced = count
        break
    }
  }

  return stats
}
