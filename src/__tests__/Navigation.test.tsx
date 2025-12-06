import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: jest.fn(),
  }),
}))

import Navigation from '../components/Navigation'

describe('Navigation', () => {
  it('renders the logo', () => {
    render(<Navigation />)
    expect(screen.getByText('Rezume')).toBeInTheDocument()
  })

  it('renders create resume link', () => {
    render(<Navigation />)
    const links = screen.getAllByRole('link')
    const createLink = links.find(link => link.getAttribute('href')?.includes('/resume/new'))
    expect(createLink).toBeInTheDocument()
  })

  it('renders dashboard link', () => {
    render(<Navigation />)
    expect(screen.getByText('My Resumes')).toBeInTheDocument()
  })

  it('does not show user menu when not logged in', () => {
    render(<Navigation />)
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument()
  })
})

describe('Navigation with logged in user', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('shows user menu when logged in', () => {
    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', role: 'user' },
        signOut: jest.fn(),
      }),
    }))
  })
})
