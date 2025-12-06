import { render, screen, waitFor } from '@testing-library/react'
import { useAuth, AuthProvider } from '../contexts/AuthContext'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

global.fetch = jest.fn()

function TestComponent() {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `Logged in as ${user.email}` : 'Not logged in'}</div>
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'No session' }),
    })
  })

  it('provides auth context to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('throws error when useAuth is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider')
    consoleError.mockRestore()
  })
})

describe('AuthContext with authenticated user', () => {
  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            id: '1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user',
            status: 'active',
            isVerified: true,
            profile: {
              id: '1',
              email: 'test@example.com',
              fullName: 'Test User',
              role: 'user',
              status: 'active',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01',
            },
          },
        }),
    })
  })

  it('shows logged in user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument()
    })
  })
})
