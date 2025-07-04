'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
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
    name: '',
    email: '',
    phone: '',
    location: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: []
}

const templates = {
  template1: Template1,
  template2: Template2,
  template3: Template3
}

export default function NewResume() {
  const router = useRouter()
  const { user } = useAuth()
  const [content, setContent] = useState<ResumeContent>(defaultContent)
  const [selectedTemplate, setSelectedTemplate] = useState('template1')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)
  const [atsHover, setAtsHover] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const atsScore = calculateATSScore(content)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to create a resume.</h2>
          <p className="text-gray-600 mb-6">You must be signed in with Supabase authentication to use this feature.</p>
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
    if (!isSupabaseAvailable() || !supabase) {
      alert('Supabase is not configured. Please contact support.')
      return
    }
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: title.trim(),
          template_id: selectedTemplate,
          content: content,
          ats_score: atsScore.score
        })
        .select()
        .single()
      if (error) throw error
      router.push(`/resume/${data.id}`)
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
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                type="button"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
          {showTemplateSelector && (
            <div className="mt-2">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={(id) => {
                  setSelectedTemplate(id);
                  setShowTemplateSelector(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* First Column - Resume Form */}
          <div className="space-y-6">
            <ResumeForm content={content} onChange={setContent} />
          </div>

          {/* ATS Score spanning columns 2 and 3 */}
          <div className="lg:col-span-2 space-y-6">
            <div
              onMouseEnter={() => setAtsHover(true)}
              onMouseLeave={() => setAtsHover(false)}
              style={{ transition: 'all 0.2s', cursor: 'pointer' }}
            >
              {atsHover ? (
                <ATSScore score={atsScore} />
              ) : (
                <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                  <span className="text-xs font-semibold text-gray-500 mb-1">ATS Score</span>
                  <span className={`text-lg font-bold ${atsScore.score < 60 ? 'text-red-500' : 'text-green-600'}`}>{atsScore.score}/100</span>
                  <span className="text-[10px] text-gray-400 mt-1">Hover for details</span>
                </div>
              )}
            </div>

            {/* Resume Preview below ATS Score - always visible */}
            <div className="resume-print-area bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <TemplateComponent ref={resumeRef} content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}