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
  Code,
  Eraser,
  Highlighter,
  Quote,
  Outdent,
  Indent,
  Minus
} from 'lucide-react'

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
  const [isFocused, setIsFocused] = useState(false)
  const [codeMode, setCodeMode] = useState(false)

  useEffect(() => {
    if (isEditing && params?.id) {
      fetchTemplate(params.id)
    }
  }, [isEditing, params?.id])

  useEffect(() => {
    if (!codeMode && editorRef.current) {
      // Only update if the content is actually different to avoid cursor jumping
      if (editorRef.current.innerHTML !== template.html_content) {
        editorRef.current.innerHTML = template.html_content || '';
      }
    }
  }, [codeMode]);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = template.html_content || '';
    }
  }, []);

  const fetchTemplate = async (id: string) => {
    try {
      console.log('Fetching template with ID:', id)
      const response = await fetch(`/api/admin/templates/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.status}`)
      }

      const data = await response.json()
      console.log('Template data received:', data)
      setTemplate(data)
    } catch (error) {
      console.error('Error fetching template:', error)
      alert('Error loading template: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const saveTemplate = async () => {
    setSaving(true)
    try {
      // Ensure we have the latest content from the editor
      if (!codeMode && editorRef.current) {
        setTemplate(prev => ({ ...prev, html_content: editorRef.current?.innerHTML || '' }));
      }

      const url = isEditing ? `/api/admin/templates/${params?.id}` : '/api/admin/templates'
      const method = isEditing ? 'PUT' : 'POST'

      console.log('Saving template:', template)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Template saved successfully:', data)
        alert('Template saved successfully!')

        // If this was a new template, redirect to templates list
        if (!isEditing) {
          window.location.href = '/admin/templates'
        }
      } else {
        console.error('Failed to save template:', data)
        alert(`Error saving template: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Error saving template: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const execCommand = (command: string, value?: string) => {
    try {
      if (command === 'formatBlock' && value === '<pre>') {
        document.execCommand('formatBlock', false, value);
        if (document.queryCommandState('formatBlock') === false) {
          document.execCommand('insertHTML', false, '<pre><br></pre>');
        }
      } else {
        document.execCommand(command, false, value);
      }
      editorRef.current?.focus();
    } catch (err) {
      alert('Code block is not supported in this browser/editor context.');
    }
  };

  const insertHTML = (html: string) => {
    document.execCommand('insertHTML', false, html)
    editorRef.current?.focus()
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setTemplate({ ...template, html_content: e.currentTarget.innerHTML });
  };

  const toolbarButtons = [
    { icon: Undo, command: 'undo', title: 'Undo' },
    { icon: Redo, command: 'redo', title: 'Redo' },
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Heading1, command: 'formatBlock', value: '<h1>', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: '<h2>', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: '<h3>', title: 'Heading 3' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
    { icon: Outdent, command: 'outdent', title: 'Outdent' },
    { icon: Indent, command: 'indent', title: 'Indent' },
    { icon: Quote, command: 'formatBlock', value: '<blockquote>', title: 'Blockquote' },
    { icon: Code, command: 'formatBlock', value: '<pre>', title: 'Code Block' },
    { icon: Highlighter, command: 'backColor', value: 'yellow', title: 'Highlight' },
    { icon: Eraser, command: 'removeFormat', title: 'Clear Formatting' },
    { icon: Minus, command: 'insertHorizontalRule', title: 'Horizontal Rule' },
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

  const showPlaceholder = (!template.html_content || template.html_content === '<br>') && !isFocused && !codeMode;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">
            {isEditing ? 'Edit Template' : 'Create Template'}
          </h1>
          <p className="mt-2 text-black">
            {isEditing ? 'Modify your existing template' : 'Design professional resume templates with our visual editor'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={saveTemplate}
            disabled={saving}
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
            <h3 className="text-lg font-medium text-black mb-4">Template Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({...template, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                  style={{ color: 'black' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate({...template, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template description"
                  style={{ color: 'black' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
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
                <label className="block text-sm font-medium text-black mb-2">
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
              <h4 className="text-sm font-medium text-black mb-3">Quick Sections</h4>
              <div className="space-y-2">
                {resumeSections.map((section) => (
                  <button
                    key={section.name}
                    onClick={() => insertHTML(section.html)}
                    className="w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-100 rounded-md"
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
          <div className="bg-white rounded-lg shadow p-6 relative">
            {/* Toolbar with Code Mode toggle */}
            <div className="flex flex-wrap gap-2 mb-2 bg-gray-50 p-2 rounded shadow-sm border border-gray-200">
              <button
                type="button"
                onClick={() => {
                  // When switching to code mode, ensure we have the latest content
                  if (!codeMode && editorRef.current) {
                    setTemplate(prev => ({ ...prev, html_content: editorRef.current?.innerHTML || '' }));
                  }
                  setCodeMode((prev) => !prev);
                }}
                title="Toggle Code Mode"
                className={`p-2 rounded ${codeMode ? 'bg-blue-200' : 'hover:bg-blue-100'} text-black`}
                style={{ minWidth: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {'</>'}
              </button>
              {toolbarButtons.map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => execCommand(btn.command, btn.value)}
                  title={btn.title}
                  className="p-2 rounded hover:bg-blue-100 focus:bg-blue-200 text-black"
                  style={{ minWidth: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  disabled={codeMode}
                >
                  <btn.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {codeMode ? (
              <div className="relative">
                <textarea
                  className="w-full min-h-[600px] p-4 border border-gray-300 rounded-md font-mono text-sm text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name || 'Resume Template'}</title>
    <style>
${template.css_styles || '/* Add your CSS styles here */'}
    </style>
</head>
<body>
${template.html_content || '<!-- Add your HTML content here -->'}
</body>
</html>`}
                  onChange={e => {
                    // Parse the combined HTML/CSS and extract the parts
                    const content = e.target.value;
                    const htmlMatch = content.match(/<body>([\s\S]*?)<\/body>/);
                    const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);

                    if (htmlMatch) {
                      setTemplate(prev => ({ ...prev, html_content: htmlMatch[1].trim() }));
                    }
                    if (cssMatch) {
                      setTemplate(prev => ({ ...prev, css_styles: cssMatch[1].trim() }));
                    }
                  }}
                  placeholder="Enter complete HTML with CSS here..."
                  spellCheck={false}
                />
              </div>
            ) : (
              <>
                {showPlaceholder && (
                  <span
                    style={{
                      color: '#888',
                      position: 'absolute',
                      left: 24,
                      top: 24,
                      pointerEvents: 'none',
                      zIndex: 1,
                    }}
                  >
                    Start typing your template here...
                  </span>
                )}
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[600px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: 'black', position: 'relative', zIndex: 2 }}
                  onInput={handleInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  suppressContentEditableWarning
                  spellCheck={true}
                />
              </>
            )}
          </div>

          {/* CSS Editor */}
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-black">CSS Styles</h3>
            </div>
            <div className="p-4">
              <textarea
                value={template.css_styles}
                onChange={(e) => setTemplate({...template, css_styles: e.target.value})}
                rows={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter CSS styles for the template..."
                style={{ color: 'black' }}
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
              <h3 className="text-lg font-medium text-black">Template Preview</h3>
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
  )
}