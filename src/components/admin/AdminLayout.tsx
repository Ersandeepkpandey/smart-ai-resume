'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart3,
  Menu,
  X,
  LogOut,
  Shield,
  Palette
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (!data.user || data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin'
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: 'Resumes',
      icon: FileText,
      href: '/admin/resumes'
    },
    {
      title: 'Templates',
      icon: Palette,
      href: '/admin/templates'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4 flex items-center">
              <Shield className="text-blue-600 mr-2" size={24} />
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg fixed left-0 top-14 bottom-0 z-30 transition-all duration-300 overflow-hidden`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
              >
                <item.icon size={20} className="mr-3" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}