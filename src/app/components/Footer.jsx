"use client";

// A simple Link component to replace Next.js Link for broader compatibility
const Link = ({ href, children, className }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// SVG Icon components to replace lucide-react
const Mail = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Linkedin = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand and Social */}
          <div>
             <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-4">
              ReeOrg
            </h2>
            <p className="text-gray-400 mb-6 max-w-xs">
              The Workforce Intelligence platform for the AI Era.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@reeorg.com"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/reeorg"
                className="text-gray-400 hover:text-indigo-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                  Workforce Intelligence
                </Link>
              </li>
              <li>
                <Link href="/#skills-dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Talent Management
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                  Skills Intelligence
                </Link>
              </li>
              <li>
                <Link href="/#org-design" className="text-gray-300 hover:text-white transition-colors">
                  Org Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
               <li>
                <Link href="/#" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-condition" className="text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} ReeOrg. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
