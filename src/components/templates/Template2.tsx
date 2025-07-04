'use client'

import { ResumeContent } from '@/lib/ats-scorer'
import { forwardRef } from 'react'

interface Template2Props {
  content: ResumeContent
  className?: string
}

const Template2 = forwardRef<HTMLDivElement, Template2Props>(
  ({ content, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white text-gray-800 max-w-4xl mx-auto shadow-lg ${className}`}
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">{content.personalInfo.name}</h1>
          <p className="text-xl text-gray-300 mb-4">{content.experience[0]?.title || 'Professional'}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              {content.personalInfo.email}
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              {content.personalInfo.phone}
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              {content.personalInfo.location}
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
                <p className="text-gray-700 leading-relaxed">{content.summary}</p>
              </div>
            )}

            {/* Experience */}
            {content.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {content.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {exp.title}
                        </h3>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600 font-medium mb-3">
                        {exp.company}
                      </p>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {content.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {content.education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-600">{edu.institution}</p>
                      </div>
                      <span className="text-gray-600 font-medium">{edu.year}</span>
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