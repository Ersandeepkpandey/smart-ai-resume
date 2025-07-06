import React from 'react';
import { Users, Star, FileText } from 'lucide-react';
import Head from 'next/head';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Rezume</title>
        <meta name="description" content="Learn more about Rezume, our mission, and our commitment to helping job seekers create professional resumes." />
      </Head>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">About Rezume</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rezume was founded with a simple mission: to empower job seekers with the tools they need to create professional, ATS-friendly resumes. Our team is passionate about helping you succeed in your career journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Expert Team</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Our experts design templates and features to help you stand out.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Star className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Cutting-Edge Tech</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">We use the latest ATS optimization and resume-building technology.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <FileText className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">User Focused</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">We are dedicated to providing the best experience for every user.</p>
          </div>
        </div>
      </section>
    </>
  );
}