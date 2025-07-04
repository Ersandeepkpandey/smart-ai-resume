'use client'

import { useState } from 'react'
import { ResumeContent } from '@/lib/ats-scorer'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface ResumeFormProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
}

export default function ResumeForm({ content, onChange }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateContent = (updates: Partial<ResumeContent>) => {
    onChange({ ...content, ...updates })
  }

  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      duration: '',
      description: ''
    }
    updateContent({
      experience: [...content.experience, newExperience]
    })
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...content.experience]
    newExperience[index] = { ...newExperience[index], [field]: value }
    updateContent({ experience: newExperience })
  }

  const removeExperience = (index: number) => {
    const newExperience = content.experience.filter((_, i) => i !== index)
    updateContent({ experience: newExperience })
  }

  const addEducation = () => {
    const newEducation = {
      degree: '',
      institution: '',
      year: ''
    }
    updateContent({
      education: [...content.education, newEducation]
    })
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...content.education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    updateContent({ education: newEducation })
  }

  const removeEducation = (index: number) => {
    const newEducation = content.education.filter((_, i) => i !== index)
    updateContent({ education: newEducation })
  }

  const addSkill = () => {
    updateContent({
      skills: [...content.skills, '']
    })
  }

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...content.skills]
    newSkills[index] = value
    updateContent({ skills: newSkills })
  }

  const removeSkill = (index: number) => {
    const newSkills = content.skills.filter((_, i) => i !== index)
    updateContent({ skills: newSkills })
  }

  const addCertification = () => {
    updateContent({
      certifications: [...content.certifications, '']
    })
  }

  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...content.certifications]
    newCertifications[index] = value
    updateContent({ certifications: newCertifications })
  }

  const removeCertification = (index: number) => {
    const newCertifications = content.certifications.filter((_, i) => i !== index)
    updateContent({ certifications: newCertifications })
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          {expandedSections.has('personal') ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.has('personal') && (
          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={content.personalInfo.name}
                  onChange={(e) => updateContent({
                    personalInfo: { ...content.personalInfo, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={content.personalInfo.email}
                  onChange={(e) => updateContent({
                    personalInfo: { ...content.personalInfo, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={content.personalInfo.phone}
                  onChange={(e) => updateContent({
                    personalInfo: { ...content.personalInfo, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={content.personalInfo.location}
                  onChange={(e) => updateContent({
                    personalInfo: { ...content.personalInfo, location: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
          {expandedSections.has('summary') ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.has('summary') && (
          <div className="px-6 pb-6">
            <textarea
              value={content.summary}
              onChange={(e) => updateContent({ summary: e.target.value })}
              rows={4}
              placeholder="Write a compelling professional summary..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => toggleSection('experience')}
            className="flex items-center justify-between text-left flex-1"
          >
            <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
            {expandedSections.has('experience') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={addExperience}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {expandedSections.has('experience') && (
          <div className="px-6 pb-6 space-y-4">
            {content.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      placeholder="e.g., Jan 2020 - Present"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => toggleSection('education')}
            className="flex items-center justify-between text-left flex-1"
          >
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            {expandedSections.has('education') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={addEducation}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {expandedSections.has('education') && (
          <div className="px-6 pb-6 space-y-4">
            {content.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="e.g., 2020"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => toggleSection('skills')}
            className="flex items-center justify-between text-left flex-1"
          >
            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            {expandedSections.has('skills') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={addSkill}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {expandedSections.has('skills') && (
          <div className="px-6 pb-6 space-y-2">
            {content.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  placeholder="Enter a skill"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => toggleSection('certifications')}
            className="flex items-center justify-between text-left flex-1"
          >
            <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
            {expandedSections.has('certifications') ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={addCertification}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {expandedSections.has('certifications') && (
          <div className="px-6 pb-6 space-y-2">
            {content.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="Enter a certification"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}