import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, renderToBuffer } from '@react-pdf/renderer'
import { ResumeContent, TextFormatting } from './ats-scorer'

// Helper function to convert CSS color to PDF color
const convertColor = (color: string) => {
  if (!color) return '#000000'

  // Handle hex colors
  if (color.startsWith('#')) {
    return color
  }

  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    // Convert rgb to hex (simplified conversion)
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0')
      return `#${r}${g}${b}`
    }
  }

  // Handle named colors (basic mapping)
  const colorMap: { [key: string]: string } = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'gray': '#808080',
    'grey': '#808080',
    'orange': '#ffa500',
    'purple': '#800080',
    'brown': '#a52a2a',
    'pink': '#ffc0cb',
    'lime': '#00ff00',
    'navy': '#000080',
    'teal': '#008080',
    'silver': '#c0c0c0',
    'gold': '#ffd700',
    'maroon': '#800000',
    'olive': '#808000',
    'fuchsia': '#ff00ff',
    'aqua': '#00ffff'
  }

  return colorMap[color.toLowerCase()] || color
}

// Helper function to convert font size to PDF size
const convertFontSize = (fontSize: string) => {
  if (!fontSize) return 14

  // Remove 'px' and convert to number
  const size = parseInt(fontSize.replace('px', ''))
  if (isNaN(size)) return 14

  // Convert to a reasonable PDF size (PDF sizes are typically smaller than web sizes)
  // For better readability in PDF, we'll scale down slightly
  if (size <= 12) return size
  if (size <= 16) return size - 1
  if (size <= 20) return size - 2
  if (size <= 24) return size - 3
  if (size <= 28) return size - 4
  if (size <= 32) return size - 5
  return size - 6
}

// Helper function to convert font family to PDF-compatible font
const convertFontFamily = (fontFamily: string) => {
  if (!fontFamily) return 'Helvetica'

  // Map web fonts to PDF-compatible fonts
  const fontMap: { [key: string]: string } = {
    'arial': 'Helvetica',
    'arial, sans-serif': 'Helvetica',
    'helvetica': 'Helvetica',
    'helvetica, sans-serif': 'Helvetica',
    'times': 'Times-Roman',
    'times new roman': 'Times-Roman',
    'times new roman, serif': 'Times-Roman',
    'georgia': 'Times-Roman',
    'georgia, serif': 'Times-Roman',
    'verdana': 'Helvetica',
    'verdana, sans-serif': 'Helvetica',
    'courier': 'Courier',
    'courier new': 'Courier',
    'courier new, monospace': 'Courier',
    'impact': 'Helvetica',
    'impact, sans-serif': 'Helvetica',
    'comic sans ms': 'Helvetica',
    'comic sans ms, cursive': 'Helvetica',
    'tahoma': 'Helvetica',
    'tahoma, sans-serif': 'Helvetica',
    'trebuchet ms': 'Helvetica',
    'trebuchet ms, sans-serif': 'Helvetica',
    'lucida console': 'Courier',
    'lucida sans unicode': 'Helvetica',
    'lucida grande': 'Helvetica',
    'geneva': 'Helvetica',
    'monaco': 'Courier',
    'menlo': 'Courier',
    'consolas': 'Courier',
    'monospace': 'Courier',
    'serif': 'Times-Roman',
    'sans-serif': 'Helvetica',
    'cursive': 'Helvetica',
    'fantasy': 'Helvetica'
  }

  // Clean up the font family string and try to match
  const cleanFont = fontFamily.toLowerCase().trim()

  // Try exact match first
  if (fontMap[cleanFont]) {
    return fontMap[cleanFont]
  }

  // Try matching the first font in a list (e.g., "Arial, Helvetica, sans-serif")
  const firstFont = cleanFont.split(',')[0].trim()
  if (fontMap[firstFont]) {
    return fontMap[firstFont]
  }

  // Default fallback
  return 'Helvetica'
}

// Helper function to get text style based on formatting
const getTextStyle = (formatting: TextFormatting | undefined, defaultStyle: Record<string, string | number> = {}) => {
  if (!formatting) return defaultStyle

  return {
    ...defaultStyle,
    fontSize: formatting.fontSize ? convertFontSize(formatting.fontSize) : defaultStyle.fontSize || 14,
    fontFamily: formatting.fontFamily ? convertFontFamily(formatting.fontFamily) : defaultStyle.fontFamily || 'Helvetica',
    color: formatting.color ? convertColor(formatting.color) : defaultStyle.color || '#000000',
    textAlign: formatting.alignment || defaultStyle.textAlign || 'left',
    fontWeight: formatting.bold ? 'bold' : (formatting.bold === false ? 'normal' : defaultStyle.fontWeight || 'normal'),
    fontStyle: formatting.italic ? 'italic' : (formatting.italic === false ? 'normal' : defaultStyle.fontStyle || 'normal'),
    textDecoration: formatting.underline ? 'underline' : (formatting.underline === false ? 'none' : defaultStyle.textDecoration || 'none'),
  }
}

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
const PDFTemplate1 = ({ content }: { content: ResumeContent }) => {
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.name, styles.name)
        }, content.personalInfo.name),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.email, styles.contactInfo)
        }, content.personalInfo.email),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.phone, styles.contactInfo)
        }, content.personalInfo.phone),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.location, styles.contactInfo)
        }, content.personalInfo.location)
      ),

      // Summary
      content.summary && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Professional Summary"),
        React.createElement(Text, {
          style: getTextStyle(content.summaryFormatting, styles.summary)
        }, content.summary)
      ),

      // Experience
      content.experience.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Professional Experience"),
        ...content.experience.map((exp, index) =>
          React.createElement(View, { key: index, style: styles.experienceItem },
            React.createElement(View, { style: styles.experienceHeader },
              React.createElement(Text, {
                style: getTextStyle(exp.formatting?.title, styles.jobTitle)
              }, exp.title),
              React.createElement(Text, {
                style: getTextStyle(exp.formatting?.duration, styles.duration)
              }, exp.duration)
            ),
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.company, styles.company)
            }, exp.company),
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.description, styles.description)
            }, exp.description)
          )
        )
      ),

      // Education
      content.education.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Education"),
        ...content.education.map((edu, index) =>
          React.createElement(View, { key: index, style: styles.educationItem },
            React.createElement(View, { style: styles.educationLeft },
              React.createElement(Text, {
                style: getTextStyle(edu.formatting?.degree, styles.degree)
              }, edu.degree),
              React.createElement(Text, {
                style: getTextStyle(edu.formatting?.institution, styles.institution)
              }, edu.institution)
            ),
            React.createElement(Text, {
              style: getTextStyle(edu.formatting?.year, styles.year)
            }, edu.year)
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

// Template 2 - Modern Sidebar style
const PDFTemplate2 = ({ content }: { content: ResumeContent }) => {
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header with contact info on the right
      React.createElement(View, { style: { ...styles.header, flexDirection: 'row', justifyContent: 'space-between' } },
        React.createElement(View, { style: { flex: 1 } },
          React.createElement(Text, {
            style: getTextStyle(content.personalInfo.formatting?.name, { ...styles.name, fontSize: 28 })
          }, content.personalInfo.name),
          React.createElement(Text, {
            style: getTextStyle(content.personalInfo.formatting?.email, { ...styles.contactInfo, fontSize: 12 })
          }, content.personalInfo.email),
          React.createElement(Text, {
            style: getTextStyle(content.personalInfo.formatting?.phone, { ...styles.contactInfo, fontSize: 12 })
          }, content.personalInfo.phone),
          React.createElement(Text, {
            style: getTextStyle(content.personalInfo.formatting?.location, { ...styles.contactInfo, fontSize: 12 })
          }, content.personalInfo.location)
        )
      ),

      // Two column layout
      React.createElement(View, { style: { flexDirection: 'row', marginTop: 20 } },
        // Main content column
        React.createElement(View, { style: { flex: 1, marginRight: 20 } },
          // Summary
          content.summary && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, "Professional Summary"),
            React.createElement(Text, {
              style: getTextStyle(content.summaryFormatting, styles.summary)
            }, content.summary)
          ),

          // Experience
          content.experience.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, "Work Experience"),
            ...content.experience.map((exp, index) =>
              React.createElement(View, { key: index, style: { marginBottom: 16 } },
                React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 } },
                  React.createElement(Text, {
                    style: getTextStyle(exp.formatting?.title, { ...styles.jobTitle, fontSize: 16 })
                  }, exp.title),
                  React.createElement(Text, {
                    style: getTextStyle(exp.formatting?.duration, { ...styles.duration, fontSize: 12 })
                  }, exp.duration)
                ),
                React.createElement(Text, {
                  style: getTextStyle(exp.formatting?.company, { ...styles.company, fontSize: 14, marginBottom: 8 })
                }, exp.company),
                React.createElement(Text, {
                  style: getTextStyle(exp.formatting?.description, styles.description)
                }, exp.description)
              )
            )
          ),

          // Education
          content.education.length > 0 && React.createElement(View, { style: styles.section },
            React.createElement(Text, { style: styles.sectionTitle }, "Education"),
            ...content.education.map((edu, index) =>
              React.createElement(View, { key: index, style: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 } },
                React.createElement(View, { style: { flex: 1 } },
                  React.createElement(Text, {
                    style: getTextStyle(edu.formatting?.degree, { ...styles.degree, fontSize: 14 })
                  }, edu.degree),
                  React.createElement(Text, {
                    style: getTextStyle(edu.formatting?.institution, { ...styles.institution, fontSize: 12 })
                  }, edu.institution)
                ),
                React.createElement(Text, {
                  style: getTextStyle(edu.formatting?.year, { ...styles.year, fontSize: 12 })
                }, edu.year)
              )
            )
          )
        ),

        // Sidebar column
        React.createElement(View, { style: { width: 120, backgroundColor: '#f8f9fa', padding: 16 } },
          // Skills
          content.skills.length > 0 && React.createElement(View, { style: { marginBottom: 20 } },
            React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 16, marginBottom: 8 } }, "Skills"),
            ...content.skills.map((skill, index) =>
              React.createElement(Text, {
                key: index,
                style: {
                  fontSize: 10,
                  color: '#374151',
                  marginBottom: 4,
                  backgroundColor: '#ffffff',
                  padding: 4,
                  borderRadius: 4
                }
              }, skill)
            )
          ),

          // Certifications
          content.certifications.length > 0 && React.createElement(View, {},
            React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 16, marginBottom: 8 } }, "Certifications"),
            ...content.certifications.map((cert, index) =>
              React.createElement(Text, {
                key: index,
                style: {
                  fontSize: 10,
                  color: '#374151',
                  marginBottom: 4,
                  backgroundColor: '#ffffff',
                  padding: 4,
                  borderRadius: 4
                }
              }, cert)
            )
          )
        )
      )
    )
  )
}

// Template 3 - Minimalist style
const PDFTemplate3 = ({ content }: { content: ResumeContent }) => {
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: { ...styles.page, textAlign: 'center' } },
      // Centered header
      React.createElement(View, { style: { marginBottom: 30 } },
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.name, { ...styles.name, fontSize: 36, textAlign: 'center' })
        }, content.personalInfo.name),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.email, { ...styles.contactInfo, fontSize: 12, textAlign: 'center' })
        }, content.personalInfo.email),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.phone, { ...styles.contactInfo, fontSize: 12, textAlign: 'center' })
        }, content.personalInfo.phone),
        React.createElement(Text, {
          style: getTextStyle(content.personalInfo.formatting?.location, { ...styles.contactInfo, fontSize: 12, textAlign: 'center' })
        }, content.personalInfo.location)
      ),

      // Summary
      content.summary && React.createElement(View, { style: { marginBottom: 30 } },
        React.createElement(Text, {
          style: getTextStyle(content.summaryFormatting, { ...styles.summary, fontSize: 16, textAlign: 'center' })
        }, content.summary)
      ),

      // Experience
      content.experience.length > 0 && React.createElement(View, { style: { marginBottom: 30 } },
        React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 24, textAlign: 'center', marginBottom: 20 } }, "Experience"),
        ...content.experience.map((exp, index) =>
          React.createElement(View, { key: index, style: { marginBottom: 20, textAlign: 'center' } },
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.title, { ...styles.jobTitle, fontSize: 18, textAlign: 'center' })
            }, exp.title),
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.company, { ...styles.company, fontSize: 16, textAlign: 'center' })
            }, exp.company),
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.duration, { ...styles.duration, fontSize: 12, textAlign: 'center' })
            }, exp.duration),
            React.createElement(Text, {
              style: getTextStyle(exp.formatting?.description, { ...styles.description, fontSize: 14, textAlign: 'center' })
            }, exp.description)
          )
        )
      ),

      // Education
      content.education.length > 0 && React.createElement(View, { style: { marginBottom: 30 } },
        React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 24, textAlign: 'center', marginBottom: 20 } }, "Education"),
        ...content.education.map((edu, index) =>
          React.createElement(View, { key: index, style: { marginBottom: 16, textAlign: 'center' } },
            React.createElement(Text, {
              style: getTextStyle(edu.formatting?.degree, { ...styles.degree, fontSize: 16, textAlign: 'center' })
            }, edu.degree),
            React.createElement(Text, {
              style: getTextStyle(edu.formatting?.institution, { ...styles.institution, fontSize: 14, textAlign: 'center' })
            }, edu.institution),
            React.createElement(Text, {
              style: getTextStyle(edu.formatting?.year, { ...styles.year, fontSize: 12, textAlign: 'center' })
            }, edu.year)
          )
        )
      ),

      // Skills
      content.skills.length > 0 && React.createElement(View, { style: { marginBottom: 30 } },
        React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 24, textAlign: 'center', marginBottom: 20 } }, "Skills"),
        React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 } },
          ...content.skills.map((skill, index) =>
            React.createElement(Text, {
              key: index,
              style: {
                fontSize: 12,
                color: '#374151',
                border: '1px solid #d1d5db',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12
              }
            }, skill)
          )
        )
      ),

      // Certifications
      content.certifications.length > 0 && React.createElement(View, {},
        React.createElement(Text, { style: { ...styles.sectionTitle, fontSize: 24, textAlign: 'center', marginBottom: 20 } }, "Certifications"),
        ...content.certifications.map((cert, index) =>
          React.createElement(Text, {
            key: index,
            style: {
              fontSize: 14,
              color: '#374151',
              textAlign: 'center',
              marginBottom: 8
            }
          }, cert)
        )
      )
    )
  )
}

// Template mapping
const pdfTemplates = {
  template1: PDFTemplate1,
  template2: PDFTemplate2,
  template3: PDFTemplate3
}

export async function downloadResumeAsPDF(content: ResumeContent, name: string, template: string = 'template1') {
  try {
        // Get the appropriate PDF template
    const PDFTemplate = pdfTemplates[template as keyof typeof pdfTemplates] || pdfTemplates.template1

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

export async function renderResumePDFBuffer(content: ResumeContent, template: string = 'template1') {
  const PDFTemplate = pdfTemplates[template as keyof typeof pdfTemplates] || pdfTemplates.template1;
  return await renderToBuffer(PDFTemplate({ content }));
}

// Legacy function for backward compatibility (keeping the same signature)
export async function exportToPDF() {
  // This function is kept for backward compatibility but is deprecated
  console.warn('exportToPDF is deprecated. Use downloadResumeAsPDF with content instead.')
  throw new Error('exportToPDF is deprecated. Use downloadResumeAsPDF with content instead.')
}