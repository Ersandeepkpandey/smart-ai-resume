describe('Resume Data Validation', () => {
  interface PersonalInfo {
    name: string
    email: string
    phone: string
    location: string
  }

  interface Experience {
    title: string
    company: string
    duration: string
    description: string
  }

  interface Resume {
    id?: string
    title: string
    personalInfo: PersonalInfo
    experience: Experience[]
  }

  const validatePersonalInfo = (info: PersonalInfo): string[] => {
    const errors: string[] = []
    if (!info.name.trim()) errors.push('Name is required')
    if (!info.email.trim()) errors.push('Email is required')
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      errors.push('Invalid email format')
    }
    return errors
  }

  const validateExperience = (exp: Experience): string[] => {
    const errors: string[] = []
    if (!exp.title.trim()) errors.push('Job title is required')
    if (!exp.company.trim()) errors.push('Company is required')
    return errors
  }

  const validateResume = (resume: Resume): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (!resume.title.trim()) errors.push('Resume title is required')
    errors.push(...validatePersonalInfo(resume.personalInfo))
    resume.experience.forEach((exp, i) => {
      const expErrors = validateExperience(exp)
      expErrors.forEach(err => errors.push(`Experience ${i + 1}: ${err}`))
    })
    return { valid: errors.length === 0, errors }
  }

  describe('personal info validation', () => {
    it('requires name', () => {
      const errors = validatePersonalInfo({ name: '', email: 'test@test.com', phone: '', location: '' })
      expect(errors).toContain('Name is required')
    })

    it('requires email', () => {
      const errors = validatePersonalInfo({ name: 'John', email: '', phone: '', location: '' })
      expect(errors).toContain('Email is required')
    })

    it('validates email format', () => {
      const errors = validatePersonalInfo({ name: 'John', email: 'invalid', phone: '', location: '' })
      expect(errors).toContain('Invalid email format')
    })

    it('passes valid info', () => {
      const errors = validatePersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        location: 'NYC',
      })
      expect(errors).toHaveLength(0)
    })
  })

  describe('experience validation', () => {
    it('requires title', () => {
      const errors = validateExperience({ title: '', company: 'Corp', duration: '', description: '' })
      expect(errors).toContain('Job title is required')
    })

    it('requires company', () => {
      const errors = validateExperience({ title: 'Developer', company: '', duration: '', description: '' })
      expect(errors).toContain('Company is required')
    })
  })

  describe('full resume validation', () => {
    it('validates complete resume', () => {
      const result = validateResume({
        title: 'My Resume',
        personalInfo: { name: 'John', email: 'john@test.com', phone: '', location: '' },
        experience: [{ title: 'Dev', company: 'Corp', duration: '2020-2023', description: '' }],
      })
      expect(result.valid).toBe(true)
    })

    it('fails on missing title', () => {
      const result = validateResume({
        title: '',
        personalInfo: { name: 'John', email: 'john@test.com', phone: '', location: '' },
        experience: [],
      })
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Resume title is required')
    })
  })
})

describe('Resume content generation', () => {
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const generateId = (): string => {
    return `resume-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  it('generates slug from title', () => {
    expect(generateSlug('Software Developer Resume')).toBe('software-developer-resume')
  })

  it('removes special characters from slug', () => {
    expect(generateSlug('My Resume (2024)!')).toBe('my-resume-2024')
  })

  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('generates ID with correct prefix', () => {
    const id = generateId()
    expect(id.startsWith('resume-')).toBe(true)
  })
})
