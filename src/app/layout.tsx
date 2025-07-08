import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rezume - Free Resume Builder & Maker | Create Professional ATS-Friendly Resumes",
  description: "Free resume builder and maker with professional ATS-friendly templates. Create, edit, and download your resume for free. Get hired with our free resume builder tool.",
  keywords: "free resume builder, free resume maker, resume builder free, resume maker free, ATS friendly resume, professional resume builder, online resume builder, resume templates, job application, career, CV builder, resume creator, free CV maker, resume generator, professional resume templates, modern resume builder, best resume builder, free resume templates, resume writing tool, job search, employment, hiring, recruitment, applicant tracking system, ATS optimization, resume scoring, PDF resume, downloadable resume, mobile resume builder, responsive resume design",
  authors: [{ name: "Rezume" }],
  creator: "Rezume",
  publisher: "Rezume",
  robots: "index, follow",
  openGraph: {
    title: "Rezume - Free Resume Builder & Maker | Create Professional ATS-Friendly Resumes",
    description: "Free resume builder and maker with professional ATS-friendly templates. Create, edit, and download your resume for free. Get hired with our free resume builder tool.",
    type: "website",
    url: "https://rezume.com",
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
    canonical: "https://rezume.com",
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
      <body className={inter.className + " min-h-screen flex flex-col bg-white text-gray-900"}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
