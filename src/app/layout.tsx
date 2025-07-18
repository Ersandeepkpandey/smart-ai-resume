import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  metadataBase: new URL('https://rezume.in'),
  title: "Rezume - Free Resume Builder & Maker | Create Professional ATS-Friendly Resumes",
  description: "Free resume builder and maker with professional ATS-friendly templates. Create, edit, and download your resume for free. Get hired with our free resume builder tool.",
  keywords: "free resume builder, free resume maker, resume builder free, resume maker free, ATS friendly resume, professional resume builder, online resume builder, resume templates, job application, career, CV builder, resume creator, free CV maker, resume generator, professional resume templates, modern resume builder, best resume builder, free resume templates, resume writing tool, job search, employment, hiring, recruitment, applicant tracking system, ATS optimization, resume scoring, PDF resume, downloadable resume, mobile resume builder, responsive resume design, AI resume builder, resume tips, cover letter builder, job interview tips, professional CV, resume examples, resume writing service, job board, career advice, job portal, resume feedback, resume review, job matching, job alerts, job seeker tools, resume analytics, resume checker, resume parser, resume upload, resume download, resume export, resume customization, resume personalization, resume design, resume formatting, resume headline, resume summary, resume objective, resume skills, resume experience, resume education, resume certifications, resume awards, resume projects, resume languages, resume hobbies, resume references, resume contact info, resume profile, resume builder India, job search India, career India, ATS resume India, free resume India, resume builder online India, resume builder 2024, latest resume templates, modern CV, professional CV India, job application India, job search 2024, career growth, job opportunities, employment India, job market India, job portal India, job board India, resume optimization India, resume review India, resume feedback India, resume writing India, resume tips India, resume advice India, resume help India, resume support India, resume builder support, resume builder help, resume builder FAQ, resume builder guide, resume builder tutorial, resume builder walkthrough, resume builder walkthrough India, resume builder tutorial India, resume builder guide India, resume builder FAQ India, resume builder support India, resume builder help India, resume builder customer support, resume builder customer service, resume builder contact, resume builder contact India, resume builder contact support, resume builder contact help, resume builder contact FAQ, resume builder contact guide, resume builder contact tutorial, resume builder contact walkthrough, resume builder contact walkthrough India, resume builder contact tutorial India, resume builder contact guide India, resume builder contact FAQ India, resume builder contact support India, resume builder contact help India, resume builder customer support India, resume builder customer service India, resume builder customer care, resume builder customer care India, resume builder customer care support, resume builder customer care help, resume builder customer care FAQ, resume builder customer care guide, resume builder customer care tutorial, resume builder customer care walkthrough, resume builder customer care walkthrough India, resume builder customer care tutorial India, resume builder customer care guide India, resume builder customer care FAQ India, resume builder customer care support India, resume builder customer care help India, resume builder India 2024, resume builder India latest, resume builder India modern, resume builder India professional, resume builder India free, resume builder India online, resume builder India download, resume builder India export, resume builder India customization, resume builder India personalization, resume builder India design, resume builder India formatting, resume builder India headline, resume builder India summary, resume builder India objective, resume builder India skills, resume builder India experience, resume builder India education, resume builder India certifications, resume builder India awards, resume builder India projects, resume builder India languages, resume builder India hobbies, resume builder India references, resume builder India contact info, resume builder India profile, resume builder India support, resume builder India help, resume builder India FAQ, resume builder India guide, resume builder India tutorial, resume builder India walkthrough, resume builder India customer support, resume builder India customer service, resume builder India customer care, resume builder India contact, resume builder India contact support, resume builder India contact help, resume builder India contact FAQ, resume builder India contact guide, resume builder India contact tutorial, resume builder India contact walkthrough, resume builder India contact walkthrough India, resume builder India contact tutorial India, resume builder India contact guide India, resume builder India contact FAQ India, resume builder India contact support India, resume builder India contact help India, resume builder India customer support India, resume builder India customer service India, resume builder India customer care India, resume builder India customer care support, resume builder India customer care help, resume builder India customer care FAQ, resume builder India customer care guide, resume builder India customer care tutorial, resume builder India customer care walkthrough, resume builder India customer care walkthrough India, resume builder India customer care tutorial India, resume builder India customer care guide India, resume builder India customer care FAQ India, resume builder India customer care support India, resume builder India customer care help India",
  authors: [{ name: "Rezume" }],
  creator: "Rezume",
  publisher: "Rezume",
  robots: "index, follow",
  icons: {
    icon: '/icon',
    shortcut: '/logo.png',
    apple: '/apple-icon',
  },
  openGraph: {
    title: "Rezume - Free Resume Builder & Maker | Create Professional ATS-Friendly Resumes",
    description: "Free resume builder and maker with professional ATS-friendly templates. Create, edit, and download your resume for free. Get hired with our free resume builder tool.",
    type: "website",
    url: "https://rezume.in",
    siteName: "Rezume",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rezume - Free Resume Builder & Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rezume - Free Resume Builder & Maker | Create Professional ATS-Friendly Resumes",
    description: "Free resume builder and maker with professional ATS-friendly templates. Create, edit, and download your resume for free.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://rezume.in",
  },
  category: "Career & Employment",
  classification: "Resume Builder Tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7VQFLZ7QVG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7VQFLZ7QVG');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
