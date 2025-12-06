import { render, screen, fireEvent } from '@testing-library/react'

interface Template {
  id: string
  name: string
  description: string
  thumbnail: string
}

const TemplateCard = ({
  template,
  selected,
  onSelect,
}: {
  template: Template
  selected: boolean
  onSelect: (id: string) => void
}) => (
  <div
    data-testid={`template-${template.id}`}
    className={selected ? 'selected' : ''}
    onClick={() => onSelect(template.id)}
    role="button"
    tabIndex={0}
  >
    <h3>{template.name}</h3>
    <p>{template.description}</p>
  </div>
)

const TemplateSelector = ({
  templates,
  selectedId,
  onSelect,
}: {
  templates: Template[]
  selectedId: string | null
  onSelect: (id: string) => void
}) => (
  <div data-testid="template-selector">
    {templates.map(template => (
      <TemplateCard
        key={template.id}
        template={template}
        selected={selectedId === template.id}
        onSelect={onSelect}
      />
    ))}
  </div>
)

const mockTemplates: Template[] = [
  { id: '1', name: 'Professional', description: 'Clean professional template', thumbnail: '/1.png' },
  { id: '2', name: 'Modern', description: 'Contemporary design', thumbnail: '/2.png' },
  { id: '3', name: 'Creative', description: 'Stand out design', thumbnail: '/3.png' },
]

describe('TemplateSelector', () => {
  it('renders all templates', () => {
    render(<TemplateSelector templates={mockTemplates} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('Professional')).toBeInTheDocument()
    expect(screen.getByText('Modern')).toBeInTheDocument()
    expect(screen.getByText('Creative')).toBeInTheDocument()
  })

  it('renders template descriptions', () => {
    render(<TemplateSelector templates={mockTemplates} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByText('Clean professional template')).toBeInTheDocument()
  })

  it('calls onSelect when template is clicked', () => {
    const handleSelect = jest.fn()
    render(<TemplateSelector templates={mockTemplates} selectedId={null} onSelect={handleSelect} />)
    fireEvent.click(screen.getByTestId('template-1'))
    expect(handleSelect).toHaveBeenCalledWith('1')
  })

  it('highlights selected template', () => {
    render(<TemplateSelector templates={mockTemplates} selectedId="2" onSelect={() => {}} />)
    expect(screen.getByTestId('template-2')).toHaveClass('selected')
  })

  it('does not highlight unselected templates', () => {
    render(<TemplateSelector templates={mockTemplates} selectedId="2" onSelect={() => {}} />)
    expect(screen.getByTestId('template-1')).not.toHaveClass('selected')
  })

  it('handles empty templates array', () => {
    render(<TemplateSelector templates={[]} selectedId={null} onSelect={() => {}} />)
    expect(screen.getByTestId('template-selector')).toBeEmptyDOMElement()
  })
})

describe('Template filtering', () => {
  const filterTemplates = (templates: Template[], query: string): Template[] => {
    if (!query) return templates
    const lowerQuery = query.toLowerCase()
    return templates.filter(
      t => t.name.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)
    )
  }

  it('filters by name', () => {
    const result = filterTemplates(mockTemplates, 'professional')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('filters by description', () => {
    const result = filterTemplates(mockTemplates, 'contemporary')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('returns all when no query', () => {
    const result = filterTemplates(mockTemplates, '')
    expect(result).toHaveLength(3)
  })

  it('returns empty for no matches', () => {
    const result = filterTemplates(mockTemplates, 'xyz')
    expect(result).toHaveLength(0)
  })
})
