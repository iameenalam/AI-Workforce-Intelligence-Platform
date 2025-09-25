"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Building2, Briefcase, Mail, BookOpen, Lightbulb,
  Award, Wrench, User, Loader2, XCircle, ChevronLeft, ChevronRight,
  DollarSign, Gift, Package, Calendar, TrendingUp, Clock, CheckCircle,
  Play, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { getEmployees } from "@/redux/action/employees";
import { getDepartments } from "@/redux/action/departments";

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

const StatCard = ({ icon, label, value, unit = "" }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900">
          {value}{unit}
        </p>
      </div>
    </div>
  </div>
);

const statusConfig = {
  not_started: {
    icon: <Clock className="h-4 w-4" />,
    styles: "bg-gray-100 text-gray-800"
  },
  in_progress: {
    icon: <Play className="h-4 w-4" />,
    styles: "bg-blue-100 text-blue-800"
  },
  completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    styles: "bg-green-100 text-green-800"
  },
  overdue: {
    icon: <AlertTriangle className="h-4 w-4" />,
    styles: "bg-red-100 text-red-800"
  },
  default: {
    icon: <Clock className="h-4 w-4" />,
    styles: "bg-gray-100 text-gray-800"
  }
};

export default function ChartEmployeeProfile() {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const { employees, loading: employeesLoading } = useSelector((state) => state.employees);
  const { departments, loading: deptsLoading } = useSelector((state) => state.departments);
  const { organization } = useSelector((state) => state.organization);

  const [employee, setEmployee] = useState(null);
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
    { value: "performance", label: "Performance", icon: <TrendingUp /> },
    { value: "payroll", label: "Payroll", icon: <DollarSign /> },
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
  }, [employee]);
  
  const handleArrowScroll = (direction) => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (organization?._id) {
      dispatch(getEmployees());
      dispatch(getDepartments({ organizationId: organization._id }));
    }
  }, [dispatch, organization?._id]);

  useEffect(() => {
    if (employeesLoading || deptsLoading) return;
    
    if (id && employees) {
      let foundEmployee = employees?.find(emp => emp._id === id);
      
      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        setError("Employee not found");
      }
      setLoading(false);
    }
  }, [id, employees, employeesLoading, deptsLoading]);

  if (loading || employeesLoading || deptsLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  }
  
  if (error) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><Alert type="error" message={error} /></div>;
  }
  
  if (!employee) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-700">No Employee found.</div>;
  }

  const department = departments?.find(d => d._id === employee.department?._id || d._id === employee.department);
  const education = employee.education || [];
  const experience = employee.experience || [];
  const skills = employee.skills || [];
  const tools = employee.tools || [];
  const certifications = employee.certifications || [];

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
                {employee.pic ? (
                  <img src={employee.pic} alt={employee.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" />
                ) : (
                  <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                    {employee.name ? employee.name[0] : <User className="w-12 h-12"/>}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center sm:text-left min-w-0">
                <h1 className="truncate text-3xl font-bold text-gray-900">{employee.name}</h1>
                <p className="text-lg font-medium text-indigo-600">{employee.role || 'Employee'}</p>
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-gray-600">
                    {employee.email && <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-gray-400" />{employee.email}</span>}
                    {department && <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{department.departmentName}</span>}
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

                  {activeTab === 'payroll' && (
                    !employee?.payroll ? (
                      <EmptyState text="No Payroll Information" icon={<DollarSign className="h-20 w-20 text-gray-300 mx-auto" />} />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Row 1: Base Salary & Bonus */}
                        <div className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-lg">
                          <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Base Salary</p>
                            <p className="font-semibold text-gray-900">${employee.payroll.baseSalary?.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-lg">
                          <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                            <Gift className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Bonus</p>
                            <p className="font-semibold text-gray-900">${employee.payroll.bonus?.toLocaleString()}</p>
                          </div>
                        </div>
                        {/* Row 2: Stock Options & Last Raised */}
                        <div className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-lg">
                          <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                            <Package className="h-5 w-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Stock Options</p>
                            <p className="font-semibold text-gray-900">{employee.payroll.stockOptions?.toLocaleString()} shares</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-lg">
                          <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Raised</p>
                            <p className="font-semibold text-gray-900">{employee.payroll.lastRaiseDate ? new Date(employee.payroll.lastRaiseDate).toLocaleDateString() : '-'}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {activeTab === 'performance' && (
                    !employee?.performance ? <EmptyState text="No Performance Data" icon={<TrendingUp className="h-10 w-10 text-gray-400" />} /> :
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Overall Completion</label>
                        <div className="mt-1 flex items-center gap-4">
                          <div className="h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-green-500" style={{ width: `${employee.performance.overallCompletion}%` }}></div></div>
                          <span className="font-semibold text-green-600">{employee.performance.overallCompletion}%</span>
                        </div>
                        {employee.performance.nextReviewDate && (
                          <div className="mt-2 text-xs text-gray-500">
                            Next Review: {new Date(employee.performance.nextReviewDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-800">Active Goals</h3>
                        <div className="space-y-4">
                          {employee.performance.goals?.map((goal, idx) => {
                            const statusConfig = {
                              not_started: { icon: <Clock className="h-4 w-4" />, styles: "bg-gray-100 text-gray-800" },
                              in_progress: { icon: <TrendingUp className="h-4 w-4" />, styles: "bg-blue-100 text-blue-800" },
                              completed: { icon: <CheckCircle className="h-4 w-4" />, styles: "bg-green-100 text-green-800" },
                              overdue: { icon: <AlertTriangle className="h-4 w-4" />, styles: "bg-red-100 text-red-800" },
                              default: { icon: <Clock className="h-4 w-4" />, styles: "bg-gray-100 text-gray-800" }
                            };
                            const status = statusConfig[goal.status] || statusConfig.default;
                            return (
                              <div key={idx} className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-semibold text-gray-800">{goal.name}</p>
                                    <p className="text-sm text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                                  </div>
                                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status.styles}`}>{status.icon} {goal.status.replace('_', ' ')}</span>
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
