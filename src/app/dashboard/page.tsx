'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, FileText, Edit, Trash2, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Resume {
  id: string
  title: string
  template_id: string
  ats_score: number
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)

  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')

      if (response.ok) {
        const data = await response.json()
        setResumes(data.resumes || [])
      } else {
        console.error('Error fetching resumes')
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setLoadingResumes(false)
    }
  }

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchResumes()
      } else {
        console.error('Error deleting resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const handleDownload = (resumeId: string, title: string) => {
    const url = `/resume/${resumeId}/download`
    const link = document.createElement('a')
    link.href = url
    link.download = `${title || 'resume'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard.</h2>
          <p className="text-gray-600 mb-6">You must be signed in to use this feature.</p>
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <br />
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage your professional resumes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/resume/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingResumes ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first resume.
            </p>
            <div className="mt-6">
              <Link
                href="/resume/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow group relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate max-w-xs" title={resume.title}>{resume.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        resume.ats_score >= 80
                          ? 'bg-green-100 text-green-800'
                          : resume.ats_score >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      title={`ATS Score: ${resume.ats_score}`}
                    >
                      ATS: {resume.ats_score}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <p>Template: <span className="font-medium text-gray-700">{resume.template_id}</span></p>
                  <p>Updated: {new Date(resume.updated_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link
                      href={`/resume/${resume.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <Link
                      href={`/resume/${resume.id}/preview`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Link>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(resume.id, resume.title)}
                      className="inline-flex items-center justify-center p-2 border border-gray-300 shadow-sm rounded text-gray-700 bg-white hover:bg-blue-50 transition-colors"
                      title="Download as PDF"
                      aria-label="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="inline-flex items-center justify-center p-2 border border-red-300 shadow-sm rounded text-red-700 bg-white hover:bg-red-50 transition-colors"
                      title="Delete this resume"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}