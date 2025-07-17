import React from 'react';
import { HelpCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import Head from 'next/head';

export default function HelpCenterPage() {
  return (
    <>
      <Head>
        <title>Help Center | Rezume</title>
        <meta name="description" content="Find answers to common questions and get support for using the Rezume resume builder. Browse our FAQs and troubleshooting guides." />
      </Head>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Need help with your resume or account? Browse our frequently asked questions and support resources to get the answers you need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <HelpCircle className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">FAQs</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Find answers to the most common questions about using Rezume.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <MessageSquare className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Contact Support</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Reach out to our team for personalized help and troubleshooting.</p>
            <a href="mailto:rezumecare@gmail.com" className="text-blue-600 hover:underline font-semibold">rezumecare@gmail.com</a>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <ShieldCheck className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Account & Privacy</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Learn how we protect your data and keep your account secure.</p>
          </div>
        </div>
      </section>
    </>
  );
}