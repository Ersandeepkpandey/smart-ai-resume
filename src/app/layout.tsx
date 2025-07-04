import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
