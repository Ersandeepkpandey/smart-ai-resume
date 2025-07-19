'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, User, Mail, Phone, MapPin, FileText, ChevronRight, ChevronLeft, Plus, Minus, Check } from 'lucide-react'

interface CreateResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface InitialData {
  name: string
  email: string
  phone: string
  location: string
  title: string
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  skills: string[]
  certifications: string[]
  projects: Array<{
    name: string
    description: string
    technologies: string
  }>
  languages: string[]
}

export default function CreateResumeModal({ isOpen, onClose }: CreateResumeModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<InitialData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    skills: [''],
    certifications: [''],
    projects: [{ name: '', description: '', technologies: '' }],
    languages: ['']
  })

  const steps = [
    { title: 'Resume Title', key: 'title', required: true },
    { title: 'Personal Information', key: 'personal', required: false },
    { title: 'Professional Summary', key: 'summary', required: false },
    { title: 'Work Experience', key: 'experience', required: false },
    { title: 'Education', key: 'education', required: false },
    { title: 'Skills', key: 'skills', required: false },
    { title: 'Projects', key: 'projects', required: false },
    { title: 'Certifications', key: 'certifications', required: false },
    { title: 'Languages', key: 'languages', required: false },
    { title: 'Review & Create', key: 'review', required: false }
  ]

  const handleInputChange = (field: keyof InitialData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipStep = () => {
    nextStep()
  }



  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }))
  }

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const updateArrayField = (field: 'skills' | 'certifications' | 'languages', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'skills' | 'certifications' | 'languages') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'skills' | 'certifications' | 'languages', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '' }]
    }))
  }

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const updateProject = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

          const handleSubmit = () => {
    try {
      // Store the initial data in sessionStorage to be used in the resume builder
      sessionStorage.setItem('initialResumeData', JSON.stringify(formData))
      console.log('Stored initial resume data:', formData)

      // Close modal first
      onClose()

      // Navigate using Next.js router
      router.push('/resume/new')
    } catch (error) {
      console.error('Error saving initial data:', error)
      // Close modal and fallback navigation
      onClose()
      window.location.href = '/resume/new'
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields for current step
    if (currentStep === 0 && !formData.title.trim()) {
      alert('Please enter a resume title before proceeding.')
      return
    }

    if (currentStep === steps.length - 1) {
      handleSubmit()
    } else {
      nextStep()
    }
  }

  const handleSkip = () => {
    try {
      // Clear any existing initial data
      sessionStorage.removeItem('initialResumeData')
      console.log('Cleared initial resume data')

      // Close modal first
      onClose()

      // Navigate using Next.js router
      router.push('/resume/new')
    } catch (error) {
      console.error('Error during skip navigation:', error)
      // Close modal and fallback navigation
      onClose()
      window.location.href = '/resume/new'
    }
  }

  if (!isOpen) return null

  const renderStepContent = () => {
    const currentStepData = steps[currentStep]

    switch (currentStepData.key) {
      case 'title':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Resume Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Software Engineer Resume"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
              </div>
            </div>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="New York, NY"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                placeholder="Write a brief summary of your professional background and key strengths..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                rows={6}
              />
            </div>
          </div>
        )

             case 'experience':
         return (
           <div className="space-y-4">
             {formData.experience.map((exp, index) => (
               <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                 {formData.experience.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeExperience(index)}
                     className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <input
                     type="text"
                     value={exp.title}
                     onChange={(e) => updateExperience(index, 'title', e.target.value)}
                     placeholder="Job Title"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <input
                     type="text"
                     value={exp.company}
                     onChange={(e) => updateExperience(index, 'company', e.target.value)}
                     placeholder="Company Name"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <input
                     type="text"
                     value={exp.duration}
                     onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                     placeholder="2020 - Present"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                 </div>
                 <textarea
                   value={exp.description}
                   onChange={(e) => updateExperience(index, 'description', e.target.value)}
                   placeholder="Describe your key responsibilities and achievements..."
                   className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   rows={3}
                 />
               </div>
             ))}
             <button
               type="button"
               onClick={addExperience}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Experience
             </button>
           </div>
         )

       case 'education':
         return (
           <div className="space-y-4">
             {formData.education.map((edu, index) => (
               <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                 {formData.education.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeEducation(index)}
                     className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <input
                     type="text"
                     value={edu.degree}
                     onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                     placeholder="Degree (e.g. B.Sc. Computer Science)"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <input
                     type="text"
                     value={edu.institution}
                     onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                     placeholder="Institution Name"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <input
                     type="text"
                     value={edu.year}
                     onChange={(e) => updateEducation(index, 'year', e.target.value)}
                     placeholder="2020 - 2024"
                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                 </div>
               </div>
             ))}
             <button
               type="button"
               onClick={addEducation}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Education
             </button>
           </div>
         )

       case 'skills':
         return (
           <div className="space-y-4">
             {formData.skills.map((skill, index) => (
               <div key={index} className="flex items-center space-x-2">
                 <input
                   type="text"
                   value={skill}
                   onChange={(e) => updateArrayField('skills', index, e.target.value)}
                   placeholder="e.g. JavaScript, React, Node.js"
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                 />
                 {formData.skills.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeArrayItem('skills', index)}
                     className="text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ))}
             <button
               type="button"
               onClick={() => addArrayItem('skills')}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Skill
             </button>
           </div>
         )

       case 'projects':
         return (
           <div className="space-y-4">
             {formData.projects.map((project, index) => (
               <div key={index} className="p-4 bg-gray-50 rounded-lg relative">
                 {formData.projects.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeProject(index)}
                     className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
                 <div className="space-y-3">
                   <input
                     type="text"
                     value={project.name}
                     onChange={(e) => updateProject(index, 'name', e.target.value)}
                     placeholder="Project Name"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <input
                     type="text"
                     value={project.technologies}
                     onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                     placeholder="Technologies Used (e.g. React, Node.js, MongoDB)"
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                   />
                   <textarea
                     value={project.description}
                     onChange={(e) => updateProject(index, 'description', e.target.value)}
                     placeholder="Project description and your role..."
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                     rows={3}
                   />
                 </div>
               </div>
             ))}
             <button
               type="button"
               onClick={addProject}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Project
             </button>
           </div>
         )

       case 'certifications':
         return (
           <div className="space-y-4">
             {formData.certifications.map((cert, index) => (
               <div key={index} className="flex items-center space-x-2">
                 <input
                   type="text"
                   value={cert}
                   onChange={(e) => updateArrayField('certifications', index, e.target.value)}
                   placeholder="e.g. AWS Certified Developer"
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                 />
                 {formData.certifications.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeArrayItem('certifications', index)}
                     className="text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ))}
             <button
               type="button"
               onClick={() => addArrayItem('certifications')}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Certification
             </button>
           </div>
         )

       case 'languages':
         return (
           <div className="space-y-4">
             {formData.languages.map((language, index) => (
               <div key={index} className="flex items-center space-x-2">
                 <input
                   type="text"
                   value={language}
                   onChange={(e) => updateArrayField('languages', index, e.target.value)}
                   placeholder="e.g. English (Native), Spanish (Fluent)"
                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                 />
                 {formData.languages.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeArrayItem('languages', index)}
                     className="text-red-600 hover:text-red-800"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ))}
             <button
               type="button"
               onClick={() => addArrayItem('languages')}
               className="flex items-center text-blue-600 hover:text-blue-800"
             >
               <Plus className="w-4 h-4 mr-2" />
               Add Another Language
             </button>
           </div>
         )

       case 'review':
         return (
           <div className="space-y-6">
             <div className="text-center">
               <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Information</h3>
               <p className="text-gray-600">Here&apos;s what we&apos;ve collected for your resume:</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
               <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                 <p><strong>Title:</strong> {formData.title || 'Not provided'}</p>
                 <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                 <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
                 <p><strong>Phone:</strong> {formData.phone || 'Not provided'}</p>
                 <p><strong>Location:</strong> {formData.location || 'Not provided'}</p>
               </div>

               <div className="bg-gray-50 p-4 rounded-lg">
                 <h4 className="font-medium text-gray-900 mb-2">Content Sections</h4>
                 <p><strong>Summary:</strong> {formData.summary ? 'Added' : 'Skipped'}</p>
                 <p><strong>Experience:</strong> {formData.experience.filter(e => e.title).length} entries</p>
                 <p><strong>Education:</strong> {formData.education.filter(e => e.degree).length} entries</p>
                 <p><strong>Skills:</strong> {formData.skills.filter(s => s.trim()).length} skills</p>
                 <p><strong>Projects:</strong> {formData.projects.filter(p => p.name).length} projects</p>
                 <p><strong>Certifications:</strong> {formData.certifications.filter(c => c.trim()).length} certifications</p>
                 <p><strong>Languages:</strong> {formData.languages.filter(l => l.trim()).length} languages</p>
               </div>
             </div>
           </div>
         )

       default:
         return <div>Step content for {currentStepData.title}</div>
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Progress */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Resume</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Step Title */}
          <h3 className="text-lg font-medium text-gray-900">
            {steps[currentStep].title}
            {!steps[currentStep].required && <span className="text-sm text-gray-500 ml-2">(Optional)</span>}
          </h3>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {currentStep === 0 && "Let's start with your resume title."}
              {currentStep > 0 && currentStep < steps.length - 1 && "Fill out what you'd like to include - you can always skip."}
              {currentStep === steps.length - 1 && "Review your information and create your resume."}
            </p>
          </div>

          {/* Step Content */}
          <div className="min-h-[200px]">
            {renderStepContent()}
          </div>
        </form>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-3">
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={skipStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Skip
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleFormSubmit(e)
                }}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Start Blank
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Create Resume
                </button>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}