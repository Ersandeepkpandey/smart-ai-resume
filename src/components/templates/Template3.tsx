'use client'

import { ResumeContent } from '@/lib/ats-scorer'
import { forwardRef } from 'react'

interface Template3Props {
  content: ResumeContent
  className?: string
}

const Template3 = forwardRef<HTMLDivElement, Template3Props>(
  ({ content, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white text-gray-800 p-8 max-w-4xl mx-auto shadow-lg ${className}`}
        style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-light text-gray-900 mb-2 tracking-wide">
            {content.personalInfo.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {content.experience[0]?.title || 'Professional'}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>{content.personalInfo.email}</span>
            <span>•</span>
            <span>{content.personalInfo.phone}</span>
            <span>•</span>
            <span>{content.personalInfo.location}</span>
          </div>
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {content.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {content.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Experience
            </h2>
            <div className="space-y-6">
              {content.experience.map((exp, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <h3 className="text-xl font-medium text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-lg text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {content.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {content.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-gray-700 px-4 py-2 border border-gray-300 rounded-full text-sm"
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
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Certifications
            </h2>
            <div className="text-center space-y-2">
              {content.certifications.map((cert, index) => (
                <p key={index} className="text-gray-700">
                  {cert}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Template3.displayName = 'Template3'

export default Template3