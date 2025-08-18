"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BookOpen, Briefcase, Lightbulb, Wrench, FileText, DollarSign,
  TrendingUp, Loader2, Mail, AlertTriangle, Gift, Package, Calendar,
  Percent, CheckCircle2, XCircle, Clock, Target, Building2, ChevronLeft,
  ChevronRight
} from "lucide-react";
import { allemployees, orgData } from "../../../../../data/data";

// Helper Functions
const findEmployeeById = (employees, id) => employees?.find((emp) => emp.id === id) || null;
const getEducation = (employee) => {
  const edu = employee?.education;
  if (Array.isArray(edu)) return edu;
  if (typeof edu === 'object' && edu !== null) return [edu];
  return [];
};
const getExperience = (employee) => employee?.experience || [];
const getSkills = (employee) => employee?.skills || [];
const getTools = (employee) => employee?.tools || [];
const getJobDescription = (employee) => employee?.jobDescription || [];
const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

// UI Components
const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
    {icon}
    <p className="mt-4 font-medium text-gray-600">{text}</p>
  </div>
);

const StatCard = ({ icon, label, value, unit = "" }) => (
  <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
    <div className="flex-shrink-0 rounded-full bg-indigo-100 p-3 text-indigo-600">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}<span className="text-base font-medium">{unit}</span></p>
    </div>
  </div>
);

// Performance Goal Status Styles & Icons
const statusConfig = {
  "on track": { styles: "bg-green-100 text-green-700", icon: <CheckCircle2 className="h-4 w-4"/> },
  "delayed": { styles: "bg-yellow-100 text-yellow-700", icon: <Clock className="h-4 w-4"/> },
  "at risk": { styles: "bg-red-100 text-red-700", icon: <XCircle className="h-4 w-4"/> },
  "completed": { styles: "bg-blue-100 text-blue-700", icon: <Target className="h-4 w-4"/> },
  "default": { styles: "bg-gray-100 text-gray-700", icon: null }
};

export default function EmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("experience");
  const tabsContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({ show: false, canLeft: false, canRight: false });

  const TABS = [
    { value: "experience", label: "Experience", icon: <Briefcase/> },
    { value: "education", label: "Education", icon: <BookOpen/> },
    { value: "skills", label: "Skills", icon: <Lightbulb/> },
    { value: "tools", label: "Tools", icon: <Wrench/> },
    { value: "job-description", label: "Job Description", icon: <FileText/> },
    { value: "performance", label: "Performance", icon: <TrendingUp/> },
    { value: "payroll", label: "Payroll", icon: <DollarSign/> },
  ];
  
  const ceoInfo = orgData[0]; // Assuming single organization data

  useEffect(() => {
    setLoading(true);
    const emp = findEmployeeById(allemployees, id);
    setTimeout(() => {
      setEmployee(emp);
      setLoading(false);
    }, 300);
  }, [id]);
  
  useEffect(() => {
    const checkScrollability = () => {
      const container = tabsContainerRef.current;
      if (container) {
        const isOverflowing = container.scrollWidth > container.clientWidth;
        setScrollState({
          show: isOverflowing,
          canLeft: container.scrollLeft > 0,
          canRight: container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
        });
      }
    };
    
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
  }, [employee]);

  const handleArrowScroll = (direction) => {
    const amount = direction === 'left' ? -200 : 200;
    tabsContainerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  
  if (!employee) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Employee Not Found</h1>
        <p className="mb-6 text-gray-600">The employee you are looking for does not exist.</p>
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700">
          <ArrowLeft className="h-4 w-4" /> Back to Demo Chart
        </button>
      </div>
    );
  }

  const tabContent = {
    experience: getExperience(employee), education: getEducation(employee),
    skills: getSkills(employee), tools: getTools(employee),
    "job-description": getJobDescription(employee),
  };

  return (
    <>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <div className="flex min-h-screen justify-center bg-slate-50 text-gray-800">
        <div className="w-full max-w-5xl px-4 py-8 md:py-12">
          <button onClick={() => router.back()} className="group mb-6 inline-flex items-center font-medium text-gray-500 transition-colors hover:text-indigo-600">
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" /> Back to Demo Chart
          </button>

          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              {employee.name === ceoInfo.ceoName ? (
                <img src={ceoInfo.ceoPic} alt={ceoInfo.ceoName} className="h-24 w-24 flex-shrink-0 rounded-full ring-4 ring-white shadow-md" />
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-4xl font-bold text-white ring-4 ring-white shadow-md">
                  {getInitials(employee.name)}
                </div>
              )}
              <div className="min-w-0 flex-grow text-center sm:text-left">
                <h1 className="truncate text-3xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-lg font-medium text-indigo-600">{employee.position}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-600 sm:justify-start">
                  <span className="flex items-center gap-2 truncate"><Mail className="h-5 w-5 text-gray-400" />{employee.email}</span>
                  <span className="flex items-center gap-2 truncate"><Building2 className="h-5 w-5 text-gray-400" />{employee.department}</span>
                </div>
              </div>
            </div>
            {employee.redFlag && (
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div><span className="font-semibold">Red Flag: </span>{employee.redFlag}</div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <div className="relative border-b border-gray-200">
              <div ref={tabsContainerRef} className="hide-scrollbar overflow-x-auto">
                <nav className="-mb-px flex justify-start gap-x-6" aria-label="Tabs">
                  {TABS.map((tab) => (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`shrink-0 flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${activeTab === tab.value ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              {scrollState.show && scrollState.canLeft && <button onClick={() => handleArrowScroll('left')} className="absolute left-0 top-1/2 z-10 -mt-2 -translate-y-1/2 rounded-full bg-white/50 p-1.5 text-indigo-600 backdrop-blur-sm disabled:text-gray-300"><ChevronLeft className="h-5 w-5" /></button>}
              {scrollState.show && scrollState.canRight && <button onClick={() => handleArrowScroll('right')} className="absolute right-0 top-1/2 z-10 -mt-2 -translate-y-1/2 rounded-full bg-white/50 p-1.5 text-indigo-600 backdrop-blur-sm disabled:text-gray-300"><ChevronRight className="h-5 w-5" /></button>}
            </div>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === 'experience' && (
                    !tabContent.experience.length ? <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-gray-400" />} /> :
                    tabContent.experience.map((job, idx) => (
                      <div key={idx} className={`relative border-l-2 border-gray-200 pl-8 sm:pl-10 ${idx === tabContent.experience.length - 1 ? "pb-1" : "pb-10"}`}>
                        <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full border-2 border-indigo-500 bg-white"></div>
                        <h3 className="text-lg font-bold text-gray-800">{job.position}</h3>
                        <p className="font-medium text-gray-600">{job.company}</p>
                        <p className="mt-1 text-sm text-gray-500">{job.startDate} - {job.endDate || 'Present'}</p>
                        {job.responsibilities?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">{job.responsibilities.map((resp, r_idx) => <li key={r_idx}>{resp}</li>)}</ul>}
                      </div>
                    ))
                  )}
                  {activeTab === 'education' && (
                    !tabContent.education.length ? <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-gray-400" />} /> :
                    tabContent.education.map((edu, idx) => (
                      <div key={idx} className={`relative border-l-2 border-gray-200 pl-8 sm:pl-10 ${idx === tabContent.education.length - 1 ? "pb-1" : "pb-10"}`}>
                        <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full border-2 border-indigo-500 bg-white"></div>
                        <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                        <p className="font-medium text-gray-600">{edu.institution}</p>
                      </div>
                    ))
                  )}
                  {activeTab === 'skills' && (
                    !tabContent.skills.length ? <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} /> :
                    <div className="flex flex-wrap gap-3">{tabContent.skills.map((skill, idx) => <span key={idx} className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">{skill}</span>)}</div>
                  )}
                  {activeTab === 'tools' && (
                    !tabContent.tools.length ? <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-gray-400" />} /> :
                    <div className="flex flex-wrap gap-3">{tabContent.tools.map((tool, idx) => <span key={idx} className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-800">{tool}</span>)}</div>
                  )}
                  {activeTab === 'job-description' && (
                    !tabContent["job-description"].length ? <EmptyState text="No Job Description" icon={<FileText className="h-10 w-10 text-gray-400" />} /> :
                    <ul className="list-disc space-y-2 pl-5 text-gray-700">{tabContent["job-description"].map((desc, idx) => <li key={idx}>{desc}</li>)}</ul>
                  )}
                  {activeTab === 'payroll' && (
                    !employee.payroll ? <EmptyState text="No Payroll Information" icon={<DollarSign className="h-10 w-10 text-gray-400" />} /> :
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <StatCard icon={<DollarSign className="h-6 w-6"/>} label="Base Salary" value={`$${employee.payroll.baseSalary?.toLocaleString()}`} />
                      <StatCard icon={<Gift className="h-6 w-6"/>} label="Bonus" value={`$${employee.payroll.bonus?.toLocaleString()}`} />
                      <StatCard icon={<Package className="h-6 w-6"/>} label="Stock Options" value={employee.payroll.stockOptions} unit=" shares" />
                      <StatCard icon={<Calendar className="h-6 w-6"/>} label="Last Raise Date" value={employee.payroll.lastRaiseDate} />
                    </div>
                  )}
                  {activeTab === 'performance' && (
                    !employee.performance ? <EmptyState text="No Performance Data" icon={<TrendingUp className="h-10 w-10 text-gray-400" />} /> :
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Overall Completion</label>
                        <div className="mt-1 flex items-center gap-4">
                          <div className="h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-green-500" style={{ width: `${employee.performance.overallCompletion}%` }}></div></div>
                          <span className="font-semibold text-green-600">{employee.performance.overallCompletion}%</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">Active Goals</h3>
                        <div className="space-y-4">
                          {employee.performance.goals?.map((goal, idx) => {
                            const status = statusConfig[goal.status] || statusConfig.default;
                            return (
                              <div key={idx} className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-semibold text-gray-800">{goal.name}</p>
                                    <p className="text-sm text-gray-500">Target: {goal.targetDate}</p>
                                  </div>
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status.styles}`}>{status.icon} {goal.status}</span>
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                  <div className="h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${goal.completion}%` }}></div></div>
                                  <span className="text-sm font-medium text-gray-600">{goal.completion}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
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