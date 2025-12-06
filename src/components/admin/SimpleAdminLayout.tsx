'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface SimpleAdminLayoutProps {
  children: React.ReactNode;
}

export default function SimpleAdminLayout({ children }: SimpleAdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    if (user) {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don&apos;t have admin privileges.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 font-bold">
                ← Back to Site
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {user.email}
            </div>
          </div>
        </div>
      </header>

      {/* Simple Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6 py-3">
            <Link 
              href="/admin" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/users" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Users
            </Link>
            <Link 
              href="/admin/resumes" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Resumes
            </Link>
            <Link 
              href="/admin/analytics" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Analytics
            </Link>
            <Link 
              href="/admin/settings" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}