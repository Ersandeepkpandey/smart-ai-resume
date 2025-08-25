"use client";
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'
import CreateResumeModal from '@/components/CreateResumeModal'
import PDFVedaBanner from '@/components/PDFVedaBanner'

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Helper to get initials from name or email
  function getInitials(nameOrEmail: string) {
    if (!nameOrEmail) return '?';
    const parts = nameOrEmail.split(/\s|@/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-x-clip">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Rezume" width={32} height={32} className="rounded" />
            <span className="text-xl font-bold text-blue-700 tracking-tight">Rezume</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-2 rounded-full text-base font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition-colors"
            >
              Create Resume
            </button>
            {!loading && !user && (
              <Link href="/auth/signin" className="text-blue-700 font-semibold hover:underline px-3 py-2 rounded transition-colors text-sm">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center relative overflow-x-clip">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Create Professional Resumes
        </h1>
        
        {/* PDFVeda Banner */}
        <PDFVedaBanner />
      </main>

      {/* PDFVeda Banner before footer */}
      <PDFVedaBanner />

      {/* Footer */}
      <footer className="w-full bg-white text-gray-800 py-10 px-4 mt-20 border-t border-blue-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Rezume. All rights reserved.</p>
        </div>
      </footer>

      {/* Create Resume Modal */}
      <CreateResumeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}