"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Briefcase, Mail, CloudUpload, CheckCircle2,
  XCircle, BookOpen, Lightbulb, Loader2, X, UserPlus, UserCheck,
  FileText, Award, Wrench, ChevronLeft, ChevronRight,
  User
} from "lucide-react";
import toast from 'react-hot-toast';

const TABS = [
  { value: "experience", label: "Experience", icon: Briefcase },
  { value: "education", label: "Education", icon: BookOpen },
  { value: "skills", label: "Skills", icon: Lightbulb },
  { value: "tools", label: "Tools", icon: Wrench },
  { value: "certifications", label: "Certifications", icon: Award },
];

const Alert = ({ type, message }) => (
  <div className={`p-4 rounded-lg ${type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
    <div className="flex items-center">
      {type === 'error' ? <XCircle className="w-5 h-5 mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
      {message}
    </div>
  </div>
);

const TabContent = ({ activeTab, data }) => {
  const renderExperience = () => (
    <div className="space-y-6">
      {data.experience && data.experience.length > 0 ? (
        data.experience.map((exp, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.title}</h3>
            <p className="text-indigo-600 font-medium mb-2">{exp.company}</p>
            <p className="text-gray-500 text-sm mb-3">{exp.duration}</p>
            {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No experience information available</p>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {data.education && data.education.length > 0 ? (
        data.education.map((edu, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
            <p className="text-indigo-600 font-medium mb-2">{edu.institution}</p>
            <p className="text-gray-500 text-sm mb-3">{edu.duration || edu.year}</p>
            {edu.description && <p className="text-gray-700 leading-relaxed">{edu.description}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No education information available</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {data.skills && data.skills.length > 0 ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No skills information available</p>
        </div>
      )}
    </div>
  );

  const renderTools = () => (
    <div className="space-y-6">
      {data.tools && data.tools.length > 0 ? (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {data.tools.map((tool, index) => (
              <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {tool}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No tools information available</p>
        </div>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      {data.certifications && data.certifications.length > 0 ? (
        data.certifications.map((cert, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.title}</h3>
            <p className="text-indigo-600 font-medium mb-2">{cert.issuer || cert.location}</p>
            <p className="text-gray-500 text-sm">{cert.duration}</p>
            {cert.description && <p className="text-gray-700 leading-relaxed mt-3">{cert.description}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications information available</p>
        </div>
      )}
    </div>
  );

  switch (activeTab) {
    case "experience": return renderExperience();
    case "education": return renderEducation();
    case "skills": return renderSkills();
    case "tools": return renderTools();
    case "certifications": return renderCertifications();
    default: return renderExperience();
  }
};

export default function EmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
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

  useEffect(() => {
    const checkScrollable = () => {
      const container = tabsContainerRef.current;
      if (container) {
        const isScrollable = container.scrollWidth > container.clientWidth;
        setShowScrollArrows(isScrollable);
        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  const handleArrowScroll = (direction) => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchEmployee = async () => {
    if (!id) return;
    if (loading) return; // Prevent multiple simultaneous calls

    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }

      console.log("Fetching employee with ID:", id);
      const res = await fetch(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.error("Employee fetch error:", data);
          throw new Error(data.message || "Failed to fetch employee data");
        } else {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
      }

      const data = await res.json();
      console.log("Employee data fetched:", data);
      setEmployee(data);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      console.log("useEffect triggered with id:", id);
      fetchEmployee();
    }
  }, [id]); // Only depend on id, not fetchEmployee

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setUploadError("Please select a PDF file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB.");
        return;
      }
      setCvFile(file);
      setUploadError(null);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess("");

    try {
      const token = Cookies.get("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      if (!id) {
        throw new Error("Employee ID not found");
      }

      console.log("Uploading CV for employee:", id);
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("employeeId", id);

      const res = await fetch("/api/employees/cv", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      console.log("CV upload response:", data);

      if (!res.ok) {
        console.error("CV upload failed:", data);
        throw new Error(data.message || data.error || "Failed to upload CV");
      }

      setUploadSuccess("CV uploaded and profile updated successfully!");
      toast.success("CV uploaded and profile updated successfully!");
      setCvFile(null);
      setIsModalOpen(false);

      // Refresh employee data
      await fetchEmployee();
    } catch (err) {
      setUploadError(err.message);
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-slate-50"><Alert type="error" message={error} /></div>;
  if (!employee) return <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-700">No employee found.</div>;

  const education = employee.education || [];
  const experience = employee.experience || [];
  const skills = employee.skills || [];
  const tools = employee.tools || [];
  const certifications = employee.certifications || [];

  return (
    <>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

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
                {employee.pic ? (
                  <img src={employee.pic} alt={employee.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" />
                ) : (
                  <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                    {employee.name ? employee.name[0] : "?"}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center sm:text-left min-w-0">
                <h1 className="truncate text-3xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-lg font-medium text-indigo-600">{employee.role}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-gray-600">
                  <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-gray-400" />{employee.email}</span>
                  {employee.department && <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{employee.department.departmentName}</span>}
                  {employee.reportsTo && <span className="flex items-center gap-2 truncate"><User className="w-5 h-5 text-gray-400" />Reports To: <span className="font-normal ml-1">{employee.reportsTo}</span></span>}
                </div>
              </div>

            </div>
          </div>

          {uploadSuccess && (
            <div className="mb-6">
              <Alert type="success" message={uploadSuccess} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative border-b border-slate-200">
              {showScrollArrows && canScrollLeft && (
                <button onClick={() => handleArrowScroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full border border-slate-200 hover:bg-slate-50">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              <div ref={tabsContainerRef} className="flex overflow-x-auto hide-scrollbar px-6 py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap mr-2 ${activeTab === tab.value ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900 hover:bg-slate-100'}`}>
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {showScrollArrows && canScrollRight && (
                <button onClick={() => handleArrowScroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full border border-slate-200 hover:bg-slate-50">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            <div className="p-6 md:p-8">
              <TabContent activeTab={activeTab} data={{ education, experience, skills, tools, certifications }} />
            </div>
          </div>
        </div>
      </div>

      {/* CV Upload Modal */}

    </>
  );
}
