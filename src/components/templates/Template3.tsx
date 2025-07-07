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
          <h1
            className="text-5xl font-light text-gray-900 mb-2 tracking-wide"
            style={{
              fontSize: content.personalInfo.formatting?.name?.fontSize || '3rem',
              color: content.personalInfo.formatting?.name?.color || '#111827',
              textAlign: content.personalInfo.formatting?.name?.alignment as 'left' | 'center' | 'right' || 'center',
              fontWeight: content.personalInfo.formatting?.name?.bold ? 'bold' : '300',
              fontStyle: content.personalInfo.formatting?.name?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.name?.underline ? 'underline' : 'none'
            }}
          >
            {content.personalInfo.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {content.experience[0]?.title || 'Professional'}
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span style={{
              fontSize: content.personalInfo.formatting?.email?.fontSize || '0.875rem',
              color: content.personalInfo.formatting?.email?.color || '#6b7280',
              textAlign: content.personalInfo.formatting?.email?.alignment as 'left' | 'center' | 'right' || 'center',
              fontWeight: content.personalInfo.formatting?.email?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.email?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.email?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.email}
            </span>
            <span>•</span>
            <span style={{
              fontSize: content.personalInfo.formatting?.phone?.fontSize || '0.875rem',
              color: content.personalInfo.formatting?.phone?.color || '#6b7280',
              textAlign: content.personalInfo.formatting?.phone?.alignment as 'left' | 'center' | 'right' || 'center',
              fontWeight: content.personalInfo.formatting?.phone?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.phone?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.phone?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.phone}
            </span>
            <span>•</span>
            <span style={{
              fontSize: content.personalInfo.formatting?.location?.fontSize || '0.875rem',
              color: content.personalInfo.formatting?.location?.color || '#6b7280',
              textAlign: content.personalInfo.formatting?.location?.alignment as 'left' | 'center' | 'right' || 'center',
              fontWeight: content.personalInfo.formatting?.location?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.location?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.location?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.location}
            </span>
          </div>
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-8 text-center">
            <p
              className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto"
              style={{
                fontSize: content.summaryFormatting?.fontSize || '1.125rem',
                color: content.summaryFormatting?.color || '#374151',
                textAlign: content.summaryFormatting?.alignment as 'left' | 'center' | 'right' || 'center',
                fontWeight: content.summaryFormatting?.bold ? 'bold' : 'normal',
                fontStyle: content.summaryFormatting?.italic ? 'italic' : 'normal',
                textDecoration: content.summaryFormatting?.underline ? 'underline' : 'none'
              }}
            >
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
                    <h3
                      className="text-xl font-medium text-gray-900"
                      style={{
                        fontSize: exp.formatting?.title?.fontSize || '1.25rem',
                        color: exp.formatting?.title?.color || '#111827',
                        textAlign: exp.formatting?.title?.alignment as 'left' | 'center' | 'right' || 'center',
                        fontWeight: exp.formatting?.title?.bold ? 'bold' : '500',
                        fontStyle: exp.formatting?.title?.italic ? 'italic' : 'normal',
                        textDecoration: exp.formatting?.title?.underline ? 'underline' : 'none'
                      }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      className="text-lg text-gray-600"
                      style={{
                        fontSize: exp.formatting?.company?.fontSize || '1.125rem',
                        color: exp.formatting?.company?.color || '#4b5563',
                        textAlign: exp.formatting?.company?.alignment as 'left' | 'center' | 'right' || 'center',
                        fontWeight: exp.formatting?.company?.bold ? 'bold' : 'normal',
                        fontStyle: exp.formatting?.company?.italic ? 'italic' : 'normal',
                        textDecoration: exp.formatting?.company?.underline ? 'underline' : 'none'
                      }}
                    >
                      {exp.company}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{
                        fontSize: exp.formatting?.duration?.fontSize || '0.875rem',
                        color: exp.formatting?.duration?.color || '#6b7280',
                        textAlign: exp.formatting?.duration?.alignment as 'left' | 'center' | 'right' || 'center',
                        fontWeight: exp.formatting?.duration?.bold ? 'bold' : 'normal',
                        fontStyle: exp.formatting?.duration?.italic ? 'italic' : 'normal',
                        textDecoration: exp.formatting?.duration?.underline ? 'underline' : 'none'
                      }}
                    >
                      {exp.duration}
                    </p>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed max-w-2xl mx-auto"
                    style={{
                      fontSize: exp.formatting?.description?.fontSize || '1rem',
                      color: exp.formatting?.description?.color || '#374151',
                      textAlign: exp.formatting?.description?.alignment as 'left' | 'center' | 'right' || 'center',
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
        {content.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center border-b border-gray-300 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div key={index} className="text-center">
                  <h3
                    className="text-lg font-medium text-gray-900"
                    style={{
                      fontSize: edu.formatting?.degree?.fontSize || '1.125rem',
                      color: edu.formatting?.degree?.color || '#111827',
                      textAlign: edu.formatting?.degree?.alignment as 'left' | 'center' | 'right' || 'center',
                      fontWeight: edu.formatting?.degree?.bold ? 'bold' : '500',
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
                      textAlign: edu.formatting?.institution?.alignment as 'left' | 'center' | 'right' || 'center',
                      fontWeight: edu.formatting?.institution?.bold ? 'bold' : 'normal',
                      fontStyle: edu.formatting?.institution?.italic ? 'italic' : 'normal',
                      textDecoration: edu.formatting?.institution?.underline ? 'underline' : 'none'
                    }}
                  >
                    {edu.institution}
                  </p>
                  <p
                    className="text-sm text-gray-500"
                    style={{
                      fontSize: edu.formatting?.year?.fontSize || '0.875rem',
                      color: edu.formatting?.year?.color || '#6b7280',
                      textAlign: edu.formatting?.year?.alignment as 'left' | 'center' | 'right' || 'center',
                      fontWeight: edu.formatting?.year?.bold ? 'bold' : 'normal',
                      fontStyle: edu.formatting?.year?.italic ? 'italic' : 'normal',
                      textDecoration: edu.formatting?.year?.underline ? 'underline' : 'none'
                    }}
                  >
                    {edu.year}
                  </p>
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