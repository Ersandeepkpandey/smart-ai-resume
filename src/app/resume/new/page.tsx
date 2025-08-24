'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ResumeContent, calculateATSScore, ATSScore as ATSScoreType } from '@/lib/ats-scorer'
import TemplateSelector from '@/components/TemplateSelector'
import RealtimeEditor from '@/components/RealtimeEditor'
import ATSScore from '@/components/ATSScore'
import CompactATSScore from '@/components/CompactATSScore'
import { Save, Download, Eye, ArrowLeft, LayoutTemplate, Menu, X } from 'lucide-react'
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
  summary: 'Experienced professional with expertise in software development.',
  experience: [
    {
      title: 'Software Engineer',
      company: 'Tech Company Inc.',
      duration: '2020 - Present',
      description: 'Led development of key features and mentored junior developers.'
    }
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      institution: 'University of Technology',
      year: '2015 - 2019'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  certifications: ['AWS Certified Developer']
}

function ResumeBuilderContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateFromUrl = searchParams.get('template') || 'template-1756037150032'
  
  const [content, setContent] = useState<ResumeContent>(defaultContent)
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateFromUrl)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [atsScore, setAtsScore] = useState<ATSScoreType>({
    score: 0,
    suggestions: [],
    keywords: [],
    missingKeywords: []
  })

  // Temporarily disable auth check for testing
  // useEffect(() => {
  //   if (!user) {
  //     router.push('/auth/signin')
  //     return
  //   }
  // }, [user, router])

  useEffect(() => {
    // Calculate ATS Score when content changes
    const atsScoreResult = calculateATSScore(content)
    setAtsScore(atsScoreResult)
  }, [content])

  const handleContentChange = (newContent: ResumeContent) => {
    setContent(newContent);
  };

  const handleSave = async (contentToSave: ResumeContent) => {
    // For testing without auth, skip save functionality
    if (!user) {
      console.log('Save skipped - no user logged in (test mode)');
      return;
    }

    setIsLoading(true)
    try {
      // Generate a title from the content
      const title = contentToSave.personalInfo?.name 
        ? `${contentToSave.personalInfo.name}'s Resume`
        : 'My Resume';

      const payload = {
        title: title,
        template_id: selectedTemplate,
        content: contentToSave,
        ats_score: atsScore.score || 0
      };

      console.log('Saving resume with payload:', payload);

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Resume saved successfully:', result)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to save resume')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      throw error // Re-throw to let RealtimeEditor handle the error
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateChange = (template: string) => {
    console.log('Template changed from:', selectedTemplate, 'to:', template)
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    // Update URL without page reload
    const newUrl = `/resume/new?template=${template}`
    window.history.replaceState({}, '', newUrl)
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadError(null)
    setDownloadSuccess(false)
    
    try {
      const fileName = content.personalInfo?.name || 'Resume'
      await downloadResumeAsPDF(content, fileName, selectedTemplate)
      setDownloadSuccess(true)
      // Hide success message after 3 seconds
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadError(error instanceof Error ? error.message : 'Failed to download PDF')
    } finally {
      setIsDownloading(false)
    }
  }

  // Temporarily disable user check for testing
  // if (!user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-20 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-5xl max-h-[90vh] overflow-auto shadow-xl border border-gray-300 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Choose Template</h2>
                <p className="text-sm text-gray-600 mt-1">Select a template for your resume</p>
              </div>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={20} className="mr-1" />
                Back to Dashboard
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LayoutTemplate size={16} className="mr-1" />
                Change Template
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Compact ATS Score Display */}
              <CompactATSScore score={atsScore} />
              
              <div className="relative">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={16} className="mr-1" />
                      Download PDF
                    </>
                  )}
                </button>
                
                {/* Download Error Message */}
                {downloadError && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-10 min-w-64">
                    <div className="flex items-start gap-2">
                      <div className="text-red-600 mt-0.5">⚠</div>
                      <div>
                        <p className="text-sm font-medium text-red-800">Download Failed</p>
                        <p className="text-xs text-red-700 mt-1">{downloadError}</p>
                        <button
                          onClick={() => setDownloadError(null)}
                          className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Download Success Message */}
                {downloadSuccess && (
                  <div className="absolute top-full right-0 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-lg z-10 min-w-64">
                    <div className="flex items-start gap-2">
                      <div className="text-green-600 mt-0.5">✓</div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Download Complete</p>
                        <p className="text-xs text-green-700 mt-1">Your resume PDF has been downloaded successfully!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Editor */}
      <RealtimeEditor
        key={selectedTemplate} // Force re-render when template changes
        initialContent={content}
        template={selectedTemplate}
        onSave={handleSave}
        onContentChange={handleContentChange}
      />
    </div>
  )
}

export default function ResumeBuilder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  )
}