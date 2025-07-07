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
          <h1
            className="text-4xl font-bold text-blue-600 mb-2"
            style={{
              fontSize: content.personalInfo.formatting?.name?.fontSize || '2.25rem',
              fontFamily: content.personalInfo.formatting?.name?.fontFamily || 'Georgia, serif',
              color: content.personalInfo.formatting?.name?.color || '#2563eb',
              textAlign: content.personalInfo.formatting?.name?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: content.personalInfo.formatting?.name?.bold ? 'bold' : 'bold',
              fontStyle: content.personalInfo.formatting?.name?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.name?.underline ? 'underline' : 'none'
            }}
          >
            {content.personalInfo.name}
          </h1>
          <div className="text-lg text-gray-600 space-y-1">
            <p style={{
              fontSize: content.personalInfo.formatting?.email?.fontSize || '1.125rem',
              fontFamily: content.personalInfo.formatting?.email?.fontFamily || 'Georgia, serif',
              color: content.personalInfo.formatting?.email?.color || '#4b5563',
              textAlign: content.personalInfo.formatting?.email?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: content.personalInfo.formatting?.email?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.email?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.email?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.email}
            </p>
            <p style={{
              fontSize: content.personalInfo.formatting?.phone?.fontSize || '1.125rem',
              fontFamily: content.personalInfo.formatting?.phone?.fontFamily || 'Georgia, serif',
              color: content.personalInfo.formatting?.phone?.color || '#4b5563',
              textAlign: content.personalInfo.formatting?.phone?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: content.personalInfo.formatting?.phone?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.phone?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.phone?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.phone}
            </p>
            <p style={{
              fontSize: content.personalInfo.formatting?.location?.fontSize || '1.125rem',
              fontFamily: content.personalInfo.formatting?.location?.fontFamily || 'Georgia, serif',
              color: content.personalInfo.formatting?.location?.color || '#4b5563',
              textAlign: content.personalInfo.formatting?.location?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: content.personalInfo.formatting?.location?.bold ? 'bold' : 'normal',
              fontStyle: content.personalInfo.formatting?.location?.italic ? 'italic' : 'normal',
              textDecoration: content.personalInfo.formatting?.location?.underline ? 'underline' : 'none'
            }}>
              {content.personalInfo.location}
            </p>
          </div>
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{
                fontSize: content.summaryFormatting?.fontSize || '1.125rem',
                fontFamily: content.summaryFormatting?.fontFamily || 'Georgia, serif',
                color: content.summaryFormatting?.color || '#000000',
                textAlign: content.summaryFormatting?.alignment as 'left' | 'center' | 'right' || 'left',
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {content.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-xl font-semibold text-gray-800"
                      style={{
                        fontSize: exp.formatting?.title?.fontSize || '1.25rem',
                        fontFamily: exp.formatting?.title?.fontFamily || 'Georgia, serif',
                        color: exp.formatting?.title?.color || '#1f2937',
                        textAlign: exp.formatting?.title?.alignment as 'left' | 'center' | 'right' || 'left',
                        fontWeight: exp.formatting?.title?.bold ? 'bold' : 'semibold',
                        fontStyle: exp.formatting?.title?.italic ? 'italic' : 'normal',
                        textDecoration: exp.formatting?.title?.underline ? 'underline' : 'none'
                      }}
                    >
                      {exp.title}
                    </h3>
                    <span
                      className="text-gray-600 font-medium"
                      style={{
                        fontSize: exp.formatting?.duration?.fontSize || '0.875rem',
                        fontFamily: exp.formatting?.duration?.fontFamily || 'Georgia, serif',
                        color: exp.formatting?.duration?.color || '#6b7280',
                        textAlign: exp.formatting?.duration?.alignment as 'left' | 'center' | 'right' || 'right',
                        fontWeight: exp.formatting?.duration?.bold ? 'bold' : 'medium',
                        fontStyle: exp.formatting?.duration?.italic ? 'italic' : 'normal',
                        textDecoration: exp.formatting?.duration?.underline ? 'underline' : 'none'
                      }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <p
                    className="text-lg text-blue-600 font-medium mb-2"
                    style={{
                      fontSize: exp.formatting?.company?.fontSize || '1.125rem',
                      fontFamily: exp.formatting?.company?.fontFamily || 'Georgia, serif',
                      color: exp.formatting?.company?.color || '#2563eb',
                      textAlign: exp.formatting?.company?.alignment as 'left' | 'center' | 'right' || 'left',
                      fontWeight: exp.formatting?.company?.bold ? 'bold' : 'medium',
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
                      fontFamily: exp.formatting?.description?.fontFamily || 'Georgia, serif',
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
        {content.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {content.education.map((edu, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-800"
                      style={{
                        fontSize: edu.formatting?.degree?.fontSize || '1.125rem',
                        fontFamily: edu.formatting?.degree?.fontFamily || 'Georgia, serif',
                        color: edu.formatting?.degree?.color || '#1f2937',
                        textAlign: edu.formatting?.degree?.alignment as 'left' | 'center' | 'right' || 'left',
                        fontWeight: edu.formatting?.degree?.bold ? 'bold' : 'semibold',
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
                        fontFamily: edu.formatting?.institution?.fontFamily || 'Georgia, serif',
                        color: edu.formatting?.institution?.color || '#6b7280',
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
                      fontFamily: edu.formatting?.year?.fontFamily || 'Georgia, serif',
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

        {/* Other Qualities */}
        {content.otherQualities && content.otherQualities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              Other Qualities
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {content.otherQualities.map((quality, index) => (
                <li key={index}>{quality}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Sections */}
        {content.customSections && content.customSections.length > 0 && content.customSections.map((section, idx) => (
          <div className="mt-6" key={idx}>
            <h2 className="text-2xl font-bold text-blue-600 mb-3 border-b-2 border-gray-300 pb-1">
              {section.heading}
            </h2>
            <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}
      </div>
    )
  }
)

Template1.displayName = 'Template1'

export default Template1