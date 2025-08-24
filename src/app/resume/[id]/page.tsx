'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ResumeContent, calculateATSScore } from '@/lib/ats-scorer'
import TemplateSelector from '@/components/TemplateSelector'
import ResumeForm from '@/components/ResumeForm'
import ATSScore from '@/components/ATSScore'
import ResumePreview from '@/components/ResumePreview'
import { Save, Download, Eye, ArrowLeft, LayoutTemplate, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

// Remove hardcoded templates - now using ResumePreview component

interface Resume {
  id: string
  title: string
  template_id: string
  content: ResumeContent
  ats_score: number
  created_at: string
  updated_at: string
}

function EditResumeContent() {
  const params = useParams()
  const { user, loading } = useAuth()
  const [resume, setResume] = useState<Resume | null>(null)
  const [content, setContent] = useState<ResumeContent | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('template1')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [loadingResume, setLoadingResume] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const resumeId = params.id as string

  const fetchResume = useCallback(async () => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`)

      if (response.ok) {
        const data = await response.json()
        // Normalize the resume data to ensure all formatting objects exist
        const resumeData = data.resume
        const content = resumeData.content || {}
        const personalInfo = content.personalInfo || {}

        const normalizedResume = {
          ...resumeData,
          content: {
            ...content,
            personalInfo: {
              name: personalInfo.name || '',
              email: personalInfo.email || '',
              phone: personalInfo.phone || '',
              location: personalInfo.location || '',
              formatting: personalInfo.formatting || {}
            },
            summary: content.summary || '',
            summaryFormatting: content.summaryFormatting || {},
            experience: (content.experience || []).map((exp: Record<string, unknown>) => ({
              title: exp.title || '',
              company: exp.company || '',
              duration: exp.duration || '',
              description: exp.description || '',
              formatting: exp.formatting || {}
            })),
            education: (content.education || []).map((edu: Record<string, unknown>) => ({
              degree: edu.degree || '',
              institution: edu.institution || '',
              year: edu.year || '',
              formatting: edu.formatting || {}
            })),
            skills: content.skills || [],
            certifications: content.certifications || [],
            otherQualities: content.otherQualities || [],
            customSections: content.customSections || []
          }
        }

        setResume(normalizedResume)
        setContent(normalizedResume.content)
        setSelectedTemplate(normalizedResume.template_id)
        setTitle(normalizedResume.title)
      } else if (response.status === 404) {
        setError('Resume not found')
      } else if (response.status === 401) {
        setError('Access denied')
      } else {
        setError('Failed to load resume')
      }
    } catch (error) {
      console.error('Error fetching resume:', error)
      setError('Failed to load resume')
    } finally {
      setLoadingResume(false)
    }
  }, [resumeId])

  useEffect(() => {
    if (user && resumeId) {
      fetchResume()
    }
  }, [user, resumeId, fetchResume])

  const saveResume = async () => {
    if (!content || !title.trim()) {
      alert('Please enter a title for your resume')
      return
    }

    setSaving(true)
    try {
      console.log('Saving resume with data:', {
        resumeId,
        title: title.trim(),
        template_id: selectedTemplate,
        content: content
      })


      const atsScore = calculateATSScore(content)
      console.log('Calculated ATS score:', atsScore)

      const requestBody = {
        title: title.trim(),
        template_id: selectedTemplate,
        content: content,
        ats_score: atsScore.score
      }

      console.log('Request body:', requestBody)

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const data = await response.json()
        console.log('Save response data:', data)
        setResume(data.resume)
        alert('Resume saved successfully!')
      } else {
        const errorText = await response.text()
        console.error('Save failed with status:', response.status, 'Error:', errorText)
        throw new Error(`Failed to save resume: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to edit this resume.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loadingResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resume || !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Resume not found'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const atsScore = calculateATSScore(content)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between py-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm">Back</span>
              </Link>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="pb-4 space-y-3">
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter resume title..."
                    className="text-lg font-bold text-black bg-transparent border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="inline-flex items-center px-3 py-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors text-sm font-semibold"
                      onClick={() => setShowTemplateSelector((v) => !v)}
                      type="button"
                    >
                      <LayoutTemplate className="w-4 h-4 mr-2" />
                      Template
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={saveResume}
                      disabled={saving}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? <span className="ml-2 text-xs">Saving...</span> : null}
                    </button>
                    <button
                      onClick={() => {
                        const url = `/resume/${resumeId}/download?template=${selectedTemplate}`;
                        window.open(url, '_blank');
                      }}
                      disabled={false}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      type="button"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                      {false && <span className="ml-2 text-xs">Downloading...</span>}
                    </button>
                  </div>
                </div>

                {showTemplateSelector && (
                  <div className="mt-2">
                    <TemplateSelector
                      selectedTemplate={selectedTemplate}
                                        onTemplateSelect={(id) => {
                    if (id !== selectedTemplate) {
                      setSelectedTemplate(id)
                    }
                    setShowTemplateSelector(false)
                  }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
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
                  <span className="ml-2 text-sm text-black">{selectedTemplate}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={`/resume/${resumeId}/preview`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Link>
                <button
                  onClick={saveResume}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {saving ? <span className="ml-2 text-xs">Saving...</span> : null}
                </button>
                <button
                  onClick={() => {
                    const url = `/resume/${resumeId}/download?template=${selectedTemplate}`;
                    window.open(url, '_blank');
                  }}
                  disabled={false}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  type="button"
                  title="Download PDF"
                >
                  <Download className="w-5 h-5" />
                  {false && <span className="ml-2 text-xs">Downloading...</span>}
                </button>
              </div>
            </div>
            {showTemplateSelector && (
              <div className="mt-2">
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={(id) => {
                    if (id !== selectedTemplate) {
                      setSelectedTemplate(id)
                    }
                    setShowTemplateSelector(false)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resume Builder</h2>
              <ResumeForm
                content={content}
                onChange={setContent}
              />

              {/* ATS Score */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ATSScore score={atsScore} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 lg:p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </button>
                </div>
              </div>

              <div className="p-4 lg:p-8">
                {/* Mobile Action Buttons */}
                <div className="lg:hidden mb-4 flex gap-2">
                  <button
                    onClick={saveResume}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      const url = `/resume/${resumeId}/download?template=${selectedTemplate}`;
                      window.open(url, '_blank');
                    }}
                    disabled={false}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    type="button"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {false ? 'Downloading...' : 'PDF'}
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ResumePreview 
                    key={selectedTemplate} 
                    content={content} 
                    template={selectedTemplate}
                    showControls={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditResume() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <EditResumeContent />
    </Suspense>
  )
}