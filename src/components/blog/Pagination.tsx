'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const buildUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}page=${page}`
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
          Previous
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-gray-300 cursor-not-allowed">
          <ChevronLeft size={18} />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildUrl(page as number)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Next
          <ChevronRight size={18} />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-gray-300 cursor-not-allowed">
          Next
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  )
}
