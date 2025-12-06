import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

import PostCard from '@/components/blog/PostCard'
import { Post } from '@/lib/blog/types'

const mockPost: Post = {
  id: '1',
  title: 'Test Post Title',
  slug: 'test-post-title',
  excerpt: 'This is a test excerpt for the post.',
  content: '<p>Full content here</p>',
  featuredImage: '/test-image.jpg',
  authorId: 'author-1',
  author: {
    id: 'author-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'author',
    createdAt: '2024-01-01T00:00:00Z'
  },
  categoryId: 'cat-1',
  category: {
    id: 'cat-1',
    name: 'Technology',
    slug: 'technology',
    postCount: 10
  },
  tags: [
    { id: 'tag-1', name: 'JavaScript', slug: 'javascript', postCount: 5 }
  ],
  status: 'published',
  publishedAt: '2024-03-15T10:00:00Z',
  readingTime: 5,
  viewCount: 100,
  createdAt: '2024-03-15T10:00:00Z',
  updatedAt: '2024-03-15T10:00:00Z'
}

describe('PostCard', () => {
  it('renders post title', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders post excerpt', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('This is a test excerpt for the post.')).toBeInTheDocument()
  })

  it('renders category name', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })

  it('renders author name', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders reading time', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('5m')).toBeInTheDocument()
  })

  it('renders view count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders featured image when provided', () => {
    render(<PostCard post={mockPost} />)
    const image = screen.getByAltText('Test Post Title')
    expect(image).toBeInTheDocument()
  })

  it('renders link to post', () => {
    render(<PostCard post={mockPost} />)
    const links = screen.getAllByRole('link')
    const postLink = links.find(link => link.getAttribute('href') === '/blog/test-post-title')
    expect(postLink).toBeInTheDocument()
  })
})

describe('PostCard variants', () => {
  it('renders featured variant with larger layout', () => {
    render(<PostCard post={mockPost} variant="featured" />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders compact variant with minimal info', () => {
    render(<PostCard post={mockPost} variant="compact" />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('shows reading time in compact variant', () => {
    render(<PostCard post={mockPost} variant="compact" />)
    expect(screen.getByText(/5 min/)).toBeInTheDocument()
  })
})

describe('PostCard edge cases', () => {
  it('handles post without featured image', () => {
    const postWithoutImage = { ...mockPost, featuredImage: undefined }
    render(<PostCard post={postWithoutImage} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('handles post without author avatar', () => {
    const postWithoutAvatar = {
      ...mockPost,
      author: { ...mockPost.author!, avatar: undefined }
    }
    render(<PostCard post={postWithoutAvatar} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('handles post without category', () => {
    const postWithoutCategory = { ...mockPost, category: undefined }
    render(<PostCard post={postWithoutCategory} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })
})
