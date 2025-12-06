describe('API Response Helpers', () => {
  const createResponse = (data: unknown, status: number) => ({
    status,
    data,
    ok: status >= 200 && status < 300,
  })

  describe('success responses', () => {
    it('creates 200 response', () => {
      const response = createResponse({ message: 'OK' }, 200)
      expect(response.status).toBe(200)
      expect(response.ok).toBe(true)
    })

    it('creates 201 response for created', () => {
      const response = createResponse({ id: '123' }, 201)
      expect(response.status).toBe(201)
      expect(response.ok).toBe(true)
    })
  })

  describe('error responses', () => {
    it('creates 400 bad request', () => {
      const response = createResponse({ error: 'Bad request' }, 400)
      expect(response.status).toBe(400)
      expect(response.ok).toBe(false)
    })

    it('creates 401 unauthorized', () => {
      const response = createResponse({ error: 'Unauthorized' }, 401)
      expect(response.status).toBe(401)
      expect(response.ok).toBe(false)
    })

    it('creates 404 not found', () => {
      const response = createResponse({ error: 'Not found' }, 404)
      expect(response.status).toBe(404)
      expect(response.ok).toBe(false)
    })

    it('creates 500 server error', () => {
      const response = createResponse({ error: 'Server error' }, 500)
      expect(response.status).toBe(500)
      expect(response.ok).toBe(false)
    })
  })
})

describe('Request Validation', () => {
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (password.length < 8) errors.push('Password must be at least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number')
    return { valid: errors.length === 0, errors }
  }

  describe('email validation', () => {
    it('accepts valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })

    it('rejects email without @', () => {
      expect(validateEmail('userexample.com')).toBe(false)
    })

    it('rejects email without domain', () => {
      expect(validateEmail('user@')).toBe(false)
    })
  })

  describe('password validation', () => {
    it('accepts strong password', () => {
      const result = validatePassword('SecurePass123')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects short password', () => {
      const result = validatePassword('Short1')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('rejects password without uppercase', () => {
      const result = validatePassword('lowercase123')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain uppercase letter')
    })

    it('rejects password without number', () => {
      const result = validatePassword('NoNumbers')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain a number')
    })
  })
})

describe('Resume API Helpers', () => {
  interface Resume {
    id: string
    title: string
    createdAt: string
    updatedAt: string
  }

  const sortResumes = (resumes: Resume[], order: 'asc' | 'desc'): Resume[] => {
    return [...resumes].sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return order === 'desc' ? dateB - dateA : dateA - dateB
    })
  }

  const filterByTitle = (resumes: Resume[], query: string): Resume[] => {
    return resumes.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
  }

  it('sorts resumes by date descending', () => {
    const resumes: Resume[] = [
      { id: '1', title: 'Old', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', title: 'New', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    ]
    const sorted = sortResumes(resumes, 'desc')
    expect(sorted[0].id).toBe('2')
  })

  it('sorts resumes by date ascending', () => {
    const resumes: Resume[] = [
      { id: '1', title: 'Old', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', title: 'New', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    ]
    const sorted = sortResumes(resumes, 'asc')
    expect(sorted[0].id).toBe('1')
  })

  it('filters resumes by title', () => {
    const resumes: Resume[] = [
      { id: '1', title: 'Software Developer', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      { id: '2', title: 'Product Manager', createdAt: '2024-02-01', updatedAt: '2024-02-01' },
    ]
    const filtered = filterByTitle(resumes, 'software')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('1')
  })
})
