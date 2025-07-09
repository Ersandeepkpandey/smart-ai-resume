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
          <div className="text-gray-700 text-left w-full space-y-6">
            <p>Last updated: [Date]</p>
            <p>Welcome to rezume (“we”, “us”, or “our”). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">1. Information We Collect</h2>
            <p>We may collect information that identifies you (“Personal Information”) when you use our services, including:</p>
            <ul className="list-disc pl-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Resume content and related data you provide</li>
              <li>Usage data (such as IP address, browser type, and access times)</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6">
              <li>Provide, operate, and maintain our services</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Communicate with you, including sending updates and support messages</li>
              <li>Process your requests and transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">3. Sharing Your Information</h2>
            <p>We do not sell or rent your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6">
              <li>Service providers who assist us in operating our website and services</li>
              <li>Law enforcement or regulatory agencies if required by law</li>
              <li>Other parties with your consent</li>
            </ul>
            <h2 className="text-xl font-bold mt-6 mb-2">4. Cookies and Tracking Technologies</h2>
            <p>We may use cookies and similar tracking technologies to enhance your experience and analyze usage.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">5. Data Security</h2>
            <p>We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">6. Your Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal information, such as accessing, correcting, or deleting your data. To exercise these rights, please contact us at <a href="mailto:rezumecare@gmail.com" className="text-blue-600 underline">rezumecare@gmail.com</a>.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">7. Children’s Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            <h2 className="text-xl font-bold mt-6 mb-2">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:rezumecare@gmail.com" className="text-blue-600 underline">rezumecare@gmail.com</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}