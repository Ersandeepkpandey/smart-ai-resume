"use client"

import { useState, useEffect, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Palette,
  Save,
  Eye,
  Download,
  Undo,
  Redo,
  Link,
  Image,
  Table,
  Code
} from 'lucide-react'
import AdminLayout from '../layout'

interface TemplateMakerProps {
  params?: { id?: string }
}

export default function TemplateMaker({ params }: TemplateMakerProps) {
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: 'professional',
    status: 'draft',
    html_content: '',
    css_styles: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const isEditing = !!params?.id

  useEffect(() => {
    if (isEditing && params?.id) {
      fetchTemplate(params.id)
    }
  }, [isEditing, params?.id])

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${id}`)
      const data = await response.json()
      setTemplate(data)
    } catch (error) {
      console.error('Error fetching template:', error)
    }
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      const url = isEditing ? `/api/admin/templates/${params?.id}` : '/api/admin/templates'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })

      if (response.ok) {
        alert('Template saved successfully!')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template')
    } finally {
      setSaving(false)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
  }

  const toolbarButtons = [
    {
      group: 'Text Formatting',
      buttons: [
        { icon: Bold, command: 'bold', title: 'Bold' },
        { icon: Italic, command: 'italic', title: 'Italic' },
        { icon: Underline, command: 'underline', title: 'Underline' },
      ]
    },
    {
      group: 'Alignment',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
        { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
        { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
        { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
      ]
    },
    {
      group: 'Headings',
      buttons: [
        { icon: Heading1, command: 'formatBlock', value: '<h1>', title: 'Heading 1' },
        { icon: Heading2, command: 'formatBlock', value: '<h2>', title: 'Heading 2' },
        { icon: Heading3, command: 'formatBlock', value: '<h3>', title: 'Heading 3' },
      ]
    },
    {
      group: 'Lists',
      buttons: [
        { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
      ]
    },
    {
      group: 'Insert',
      buttons: [
        { icon: Link, command: 'createLink', title: 'Insert Link' },
        { icon: Image, command: 'insertImage', title: 'Insert Image' },
        { icon: Table, command: 'insertTable', title: 'Insert Table' },
      ]
    }
  ]

  const resumeSections = [
    {
      name: 'Header',
      html: `
        <div class="resume-header">
          <h1 class="name">John Doe</h1>
          <p class="title">Software Engineer</p>
          <div class="contact-info">
            <p>📧 john.doe@email.com</p>
            <p>📱 (555) 123-4567</p>
            <p>📍 New York, NY</p>
          </div>
        </div>
      `
    },
    {
      name: 'Summary',
      html: `
        <div class="resume-section">
          <h2>Professional Summary</h2>
          <p>Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.</p>
        </div>
      `
    },
    {
      name: 'Experience',
      html: `
        <div class="resume-section">
          <h2>Work Experience</h2>
          <div class="experience-item">
            <h3>Senior Software Engineer</h3>
            <p class="company">Tech Company Inc. | 2020 - Present</p>
            <ul>
              <li>Led development of microservices architecture</li>
              <li>Mentored junior developers</li>
              <li>Improved system performance by 40%</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      name: 'Education',
      html: `
        <div class="resume-section">
          <h2>Education</h2>
          <div class="education-item">
            <h3>Bachelor of Science in Computer Science</h3>
            <p>University of Technology | 2015 - 2019</p>
          </div>
        </div>
      `
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Template' : 'Create Template'}
            </h1>
            <p className="mt-2 text-gray-600">
              Design professional resume templates with our visual editor
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={saveTemplate}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Template Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate({...template, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => setTemplate({...template, description: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={template.category}
                    onChange={(e) => setTemplate({...template, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="creative">Creative</option>
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={template.status}
                    onChange={(e) => setTemplate({...template, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Quick Sections */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Sections</h4>
                <div className="space-y-2">
                  {resumeSections.map((section) => (
                    <button
                      key={section.name}
                      onClick={() => insertHTML(section.html)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      + {section.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Toolbar */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex flex-wrap gap-2">
                  {toolbarButtons.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex items-center space-x-1">
                      {group.buttons.map((button, buttonIndex) => (
                        <button
                          key={buttonIndex}
                          onClick={() => execCommand(button.command, button.value)}
                          title={button.title}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        >
                          <button.icon className="w-4 h-4" />
                        </button>
                      ))}
                      {groupIndex < toolbarButtons.length - 1 && (
                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor Area */}
              <div className="p-4">
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[600px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dangerouslySetInnerHTML={{ __html: template.html_content }}
                  onInput={(e) => setTemplate({...template, html_content: e.currentTarget.innerHTML})}
                />
              </div>
            </div>

            {/* CSS Editor */}
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">CSS Styles</h3>
              </div>
              <div className="p-4">
                <textarea
                  value={template.css_styles}
                  onChange={(e) => setTemplate({...template, css_styles: e.target.value})}
                  rows={8}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter CSS styles for the template..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Template Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <style dangerouslySetInnerHTML={{ __html: template.css_styles }} />
                <div
                  className="bg-white mx-auto max-w-md shadow-lg"
                  dangerouslySetInnerHTML={{ __html: template.html_content }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}