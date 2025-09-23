"use client";
import Link from "next/link";

export default function SkillsSection() {
  return (
    <section id="skills-dashboard" className="py-10 sm:py-14 md:py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left column - Content */}
          <div>
            <div className="inline-flex items-center px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium bg-indigo-100 text-indigo-800 mb-4 md:mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Intelligent Dashboard
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-gray-900">Your AI-Powered</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Workforce Command Center
              </span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-10 leading-relaxed">
              Get comprehensive insights into your workforce with dynamic dashboards that adapt to your needs and provide actionable intelligence in real-time.
            </p>

            {/* Feature cards */}
            <div className="space-y-6 mb-10">
              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    360° Employee Profiles
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Comprehensive profiles with skills assessment, performance metrics, career progression, and AI-powered risk indicators for every team member.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    Advanced Analytics Engine
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Deep dive into skill distributions, performance trends, and team dynamics with interactive visualizations and predictive insights.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    Smart Career Pathways
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    AI-powered recommendations for individual development plans, skill building, and career advancement opportunities.
                  </p>
                </div>
              </div>
            </div>

            <Link 
              href="/signup" 
              className="group inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300"
            >
              <span>Experience the Dashboard</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Right column - Visual */}
          <div className="relative mt-12 lg:mt-0">
            <div className="relative">
              {/* Main dashboard image */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                      <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    </div>
                    <div className="text-white text-sm font-medium">Workforce Analytics</div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <img
                    src="./talent.jpg"
                    alt="Workforce Analytics Dashboard"
                    className="w-full h-full object-cover rounded-lg mb-4"
                  />
                  
                  {/* Dashboard metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">94%</div>
                      <div className="text-sm text-gray-600">Employee Satisfaction</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-sm text-gray-600">Skill Match Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 animate-float z-20">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">Risk Alert</div>
                    <div className="text-xs text-gray-500">Low Priority</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-gray-100 animate-float animation-delay-2000 z-20">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">New Hire</div>
                    <div className="text-xs text-gray-500">Onboarding</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl transform rotate-3 opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
