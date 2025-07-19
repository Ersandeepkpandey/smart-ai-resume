import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

function extractKeywords(jobDescription: string): string[] {
  // Simple keyword extraction: split by words, filter out short/common words
  return (
    jobDescription
      .toLowerCase()
      .match(/\b\w{4,}\b/g) // words with 4+ chars
      ?.slice(0, 20) || []
  );
}

function calculateATSScore(resumeText: string, keywords: string[]): { score: number; feedback: string[] } {
  let score = 0;
  const feedback: string[] = [];

  // Keyword match (50%)
  const foundKeywords = keywords.filter((kw) => resumeText.toLowerCase().includes(kw));
  const keywordScore = (foundKeywords.length / (keywords.length || 1)) * 50;
  score += keywordScore;
  feedback.push(`Matched keywords: ${foundKeywords.join(', ') || 'None'}`);

  // Section presence (20%)
  const sections = ['contact', 'experience', 'education', 'skills'];
  let foundSections = 0;
  sections.forEach((section) => {
    if (resumeText.toLowerCase().includes(section)) foundSections++;
    else feedback.push(`Missing section: ${section.charAt(0).toUpperCase() + section.slice(1)}`);
  });
  score += (foundSections / sections.length) * 20;

  // Formatting (15%)
  if (resumeText.includes('table')) {
    score -= 10;
    feedback.push('Avoid using tables for better ATS compatibility.');
  } else {
    score += 10;
  }

  // Length (15%)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    score -= 5;
    feedback.push('Resume is too short.');
  } else if (wordCount > 1200) {
    score -= 5;
    feedback.push('Resume is too long.');
  } else {
    score += 10;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, feedback };
}

async function extractTextFromFile(file: FormidableFile): Promise<string> {
  const buffer = await fs.readFile(file.filepath);
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error('Unsupported file type');
}

export async function POST(req: NextRequest) {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise<Response>(resolve => {
    form.parse(req as unknown as NodeJS.ReadableStream, async (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error('Formidable error:', err);
        resolve(NextResponse.json({ error: 'Error parsing form data' }, { status: 400 }));
        return;
      }
      const file = files.resume as FormidableFile;
      const jobDescription = (fields.jobDescription as string) || '';
      if (!file) {
        console.error('No file uploaded');
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }
      try {
        console.log('Processing file:', file.originalFilename, file.mimetype);
        const resumeText = await extractTextFromFile(file);
        console.log('Extracted resume text length:', resumeText.length);
        const keywords = extractKeywords(jobDescription);
        console.log('Extracted keywords:', keywords);
        const { score, feedback } = calculateATSScore(resumeText, keywords);
        console.log('ATS score:', score, 'Feedback:', feedback);
        resolve(NextResponse.json({ score, feedback }));
      } catch (e: unknown) {
        console.error('Processing error:', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
        resolve(NextResponse.json({ error: errorMessage }, { status: 500 }));
      }
    });
  });
}