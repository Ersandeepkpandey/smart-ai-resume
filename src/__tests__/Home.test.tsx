import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    updateUser: jest.fn(),
    isSigningOut: false,
  }),
}))

// Mock CreateResumeModal
jest.mock('@/components/CreateResumeModal', () => ({
  __esModule: true,
  default: () => <div data-testid="create-resume-modal" />,
}))

// Mock PDFVedaBanner
jest.mock('@/components/PDFVedaBanner', () => ({
  __esModule: true,
  default: () => <div data-testid="pdfveda-banner" />,
}))

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the navigation', () => {
    render(<Home />)
    const navElements = screen.getAllByRole('navigation')
    expect(navElements.length).toBeGreaterThan(0)
  })

  it('shows Create Resume button', () => {
    render(<Home />)
    const buttons = screen.getAllByRole('button', { name: /create resume/i })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('shows Sign In link when user is not logged in', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<Home />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
