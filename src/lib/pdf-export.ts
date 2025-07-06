import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { ResumeContent } from './ats-scorer'

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    borderBottom: '4px solid #2563eb',
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 12,
    borderBottom: '2px solid #d1d5db',
    paddingBottom: 4,
  },
  summary: {
    fontSize: 14,
    lineHeight: 1.5,
    color: '#374151',
  },
  experienceItem: {
    marginBottom: 16,
    borderLeft: '4px solid #dbeafe',
    paddingLeft: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  duration: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  },
  company: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 'medium',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.4,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  educationLeft: {
    flex: 1,
  },
  degree: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  institution: {
    fontSize: 14,
    color: '#6b7280',
  },
  year: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skill: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'medium',
  },
  certificationsList: {
    marginLeft: 16,
  },
  certificationItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
})

// PDF Template Component using React.createElement to avoid JSX parsing issues
const PDFTemplate = ({ content }: { content: ResumeContent }) => {
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name }, content.personalInfo.name),
        React.createElement(Text, { style: styles.contactInfo }, content.personalInfo.email),
        React.createElement(Text, { style: styles.contactInfo }, content.personalInfo.phone),
        React.createElement(Text, { style: styles.contactInfo }, content.personalInfo.location)
      ),

      // Summary
      content.summary && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Professional Summary"),
        React.createElement(Text, { style: styles.summary }, content.summary)
      ),

      // Experience
      content.experience.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Professional Experience"),
        ...content.experience.map((exp, index) =>
          React.createElement(View, { key: index, style: styles.experienceItem },
            React.createElement(View, { style: styles.experienceHeader },
              React.createElement(Text, { style: styles.jobTitle }, exp.title),
              React.createElement(Text, { style: styles.duration }, exp.duration)
            ),
            React.createElement(Text, { style: styles.company }, exp.company),
            React.createElement(Text, { style: styles.description }, exp.description)
          )
        )
      ),

      // Education
      content.education.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Education"),
        ...content.education.map((edu, index) =>
          React.createElement(View, { key: index, style: styles.educationItem },
            React.createElement(View, { style: styles.educationLeft },
              React.createElement(Text, { style: styles.degree }, edu.degree),
              React.createElement(Text, { style: styles.institution }, edu.institution)
            ),
            React.createElement(Text, { style: styles.year }, edu.year)
          )
        )
      ),

      // Skills
      content.skills.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Skills"),
        React.createElement(View, { style: styles.skillsContainer },
          ...content.skills.map((skill, index) =>
            React.createElement(Text, { key: index, style: styles.skill }, skill)
          )
        )
      ),

      // Certifications
      content.certifications.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Certifications"),
        React.createElement(View, { style: styles.certificationsList },
          ...content.certifications.map((cert, index) =>
            React.createElement(Text, { key: index, style: styles.certificationItem }, `• ${cert}`)
          )
        )
      )
    )
  )
}

export async function downloadResumeAsPDF(content: ResumeContent, name: string) {
  try {
    // Generate PDF blob
    const blob = await pdf(PDFTemplate({ content })).toBlob()

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${name.replace(/\s+/g, '_')}_resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

// Legacy function for backward compatibility (keeping the same signature)
export async function exportToPDF() {
  // This function is kept for backward compatibility but is deprecated
  console.warn('exportToPDF is deprecated. Use downloadResumeAsPDF with content instead.')
  throw new Error('exportToPDF is deprecated. Use downloadResumeAsPDF with content instead.')
}