import React from 'react';
import { Zap, CheckCircle, BarChart3 } from 'lucide-react';
import Head from 'next/head';

export default function ATSScorePage() {
  return (
    <>
      <Head>
        <title>ATS Score Checker | Rezume</title>
        <meta name="description" content="Check your resume's ATS score and optimize it for applicant tracking systems. Improve your chances of getting noticed by recruiters with our ATS score tool." />
      </Head>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">ATS Score Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our ATS Score feature analyzes your resume to ensure it passes through applicant tracking systems used by top employers. Get instant feedback and actionable tips to improve your resume&apos;s compatibility and visibility.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Zap className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Real-Time Analysis</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Get instant feedback on your resume&apos;s ATS compatibility as you build.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <BarChart3 className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Actionable Insights</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Personalized suggestions to boost your score and land more interviews.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Higher Success Rate</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Increase your chances of getting noticed by recruiters and employers.</p>
          </div>
        </div>
      </section>
    </>
  );
}