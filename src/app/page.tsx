"use client";
import Link from 'next/link'
import Image from 'next/image'
import { Check, Star, Download, Eye, Zap, Download as DownloadIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm w-full border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Rezume</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-green-600">FREE</span> Resume Builder
            <span className="text-blue-600"> That Gets You Hired</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build ATS-friendly resumes with our <span className="font-semibold text-green-600">free professional templates</span>. Get real-time feedback
            and optimize your chances of landing your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/resume/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg"
            >
              Create Your Resume - It&apos;s Free!
            </Link>
            <Link
              href="/templates"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Template Showcase Section */}
      <div className="py-16 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Resume Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of expertly designed, ATS-friendly templates that help you stand out
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Template 1 */}
            <div className="relative group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="relative">
                  <Image
                    src="/resume1.png"
                    alt="Professional Resume Template 1"
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover rounded-t-xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Classic</h3>
                  <p className="text-gray-600 mb-4">
                    Clean and traditional design perfect for corporate environments. Features a professional layout with clear sections and optimal readability.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">ATS-Friendly</span>
                    </div>
                    <Link
                      href="/resume/new?template=template1"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Template 2 */}
            <div className="relative group">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <div className="relative">
                  <Image
                    src="/resume2.png"
                    alt="Professional Resume Template 2"
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover rounded-t-xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Modern Sidebar</h3>
                  <p className="text-gray-600 mb-4">
                    Contemporary layout with sidebar design, perfect for tech professionals. Features a modern aesthetic with enhanced visual hierarchy.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">ATS-Friendly</span>
                    </div>
                    <Link
                      href="/resume/new?template=template2"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                      Use Template
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/templates"
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              View All Templates
              <Eye className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create the Perfect Resume
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tools designed to help you stand out in today&apos;s competitive job market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Professional Templates</h3>
              <p className="text-gray-600">
                Choose from multiple <span className="font-semibold text-green-600">free ATS-friendly templates</span> designed by professionals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Score Detector</h3>
              <p className="text-gray-600">
                Get instant feedback on how well your resume will perform with Applicant Tracking Systems.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Export</h3>
              <p className="text-gray-600">
                Download your resume as a professional PDF file ready for job applications.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Preview</h3>
              <p className="text-gray-600">
                See your changes instantly as you build your resume with our live preview feature.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Customization</h3>
              <p className="text-gray-600">
                Customize colors, fonts, and layouts to match your personal brand and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">
                Create and edit your resume on any device with our responsive design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Create Your Professional Resume?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of job seekers who have successfully landed their dream jobs</p>
          <Link
            href="/resume/new"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Start Building Now - Free!
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Rezume</h3>
              <p className="text-gray-400">
                Create professional, ATS-friendly resumes that help you stand out and get hired.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                <li><Link href="/ats-score" className="hover:text-white transition-colors">ATS Score</Link></li>

              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rezume. All rights reserved. | <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
