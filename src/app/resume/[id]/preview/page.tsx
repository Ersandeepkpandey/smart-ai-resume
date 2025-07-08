'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ResumeContent } from '@/lib/ats-scorer'
import Template1 from '@/components/templates/Template1'
import Template2 from '@/components/templates/Template2'
import Template3 from '@/components/templates/Template3'
import { ArrowLeft, Download, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { downloadResumeAsPDF } from '@/lib/pdf-export'

const templates = {
  template1: Template1,
  template2: Template2,
  template3: Template3
}

interface Resume {
  id: string
  title: string
  template_id: string
  content: ResumeContent
  ats_score: number
  created_at: string
  updated_at: string
}

function ResumePreviewContent() {
  const params = useParams()
  const { user, loading } = useAuth()
  const [resume, setResume] = useState<Resume | null>(null)
  const [loadingResume, setLoadingResume] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resumeId = params.id as string

  const fetchResume = useCallback(async () => {
    try {
      console.log('Fetching resume with ID:', resumeId)
      const response = await fetch(`/api/resumes/${resumeId}`)

      if (response.ok) {
        const data = await response.json()
        console.log('Raw resume data:', data)

        // Normalize the resume data to ensure all formatting objects exist
        const resumeData = data.resume
        const content = resumeData.content || {}
        const personalInfo = content.personalInfo || {}

        console.log('Resume data structure:', {
          resumeData,
          content,
          personalInfo
        })

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

        console.log('Normalized resume:', normalizedResume)
        setResume(normalizedResume)
      } else if (response.status === 404) {
        console.error('Resume not found')
        setError('Resume not found')
      } else if (response.status === 401) {
        console.error('Access denied')
        setError('Access denied')
      } else {
        console.error('Failed to load resume, status:', response.status)
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

  const handleDownload = async () => {
    if (!resume) return

    setDownloading(true)
    try {

      await downloadResumeAsPDF(resume.content, resume.title, resume.template_id)
    } catch (error) {
      console.error('Error downloading resume:', error)
      alert('Failed to download resume')
    } finally {
      setDownloading(false)
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
          <p className="text-gray-600 mb-4">You need to be signed in to view this resume.</p>
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

  if (error || !resume) {
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

  const TemplateComponent = templates[resume.template_id as keyof typeof templates] || Template1
  console.log('Rendering template:', resume.template_id, 'with content:', resume.content)

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/resume/${resume.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 lg:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Eye className="w-4 h-4 mr-1" />
                Read-only view
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-8">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <TemplateComponent content={resume.content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumePreview() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResumePreviewContent />
    </Suspense>
  )
}