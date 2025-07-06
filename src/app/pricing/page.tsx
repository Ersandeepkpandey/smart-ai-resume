import React from 'react';
import { CheckCircle, Star, Gift } from 'lucide-react';
import Head from 'next/head';

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing | Rezume</title>
        <meta name="description" content="Choose the best pricing plan for your resume needs. Affordable and flexible plans for job seekers, students, and professionals." />
      </Head>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Pricing Plans</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the plan that fits your career goals. All plans include access to our professional resume builder, ATS score checker, and premium templates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-2 border-blue-600">
            <Gift className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Free</h2>
            <ul className="text-gray-600 text-sm mb-4 space-y-1">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Basic templates</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Unlimited resumes</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> PDF download</li>
            </ul>
            <span className="text-3xl font-extrabold text-blue-700 mb-2">$0</span>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4">Get Started</button>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border-2 border-yellow-400">
            <Star className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <ul className="text-gray-600 text-sm mb-4 space-y-1">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Premium templates</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Advanced ATS scoring</li>
              <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Priority support</li>
            </ul>
            <span className="text-3xl font-extrabold text-yellow-400 mb-2">$9<span className="text-lg font-normal">/mo</span></span>
            <button className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors mt-4">Upgrade</button>
          </div>
        </div>
      </section>
    </>
  );
}