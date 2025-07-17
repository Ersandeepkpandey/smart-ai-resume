import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/turso'
import { getSessionIdFromCookie } from '@/lib/session'
import { verifyUserSession } from '@/lib/auth'
import { renderResumePDFBuffer } from '@/lib/pdf-export'
import { Buffer } from 'buffer'
import { ResumeContent } from '@/lib/ats-scorer'
import puppeteer from 'puppeteer';

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
    const c = content as Partial<ResumeContent>
    if (!c || typeof c !== 'object' ||
      !c.personalInfo || !c.summary || !Array.isArray(c.experience) || !Array.isArray(c.education) || !Array.isArray(c.skills) || !Array.isArray(c.certifications)) {
      return new NextResponse('Invalid resume content', { status: 400 })
    }
    // Puppeteer PDF export
    try {
      // Get template from query param if present
      const { searchParams } = new URL(request.url);
      const templateParam = searchParams.get('template');
      const templateQuery = templateParam ? `&template=${encodeURIComponent(templateParam)}` : '';
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      // Construct the preview URL (adjust if your domain/port is different)
      const previewUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/resume/${resumeId}/preview?pdf=1${templateQuery}`;
      await page.goto(previewUrl, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      });
      await browser.close();
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
    } catch (puppeteerError) {
      console.error('Puppeteer PDF generation failed, falling back:', puppeteerError);
      // Fallback to existing PDF logic
      const template = typeof resume.template_id === 'string' && resume.template_id ? resume.template_id : 'template1';
      const pdfArrayBuffer = await renderResumePDFBuffer(c as ResumeContent, template);
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
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Failed to generate PDF', { status: 500 })
  }
}