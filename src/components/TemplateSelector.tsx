'use client'


import { Check } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  preview: string
  component: string
}

const templates: Template[] = [
  {
    id: 'template1',
    name: 'Professional Classic',
    description: 'Clean and traditional design with blue accents',
    preview: '/api/preview/template1',
    component: 'Template1'
  },
  {
    id: 'template2',
    name: 'Modern Sidebar',
    description: 'Contemporary layout with sidebar for skills',
    preview: '/api/preview/template2',
    component: 'Template2'
  },
  {
    id: 'template3',
    name: 'Minimalist',
    description: 'Simple and elegant centered design',
    preview: '/api/preview/template3',
    component: 'Template3'
  }
]

interface TemplateSelectorProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
}

export default function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Choose Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative border-2 rounded-lg p-1 cursor-pointer transition-all duration-200 text-[10px] min-w-0 min-h-0 ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTemplateSelect(template.id)}
            style={{ maxWidth: 90 }}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-0.5 right-0.5">
                <div className="bg-blue-500 text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5" />
                </div>
              </div>
            )}

            <div className="h-7 bg-gray-100 rounded mb-0.5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-4 h-5 bg-gray-300 rounded mx-auto mb-0.5"></div>
                <p className="text-[8px] text-gray-600">Preview</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-900 mb-0.5 text-[10px] whitespace-normal break-words">{template.name}</h4>
            <p className="text-[8px] text-gray-600 whitespace-normal break-words">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}