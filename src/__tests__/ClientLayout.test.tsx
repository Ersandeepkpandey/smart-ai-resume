import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
}))

jest.mock('@/components/Navigation', () => {
  return function Navigation() {
    return <nav data-testid="navigation">Navigation</nav>
  }
})

import ClientLayout from '../components/ClientLayout'

describe('ClientLayout', () => {
  it('renders children', () => {
    render(
      <ClientLayout>
        <div data-testid="child">Test Content</div>
      </ClientLayout>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders main element', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('does not show navigation on home page', () => {
    render(
      <ClientLayout>
        <div>Content</div>
      </ClientLayout>
    )
    expect(screen.queryByTestId('navigation')).not.toBeInTheDocument()
  })

  it('wraps content in main tag', () => {
    render(
      <ClientLayout>
        <span>Test</span>
      </ClientLayout>
    )
    const main = screen.getByRole('main')
    expect(main).toContainElement(screen.getByText('Test'))
  })
})
