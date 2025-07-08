"use client";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";

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
  return (
    <AuthProvider>
      {showHeaderFooter && <Navigation />}
      <main className={`flex-1 w-full${showHeaderFooter ? (['/templates', '/ats-score', '/help-center', '/contact-us', '/privacy-policy'].includes(pathname) ? ' bg-white' : ' mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-white') : ' p-0'}`}>
        {children}
      </main>

      {showHeaderFooter && (
        <footer className="bg-gray-900 text-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Rezume</h3>
                <p className="text-gray-400">
                  Create professional, ATS-friendly resumes that help you stand out and get hired.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/templates" className="hover:text-white transition-colors">Templates</Link></li>
                  <li><Link href="/ats-score" className="hover:text-white transition-colors">ATS Score</Link></li>

                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Rezume. All rights reserved. | <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></p>
            </div>
          </div>
        </footer>
      )}
    </AuthProvider>
  );
}