import { render, screen } from '@testing-library/react'
import PDFVedaBanner from '../components/PDFVedaBanner'

describe('PDFVedaBanner', () => {
  it('renders the banner heading', () => {
    render(<PDFVedaBanner />)
    expect(screen.getByText('All-in-One PDF & Image Toolbox')).toBeInTheDocument()
  })

  it('renders PDF tools', () => {
    render(<PDFVedaBanner />)
    expect(screen.getByText('Merge PDF')).toBeInTheDocument()
    expect(screen.getByText('Split PDF')).toBeInTheDocument()
    expect(screen.getByText('Compress PDF')).toBeInTheDocument()
  })

  it('renders image tools', () => {
    render(<PDFVedaBanner />)
    expect(screen.getByText('Compress Image')).toBeInTheDocument()
    expect(screen.getByText('Resize Image')).toBeInTheDocument()
    expect(screen.getByText('Crop Image')).toBeInTheDocument()
  })

  it('renders CTA button with correct link', () => {
    render(<PDFVedaBanner />)
    const ctaButton = screen.getByRole('link', { name: /TRY FREE AT PDFVEDA.COM/i })
    expect(ctaButton).toHaveAttribute('href', 'https://pdfveda.com')
    expect(ctaButton).toHaveAttribute('target', '_blank')
  })

  it('shows partner label', () => {
    render(<PDFVedaBanner />)
    expect(screen.getByText('Partner: PDFVeda')).toBeInTheDocument()
  })
})
