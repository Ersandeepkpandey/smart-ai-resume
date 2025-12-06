import { calculateATSScore, ResumeContent } from '../lib/ats-scorer'

const createEmptyResume = (): ResumeContent => ({
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
})

const createFilledResume = (): ResumeContent => ({
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    location: 'New York, NY',
  },
  summary: 'Experienced software developer with expertise in building scalable web applications using modern technologies.',
  experience: [
    {
      title: 'Senior Developer',
      company: 'Tech Corp',
      duration: '2020-2023',
      description: 'Developed and implemented React applications. Led a team of 5 developers. Improved performance by 40%.',
    },
  ],
  education: [
    {
      degree: 'BS Computer Science',
      institution: 'State University',
      year: '2018',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'],
  certifications: ['AWS Certified Developer'],
})

describe('calculateATSScore', () => {
  it('returns low score for empty resume', () => {
    const resume = createEmptyResume()
    const result = calculateATSScore(resume)
    expect(result.score).toBeLessThan(30)
  })

  it('returns higher score for filled resume', () => {
    const resume = createFilledResume()
    const result = calculateATSScore(resume)
    expect(result.score).toBeGreaterThan(50)
  })

  it('includes suggestions for empty resume', () => {
    const resume = createEmptyResume()
    const result = calculateATSScore(resume)
    expect(result.suggestions.length).toBeGreaterThan(0)
  })

  it('finds keywords in resume', () => {
    const resume = createFilledResume()
    const result = calculateATSScore(resume)
    expect(result.keywords.length).toBeGreaterThan(0)
  })

  it('suggests adding action verbs when missing', () => {
    const resume = createEmptyResume()
    resume.summary = 'I work with computers'
    const result = calculateATSScore(resume)
    expect(result.suggestions).toContain('Use action verbs to describe your achievements')
  })

  it('detects action verbs when present', () => {
    const resume = createFilledResume()
    const result = calculateATSScore(resume)
    expect(result.suggestions).not.toContain('Use action verbs to describe your achievements')
  })

  it('suggests more skills when less than 5', () => {
    const resume = createEmptyResume()
    resume.skills = ['JavaScript', 'React']
    const result = calculateATSScore(resume)
    expect(result.suggestions).toContain('Add more relevant skills')
  })

  it('handles missing job keywords', () => {
    const resume = createFilledResume()
    const result = calculateATSScore(resume, ['kubernetes', 'terraform'])
    expect(result.missingKeywords).toContain('kubernetes')
    expect(result.missingKeywords).toContain('terraform')
  })

  it('handles undefined arrays gracefully', () => {
    const resume = {
      personalInfo: { name: 'Test', email: 'test@test.com', phone: '', location: '' },
      summary: '',
    } as ResumeContent
    expect(() => calculateATSScore(resume)).not.toThrow()
  })
})
