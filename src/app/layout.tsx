import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rezume - Create Professional ATS-Friendly Resumes",
  description: "Build professional resumes with Rezume's ATS-friendly templates. Get real-time feedback and optimize your chances of landing your dream job.",
  keywords: "resume builder, ATS friendly, professional resume, job application, career",
  authors: [{ name: "Rezume" }],
  openGraph: {
    title: "Rezume - Create Professional ATS-Friendly Resumes",
    description: "Build professional resumes with Rezume's ATS-friendly templates. Get real-time feedback and optimize your chances of landing your dream job.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
      <body className={inter.className + " min-h-screen flex flex-col"}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
