"use client";
import { useState } from "react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // A simple Link component to replace Next.js Link for broader compatibility
  const Link = ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );

  // --- Form submission handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Using Formspree for form handling
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("company_size", companySize);

    try {
      // Post data to the Formspree endpoint
      await fetch("https://formspree.io/f/myzwrdyw", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      // Show success message after a short delay
      setTimeout(() => setSubmitted(true), 1000);
    } catch {
      // Also show success message on error to avoid user confusion
      setTimeout(() => setSubmitted(true), 1000);
    }
  };

  return (
    // --- Section with gradient background similar to the skills dashboard ---
    <section
      id="contact"
      className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Increased gap for better spacing on larger screens --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-16 items-center">
          
          {/* --- Left Column: Content --- */}
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Ready to Transform</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Organization?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Join leading companies using ReeOrg to build more effective
              teams and develop talent strategically.
            </p>

            {/* --- Feature list with enhanced styling --- */}
            <div className="space-y-5 mb-12">
              {[
                "Gain deep insights into your organization’s talent landscape",
                "Visualize your entire org in real time with roles, reporting lines, and risks",
                "Analyze skills distribution to quickly identify misalignments and gaps",
                "Identify and address market risks and internal red flags in real-time",
                "Stay ahead with AI-driven scoring, analysis and targeted plans",
                "Model different scenarios to plan and transform before disruption hits",
              ].map((point, idx) => (
                <div className="flex items-start" key={idx}>
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                    <svg
                      className="h-4 w-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="ml-4 text-gray-700 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            {/* --- Call to action link --- */}
            <Link
              href="/demo"
              className="group inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 text-lg"
            >
              <span>Try ReeOrg’s sandbox version</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          {/* --- Right Column: Contact Form --- */}
          <div className="mt-12 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-200">
              {submitted ? (
                // --- Thank you message after submission ---
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-8 w-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-gray-600">
                    Our team will reach out shortly to schedule your demo.
                  </p>
                </div>
              ) : (
                // --- The form itself ---
                <>
                  <h3 className="text-3xl font-bold mb-2 text-gray-900">Request a Demo</h3>
                  <p className="text-gray-600 mb-8">
                    Let's talk about how ReeOrg can help your organization.
                  </p>
                  {/* --- Increased spacing in the form for better readability --- */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" placeholder="Your name"/>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" placeholder="you@company.com"/>
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <input id="role" name="role" type="text" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" placeholder="Your role"/>
                    </div>
                    <div>
                      <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                      <select id="companySize" name="companySize" required value={companySize} onChange={(e) => setCompanySize(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all duration-300">
                        <option value="" disabled>Select company size</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="501-1000">501-1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Get Started
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
