import React from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';
import Head from 'next/head';

export default function ContactUsPage() {
  return (
    <>
      <Head>
        <title>Contact Us | Rezume</title>
        <meta name="description" content="Get in touch with the Rezume team for support, feedback, or partnership inquiries. We're here to help you succeed in your job search." />
      </Head>
      <section className="py-12 flex justify-center items-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-lg mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8 text-center">
            Have questions or need support? Fill out the form below or email us directly. Our team is here to help you with your resume and job search journey.
          </p>
          <form className="space-y-6 w-full">
            <div className="flex items-center border rounded px-3 py-2 mb-2 bg-gray-50">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <input type="text" placeholder="Your Name" className="w-full bg-transparent outline-none" />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-2 bg-gray-50">
              <Mail className="w-5 h-5 text-blue-500 mr-2" />
              <input type="email" placeholder="Your Email" className="w-full bg-transparent outline-none" />
            </div>
            <div className="flex items-start border rounded px-3 py-2 bg-gray-50">
              <MessageSquare className="w-5 h-5 text-blue-500 mr-2 mt-1" />
              <textarea placeholder="Your Message" className="w-full bg-transparent outline-none resize-none" rows={4}></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}