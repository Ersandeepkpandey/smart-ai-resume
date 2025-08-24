"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";

const FOOTER_PAGES = [
  "/templates",
  "/ats-score",
  "/help-center",
  "/contact-us",
  "/privacy-policy",
  "/about",
  "/blog",
  "/careers"
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeaderFooter = FOOTER_PAGES.includes(pathname);

  // Add global error handlers
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent the default error handling
    };

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <AuthProvider>
      {showHeaderFooter && <Navigation />}
      <main className={`flex-1 w-full${showHeaderFooter ? (['/templates', '/ats-score', '/help-center', '/contact-us', '/privacy-policy'].includes(pathname) ? ' bg-white' : ' mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-white') : ' p-0'}`}>
        {children}
      </main>

      {/* Footer removed as per request */}
    </AuthProvider>
  );
}