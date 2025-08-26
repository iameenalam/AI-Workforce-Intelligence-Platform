"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Briefcase, Mail, BookOpen, Lightbulb,
  Award, Wrench, User, Loader2, XCircle, ChevronLeft, ChevronRight
} from "lucide-react";

const Alert = ({ type, message }) => {
  const isError = type === "error";
  return (
    <div
      className={`mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
        isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isError && <XCircle className="h-5 w-5" />}
      <p>{message}</p>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
    {icon}
    <p className="mt-4 font-medium text-gray-600">{text}</p>
    <p className="mt-1 text-sm text-gray-500">
      Information not available.
    </p>
  </div>
);

export default function CEOProfile() {
  const router = useRouter();
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("experience");

  const tabsContainerRef = useRef(null);
  const [showScrollArrows, setShowScrollArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const TABS = [
    { value: "experience", label: "Experience", icon: <Briefcase /> },
    { value: "education", label: "Education", icon: <BookOpen /> },
    { value: "skills", label: "Skills", icon: <Lightbulb /> },
    { value: "tools", label: "Tools", icon: <Wrench /> },
    { value: "certifications", label: "Certifications", icon: <Award /> },
  ];

  const checkScrollability = () => {
    const container = tabsContainerRef.current;
    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setShowScrollArrows(isOverflowing);
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      checkScrollability();
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(container);
      container.addEventListener('scroll', checkScrollability);

      return () => {
        if (resizeObserver && container) {
            resizeObserver.unobserve(container);
        }
        if (container) {
            container.removeEventListener('scroll', checkScrollability);
        }
      };
    }
  }, [organization]);
  
  const handleArrowScroll = (direction) => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (id) fetchOrganization();
  }, [id]);

  const fetchOrganization = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/organization/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch organization data");
      }
      const data = await res.json();
      setOrganization(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-slate-50"><Alert type="error" message={error} /></div>;
  if (!organization) return <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-700">No CEO found.</div>;

  const education = organization.ceoEducation || [];
  const experience = organization.ceoExperience || [];
  const skills = organization.ceoSkills || [];
  const tools = organization.ceoTools || [];
  const certifications = organization.ceoCertifications || [];

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="min-h-screen bg-slate-50 text-gray-800 flex justify-center">
        <div className="w-full max-w-5xl px-4 py-8 md:py-12">
          <div className="mb-6">
            <Link href="/chart" className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium group transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Chart
            </Link>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                {organization.ceoPic ? (
                  <img src={organization.ceoPic} alt={organization.ceoName} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" />
                ) : (
                  <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                    {organization.ceoName ? organization.ceoName[0] : <User className="w-12 h-12"/>}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center sm:text-left min-w-0">
                <h1 className="truncate text-3xl font-bold text-gray-900">{organization.ceoName}</h1>
                <p className="text-lg font-medium text-indigo-600">Chief Executive Officer</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-gray-600">
                    <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-gray-400" />{organization.email}</span>
                    <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{organization.industry}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
            <div className="relative border-b border-gray-200">
              <div ref={tabsContainerRef} className="overflow-x-auto hide-scrollbar">
                <nav className="-mb-px flex justify-start gap-x-6" aria-label="Tabs">
                  {TABS.map((tab) => (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                      className={`shrink-0 flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                        activeTab === tab.value
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              {showScrollArrows && canScrollLeft && (
                  <button onClick={() => handleArrowScroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -mt-2 text-indigo-600 p-1.5 disabled:text-gray-300 z-10 bg-white/50 backdrop-blur-sm rounded-full">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
              )}
              {showScrollArrows && canScrollRight && (
                  <button onClick={() => handleArrowScroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mt-2 text-indigo-600 p-1.5 disabled:text-gray-300 z-10 bg-white/50 backdrop-blur-sm rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </button>
              )}
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === 'experience' && (experience.length > 0 ? experience.map((job, idx) => <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === experience.length - 1 ? 'pb-1' : 'pb-10'}`}><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{job.title}</h3><p className="font-medium text-gray-600">{job.company}</p><p className="text-sm text-gray-500 mt-1">{job.duration}</p>{job.description && <p className="text-gray-700 mt-2">{job.description}</p>}</div>) : <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-gray-400" />} />)}
                  {activeTab === 'education' && (education.length > 0 ? education.map((edu, idx) => <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === education.length - 1 ? 'pb-1' : 'pb-10'}`}><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3><p className="font-medium text-gray-600">{edu.institution}</p><p className="text-sm text-gray-500 mt-1">{edu.year || edu.duration}</p></div>) : <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-gray-400" />} />)}
                  {activeTab === 'certifications' && (certifications.length > 0 ? certifications.map((cert, idx) => <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === certifications.length - 1 ? 'pb-1' : 'pb-10'}`}><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{cert.title}</h3><p className="font-medium text-gray-600">{cert.issuer || cert.location || 'N/A'}</p><p className="text-sm text-gray-500 mt-1">{cert.duration || cert.year}</p></div>) : <EmptyState text="No Certifications Listed" icon={<Award className="h-10 w-10 text-gray-400" />} />)}
                  {activeTab === 'skills' && (skills.length > 0 ? <div className="flex flex-wrap gap-3">{skills.map((skill, idx) => <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">{skill}</span>)}</div> : <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} />)}
                  {activeTab === 'tools' && (tools.length > 0 ? <div className="flex flex-wrap gap-3">{tools.map((tool, idx) => <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">{tool}</span>)}</div> : <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-gray-400" />} />)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
