import { NextRequest, NextResponse } from 'next/server';
import { ResumeContent } from '@/lib/ats-scorer';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
  try {
    const { content, template } = await req.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      );
    }

    // Generate HTML content from resume data
    const html = generateResumeHTML(content, template);
    
    // Launch puppeteer browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    await browser.close();

    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${content.personalInfo?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'resume'}.pdf"`
      }
    });

    return response;
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function generateResumeHTML(content: ResumeContent, template?: string): string {
  // Use Template1 as default
  return generateTemplate1HTML(content);
}

function generateTemplate1HTML(content: ResumeContent): string {
  // Defensive: ensure formatting objects exist (same as Template1)
  const personalInfo = {
    ...content.personalInfo,
    formatting: content.personalInfo.formatting || {}
  };
  const summaryFormatting = content.summaryFormatting || {};
  const experience = (content.experience || []).map(exp => ({
    ...exp,
    formatting: exp.formatting || {}
  }));
  const education = (content.education || []).map(edu => ({
    ...edu,
    formatting: edu.formatting || {}
  }));

  // Social media platforms (same as Template1)
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
  ];

  const renderContentWithLinks = (text: string) => {
    if (!text) return '';
    // Simple link rendering - convert URLs to clickable links
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #2563eb;">$1</a>');
  };

  const getStyleString = (formatting: any, defaults: any = {}) => {
    const styles: string[] = [];
    if (formatting?.fontSize) styles.push(`font-size: ${formatting.fontSize}`);
    if (formatting?.fontFamily) styles.push(`font-family: ${formatting.fontFamily}`);
    if (formatting?.color) styles.push(`color: ${formatting.color}`);
    if (formatting?.alignment) styles.push(`text-align: ${formatting.alignment}`);
    if (formatting?.bold) styles.push('font-weight: bold');
    if (formatting?.italic) styles.push('font-style: italic');
    if (formatting?.underline) styles.push('text-decoration: underline');
    
    // Add defaults
    Object.entries(defaults).forEach(([key, value]) => {
      if (!styles.some(style => style.startsWith(key))) {
        styles.push(`${key}: ${value}`);
      }
    });
    
    return styles.join('; ');
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${personalInfo.name} Resume</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Georgia, serif;
          line-height: 1.6;
          color: #1f2937;
          background-color: white;
        }
        
        .container {
          background-color: white;
          color: #1f2937;
          padding: 32px;
          max-width: 896px;
          margin: 0 auto;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          font-family: Georgia, serif;
        }
        
        .header {
          border-bottom: 4px solid #2563eb;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        
        .name {
          font-size: 2.25rem;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 8px;
        }
        
        .contact-info {
          font-size: 1.125rem;
          color: #4b5563;
          margin-bottom: 4px;
        }
        
        .social-links {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #d1d5db;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .social-link {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background-color: #eff6ff;
          color: #1d4ed8;
          border-radius: 9999px;
          font-size: 0.875rem;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .social-link:hover {
          background-color: #dbeafe;
        }
        
        .section {
          margin-bottom: 32px;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 16px;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 8px;
        }
        
        .summary {
          color: #374151;
          line-height: 1.7;
        }
        
        .experience-item {
          margin-bottom: 16px;
          border-left: 4px solid #c7d2fe;
          padding-left: 16px;
        }
        
        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .company {
          font-size: 1.125rem;
          color: #2563eb;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .duration {
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 8px;
          font-size: 0.875rem;
        }
        
        .description {
          color: #374151;
          line-height: 1.7;
        }
        
        .education-item {
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .education-left {
          flex: 1;
        }
        
        .degree {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .institution {
          color: #4b5563;
        }
        
        .year {
          color: #6b7280;
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-item {
          background-color: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .certifications-list {
          list-style-type: disc;
          list-style-position: inside;
        }
        
        .certifications-list li {
          color: #374151;
          margin-bottom: 8px;
        }
        
        .custom-section {
          margin-top: 24px;
        }
        
        .custom-section-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 12px;
          border-bottom: 2px solid #d1d5db;
          padding-bottom: 4px;
        }
        
        .custom-section-content {
          color: #1f2937;
          line-height: 1.7;
          white-space: pre-line;
        }
        
        .other-qualities-list {
          list-style-type: disc;
          list-style-position: inside;
        }
        
        .other-qualities-list li {
          color: #374151;
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 class="name" style="${getStyleString(personalInfo.formatting?.name, {
            'font-size': '2.25rem',
            'font-family': 'Georgia, serif',
            'color': '#2563eb',
            'font-weight': 'bold'
          })}">${personalInfo.name}</h1>
          <div class="contact-info">
            <p style="${getStyleString(personalInfo.formatting?.email, {
              'font-size': '1.125rem',
              'font-family': 'Georgia, serif',
              'color': '#4b5563'
            })}">${personalInfo.email}</p>
            <p style="${getStyleString(personalInfo.formatting?.phone, {
              'font-size': '1.125rem',
              'font-family': 'Georgia, serif',
              'color': '#4b5563'
            })}">${personalInfo.phone}</p>
            <p style="${getStyleString(personalInfo.formatting?.location, {
              'font-size': '1.125rem',
              'font-family': 'Georgia, serif',
              'color': '#4b5563'
            })}">${personalInfo.location}</p>
          </div>

          ${personalInfo.socialLinks && personalInfo.socialLinks.length > 0 ? `
            <div class="social-links">
              ${personalInfo.socialLinks.map(link => {
                const platform = socialPlatforms.find(p => p.value === link.platform);
                const displayText = link.label || platform?.label || link.platform;
                return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link">${displayText}</a>`;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Summary -->
        ${content.summary ? `
          <div class="section">
            <h2 class="section-title">${content.sectionHeadings?.summary || 'Professional Summary'}</h2>
            <p class="summary" style="${getStyleString(summaryFormatting, {
              'color': '#374151',
              'line-height': '1.7'
            })}">${renderContentWithLinks(content.summary)}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience.length > 0 ? `
          <div class="section">
            <h2 class="section-title">${content.sectionHeadings?.experience || 'Work Experience'}</h2>
            ${experience.map(exp => `
              <div class="experience-item">
                <h3 class="job-title" style="${getStyleString(exp.formatting?.title, {
                  'font-size': '1.25rem',
                  'font-family': 'Georgia, serif',
                  'color': '#1f2937',
                  'font-weight': '600'
                })}">${exp.title}</h3>
                <p class="company" style="${getStyleString(exp.formatting?.company, {
                  'font-size': '1.125rem',
                  'font-family': 'Georgia, serif',
                  'color': '#2563eb',
                  'font-weight': '500'
                })}">${renderContentWithLinks(exp.company)}</p>
                <span class="duration" style="${getStyleString(exp.formatting?.duration, {
                  'font-size': '0.875rem',
                  'font-family': 'Georgia, serif',
                  'color': '#6b7280',
                  'font-weight': '500'
                })}">${exp.duration}</span>
                <p class="description" style="${getStyleString(exp.formatting?.description, {
                  'font-family': 'Georgia, serif',
                  'color': '#374151',
                  'line-height': '1.7'
                })}">${renderContentWithLinks(exp.description)}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education.length > 0 ? `
          <div class="section">
            <h2 class="section-title">${content.sectionHeadings?.education || 'Education'}</h2>
            ${education.map(edu => `
              <div class="education-item">
                <div class="education-left">
                  <h3 class="degree" style="${getStyleString(edu.formatting?.degree, {
                    'font-size': '1.125rem',
                    'color': '#1f2937',
                    'font-weight': '600'
                  })}">${edu.degree}</h3>
                  <p class="institution" style="${getStyleString(edu.formatting?.institution, {
                    'color': '#4b5563'
                  })}">${edu.institution}</p>
                </div>
                <span class="year" style="${getStyleString(edu.formatting?.year, {
                  'font-size': '0.875rem',
                  'color': '#6b7280',
                  'font-weight': '500'
                })}">${edu.year}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${content.skills && content.skills.length > 0 ? `
          <div class="section">
            <h2 class="section-title">${content.sectionHeadings?.skills || 'Skills'}</h2>
            <div class="skills-container">
              ${content.skills.map(skill => `
                <span class="skill-item">${skill}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Certifications -->
        ${content.certifications && content.certifications.length > 0 ? `
          <div class="section">
            <h2 class="section-title">${content.sectionHeadings?.certifications || 'Certifications'}</h2>
            <ul class="certifications-list">
              ${content.certifications.map(cert => `<li>${cert}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Other Qualities -->
        ${content.otherQualities && content.otherQualities.length > 0 ? `
          <div class="custom-section">
            <h2 class="custom-section-title">Other Qualities</h2>
            <ul class="other-qualities-list">
              ${content.otherQualities.map(quality => `<li>${quality}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Custom Sections -->
        ${content.customSections && content.customSections.length > 0 ? content.customSections.map(section => `
          <div class="custom-section">
            <h2 class="custom-section-title">${section.heading}</h2>
            <div class="custom-section-content">${renderContentWithLinks(section.content)}</div>
          </div>
        `).join('') : ''}
      </div>
    </body>
    </html>
  `;
}