'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ResumeContent, calculateATSScore } from '@/lib/ats-scorer'
import TemplateSelector from '@/components/TemplateSelector'
import ResumeForm from '@/components/ResumeForm'
import ATSScore from '@/components/ATSScore'
import Template1 from '@/components/templates/Template1'
import Template2 from '@/components/templates/Template2'
import Template3 from '@/components/templates/Template3'
import { Save, Download, Eye, ArrowLeft, LayoutTemplate } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { downloadResumeAsPDF } from '@/lib/pdf-export'

const defaultContent: ResumeContent = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    location: 'New York, NY'
  },
  summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading development teams.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Company Inc.',
      duration: '2020 - Present',
      description: 'Led development of microservices architecture. Mentored junior developers. Improved system performance by 40%.'
    },
    {
      title: 'Software Engineer',
      company: 'Web Solutions LLC',
      duration: '2017 - 2020',
      description: 'Built and maintained web applications. Collaborated with cross-functional teams. Enhanced UI/UX for client projects.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      institution: 'University of Technology',
      year: '2015 - 2019'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'AWS'],
  certifications: ['AWS Certified Developer', 'Scrum Master Certified']
}

const templates = {
  template1: Template1,
  template2: Template2,
  template3: Template3
}

export default function NewResume() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [content, setContent] = useState<ResumeContent>(defaultContent)
  const [selectedTemplate, setSelectedTemplate] = useState('template1')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [atsHover, setAtsHover] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Handle template selection from URL parameters or sessionStorage
  useEffect(() => {
    const templateFromUrl = searchParams.get('template')
    const templateFromStorage = sessionStorage.getItem('selectedTemplate')

    if (templateFromUrl) {
      setSelectedTemplate(`template${templateFromUrl}`)
      sessionStorage.removeItem('selectedTemplate') // Clean up
    } else if (templateFromStorage) {
      setSelectedTemplate(`template${templateFromStorage}`)
      sessionStorage.removeItem('selectedTemplate') // Clean up
    }
  }, [searchParams])

  const atsScore = calculateATSScore(content)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to create a resume.</h2>
          <p className="text-gray-600 mb-6">You must be signed in to use this feature.</p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Link>
            <br />
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const saveResume = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your resume')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          template_id: selectedTemplate,
          content: content,
          ats_score: atsScore.score
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/resume/${data.resume.id}`)
      } else {
        throw new Error('Failed to save resume')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const TemplateComponent = templates[selectedTemplate as keyof typeof templates]

  const selectedTemplateObj = [
    { id: 'template1', name: 'Professional Classic' },
    { id: 'template2', name: 'Modern Sidebar' },
    { id: 'template3', name: 'Minimalist' }
  ].find(t => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter resume title..."
                  className="text-2xl font-bold text-black bg-transparent border-none outline-none focus:ring-0"
                />
                <button
                  className="inline-flex items-center px-3 py-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors text-sm font-semibold"
                  onClick={() => setShowTemplateSelector((v) => !v)}
                  type="button"
                >
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  {showTemplateSelector ? 'Hide Templates' : 'Choose Template'}
                </button>
                <span className="ml-2 text-sm text-black">{selectedTemplateObj?.name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={saveResume}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Resume'}
              </button>
              <button
                onClick={async () => {
                  setDownloading(true)
                  await downloadResumeAsPDF(content, title || 'resume')
                  setDownloading(false)
                }}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                type="button"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>
          {showTemplateSelector && (
            <div className="mt-2">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={(id) => {
                  setSelectedTemplate(id)
                  setShowTemplateSelector(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Builder</h2>
              <ResumeForm content={content} onChange={setContent} />

              {/* ATS Score */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ATSScore score={atsScore} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  onMouseEnter={() => setAtsHover(true)}
                  onMouseLeave={() => setAtsHover(false)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <TemplateComponent content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}