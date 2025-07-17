import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'
import { renderResumePDFBuffer } from '@/lib/pdf-export'
import { Buffer } from 'buffer'
import { ResumeContent } from '@/lib/ats-scorer'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const sessionId = await getSessionIdFromCookie()
    if (!sessionId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const user = await verifyUserSession(sessionId)
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const resumeId = id
    const result = await client.execute({
      sql: 'SELECT id, title, template_id, content FROM resumes WHERE id = ? AND user_id = ?',
      args: [resumeId, user.userId]
    })
    if (result.rows.length === 0) {
      return new NextResponse('Resume not found', { status: 404 })
    }
    const resume = result.rows[0]
    let content = resume.content
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content)
      } catch {}
    }
    if (content instanceof ArrayBuffer) {
      return new NextResponse('Invalid resume content', { status: 400 })
    }
    // Defensive: fill missing fields with defaults
    const c: Partial<ResumeContent> = content && typeof content === 'object' ? content : {};
    const safeContent = {
      personalInfo: c.personalInfo || {},
      summary: typeof c.summary === 'string' ? c.summary : '',
      experience: Array.isArray(c.experience) ? c.experience : [],
      education: Array.isArray(c.education) ? c.education : [],
      skills: Array.isArray(c.skills) ? c.skills : [],
      certifications: Array.isArray(c.certifications) ? c.certifications : [],
      sectionHeadings: c.sectionHeadings || {},
      summaryFormatting: c.summaryFormatting || {},
      otherQualities: Array.isArray(c.otherQualities) ? c.otherQualities : [],
      customSections: Array.isArray(c.customSections) ? c.customSections : [],
      showSocialLinksInPDF: c.showSocialLinksInPDF !== false,
    };
    // Use only @react-pdf/renderer for PDF generation
    const template = typeof resume.template_id === 'string' && resume.template_id ? resume.template_id : 'template1';
    const pdfArrayBuffer = await renderResumePDFBuffer(safeContent as ResumeContent, template);
    const pdfBuffer = Buffer.from(pdfArrayBuffer)
    let filename = 'resume.pdf';
    if (resume.title && typeof resume.title === 'string' && resume.title.trim()) {
      filename = resume.title.replace(/[^a-zA-Z0-9-_]/g, '_') + '.pdf';
    }
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}