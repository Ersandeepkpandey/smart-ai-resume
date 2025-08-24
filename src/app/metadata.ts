import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAANG Resume Templates | Google-Ready & Amazon-Optimized | Free Resume Builder - Rezume',
  description: 'Create FAANG-ready resume templates optimized for Google, Amazon, Meta, Apple, Netflix, Microsoft. ATS-friendly resume builder with templates specifically designed for Big Tech companies. Used by successful Google L3-L8 engineers, Amazon SDEs, Meta PMs. 100% free, no signup required.',
  keywords: 'FAANG resume template, Google resume template, Amazon resume template, Meta resume template, Apple resume template, Netflix resume template, Microsoft resume template, Big Tech resume, ATS-optimized resume, software engineer resume, Google L4 resume, Amazon SDE resume, tech resume template, FAANG CV template, Silicon Valley resume, Google engineers resume, Facebook resume template, tech company resume, ATS-friendly resume, free resume builder, online resume maker',
  openGraph: {
    title: 'FAANG-Ready Resume Templates | Google, Amazon, Meta Optimized - Rezume',
    description: 'Build ATS-optimized resumes for FAANG companies. Templates used by successful Google, Amazon, Meta, Apple engineers. 100% free resume builder.',
    url: 'https://rezume.com',
    siteName: 'Rezume - FAANG Resume Builder',
    images: [
      {
        url: '/og-faang-resume.png',
        width: 1200,
        height: 630,
        alt: 'FAANG Resume Templates - Google, Amazon, Meta Ready',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAANG Resume Templates | Google & Amazon Ready',
    description: 'Create ATS-optimized resumes for Google, Amazon, Meta, Apple. Free resume builder with Big Tech templates.',
    images: ['/twitter-faang-resume.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rezume.com',
  },
  category: 'Resume Builder',
  applicationName: 'Rezume - FAANG Resume Builder',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  authors: [{ name: 'Rezume Team' }],
  creator: 'Rezume',
  publisher: 'Rezume',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};