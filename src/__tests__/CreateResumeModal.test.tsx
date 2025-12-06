import { render, screen, fireEvent } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

import CreateResumeModal from '../components/CreateResumeModal'

describe('CreateResumeModal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('does not render when closed', () => {
    render(<CreateResumeModal isOpen={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Create New Resume')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Create New Resume')).toBeInTheDocument()
  })

  it('shows resume title input on first step', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Resume Title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Software Engineer Resume/i)).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText(/Step 1 of/)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons.find(btn => btn.querySelector('svg'))
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('shows next button on first step', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('disables previous button on first step', () => {
    render(<CreateResumeModal isOpen={true} onClose={mockOnClose} />)
    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()
  })
})
