import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Head from 'next/head';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Rezume</title>
        <meta name="description" content="Read our privacy policy to learn how Rezume protects your personal information and keeps your data secure." />
      </Head>
      <section className="py-12 flex justify-center items-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl mx-auto flex flex-col items-center">
          <ShieldCheck className="w-12 h-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8 text-center">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use Rezume.
          </p>
          <ul className="list-disc pl-6 text-gray-800 mb-8 self-start">
            <li>We never sell your data to third parties</li>
            <li>Your information is encrypted and securely stored</li>
            <li>You control your data and can request deletion at any time</li>
          </ul>
          <p className="text-gray-500 text-center">
            For more details, please contact our support team or review our full privacy practices below.
          </p>
        </div>
      </section>
    </>
  );
}