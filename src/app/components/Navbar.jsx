"use client";
import { useState, useEffect, useRef } from "react";

// A simple Link component to replace Next.js Link for broader compatibility
const Link = ({ href, children, className, onClick }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

const PRODUCT_OPTIONS = [
  { href: "/#features", label: "Workforce Intelligence" },
  { href: "/#skills-dashboard", label: "Talent Management" },
  { href: "/#features", label: "Skills Intelligence" },
  { href: "/#org-design", label: "Org Design" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuresDropdown, setFeaturesDropdown] = useState(false);
  const [featuresDropdownMobile, setFeaturesDropdownMobile] = useState(false);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check scroll position on initial load
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // --- Dropdown open/close with delay (desktop only) ---
  const handleDropdownMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setFeaturesDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setFeaturesDropdown(false);
    }, 200);
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              ReeOrg
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                id="features-trigger"
                className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
                aria-haspopup="true"
                aria-expanded={featuresDropdown}
              >
                Solutions
                <svg
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${featuresDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ${featuresDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                <div
                  id="features-dropdown"
                  className="absolute left-1/2 -translate-x-1/2 mt-4 w-56 rounded-xl bg-white shadow-2xl border border-gray-100 z-50 overflow-hidden"
                >
                  <ul className="py-2">
                    {PRODUCT_OPTIONS.map((opt) => (
                      <li key={opt.label}>
                        <Link
                          href={opt.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm"
                          onClick={() => setFeaturesDropdown(false)}
                        >
                          {opt.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:opacity-95 transform hover:-translate-y-px transition-all"
            >
              Get Started
            </Link>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen border-t border-gray-200' : 'max-h-0'}`}>
          <div className="container mx-auto px-4 py-6 space-y-4">
             <Link
              href="#"
              className="block text-gray-700 hover:text-indigo-600 transition-colors font-medium text-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <div>
              <button
                className="w-full text-left text-gray-700 hover:text-indigo-600 transition-colors flex items-center justify-between font-medium text-lg"
                onClick={() => setFeaturesDropdownMobile(!featuresDropdownMobile)}
              >
                Solutions
                <svg
                  className={`ml-1 w-5 h-5 transition-transform duration-200 ${featuresDropdownMobile ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${featuresDropdownMobile ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <ul className="space-y-1 pl-4 border-l-2 border-indigo-100">
                  {PRODUCT_OPTIONS.map((opt) => (
                    <li key={opt.label}>
                      <Link
                        href={opt.href}
                        className="block px-2 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        {opt.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/signup"
              className="block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full text-center font-semibold mt-4"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
    </header>
  );
}
