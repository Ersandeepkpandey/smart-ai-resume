import React from 'react';

export interface ATSScore {
  score: number
  suggestions: string[]
  keywords: string[]
  missingKeywords: string[]
}

export interface TextFormatting {
  fontSize?: string
  fontFamily?: string
  color?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

// Function to render content with clickable links
export const renderContentWithLinks = (content: string): React.ReactNode => {
  if (!content) return content;

  // Replace [LINK:url]text[/LINK] with clickable links
  const linkRegex = /\[LINK:([^\]]+)\]([^[]*)\[\/LINK\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add the clickable link
    const url = match[1];
    const linkText = match[2];
    parts.push(
      React.createElement('a', {
        key: `link-${match.index}`,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          window.open(url, '_blank');
        }
      }, linkText)
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : content;
};

export interface ResumeContent {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    socialLinks?: Array<{
      platform: string
      url: string
      label?: string
    }>
    formatting?: {
      name?: TextFormatting
      email?: TextFormatting
      phone?: TextFormatting
      location?: TextFormatting
    }
  }
  summary: string
  summaryFormatting?: TextFormatting
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
    formatting?: {
      title?: TextFormatting
      company?: TextFormatting
      duration?: TextFormatting
      description?: TextFormatting
    }
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    formatting?: {
      degree?: TextFormatting
      institution?: TextFormatting
      year?: TextFormatting
    }
  }>
  skills: string[]
  certifications: string[]
  formatting?: TextFormatting
  otherQualities?: string[]
  customSections?: { heading: string, content: string }[]
  showSocialLinksInPDF?: boolean
  sectionHeadings?: {
    summary?: string
    experience?: string
    education?: string
    skills?: string
    certifications?: string
  }
}

// Common ATS keywords by industry
const COMMON_KEYWORDS = {
  technical: [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'typescript',
    'html', 'css', 'mongodb', 'postgresql', 'redis', 'elasticsearch', 'machine learning',
    'ai', 'data analysis', 'statistics', 'excel', 'tableau', 'power bi'
  ],
  business: [
    'project management', 'leadership', 'strategy', 'analysis', 'marketing',
    'sales', 'customer service', 'communication', 'teamwork', 'problem solving',
    'budgeting', 'forecasting', 'negotiation', 'presentation', 'research'
  ],
  general: [
    'management', 'coordination', 'planning', 'organization', 'multitasking',
    'attention to detail', 'time management', 'collaboration', 'innovation',
    'adaptability', 'flexibility', 'initiative', 'results-oriented'
  ]
}

export function calculateATSScore(content: ResumeContent, jobKeywords: string[] = []): ATSScore {
  const suggestions: string[] = []
  const foundKeywords: string[] = []
  const missingKeywords: string[] = []

  // Defensive: ensure all arrays exist
  const experience = content.experience || []
  const education = content.education || []
  const skills = content.skills || []
  const certifications = content.certifications || []
  const summary = content.summary || ''

  // Combine all text content for analysis
  const allText = [
    content.personalInfo?.name || '',
    content.personalInfo?.email || '',
    content.personalInfo?.location || '',
    summary,
    ...experience.map(exp => `${exp.title || ''} ${exp.company || ''} ${exp.description || ''}`),
    ...education.map(edu => `${edu.degree || ''} ${edu.institution || ''}`),
    ...skills,
    ...certifications
  ].join(' ').toLowerCase()

  // Check for common keywords
  const allKeywords = [...COMMON_KEYWORDS.technical, ...COMMON_KEYWORDS.business, ...COMMON_KEYWORDS.general, ...jobKeywords]

  allKeywords.forEach(keyword => {
    if (allText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword)
    } else if (jobKeywords.includes(keyword)) {
      missingKeywords.push(keyword)
    }
  })

  // Calculate score based on various factors
  let score = 0

  // Keyword match (40 points)
  const keywordScore = Math.min((foundKeywords.length / Math.max(jobKeywords.length, 10)) * 40, 40)
  score += keywordScore

  // Content completeness (30 points)
  if (summary.length > 50) score += 10
  if (experience.length > 0) score += 10
  if (education.length > 0) score += 5
  if (skills.length > 5) score += 5

  // Format and structure (20 points)
  if (content.personalInfo?.name && content.personalInfo?.email) score += 10
  if (experience.some(exp => (exp.description || '').length > 50)) score += 10

  // Action verbs and achievements (10 points)
  const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'created', 'designed', 'improved', 'increased', 'reduced', 'achieved']
  const hasActionVerbs = actionVerbs.some(verb => allText.includes(verb))
  if (hasActionVerbs) score += 10

  // Generate suggestions
  if (score < 70) {
    suggestions.push('Consider adding more relevant keywords from the job description')
  }
  if (summary.length < 50) {
    suggestions.push('Add a more detailed professional summary')
  }
  if (experience.length === 0) {
    suggestions.push('Include relevant work experience')
  }
  if (skills.length < 5) {
    suggestions.push('Add more relevant skills')
  }
  if (!hasActionVerbs) {
    suggestions.push('Use action verbs to describe your achievements')
  }
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`)
  }

  return {
    score: Math.round(score),
    suggestions,
    keywords: foundKeywords,
    missingKeywords
  }
}