"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Briefcase, Mail, CloudUpload, CheckCircle2,
  XCircle, BookOpen, Lightbulb, Loader2, X, UserPlus, UserCheck,
  FileText, Award, Wrench, User, ChevronLeft, ChevronRight
} from "lucide-react";

const Alert = ({ type, message }) => {
  const isError = type === "error";
  return (
    <div
      className={`mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${
        isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isError ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
      <p>{message}</p>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
    {icon}
    <p className="mt-4 font-medium text-gray-600">{text}</p>
    <p className="mt-1 text-sm text-gray-500">
      Upload a CV to populate this section.
    </p>
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        if (isOpen) {
          document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm cursor-pointer p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl cursor-default"
                    >
                         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function TeamMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const [teamMember, setTeamMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("experience");
  const [cvFile, setCvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabsContainerRef = useRef(null);
  const [showScrollArrows, setShowScrollArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
        resizeObserver.disconnect();
        container.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [teamMember]);

  const handleArrowScroll = (direction) => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchTeamMember = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/teammembers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch team member data");
      }
      const data = await res.json();
      setTeamMember(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTeamMember();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setUploadError(null);
      setUploadSuccess("");
    } else {
      setCvFile(null);
      setUploadError("Please select a valid PDF file.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadError(null);
    setUploadSuccess("");
    setCvFile(null);
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess("");
    const formData = new FormData();
    formData.append("cv", cvFile);
    try {
      const token = Cookies.get("token");
      const res = await fetch(`/api/teammembers/cv?id=${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "An unknown error occurred.");
      
      setUploadSuccess(result.message || "Profile updated successfully!");
      
      const dataRes = await fetch(`/api/teammembers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fullData = await dataRes.json();
      if (dataRes.ok) {
        setTeamMember(fullData);
      }

      setTimeout(closeModal, 1500);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-slate-50"><Alert type="error" message={error} /></div>;
  if (!teamMember) return <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-700">No Team Member found.</div>;

  const education = teamMember.education || [];
  const experience = teamMember.experience || [];
  const skills = teamMember.skills || [];
  const tools = teamMember.tools || [];
  const certifications = teamMember.certifications || [];
  
  const TABS = [
    { value: "experience", label: "Experience", icon: <Briefcase /> },
    { value: "education", label: "Education", icon: <BookOpen /> },
    { value: "skills", label: "Skills", icon: <Lightbulb /> },
    { value: "tools", label: "Tools", icon: <Wrench /> },
    { value: "job-description", label: "Job Description", icon: <FileText /> },
    { value: "certifications", label: "Certifications", icon: <Award /> },
  ];

  const isProfileComplete = education.length > 0 || experience.length > 0 || skills.length > 0;

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
                {isProfileComplete ? "Update Profile" : "Complete Profile"}
            </h2>
            <p className="text-gray-500 mb-6">
                {isProfileComplete ? "Upload a new CV to update the profile details." : "Upload the team member's CV (PDF) to auto-populate their profile."}
            </p>
            <label htmlFor="cv-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudUpload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF only (MAX. 5MB)</p>
                    {cvFile && <p className="mt-4 text-sm font-medium text-indigo-600">{cvFile.name}</p>}
                </div>
                <input id="cv-upload" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isUploading}/>
            </label>
            <div className="mt-6 flex justify-end">
                <button onClick={handleCvUpload} disabled={!cvFile || isUploading} className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed w-full sm:w-auto">
                    {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isUploading ? "Uploading..." : "Upload & Parse CV"}
                </button>
            </div>
            {uploadError && <Alert type="error" message={uploadError} />}
            {uploadSuccess && <Alert type="success" message={uploadSuccess} />}
        </div>
      </Modal>

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
                  <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                    {teamMember.name ? teamMember.name[0] : "?"}
                  </div>
              </div>
              <div className="flex-grow text-center sm:text-left min-w-0">
                <h1 className="truncate text-3xl font-bold text-gray-900">{teamMember.name}</h1>
                <p className="text-lg font-medium text-indigo-600">{teamMember.role}</p>
                <div className="mt-4 flex flex-col items-center sm:items-start gap-2 text-gray-600">
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2">
                        <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-gray-400" />{teamMember.email}</span>
                        <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{teamMember.department?.departmentName}</span>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2">
                        <span className="font-medium flex items-center gap-2 truncate"><User className="w-5 h-5 text-gray-400" />Reports To: <span className="font-normal">{teamMember.reportTo || '-'}</span></span>
                        <span className="font-medium flex items-center gap-2">Invited: 
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${teamMember.invited ? "bg-green-100 text-green-800 border-green-300" : "bg-gray-100 text-gray-800 border-gray-300"}`}>
                                {teamMember.invited ? "Yes" : "No"}
                            </span>
                        </span>
                    </div>
                </div>
              </div>
              <div className="w-full flex justify-center sm:w-auto sm:ml-auto mt-4 sm:mt-0">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-sm"
                >
                  {isProfileComplete ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isProfileComplete ? "Update Profile" : "Complete Profile"}
                </button>
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
                  {activeTab === "education" && (
                    <div>
                      {education.length > 0 ? (
                        education.map((edu, idx) => (
                          <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === education.length - 1 ? 'pb-1' : 'pb-10'}`}>
                            <div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div>
                            <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                            <p className="font-medium text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500 mt-1">{edu.year}</p>
                          </div>
                        ))
                      ) : (
                        <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-gray-400" />} />
                      )}
                    </div>
                  )}
                  {activeTab === "experience" && (
                    <div>
                      {experience.length > 0 ? (
                        experience.map((job, idx) => (
                          <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === experience.length - 1 ? 'pb-1' : 'pb-10'}`}>
                            <div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div>
                            <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                            <p className="font-medium text-gray-600">{job.company}</p>
                            <p className="text-sm text-gray-500 mt-1">{job.duration}</p>
                          </div>
                        ))
                      ) : (
                        <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-gray-400" />} />
                      )}
                    </div>
                  )}
                  {activeTab === "job-description" && (
                     <div className="space-y-4">
                        {experience.some(job => job.description) ? (
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {experience.filter(job => job.description).map((job, idx) => (
                                    <li key={idx}>{job.description}</li>
                                ))}
                            </ul>
                        ) : (
                           <EmptyState text="No Job Descriptions Available" icon={<FileText className="h-10 w-10 text-gray-400" />} />
                        )}
                    </div>
                  )}
                   {activeTab === "certifications" && (
                     <div>
                        {certifications.length > 0 ? (
                            certifications.map((cert, idx) => (
                                <div key={idx} className={`relative pl-8 sm:pl-10 border-l-2 border-gray-200 ${idx === certifications.length - 1 ? 'pb-1' : 'pb-10'}`}>
                                    <div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div>
                                    <h3 className="text-lg font-bold text-gray-800">{cert.title}</h3>
                                    <p className="font-medium text-gray-600">{cert.location}</p>
                                    <p className="text-sm text-gray-500 mt-1">{cert.duration}</p>
                                </div>
                            ))
                        ) : (
                           <EmptyState text="No Certifications Listed" icon={<Award className="h-10 w-10 text-gray-400" />} />
                        )}
                    </div>
                  )}
                  {activeTab === "skills" && (
                    <div>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {skills.map((skill, idx) => (
                            <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} />
                      )}
                    </div>
                  )}
                  {activeTab === "tools" && (
                    <div>
                      {tools.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {tools.map((tool, idx) => (
                            <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">
                              {tool}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-gray-400" />} />
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
