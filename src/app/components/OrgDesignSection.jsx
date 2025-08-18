"use client";
import Link from "next/link";

export default function OrgDesignSection() {
  return (
    <section id="org-design" className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Right column on desktop, first on mobile */}
          <div className="lg:order-last">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Smart Organization Design
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Visualize & Optimize</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your Organization
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Transform your organizational structure with intelligent visualization tools and data-driven insights that help you make strategic decisions with confidence.
            </p>

            <div className="space-y-6 mb-10">
              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Real-Time Org Visualization
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Interactive organizational charts that update in real-time, showing reporting structures, team dynamics, and identifying potential bottlenecks or inefficiencies.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Skills Distribution Analysis
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Analyze skill distribution across teams and departments, identify gaps, and optimize resource allocation for maximum efficiency and growth potential.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    Future-Ready Planning
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Scenario modeling and predictive analytics to help you prepare for organizational changes, market shifts, and future workforce needs.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/demo"
              className="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-300"
            >
              <span>Explore Organization Design</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          {/* Left column on desktop, second on mobile */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main org chart container */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="text-white text-sm font-medium">Organization Structure</div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <img
                    src="./chart.jpg"
                    alt="Organizational Chart Visualization"
                    className="w-full h-full object-cover rounded-lg mb-4"
                  />
                  
                  {/* Interactive elements */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">CEO</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Executive Level</span>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold">3 positions</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">VP</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Department Heads</span>
                      </div>
                      <span className="text-xs text-green-600 font-semibold">8 positions</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">TL</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Team Leaders</span>
                      </div>
                      <span className="text-xs text-purple-600 font-semibold">24 positions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating insights */}
              <div className="absolute top-0 -left-2 sm:-top-4 sm:-left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 animate-float">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">Skill Gap</div>
                    <div className="text-xs text-gray-500">Engineering</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 -right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 animate-float animation-delay-2000">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">Optimized</div>
                    <div className="text-xs text-gray-500">Structure</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl transform -rotate-3 opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
