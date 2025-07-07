'use client'

import { useState } from 'react'
import { ResumeContent, TextFormatting } from '@/lib/ats-scorer'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import FormattedInput from './FormattedInput'

interface ResumeFormProps {
  content: ResumeContent
  onChange: (content: ResumeContent) => void
  onFieldFocus?: (fieldId: string) => void
}

export default function ResumeForm({ content, onChange, onFieldFocus }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']))
  const [newSectionHeading, setNewSectionHeading] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)

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

  const updatePersonalInfoFormatting = (field: string, formatting: TextFormatting) => {
    const newPersonalInfo = {
      ...content.personalInfo,
      formatting: {
        ...content.personalInfo.formatting,
        [field]: formatting
      }
    }
    updateContent({ personalInfo: newPersonalInfo })
  }

  const updateSummaryFormatting = (formatting: TextFormatting) => {
    updateContent({ summaryFormatting: formatting })
  }

  const updateExperienceFormatting = (index: number, field: string, formatting: TextFormatting) => {
    const newExperience = [...content.experience]
    newExperience[index] = {
      ...newExperience[index],
      formatting: {
        ...newExperience[index].formatting,
        [field]: formatting
      }
    }
    updateContent({ experience: newExperience })
  }

  const updateEducationFormatting = (index: number, field: string, formatting: TextFormatting) => {
    const newEducation = [...content.education]
    newEducation[index] = {
      ...newEducation[index],
      formatting: {
        ...newEducation[index].formatting,
        [field]: formatting
      }
    }
    updateContent({ education: newEducation })
  }

  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      duration: '',
      description: '',
      formatting: {}
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
      year: '',
      formatting: {}
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

  const addOtherQuality = () => {
    updateContent({ otherQualities: [...(content.otherQualities || []), ''] })
  }

  const updateOtherQuality = (index: number, value: string) => {
    const newQualities = [...(content.otherQualities || [])]
    newQualities[index] = value
    updateContent({ otherQualities: newQualities })
  }

  const removeOtherQuality = (index: number) => {
    const newQualities = (content.otherQualities || []).filter((_, i) => i !== index)
    updateContent({ otherQualities: newQualities })
  }

  const addCustomSection = () => {
    if (!newSectionHeading.trim()) return;
    updateContent({
      customSections: [
        ...(content.customSections || []),
        { heading: newSectionHeading.trim(), content: '' }
      ]
    })
    setNewSectionHeading('')
    setShowAddSection(false)
  }

  const updateCustomSectionHeading = (index: number, heading: string) => {
    const newSections = [...(content.customSections || [])]
    newSections[index].heading = heading
    updateContent({ customSections: newSections })
  }

  const updateCustomSectionContent = (index: number, value: string) => {
    const newSections = [...(content.customSections || [])]
    newSections[index].content = value
    updateContent({ customSections: newSections })
  }

  const removeCustomSection = (sectionIdx: number) => {
    const newSections = (content.customSections || []).filter((_, i) => i !== sectionIdx)
    updateContent({ customSections: newSections })
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
                <FormattedInput
                  value={content.personalInfo.name}
                  onChange={(value) => updateContent({
                    personalInfo: { ...content.personalInfo, name: value }
                  })}
                  onFormatChange={(formatting) => updatePersonalInfoFormatting('name', formatting)}
                  initialFormatting={content.personalInfo.formatting?.name}
                  type="text"
                  label="Full Name"
                  onFocus={() => onFieldFocus?.('Personal Name')}
                />
              </div>
              <div>
                <FormattedInput
                  value={content.personalInfo.email}
                  onChange={(value) => updateContent({
                    personalInfo: { ...content.personalInfo, email: value }
                  })}
                  onFormatChange={(formatting) => updatePersonalInfoFormatting('email', formatting)}
                  initialFormatting={content.personalInfo.formatting?.email}
                  type="email"
                  label="Email"
                />
              </div>
              <div>
                <FormattedInput
                  value={content.personalInfo.phone}
                  onChange={(value) => updateContent({
                    personalInfo: { ...content.personalInfo, phone: value }
                  })}
                  onFormatChange={(formatting) => updatePersonalInfoFormatting('phone', formatting)}
                  initialFormatting={content.personalInfo.formatting?.phone}
                  type="tel"
                  label="Phone"
                />
              </div>
              <div>
                <FormattedInput
                  value={content.personalInfo.location}
                  onChange={(value) => updateContent({
                    personalInfo: { ...content.personalInfo, location: value }
                  })}
                  onFormatChange={(formatting) => updatePersonalInfoFormatting('location', formatting)}
                  initialFormatting={content.personalInfo.formatting?.location}
                  type="text"
                  label="Location"
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
            <FormattedInput
              value={content.summary}
              onChange={(value) => updateContent({ summary: value })}
              onFormatChange={updateSummaryFormatting}
              initialFormatting={content.summaryFormatting}
              rows={4}
              placeholder="Write a compelling professional summary..."
              onFocus={() => onFieldFocus?.('Professional Summary')}
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
                    <FormattedInput
                      value={exp.title}
                      onChange={(value) => updateExperience(index, 'title', value)}
                      onFormatChange={(formatting) => updateExperienceFormatting(index, 'title', formatting)}
                      initialFormatting={exp.formatting?.title}
                      type="text"
                      label="Job Title"
                    />
                  </div>
                  <div>
                    <FormattedInput
                      value={exp.company}
                      onChange={(value) => updateExperience(index, 'company', value)}
                      onFormatChange={(formatting) => updateExperienceFormatting(index, 'company', formatting)}
                      initialFormatting={exp.formatting?.company}
                      type="text"
                      label="Company"
                    />
                  </div>
                  <div>
                    <FormattedInput
                      value={exp.duration}
                      onChange={(value) => updateExperience(index, 'duration', value)}
                      onFormatChange={(formatting) => updateExperienceFormatting(index, 'duration', formatting)}
                      initialFormatting={exp.formatting?.duration}
                      type="text"
                      label="Duration"
                      placeholder="e.g., Jan 2020 - Present"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <FormattedInput
                    value={exp.description}
                    onChange={(value) => updateExperience(index, 'description', value)}
                    onFormatChange={(formatting) => updateExperienceFormatting(index, 'description', formatting)}
                    initialFormatting={exp.formatting?.description}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                    label="Description"
                    onFocus={() => onFieldFocus?.(`Experience ${index + 1} Description`)}
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
                    <FormattedInput
                      value={edu.degree}
                      onChange={(value) => updateEducation(index, 'degree', value)}
                      onFormatChange={(formatting) => updateEducationFormatting(index, 'degree', formatting)}
                      initialFormatting={edu.formatting?.degree}
                      type="text"
                      label="Degree"
                    />
                  </div>
                  <div>
                    <FormattedInput
                      value={edu.institution}
                      onChange={(value) => updateEducation(index, 'institution', value)}
                      onFormatChange={(formatting) => updateEducationFormatting(index, 'institution', formatting)}
                      initialFormatting={edu.formatting?.institution}
                      type="text"
                      label="Institution"
                    />
                  </div>
                  <div>
                    <FormattedInput
                      value={edu.year}
                      onChange={(value) => updateEducation(index, 'year', value)}
                      onFormatChange={(formatting) => updateEducationFormatting(index, 'year', formatting)}
                      initialFormatting={edu.formatting?.year}
                      type="text"
                      label="Year"
                      placeholder="e.g., 2020"
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

      {/* Other Qualities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Other Qualities</span>
          <button
            onClick={addOtherQuality}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium border border-blue-100"
            type="button"
          >
            Add More
          </button>
        </div>
        {(content.otherQualities || []).length > 0 && (
          <div className="px-6 pb-6 space-y-2">
            {(content.otherQualities || []).map((quality, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={quality}
                  onChange={e => updateOtherQuality(index, e.target.value)}
                  placeholder="Enter a quality or achievement"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button
                  onClick={() => removeOtherQuality(index)}
                  className="text-red-600 hover:text-red-800 p-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Sections as Cards */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">Add More</span>
          <button
            onClick={() => setShowAddSection(true)}
            className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium border border-blue-100"
            type="button"
          >
            + Add More
          </button>
        </div>
        {showAddSection && (
          <div className="mb-4 flex flex-col sm:flex-row gap-2 items-stretch w-full">
            <input
              type="text"
              value={newSectionHeading}
              onChange={e => setNewSectionHeading(e.target.value)}
              placeholder="Section Heading (e.g. Awards)"
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={addCustomSection}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                type="button"
              >
                Add
              </button>
              <button
                onClick={() => { setShowAddSection(false); setNewSectionHeading('') }}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="space-y-6">
          {(content.customSections || []).map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={section.heading}
                  onChange={e => updateCustomSectionHeading(sectionIdx, e.target.value)}
                  className="text-lg font-bold text-blue-700 bg-transparent border-b border-blue-200 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  onClick={() => removeCustomSection(sectionIdx)}
                  className="text-red-600 hover:text-red-800 p-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <FormattedInput
                value={section.content}
                onChange={value => updateCustomSectionContent(sectionIdx, value)}
                rows={4}
                placeholder="Write content for this section..."
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}