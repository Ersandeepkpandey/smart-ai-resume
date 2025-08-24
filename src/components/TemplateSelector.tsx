'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  status: string
  html_content: string
  css_styles: string
  preview_image: string
  usage_count: number
  created_at: string
  updated_at: string
}

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/templates')
        
        if (!response.ok) {
          throw new Error('Failed to fetch templates')
        }

        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (err) {
        console.error('Error fetching templates:', err)
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-700 font-medium">⚠️ {error}</p>
          <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-transparent">      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
              selectedTemplate === template.id
                ? 'border-blue-500 shadow-md'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute -top-1 -right-1 z-10">
                <div className="bg-blue-500 text-white rounded-full p-1 shadow-md">
                  <Check className="w-3 h-3" />
                </div>
              </div>
            )}

            {/* Template Preview */}
            <div className="p-3">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="w-6 h-8 bg-gray-400 rounded mx-auto mb-1 opacity-60"></div>
                  <div className="space-y-0.5">
                    <div className="w-8 h-0.5 bg-gray-400 rounded mx-auto opacity-40"></div>
                    <div className="w-6 h-0.5 bg-gray-400 rounded mx-auto opacity-40"></div>
                    <div className="w-10 h-0.5 bg-gray-400 rounded mx-auto opacity-40"></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 font-medium">{template.name}</p>
                </div>
              </div>

              {/* Template Info */}
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900 text-xs leading-tight line-clamp-2">
                  {template.name}
                </h4>
                <p className="text-[10px] text-gray-600 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
                
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[9px] rounded-full font-medium capitalize">
                    {template.category}
                  </span>
                  {template.usage_count > 0 && (
                    <span className="text-[9px] text-gray-500">
                      {template.usage_count}x
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No templates available</p>
        </div>
      )}
    </div>
  )
}