"use client";
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import CreateResumeModal from '@/components/CreateResumeModal'
import PDFVedaBanner from '@/components/PDFVedaBanner'

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  function getInitials(nameOrEmail: string) {
    if (!nameOrEmail) return '?';
    const parts = nameOrEmail.split(/\s|@/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Rezume - FAANG Resume Builder",
            "description": "Create FAANG-ready resume templates optimized for Google, Amazon, Meta, Apple, Netflix, Microsoft. ATS-friendly resume builder with templates specifically designed for Big Tech companies.",
            "url": "https://rezume.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free FAANG resume builder"
            },
            "keywords": "FAANG resume template, Google resume template, Amazon resume template, Meta resume template, Apple resume template, Netflix resume template, Microsoft resume template, Big Tech resume, ATS-optimized resume, software engineer resume",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "2500"
            },
            "author": {
              "@type": "Organization",
              "name": "Rezume Team"
            }
          })
        }}
      />
      
      <div className="pointer-events-none select-none fixed inset-0 z-0">
        <svg width="100%" height="100%" className="w-full h-full" style={{position:'absolute',top:0,left:0}}>
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#dbeafe" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rezume" width={32} height={32} className="rounded" />
            <span className="text-xl font-bold text-blue-700 tracking-tight">Rezume</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition-colors"
            >
              Create Resume
            </button>
            {!loading && !user && (
              <Link href="/auth/signin" className="text-blue-700 font-semibold hover:underline px-3 py-2 rounded transition-colors text-sm">Sign In</Link>
            )}
            {!loading && user && (
              <div className="relative" ref={avatarRef}>
                <button
                  className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow border-2 border-blue-200 focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-label="Open profile menu"
                >
                  {getInitials(user.fullName || user.email)}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200 animate-fade-in">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        try {
                          await signOut();
                        } catch (error) {
                          console.error('Sign out error in landing page:', error);
                        }
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center relative overflow-x-clip">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <svg width="100%" height="420" viewBox="0 0 1200 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[420px]">
            <ellipse cx="600" cy="210" rx="600" ry="180" fill="url(#heroGradient)" fillOpacity="0.18" />
            <defs>
              <linearGradient id="heroGradient" x1="0" y1="0" x2="1200" y2="420" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <section className="w-full flex flex-col-reverse md:flex-row items-center justify-between mb-20 gap-12 md:gap-0 relative min-h-[60vh] md:min-h-[80vh] z-10">
          <svg className="absolute -top-24 -left-32 w-72 h-72 opacity-30 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#3b82f6" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              <span className="">Create <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">FAANG-Ready</span> & <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Google-Approved</span></span> <br className="hidden md:block" />Resume Templates in Minutes - Free Resume Builder
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Build standout, <span className="font-semibold text-blue-700">ATS-optimized resumes for Google, Amazon, Meta, Apple, Microsoft</span> and top tech companies. Our <span className="font-semibold">FAANG-ready resume templates</span> are designed by ex-recruiters from Big Tech. Perfect for software engineers, product managers, data scientists, and all tech professionals.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors"
            >
              Get Started
            </button>
            
            <div className="flex flex-wrap gap-4 mt-8 items-center justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm font-medium border border-gray-100">
                <span className="text-green-500 text-lg">★</span> FAANG-Ready Templates
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm font-medium border border-gray-100">
                <span className="text-blue-500 text-lg">✓</span> Google ATS-Optimized
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm font-medium border border-gray-100">
                <span className="text-purple-500 text-lg">◆</span> Big Tech Approved
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative min-h-[220px] md:min-h-[48vh] lg:min-h-[56vh] xl:min-h-[64vh]">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[220px] h-[220px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-transparent blur-2xl opacity-60 z-0 animate-pulse-slow" />
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-12px); }
              }
              .animate-float { animation: float 4s ease-in-out infinite; }
              .animate-float-delay { animation: float 4s ease-in-out infinite; animation-delay: 2s; }
              .hover-tilt:hover { transform: scale(1.04) rotate(2deg); box-shadow: 0 8px 32px 0 rgba(59,130,246,0.18); }
            `}</style>
            <div className="relative w-[160px] h-[220px] md:w-[340px] md:h-[440px] lg:w-[400px] lg:h-[520px] xl:w-[480px] xl:h-[640px]">
              <Image
                src="/resume1.png"
                alt="Resume Template 1"
                width={320}
                height={440}
                className="absolute top-12 left-4 w-[80px] h-[120px] md:w-[140px] md:h-[200px] lg:w-[180px] lg:h-[260px] xl:w-[200px] xl:h-[300px] rounded-2xl shadow-lg border-4 border-white z-10 object-cover rotate-[-10deg] opacity-80 animate-float hover-tilt transition-transform duration-300"
                style={{ zIndex: 10 }}
              />
              <Image
                src="/resume2.png"
                alt="Resume Template 2"
                width={340}
                height={440}
                className="absolute top-4 left-12 w-[110px] h-[160px] md:w-[180px] md:h-[260px] lg:w-[220px] lg:h-[320px] xl:w-[260px] xl:h-[380px] rounded-2xl shadow-xl border-4 border-white z-20 object-cover rotate-[-2deg] opacity-90 animate-float-delay hover-tilt transition-transform duration-300"
                style={{ zIndex: 20 }}
              />
              <div className="absolute top-0 left-24 w-[120px] h-[180px] md:w-[200px] md:h-[300px] lg:w-[260px] lg:h-[380px] xl:w-[320px] xl:h-[480px] z-30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg z-40 border-2 border-white">No.1 Free Builder</div>
                <Image
                  src="/resume1.png"
                  alt="Resume Template 3"
                  width={340}
                  height={440}
                  className="w-full h-full rounded-2xl shadow-2xl border-4 border-white object-cover rotate-4 animate-float hover-tilt transition-transform duration-300"
                  style={{ zIndex: 30 }}
                />
              </div>
              <Image
                src="/logo.png"
                alt="Rezume Logo"
                width={48}
                height={48}
                className="absolute bottom-2 right-2 w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg border-4 border-white z-40 bg-white object-contain"
                style={{ zIndex: 40 }}
              />
            </div>
          </div>
        </section>

        <PDFVedaBanner />

        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 shadow-sm relative z-10">
          <svg className="absolute -top-16 right-0 w-40 h-40 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How Our Free Online Resume Builder Works</h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between max-w-4xl mx-auto">
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Professional Resume Templates</h3>
              <p className="text-gray-600 text-sm text-center">Pick from modern, ATS-optimized resume templates designed by professionals to help you get hired.</p>
            </div>
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">✍️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fill Your Resume Information</h3>
              <p className="text-gray-600 text-sm text-center">Enter your work experience, education, skills, and achievements with our easy-to-use resume builder interface.</p>
            </div>
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">⬇️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Download PDF Resume</h3>
              <p className="text-gray-600 text-sm text-center">Export your professional resume as a PDF file and start applying for jobs immediately. No watermarks, completely free.</p>
            </div>
          </div>
        </section>

        <section className="w-full mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">FAANG-Ready & Google-Optimized Resume Templates</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">Choose from our collection of <span className="font-semibold">Google-ready, Amazon-approved, Meta-optimized resume templates</span> specifically designed for FAANG companies (Facebook/Meta, Amazon, Apple, Netflix, Google) and top tech companies like Microsoft, Tesla, Uber, Airbnb. All templates pass ATS systems used by Big Tech recruiters.</p>
          <div className="flex md:justify-center gap-8 overflow-x-auto pb-4 md:pb-0 snap-x">
            <div className="relative min-w-[280px] max-w-[340px] snap-center">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-30">FAANG-Ready</div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <Image
                  src="/resume1.png"
                  alt="FAANG Resume Template - Google, Amazon, Meta Ready"
                  width={400}
                  height={500}
                  className="w-full h-auto border-b border-gray-100 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">FAANG-Optimized Resume Template</h3>
                  <p className="text-gray-600 text-sm mb-4">Specifically designed for <span className="font-semibold">Google, Amazon, Meta, Apple, Netflix</span> applications. ATS-optimized format preferred by Big Tech recruiters</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Google-Ready</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Amazon ATS</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Meta-Approved</span>
                  </div>
                  <Link
                    href="/resume/new?template=template-1756037150032"
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Use FAANG template →
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative min-w-[280px] max-w-[340px] snap-center mt-8 md:mt-0">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-30">Google Engineers</div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <Image
                  src="/resume2.png"
                  alt="Google Engineers Resume Template"
                  width={400}
                  height={500}
                  className="w-full h-auto border-b border-gray-100 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Engineers Professional Template</h3>
                  <p className="text-gray-600 text-sm mb-4">Used by successful <span className="font-semibold">Google L3-L8 engineers, Microsoft SDE, Amazon SDE</span>. Perfect for software engineers, ML engineers, and tech leads</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Google L4+</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Microsoft SDE</span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Tech Lead</span>
                  </div>
                  <Link
                    href="/resume/new?template=template-1756044868419"
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Use Google template →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full mb-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl py-12 px-4 shadow-sm relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Resume Templates for FAANG & Big Tech Companies</h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Our <span className="font-semibold">FAANG-ready resume templates</span> are specifically optimized for top tech companies. 
            Get past the ATS systems used by <span className="font-semibold">Google, Amazon, Meta (Facebook), Apple, Netflix, Microsoft, 
            Tesla, Uber, Airbnb, LinkedIn, Salesforce, Oracle, IBM</span> and other Fortune 500 tech companies.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-blue-100">
              <div className="text-3xl mb-3">🔷</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Google Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Optimized for Google's hiring process. Perfect for SWE, PM, UX roles at Google, YouTube, Cloud</p>
              <div className="text-xs text-blue-600 font-semibold">L3-L8 Compatible • Googleyness Focused</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-orange-100">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Amazon Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Built for Amazon's Leadership Principles. Ideal for SDE, TPM, Operations roles at Amazon, AWS</p>
              <div className="text-xs text-orange-600 font-semibold">STAR Format • Leadership Principles</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-purple-100">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Meta Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Designed for Meta/Facebook culture. Great for Engineering, Product, Data Science at Meta, Instagram, WhatsApp</p>
              <div className="text-xs text-purple-600 font-semibold">Move Fast • Impact Focused</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-gray-200">
              <div className="text-3xl mb-3">🍎</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Apple Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Crafted for Apple's design excellence. Perfect for Hardware, Software, Design roles at Apple</p>
              <div className="text-xs text-gray-600 font-semibold">Design Excellence • Innovation</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-blue-100">
              <div className="text-3xl mb-3">Ⓜ️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Microsoft Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Aligned with Microsoft values. Ideal for SDE, PM, Cloud Architect roles at Microsoft, Azure, Office</p>
              <div className="text-xs text-blue-600 font-semibold">Growth Mindset • Customer Focus</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow border-2 border-red-100">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Netflix Resume Template</h3>
              <p className="text-gray-600 text-sm mb-3">Built for Netflix culture. Great for Engineering, Data, Content roles at Netflix</p>
              <div className="text-xs text-red-600 font-semibold">Freedom & Responsibility • Context</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-4xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Why FAANG Companies Love Our Templates
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>✅ <strong>ATS-Optimized:</strong> Pass through Taleo, Workday, Greenhouse, Lever systems used by Big Tech</li>
              <li>✅ <strong>Keyword-Rich:</strong> Include industry-specific keywords that FAANG recruiters search for</li>
              <li>✅ <strong>Impact-Focused:</strong> Highlight quantifiable achievements that Big Tech values</li>
              <li>✅ <strong>Clean Format:</strong> Simple, scannable layout preferred by tech recruiters</li>
              <li>✅ <strong>One-Page Design:</strong> Concise format recommended for tech roles</li>
            </ul>
          </div>
        </section>

        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 shadow-sm relative z-10">
          <svg className="absolute -top-16 right-0 w-40 h-40 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Why Choose Our Free Resume Builder?</h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">Our resume maker is trusted by thousands of job seekers worldwide. Create professional resumes that get you hired faster with these powerful features.</p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS-Friendly Resume Templates</h3>
              <p className="text-gray-600 text-sm">All our resume templates are designed to pass Applicant Tracking Systems used by top companies and recruiters</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">📥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant PDF Download</h3>
              <p className="text-gray-600 text-sm">Download your professional resume as a high-quality PDF file ready for job applications and interviews</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">💸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Free Resume Maker</h3>
              <p className="text-gray-600 text-sm">Completely free resume builder with no hidden costs, watermarks, or signup requirements</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your personal information and resume data stays completely private and secure with no data collection</p>
            </div>
          </div>
        </section>

        <div className="w-full h-8 -mb-8 z-20 relative">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,40 Q360,80 720,40 T1440,40 V80 H0 Z" fill="#e0e7ff" />
          </svg>
        </div>
        
        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 relative z-10">
          <svg className="absolute -top-10 right-0 w-24 h-24 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is it really free?</h3>
              <p className="text-gray-600 text-sm">Yes! Rezume is completely free to use. No hidden fees, no credit card required.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-600 text-sm">No signup is required. You can start building and downloading your resume instantly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my data private?</h3>
              <p className="text-gray-600 text-sm">Absolutely. Your data is never stored or shared without your consent.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I edit my resume later?</h3>
              <p className="text-gray-600 text-sm">Yes, you can return and edit your resume as often as you like before downloading.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Are the templates ATS-friendly?</h3>
              <p className="text-gray-600 text-sm">All templates are designed to be compatible with Applicant Tracking Systems.</p>
            </div>
          </div>
        </section>

        <section className="w-full mb-20 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-10 py-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to create your resume?</h2>
            <p className="mb-6 text-base">Start building your professional resume for free—no signup required.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors shadow"
            >
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      <footer className="w-full bg-white text-gray-800 py-10 px-4 mt-20 border-t border-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          <svg width="100%" height="100%" className="w-full h-full" style={{position:'absolute',top:0,left:0}}>
            <defs>
              <pattern id="footer-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#dbeafe" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-dots)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8 relative z-10">
          <div className="mb-8 md:mb-0 flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo.png" alt="Rezume Logo" width={32} height={32} className="rounded shadow-md border-2 border-blue-200" />
              <span className="text-xl font-bold text-blue-700 tracking-tight">Rezume</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">Create professional, ATS-friendly resumes for free. Trusted by job seekers worldwide.</p>
          </div>
          
          <nav aria-label="Footer Important Links" className="flex-1 min-w-[180px]">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Important Links</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="/about" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="/contact-us" className="hover:text-blue-500 transition-colors">Contact</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-500 transition-colors">Terms & Conditions</a></li>
              <li><a href="/disclaimer" className="hover:text-blue-500 transition-colors">Disclaimer</a></li>
              <li><a href="/blog" className="hover:text-blue-500 transition-colors">Blog</a></li>
              <li><a href="/careers" className="hover:text-blue-500 transition-colors">Careers</a></li>
              <li><a href="/sitemap.xml" className="hover:text-blue-500 transition-colors">Sitemap</a></li>
            </ul>
          </nav>
          
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Contact & Legal</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="mailto:rezumecare@gmail.com" className="hover:text-blue-500 transition-colors">rezumecare@gmail.com</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="/disclaimer" className="hover:text-blue-500 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-blue-100 pt-6 text-center text-xs text-gray-400 relative z-10">
          &copy; {new Date().getFullYear()} Rezume. All rights reserved.
        </div>
      </footer>

      <CreateResumeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}