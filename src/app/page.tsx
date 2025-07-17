"use client";
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-x-clip">
      {/* Decorative background pattern */}
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
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Rezume" width={32} height={32} className="rounded" />
              <span className="text-xl font-bold text-blue-700 tracking-tight">Rezume</span>
            </Link>
            <Link href="/resume/new" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition-colors">
              Create Resume
            </Link>
          </div>
        </nav>

      {/* Hero Section with Gradient Background and Trust Badges */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center relative overflow-x-clip">
        {/* Gradient SVG Background */}
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
          {/* Decorative blob in hero */}
          <svg className="absolute -top-24 -left-32 w-72 h-72 opacity-30 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#3b82f6" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          {/* Left: Headline and CTA */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              <span className="">Create a <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Professional Resume</span></span> <br className="hidden md:block" />in Minutes
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl">
              Build a standout, <span className="font-semibold text-blue-700">ATS-friendly</span> resume for free. Choose a template, fill in your details, and download instantly—no signup required.
            </p>
            <Link
              href="/resume/new"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors"
            >
              Get Started
            </Link>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-8 items-center justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm font-medium border border-gray-100">
                <span className="text-green-500 text-lg">★</span> Trusted by 10,000+ users
              </div>
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow text-gray-700 text-sm font-medium border border-gray-100">
                <span className="text-blue-500 text-lg">✓</span> No Signup Required
              </div>
            </div>
          </div>
          {/* Right: Overlapping Images with More Depth */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative min-h-[220px] md:min-h-[48vh] lg:min-h-[56vh] xl:min-h-[64vh]">
            {/* Animated, glowing background accent */}
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
              {/* Back image, always visible for overlap effect */}
              <Image
                src="/resume1.png"
                alt="Resume Template 1"
                width={320}
                height={440}
                className="absolute top-12 left-4 w-[80px] h-[120px] md:w-[140px] md:h-[200px] lg:w-[180px] lg:h-[260px] xl:w-[200px] xl:h-[300px] rounded-2xl shadow-lg border-4 border-white z-10 object-cover rotate-[-10deg] opacity-80 animate-float hover-tilt transition-transform duration-300"
                style={{ zIndex: 10 }}
              />
              {/* Middle image */}
              <Image
                src="/resume2.png"
                alt="Resume Template 2"
                width={340}
                height={440}
                className="absolute top-4 left-12 w-[110px] h-[160px] md:w-[180px] md:h-[260px] lg:w-[220px] lg:h-[320px] xl:w-[260px] xl:h-[380px] rounded-2xl shadow-xl border-4 border-white z-20 object-cover rotate-[-2deg] opacity-90 animate-float-delay hover-tilt transition-transform duration-300"
                style={{ zIndex: 20 }}
              />
              {/* Front image, always visible */}
              <div className="absolute top-0 left-24 w-[120px] h-[180px] md:w-[200px] md:h-[300px] lg:w-[260px] lg:h-[380px] xl:w-[320px] xl:h-[480px] z-30">
                {/* Badge */}
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
              {/* Logo circle, small and tucked in corner */}
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

        {/* How It Works - Modernized */}
        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 shadow-sm relative z-10">
          {/* Decorative blob in features */}
          <svg className="absolute -top-16 right-0 w-40 h-40 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 md:justify-between max-w-4xl mx-auto">
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">📄</div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose a Template</h3>
              <p className="text-gray-600 text-sm text-center">Pick from modern, professional templates designed to impress.</p>
            </div>
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">✍️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Fill in Your Details</h3>
              <p className="text-gray-600 text-sm text-center">Enter your information easily with our guided form.</p>
            </div>
            <div className="flex flex-col items-center md:w-1/3 px-4">
              <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-3xl shadow-lg border-2 border-blue-100">⬇️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Download Instantly</h3>
              <p className="text-gray-600 text-sm text-center">Export your resume as a PDF and start applying for jobs right away.</p>
            </div>
          </div>
        </section>

        {/* Template Preview - Modern, Scrollable, Badges */}
        <section className="w-full mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Templates</h2>
          <div className="flex md:justify-center gap-8 overflow-x-auto pb-4 md:pb-0 snap-x">
            <div className="relative min-w-[280px] max-w-[340px] snap-center">
              <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow z-30">Popular</div>
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <Image
                  src="/resume1.png"
                  alt="Professional Template"
                  width={400}
                  height={500}
                  className="w-full h-auto border-b border-gray-100 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional</h3>
                  <p className="text-gray-600 text-sm mb-4">Clean and traditional design</p>
                  <Link
                    href="/resume/new?template=template1"
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Use template →
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative min-w-[280px] max-w-[340px] snap-center mt-8 md:mt-0">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <Image
                  src="/resume2.png"
                  alt="Modern Template"
                  width={400}
                  height={500}
                  className="w-full h-auto border-b border-gray-100 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern</h3>
                  <p className="text-gray-600 text-sm mb-4">Contemporary layout with sidebar</p>
                  <Link
                    href="/resume/new?template=template2"
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Use template →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features - Modern Cards */}
        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 shadow-sm relative z-10">
          {/* Decorative blob in features */}
          <svg className="absolute -top-16 right-0 w-40 h-40 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#60a5fa" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">Features</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS-Optimized</h3>
              <p className="text-gray-600 text-sm">Templates designed to pass Applicant Tracking Systems</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">📥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF Export</h3>
              <p className="text-gray-600 text-sm">Download your resume as a professional PDF file</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">💸</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free & No Signup</h3>
              <p className="text-gray-600 text-sm">Completely free to use, no account required</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">Your data stays private—nothing is stored without your consent</p>
            </div>
          </div>
        </section>

        {/* Testimonials - Avatars and Stars */}
        <section className="w-full mb-20 relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center relative z-10">What Users Say</h2>
          {/* Section divider SVG moved below heading */}
          <div className="w-full h-8 -mb-8 z-0 relative">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M0,40 Q360,0 720,40 T1440,40 V80 H0 Z" fill="#e0e7ff" />
            </svg>
          </div>
          {/* Decorative icon in testimonials */}
          <svg className="absolute -top-10 left-0 w-24 h-24 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#3b82f6" d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.7C29.7,56,14.8,63.8,-0.7,64.7C-16.2,65.6,-32.4,59.6,-44.2,49.2C-56,38.8,-63.3,24,-66.2,8.2C-69.1,-7.6,-67.6,-24.4,-59.7,-36.7C-51.8,-49,-37.6,-56.8,-23.1,-62.7C-8.6,-68.6,6.2,-72.6,20.7,-71.1C35.2,-69.6,49.3,-62.2,44.8,-67.2Z" transform="translate(100 100)" /></svg>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/logo.png" alt="User" width={48} height={48} className="rounded-full mb-2" />
              <div className="flex gap-1 mb-2 text-yellow-400 text-lg">★ ★ ★ ★ ★</div>
              <p className="text-gray-700 italic mb-4">“So easy to use and my resume looks amazing. Got more interviews in a week!”</p>
              <span className="text-sm font-semibold text-gray-900">— Alex P.</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/logo.png" alt="User" width={48} height={48} className="rounded-full mb-2" />
              <div className="flex gap-1 mb-2 text-yellow-400 text-lg">★ ★ ★ ★ ★</div>
              <p className="text-gray-700 italic mb-4">“Love that it’s free and no signup. The templates are top-notch.”</p>
              <span className="text-sm font-semibold text-gray-900">— Priya S.</span>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow text-center flex flex-col items-center">
              <Image src="/logo.png" alt="User" width={48} height={48} className="rounded-full mb-2" />
              <div className="flex gap-1 mb-2 text-yellow-400 text-lg">★ ★ ★ ★ ★</div>
              <p className="text-gray-700 italic mb-4">“I made my resume in 10 minutes and got the job. Highly recommend!”</p>
              <span className="text-sm font-semibold text-gray-900">— Jordan M.</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {/* Section divider */}
        <div className="w-full h-8 -mb-8 z-20 relative">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0,40 Q360,80 720,40 T1440,40 V80 H0 Z" fill="#e0e7ff" />
          </svg>
        </div>
        <section className="w-full mb-20 bg-blue-50 rounded-2xl py-12 px-4 relative z-10">
          {/* Decorative icon in FAQ */}
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

        {/* Final CTA Section */}
        <section className="w-full mb-20 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-10 py-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to create your resume?</h2>
            <p className="mb-6 text-base">Start building your professional resume for free—no signup required.</p>
            <Link
              href="/resume/new"
              className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors shadow"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Modern SEO Footer - White with Dotted Pattern */}
      <footer className="w-full bg-white text-gray-800 py-10 px-4 mt-20 border-t border-blue-100 relative overflow-hidden">
        {/* Dotted SVG Pattern Background */}
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
          {/* Brand and Description */}
          <div className="mb-8 md:mb-0 flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo.png" alt="Rezume Logo" width={32} height={32} className="rounded shadow-md border-2 border-blue-200" />
              <span className="text-xl font-bold text-blue-700 tracking-tight">Rezume</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">Create professional, ATS-friendly resumes for free. Trusted by job seekers worldwide.</p>
          </div>
          {/* Important Links */}
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
          {/* Contact & Legal */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Contact & Legal</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li><a href="mailto:support@rezume.in" className="hover:text-blue-500 transition-colors">support@rezume.in</a></li>
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
    </div>
  )
}
