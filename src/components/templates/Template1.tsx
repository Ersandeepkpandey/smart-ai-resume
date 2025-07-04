'use client'

import { ResumeContent } from '@/lib/ats-scorer'
import { forwardRef } from 'react'

interface Template1Props {
  content: ResumeContent
  className?: string
}

const Template1 = forwardRef<HTMLDivElement, Template1Props>(
  ({ content, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white text-gray-800 p-8 max-w-4xl mx-auto shadow-lg ${className}`}
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Header */}
        <div className="border-b-4 border-blue-600 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            {content.personalInfo.name}
          </h1>
          <div className="text-lg text-gray-600 space-y-1">
            <p>{content.personalInfo.email}</p>
            <p>{content.personalInfo.phone}</p>
            <p>{content.personalInfo.location}</p>
          </div>
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-lg leading-relaxed">{content.summary}</p>
          </div>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {exp.title}
                    </h3>
                    <span className="text-gray-600 font-medium">{exp.duration}</span>
                  </div>
                  <p className="text-lg text-blue-600 font-medium mb-2">
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-center">
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

        {/* Skills */}
        {content.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {content.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {content.certifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Certifications
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {content.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
)

Template1.displayName = 'Template1'

export default Template1