import { render, screen, fireEvent } from '@testing-library/react'

const FormattedInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    data-testid="formatted-input"
  />
)

describe('FormattedInput', () => {
  it('renders with placeholder', () => {
    render(<FormattedInput value="" onChange={() => {}} placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('displays value', () => {
    render(<FormattedInput value="Hello" onChange={() => {}} />)
    expect(screen.getByDisplayValue('Hello')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const handleChange = jest.fn()
    render(<FormattedInput value="" onChange={handleChange} />)
    fireEvent.change(screen.getByTestId('formatted-input'), { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledWith('test')
  })

  it('renders as email type', () => {
    render(<FormattedInput value="" onChange={() => {}} type="email" />)
    expect(screen.getByTestId('formatted-input')).toHaveAttribute('type', 'email')
  })

  it('renders as tel type', () => {
    render(<FormattedInput value="" onChange={() => {}} type="tel" />)
    expect(screen.getByTestId('formatted-input')).toHaveAttribute('type', 'tel')
  })
})

describe('Input formatting helpers', () => {
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const capitalizeWords = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  describe('phone formatting', () => {
    it('formats partial phone number', () => {
      expect(formatPhoneNumber('555')).toBe('555')
      expect(formatPhoneNumber('5551')).toBe('(555) 1')
      expect(formatPhoneNumber('5551234')).toBe('(555) 123-4')
    })

    it('formats complete phone number', () => {
      expect(formatPhoneNumber('5551234567')).toBe('(555) 123-4567')
    })

    it('strips non-numeric characters', () => {
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567')
    })
  })

  describe('text capitalization', () => {
    it('capitalizes single word', () => {
      expect(capitalizeWords('hello')).toBe('Hello')
    })

    it('capitalizes multiple words', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World')
    })

    it('handles mixed case', () => {
      expect(capitalizeWords('hELLO wORLD')).toBe('Hello World')
    })

    it('handles empty string', () => {
      expect(capitalizeWords('')).toBe('')
    })
  })
})
