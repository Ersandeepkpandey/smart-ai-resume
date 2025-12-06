import { render, screen } from '@testing-library/react'

jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>
  }
})

import Pagination from '@/components/blog/Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} baseUrl="/blog" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders page numbers', () => {
    render(<Pagination currentPage={1} totalPages={5} baseUrl="/blog" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(<Pagination currentPage={3} totalPages={5} baseUrl="/blog" />)
    const currentPageLink = screen.getByText('3')
    expect(currentPageLink).toHaveClass('bg-blue-600')
  })

  it('disables Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} baseUrl="/blog" />)
    const prevButton = screen.getByText('Previous')
    expect(prevButton.closest('span')).toHaveClass('cursor-not-allowed')
  })

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} baseUrl="/blog" />)
    const nextButton = screen.getByText('Next')
    expect(nextButton.closest('span')).toHaveClass('cursor-not-allowed')
  })

  it('enables Previous button on pages after first', () => {
    render(<Pagination currentPage={3} totalPages={5} baseUrl="/blog" />)
    const prevLink = screen.getByText('Previous').closest('a')
    expect(prevLink).toHaveAttribute('href', '/blog?page=2')
  })

  it('enables Next button on pages before last', () => {
    render(<Pagination currentPage={3} totalPages={5} baseUrl="/blog" />)
    const nextLink = screen.getByText('Next').closest('a')
    expect(nextLink).toHaveAttribute('href', '/blog?page=4')
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} baseUrl="/blog" />)
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('builds correct URLs with existing query params', () => {
    render(<Pagination currentPage={1} totalPages={5} baseUrl="/blog?category=tech" />)
    const page2Link = screen.getByText('2').closest('a')
    expect(page2Link).toHaveAttribute('href', '/blog?category=tech&page=2')
  })
})

describe('Pagination page number logic', () => {
  it('shows all pages when totalPages is 7 or less', () => {
    render(<Pagination currentPage={4} totalPages={7} baseUrl="/blog" />)
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument()
    }
  })

  it('shows first page, current range, and last page for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} baseUrl="/blog" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('handles edge case at beginning', () => {
    render(<Pagination currentPage={2} totalPages={10} baseUrl="/blog" />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('handles edge case at end', () => {
    render(<Pagination currentPage={9} totalPages={10} baseUrl="/blog" />)
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
