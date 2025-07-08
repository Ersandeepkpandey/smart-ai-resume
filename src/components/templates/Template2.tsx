'use client'

import { ResumeContent } from '@/lib/ats-scorer'
import { forwardRef } from 'react'

interface Template2Props {
  content: ResumeContent
  className?: string
}

const Template2 = forwardRef<HTMLDivElement, Template2Props>(
  ({ content, className = '' }, ref) => {
    // Defensive: ensure formatting objects exist
    const personalInfo = {
      ...content.personalInfo,
      formatting: content.personalInfo.formatting || {}
    }
    const summaryFormatting = content.summaryFormatting || {}
    const experience = (content.experience || []).map(exp => ({
      ...exp,
      formatting: exp.formatting || {}
    }))
    const education = (content.education || []).map(edu => ({
      ...edu,
      formatting: edu.formatting || {}
    }))

    return (
      <div
        ref={ref}
        className={`bg-white text-gray-800 max-w-4xl mx-auto shadow-lg ${className}`}
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontSize: personalInfo.formatting?.name?.fontSize || '2.25rem',
              color: personalInfo.formatting?.name?.color || '#ffffff',
              textAlign: personalInfo.formatting?.name?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: personalInfo.formatting?.name?.bold ? 'bold' : 'bold',
              fontStyle: personalInfo.formatting?.name?.italic ? 'italic' : 'normal',
              textDecoration: personalInfo.formatting?.name?.underline ? 'underline' : 'none'
            }}
          >
            {personalInfo.name}
          </h1>
          <p className="text-xl text-gray-300 mb-4">{experience[0]?.title || 'Professional'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span style={{
                fontSize: personalInfo.formatting?.email?.fontSize || '0.875rem',
                color: personalInfo.formatting?.email?.color || '#d1d5db',
                textAlign: personalInfo.formatting?.email?.alignment as 'left' | 'center' | 'right' || 'left',
                fontWeight: personalInfo.formatting?.email?.bold ? 'bold' : 'normal',
                fontStyle: personalInfo.formatting?.email?.italic ? 'italic' : 'normal',
                textDecoration: personalInfo.formatting?.email?.underline ? 'underline' : 'none'
              }}>
                {personalInfo.email}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span style={{
                fontSize: personalInfo.formatting?.phone?.fontSize || '0.875rem',
                color: personalInfo.formatting?.phone?.color || '#d1d5db',
                textAlign: personalInfo.formatting?.phone?.alignment as 'left' | 'center' | 'right' || 'left',
                fontWeight: personalInfo.formatting?.phone?.bold ? 'bold' : 'normal',
                fontStyle: personalInfo.formatting?.phone?.italic ? 'italic' : 'normal',
                textDecoration: personalInfo.formatting?.phone?.underline ? 'underline' : 'none'
              }}>
                {personalInfo.phone}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span style={{
                fontSize: personalInfo.formatting?.location?.fontSize || '0.875rem',
                color: personalInfo.formatting?.location?.color || '#d1d5db',
                textAlign: personalInfo.formatting?.location?.alignment as 'left' | 'center' | 'right' || 'left',
                fontWeight: personalInfo.formatting?.location?.bold ? 'bold' : 'normal',
                fontStyle: personalInfo.formatting?.location?.italic ? 'italic' : 'normal',
                textDecoration: personalInfo.formatting?.location?.underline ? 'underline' : 'none'
              }}>
                {personalInfo.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Summary */}
            {content.summary && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Professional Summary
                </h2>
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{
                    fontSize: summaryFormatting?.fontSize || '1rem',
                    color: summaryFormatting?.color || '#374151',
                    textAlign: summaryFormatting?.alignment as 'left' | 'center' | 'right' || 'left',
                    fontWeight: summaryFormatting?.bold ? 'bold' : 'normal',
                    fontStyle: summaryFormatting?.italic ? 'italic' : 'normal',
                    textDecoration: summaryFormatting?.underline ? 'underline' : 'none'
                  }}
                >
                  {content.summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="text-xl font-semibold text-gray-800"
                          style={{
                            fontSize: exp.formatting?.title?.fontSize || '1.25rem',
                            color: exp.formatting?.title?.color || '#1f2937',
                            textAlign: exp.formatting?.title?.alignment as 'left' | 'center' | 'right' || 'left',
                            fontWeight: exp.formatting?.title?.bold ? 'bold' : '600',
                            fontStyle: exp.formatting?.title?.italic ? 'italic' : 'normal',
                            textDecoration: exp.formatting?.title?.underline ? 'underline' : 'none'
                          }}
                        >
                          {exp.title}
                        </h3>
                        <span
                          className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
                          style={{
                            fontSize: exp.formatting?.duration?.fontSize || '0.875rem',
                            color: exp.formatting?.duration?.color || '#6b7280',
                            textAlign: exp.formatting?.duration?.alignment as 'left' | 'center' | 'right' || 'right',
                            fontWeight: exp.formatting?.duration?.bold ? 'bold' : 'normal',
                            fontStyle: exp.formatting?.duration?.italic ? 'italic' : 'normal',
                            textDecoration: exp.formatting?.duration?.underline ? 'underline' : 'none'
                          }}
                        >
                          {exp.duration}
                        </span>
                      </div>
                      <p
                        className="text-lg text-gray-600 font-medium mb-3"
                        style={{
                          fontSize: exp.formatting?.company?.fontSize || '1.125rem',
                          color: exp.formatting?.company?.color || '#4b5563',
                          textAlign: exp.formatting?.company?.alignment as 'left' | 'center' | 'right' || 'left',
                          fontWeight: exp.formatting?.company?.bold ? 'bold' : '500',
                          fontStyle: exp.formatting?.company?.italic ? 'italic' : 'normal',
                          textDecoration: exp.formatting?.company?.underline ? 'underline' : 'none'
                        }}
                      >
                        {exp.company}
                      </p>
                      <p
                        className="text-gray-700 leading-relaxed"
                        style={{
                          fontSize: exp.formatting?.description?.fontSize || '1rem',
                          color: exp.formatting?.description?.color || '#374151',
                          textAlign: exp.formatting?.description?.alignment as 'left' | 'center' | 'right' || 'left',
                          fontWeight: exp.formatting?.description?.bold ? 'bold' : 'normal',
                          fontStyle: exp.formatting?.description?.italic ? 'italic' : 'normal',
                          textDecoration: exp.formatting?.description?.underline ? 'underline' : 'none'
                        }}
                      >
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3
                          className="text-lg font-semibold text-gray-800"
                          style={{
                            fontSize: edu.formatting?.degree?.fontSize || '1.125rem',
                            color: edu.formatting?.degree?.color || '#1f2937',
                            textAlign: edu.formatting?.degree?.alignment as 'left' | 'center' | 'right' || 'left',
                            fontWeight: edu.formatting?.degree?.bold ? 'bold' : '600',
                            fontStyle: edu.formatting?.degree?.italic ? 'italic' : 'normal',
                            textDecoration: edu.formatting?.degree?.underline ? 'underline' : 'none'
                          }}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className="text-gray-600"
                          style={{
                            fontSize: edu.formatting?.institution?.fontSize || '1rem',
                            color: edu.formatting?.institution?.color || '#4b5563',
                            textAlign: edu.formatting?.institution?.alignment as 'left' | 'center' | 'right' || 'left',
                            fontWeight: edu.formatting?.institution?.bold ? 'bold' : 'normal',
                            fontStyle: edu.formatting?.institution?.italic ? 'italic' : 'normal',
                            textDecoration: edu.formatting?.institution?.underline ? 'underline' : 'none'
                          }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <span
                        className="text-gray-600 font-medium"
                        style={{
                          fontSize: edu.formatting?.year?.fontSize || '0.875rem',
                          color: edu.formatting?.year?.color || '#6b7280',
                          textAlign: edu.formatting?.year?.alignment as 'left' | 'center' | 'right' || 'right',
                          fontWeight: edu.formatting?.year?.bold ? 'bold' : 'medium',
                          fontStyle: edu.formatting?.year?.italic ? 'italic' : 'normal',
                          textDecoration: edu.formatting?.year?.underline ? 'underline' : 'none'
                        }}
                      >
                        {edu.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 bg-gray-50 p-8">
            {/* Skills */}
            {content.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Skills
                </h2>
                <div className="space-y-2">
                  {content.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-white text-gray-700 px-3 py-2 rounded border border-gray-200 text-sm"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {content.certifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Certifications
                </h2>
                <ul className="space-y-2">
                  {content.certifications.map((cert, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-200">
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Template2.displayName = 'Template2'

export default Template2