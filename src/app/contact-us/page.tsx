'use client'

import React, { useState } from 'react';
import { Mail, User, MessageSquare } from 'lucide-react';
import Head from 'next/head';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Your message has been sent! We will get back to you soon.');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(data.error || 'Failed to send message. Please try again later.');
      }
    } catch {
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            Have questions or need support? Fill out the form below or email us directly at{' '}
            <a href="mailto:rezumecare@gmail.com" className="text-blue-600 hover:underline font-semibold">rezumecare@gmail.com</a>.
            Our team is here to help you with your resume and job search journey.
          </p>
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div className="flex items-center border rounded px-3 py-2 mb-2 bg-gray-50">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <input type="text" placeholder="Your Name" className="w-full bg-transparent outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex items-center border rounded px-3 py-2 mb-2 bg-gray-50">
              <Mail className="w-5 h-5 text-blue-500 mr-2" />
              <input type="email" placeholder="Your Email" className="w-full bg-transparent outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex items-start border rounded px-3 py-2 bg-gray-50">
              <MessageSquare className="w-5 h-5 text-blue-500 mr-2 mt-1" />
              <textarea placeholder="Your Message" className="w-full bg-transparent outline-none resize-none" rows={4} value={message} onChange={e => setMessage(e.target.value)}></textarea>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>
      </section>
    </>
  );
}