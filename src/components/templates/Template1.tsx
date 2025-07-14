'use client'

import { ResumeContent, renderContentWithLinks } from '@/lib/ats-scorer'
import { forwardRef } from 'react'

interface Template1Props {
  content: ResumeContent
  className?: string
}

const Template1 = forwardRef<HTMLDivElement, Template1Props>(
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

    // Social media platforms for display
    const socialPlatforms = [
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'github', label: 'GitHub' },
      { value: 'portfolio', label: 'Portfolio' },
      { value: 'twitter', label: 'Twitter/X' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'medium', label: 'Medium' },
      { value: 'behance', label: 'Behance' },
      { value: 'dribbble', label: 'Dribbble' },
      { value: 'stackoverflow', label: 'Stack Overflow' },
      { value: 'custom', label: 'Custom' }
    ]

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
              fontSize: personalInfo.formatting?.name?.fontSize || '2.25rem',
              fontFamily: personalInfo.formatting?.name?.fontFamily || 'Georgia, serif',
              color: personalInfo.formatting?.name?.color || '#2563eb',
              textAlign: personalInfo.formatting?.name?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: personalInfo.formatting?.name?.bold ? 'bold' : 'bold',
              fontStyle: personalInfo.formatting?.name?.italic ? 'italic' : 'normal',
              textDecoration: personalInfo.formatting?.name?.underline ? 'underline' : 'none'
            }}
          >
            {personalInfo.name}
          </h1>
          <div className="text-lg text-gray-600 space-y-1">
            <p style={{
              fontSize: personalInfo.formatting?.email?.fontSize || '1.125rem',
              fontFamily: personalInfo.formatting?.email?.fontFamily || 'Georgia, serif',
              color: personalInfo.formatting?.email?.color || '#4b5563',
              textAlign: personalInfo.formatting?.email?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: personalInfo.formatting?.email?.bold ? 'bold' : 'normal',
              fontStyle: personalInfo.formatting?.email?.italic ? 'italic' : 'normal',
              textDecoration: personalInfo.formatting?.email?.underline ? 'underline' : 'none'
            }}>
              {personalInfo.email}
            </p>
            <p style={{
              fontSize: personalInfo.formatting?.phone?.fontSize || '1.125rem',
              fontFamily: personalInfo.formatting?.phone?.fontFamily || 'Georgia, serif',
              color: personalInfo.formatting?.phone?.color || '#4b5563',
              textAlign: personalInfo.formatting?.phone?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: personalInfo.formatting?.phone?.bold ? 'bold' : 'normal',
              fontStyle: personalInfo.formatting?.phone?.italic ? 'italic' : 'normal',
              textDecoration: personalInfo.formatting?.phone?.underline ? 'underline' : 'none'
            }}>
              {personalInfo.phone}
            </p>
            <p style={{
              fontSize: personalInfo.formatting?.location?.fontSize || '1.125rem',
              fontFamily: personalInfo.formatting?.location?.fontFamily || 'Georgia, serif',
              color: personalInfo.formatting?.location?.color || '#4b5563',
              textAlign: personalInfo.formatting?.location?.alignment as 'left' | 'center' | 'right' || 'left',
              fontWeight: personalInfo.formatting?.location?.bold ? 'bold' : 'normal',
              fontStyle: personalInfo.formatting?.location?.italic ? 'italic' : 'normal',
              textDecoration: personalInfo.formatting?.location?.underline ? 'underline' : 'none'
            }}>
              {personalInfo.location}
            </p>
          </div>

          {/* Social Media Links */}
          {personalInfo.socialLinks && personalInfo.socialLinks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-300">
              <div className="flex flex-wrap gap-3">
                {personalInfo.socialLinks.map((link, index) => {
                  const platform = socialPlatforms.find(p => p.value === link.platform);
                  const displayText = link.label || platform?.label || link.platform;

                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      {displayText}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              {content.sectionHeadings?.summary || 'Professional Summary'}
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
              {renderContentWithLinks(content.summary)}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              {content.sectionHeadings?.experience || 'Work Experience'}
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
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
                      {renderContentWithLinks(exp.company)}
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
                    {renderContentWithLinks(exp.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              {content.sectionHeadings?.education || 'Education'}
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

        {/* Skills */}
        {content.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              {content.sectionHeadings?.skills || 'Skills'}
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              {content.sectionHeadings?.certifications || 'Certifications'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {content.certifications.map((cert, index) => (
                <li key={index} className="text-gray-700">
                  {cert}
                </li>
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
              {renderContentWithLinks(section.content)}
            </div>
          </div>
        ))}
      </div>
    )
  }
)

Template1.displayName = 'Template1'

export default Template1