export interface Subscriber {
  id: string
  email: string
  firstName?: string
  lastName?: string
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced'
  source: 'website' | 'blog' | 'landing_page' | 'api' | 'import'
  preferences: SubscriberPreferences
  confirmedAt?: string
  unsubscribedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SubscriberPreferences {
  resumeTips: boolean
  careerAdvice: boolean
  jobSearchStrategies: boolean
  industryNews: boolean
  productUpdates: boolean
  weeklyDigest: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
}

export interface Newsletter {
  id: string
  title: string
  subject: string
  preheader?: string
  content: string
  htmlContent?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
  scheduledAt?: string
  sentAt?: string
  authorId: string
  author?: NewsletterAuthor
  stats: NewsletterStats
  targetSegment?: NewsletterSegment
  createdAt: string
  updatedAt: string
}

export interface NewsletterAuthor {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface NewsletterStats {
  totalRecipients: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  openRate: number
  clickRate: number
}

export interface NewsletterSegment {
  id: string
  name: string
  description?: string
  conditions: SegmentCondition[]
  subscriberCount: number
  createdAt: string
}

export interface SegmentCondition {
  field: 'status' | 'source' | 'preferences' | 'createdAt' | 'lastActivity'
  operator: 'equals' | 'not_equals' | 'contains' | 'before' | 'after'
  value: string | string[] | boolean
}

export interface Campaign {
  id: string
  name: string
  description?: string
  newsletters: string[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate?: string
  endDate?: string
  stats: CampaignStats
  createdAt: string
  updatedAt: string
}

export interface CampaignStats {
  totalNewsletters: number
  totalRecipients: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  averageOpenRate: number
  averageClickRate: number
}

export interface EmailTemplate {
  id: string
  name: string
  description?: string
  category: 'welcome' | 'newsletter' | 'promotional' | 'transactional' | 'custom'
  htmlContent: string
  variables: TemplateVariable[]
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateVariable {
  name: string
  description: string
  defaultValue?: string
  required: boolean
}

export interface SubscriptionFormData {
  email: string
  firstName?: string
  lastName?: string
  preferences?: Partial<SubscriberPreferences>
  source?: Subscriber['source']
}

export interface UnsubscribeFormData {
  email: string
  reason?: string
  feedback?: string
}

export interface NewsletterFilters {
  status?: Newsletter['status']
  authorId?: string
  search?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface SubscriberFilters {
  status?: Subscriber['status']
  source?: Subscriber['source']
  search?: string
  startDate?: string
  endDate?: string
  hasPreference?: keyof SubscriberPreferences
  page?: number
  limit?: number
}

export interface PaginatedSubscribers {
  data: Subscriber[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedNewsletters {
  data: Newsletter[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SubscriptionResult {
  success: boolean
  subscriber?: Subscriber
  message: string
  requiresConfirmation?: boolean
}

export interface BulkOperationResult {
  success: boolean
  processed: number
  failed: number
  errors?: Array<{ id: string; error: string }>
}

export interface NewsletterAnalytics {
  period: 'day' | 'week' | 'month' | 'year'
  data: AnalyticsDataPoint[]
  summary: AnalyticsSummary
}

export interface AnalyticsDataPoint {
  date: string
  subscribers: number
  unsubscribes: number
  opens: number
  clicks: number
  bounces: number
}

export interface AnalyticsSummary {
  totalSubscribers: number
  activeSubscribers: number
  newSubscribersThisPeriod: number
  unsubscribesThisPeriod: number
  averageOpenRate: number
  averageClickRate: number
  growthRate: number
}
