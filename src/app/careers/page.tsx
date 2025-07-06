import React from 'react';
import { Briefcase, Users, Star } from 'lucide-react';
import Head from 'next/head';

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers | Rezume</title>
        <meta name="description" content="Explore career opportunities at Rezume. Join our team and help shape the future of resume building and job search technology." />
      </Head>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">Careers at Rezume</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Want to make a difference in the world of job search and resume technology? We&apos;re always looking for talented, passionate individuals to join our team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Briefcase className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Innovative Work</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Collaborate on cutting-edge resume and job search technology.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Users className="w-12 h-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Growth & Learning</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Opportunities for professional development and advancement.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow">
            <Star className="w-12 h-12 text-yellow-400 mb-4" />
            <h2 className="text-xl font-bold mb-2">Remote Friendly</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Work from anywhere with our flexible, remote-friendly culture.</p>
          </div>
        </div>
        <div className="text-gray-400 italic text-center mt-12">
          No open positions at the moment. Please check back soon!
        </div>
      </section>
    </>
  );
}