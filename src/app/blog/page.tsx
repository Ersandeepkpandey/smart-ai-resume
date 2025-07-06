import React from 'react';
import { BookOpen } from 'lucide-react';
import Head from 'next/head';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog | Rezume</title>
        <meta name="description" content="Read the latest tips, guides, and news on resume writing, job search strategies, and career development from the Rezume team." />
      </Head>
      <section className="py-12 flex justify-center items-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl mx-auto flex flex-col items-center">
          <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4">Rezume Blog</h1>
          <p className="text-gray-600 mb-8 text-center">
            Stay up to date with the latest resume writing tips, job search strategies, and career advice from our experts. New articles coming soon!
          </p>
          <div className="text-gray-400 italic text-center">
            No blog posts yet. Check back soon for updates!
          </div>
        </div>
      </section>
    </>
  );
}