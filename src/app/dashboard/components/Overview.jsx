"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, User, Users, Building2, Workflow, MapPin, Calendar, Building, Laptop, Scaling, Mail, BookOpen, Lightbulb, Wrench, FileText, Award, Briefcase, UserCircle, Edit, Trash2, X, Loader2, PlusCircle, ArrowLeft, Eye, AlertTriangle, DollarSign, Gift, Package, TrendingUp, Clock, CheckCircle, Play } from "lucide-react";
import toast from 'react-hot-toast';

const Button = ({ children, onClick, variant, className = '', disabled, size = 'md' }) => {
    const baseStyle = "rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeStyles = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-4 py-2 text-sm',
    };
    const variantStyles = {
        ghost: 'bg-transparent hover:bg-slate-100',
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    const variantStyle = variantStyles[variant] || variantStyles.primary;
    return <button onClick={onClick} className={`${baseStyle} ${sizeStyles[size]} ${variantStyle} ${className}`} disabled={disabled}>{children}</button>;
};

const InputField = ({ label, name, value, onChange, type = "text" }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400" 
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, children }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
        <select 
            name={name} 
            value={value || ''} 
            onChange={onChange} 
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
            {children}
        </select>
    </div>
);

const AddItemButton = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full justify-center py-2 px-4 rounded-lg border-2 border-dashed border-indigo-200 text-sm font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-colors flex items-center gap-2"
    >
        <PlusCircle size={16} />
        {children}
    </button>
);

const BackButton = ({ onClick }) => (
    <div className="mb-6">
        <button onClick={onClick} className="group inline-flex items-center text-gray-500 transition-colors hover:text-indigo-600 font-medium">
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back
        </button>
    </div>
);

const ViewProfileButton = ({ onClick }) => (
    <Button onClick={onClick} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
        <Eye className="h-4 w-4" />
    </Button>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm text-gray-500">{message}</p>
                        </div>
                        <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                            <Button variant="ghost" className="border border-slate-300 text-gray-800" onClick={onClose} disabled={isLoading}>Cancel</Button>
                            <Button variant="danger" onClick={onConfirm} className="w-28" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Delete'}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const StatCard = ({ title, value, icon, onButtonClick }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200/80 flex items-center justify-between transition-all duration-300 hover:border-indigo-200 hover:shadow-md">
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-100">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-xl font-bold text-gray-800 truncate">{value}</p>
            </div>
        </div>
        {onButtonClick && <ViewProfileButton onClick={onButtonClick} />}
    </div>
);

export function Overview({ organization, departments, onNavigate, setActiveTab, totalEmployees }) {
    return (
        <div className="p-0 md:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Organization" 
                    value={organization?.name || 'N/A'} 
                    icon={<Network className="h-7 w-7 text-indigo-600" />} 
                    onButtonClick={organization ? () => onNavigate(`organization/${organization._id}`) : null}
                />
                <StatCard 
                    title="CEO" 
                    value={organization?.ceoName || 'N/A'} 
                    icon={<User className="h-7 w-7 text-indigo-600" />} 
                    onButtonClick={organization?.ceoName ? () => onNavigate(`ceo/${organization._id}`) : null}
                />
                <StatCard 
                    title="Total Employees" 
                    value={totalEmployees} 
                    icon={<Users className="h-7 w-7 text-indigo-600" />} 
                    onButtonClick={() => setActiveTab('employees')}
                />
                <StatCard 
                    title="Total Departments" 
                    value={departments?.length || 0} 
                    icon={<Building2 className="h-7 w-7 text-indigo-600" />} 
                    onButtonClick={() => setActiveTab('departments')}
                />
            </div>
        </div>
    );
}

export const OrganizationProfilePage = ({ organization, departments, employees, onBack, onEdit, onDelete }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    if (!organization) {
        return (
            <div className="p-4 sm:p-8 h-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Count employees with assigned roles
    const assignedEmployees = employees?.filter(emp => emp.role !== "Unassigned" && emp.department) || [];
    const totalEmployees = assignedEmployees.length;
    const totalHods = assignedEmployees.filter(emp => emp.role === "HOD").length;
    const totalSubFunctions = departments?.reduce((acc, dept) => acc + (dept.subfunctions?.length || 0), 0);

    const InfoCard = ({ icon, label, value }) => (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4">
        <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
    
    const handleDeleteClick = () => {
        onDelete();
        setIsDeleteModalOpen(false);
    }

    return (
        <>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteClick}
                title="Delete Organization"
                message="Are you sure you want to delete this entire organization? This action cannot be undone."
            />
            <div className="p-4 sm:p-8">
                <BackButton onClick={onBack} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                            <div className="flex-shrink-0">
                                {organization.logoUrl ? (
                                    <img src={organization.logoUrl} alt={`${organization.name} Logo`} className="w-24 h-24 rounded-full object-cover ring-4 ring-white" />
                                ) : (
                                    <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white">
                                        {organization.name ? organization.name.charAt(0) : <Network className="w-12 h-12" />}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{organization.name}</h1>
                                <p className="text-lg font-medium text-indigo-600 sm:text-xl">{organization.industry}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <Button onClick={() => onEdit(organization)} variant="ghost" className="text-indigo-600 hover:bg-indigo-100"><Edit className="h-4 w-4"/>Edit</Button>
                                <Button onClick={() => setIsDeleteModalOpen(true)} variant="ghost" className="text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4"/>Delete</Button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">Organization Details</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoCard icon={<User className="h-6 w-6" />} label="CEO" value={organization.ceoName} />
                            <InfoCard icon={<Users className="h-6 w-6" />} label="Total Employees" value={totalEmployees} />
                            <InfoCard icon={<Building2 className="h-6 w-6" />} label="Total Departments" value={totalHods} />
                            <InfoCard icon={<Workflow className="h-6 w-6" />} label="Total Sub-Functions" value={totalSubFunctions} />
                            <InfoCard icon={<MapPin className="h-6 w-6" />} label="Location" value={`${organization.city}, ${organization.country}`} />
                            <InfoCard icon={<Calendar className="h-6 w-6" />} label="Year Founded" value={organization.yearFounded} />
                            <InfoCard icon={<Building className="h-6 w-6" />} label="Number of Offices" value={organization.numberOfOffices} />
                            <InfoCard icon={<Laptop className="h-6 w-6" />} label="Work Model" value={organization.workModel} />
                            <InfoCard icon={<Scaling className="h-6 w-6" />} label="Hiring Level" value={organization.hiringLevel} />
                            <InfoCard icon={<Users className="h-6 w-6" />} label="Company Size" value={organization.companySize} />
                            <InfoCard icon={<Building className="h-6 w-6" />} label="Organization Type" value={organization.organizationType} />
                            <InfoCard icon={<Wrench className="h-6 w-6" />} label="HR Tools Used" value={organization.hrToolsUsed} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export const GenericProfilePage = ({ person, onBack, isCeoProfile, onEdit }) => {
    const { name, role, email, industry, departmentName, reportsTo, pic, education = [], experience = [], skills = [], tools = [], certifications = [] } = person;
    const [activeTab, setActiveTab] = useState("experience");
    
    const TABS = [
        { value: "experience", label: "Experience", icon: <Briefcase className="w-5 h-5" /> },
        { value: "education", label: "Education", icon: <BookOpen className="w-5 h-5" /> },
        { value: "skills", label: "Skills", icon: <Lightbulb className="w-5 h-5" /> },
        { value: "tools", label: "Tools", icon: <Wrench className="w-5 h-5" /> },
        { value: "certifications", label: "Certifications", icon: <Award className="w-5 h-5" /> },
        ...(isCeoProfile ? [] : [
            { value: "performance", label: "Performance", icon: <TrendingUp className="w-5 h-5" /> },
            { value: "payroll", label: "Payroll", icon: <DollarSign className="w-5 h-5" /> }
        ])
    ];

    const EmptyState = ({ text, icon }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
            {icon}
            <p className="mt-4 font-semibold text-gray-700">{text}</p>
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

    return (
        <div className="p-4 sm:p-8">
            <BackButton onClick={onBack} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="space-y-8">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            {pic ? (
                                <img src={pic} alt={name} className="w-24 h-24 rounded-full object-cover ring-4 ring-white" />
                            ) : (
                                <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white">
                                    {name ? name[0] : "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow text-center sm:text-left min-w-0">
                            <h1 className="truncate text-3xl font-bold text-gray-900">{name}</h1>
                            <p className="text-lg font-medium text-indigo-600">{role}</p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-gray-600">
                                <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-gray-400" />{email}</span>
                                {isCeoProfile && industry && <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{industry}</span>}
                                {departmentName && <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-gray-400" />{departmentName}</span>}
                                {reportsTo && <span className="flex items-center gap-2 truncate"><User className="w-5 h-5 text-gray-400" />Reports To: <span className="font-normal ml-1">{reportsTo}</span></span>}
                            </div>
                        </div>
                        {isCeoProfile && (
                             <div className="flex-shrink-0">
                                 <Button onClick={onEdit} variant="ghost" className="text-indigo-600 hover:bg-indigo-100"><Edit className="h-4 w-4"/>Edit</Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200/80">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex justify-start gap-x-6 overflow-x-auto" aria-label="Tabs">
                            {TABS.map((tab) => (
                                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                                    className={`shrink-0 flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                                    activeTab === tab.value ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    }`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'experience' && (experience.length > 0 ? experience.map((job, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{job.title}</h3><p className="font-medium text-gray-600">{job.company}</p><p className="text-sm text-gray-500 mt-1">{job.duration}</p>{job.description && <p className="text-gray-600 mt-2">{job.description}</p>}</div>) : <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'education' && (education.length > 0 ? education.map((edu, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3><p className="font-medium text-gray-600">{edu.institution}</p><p className="text-sm text-gray-500 mt-1">{edu.year}</p></div>) : <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'skills' && (skills.length > 0 ? <div className="flex flex-wrap gap-3">{skills.map((skill, idx) => <span key={idx} className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">{skill}</span>)}</div> : <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'tools' && (tools.length > 0 ? <div className="flex flex-wrap gap-3">{tools.map((tool, idx) => <span key={idx} className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">{tool}</span>)}</div> : <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-gray-400" />} />)}

                                {activeTab === 'certifications' && (certifications.length > 0 ? certifications.map((cert, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{cert.title}</h3><p className="font-medium text-gray-600">{cert.issuer || 'N/A'}</p><p className="text-sm text-gray-500 mt-1">{cert.duration}</p></div>) : <EmptyState text="No Certifications Listed" icon={<Award className="h-10 w-10 text-gray-400" />} />)}

                                {activeTab === 'payroll' && (
                                    !person.payroll ? <EmptyState text="No Payroll Information" icon={<DollarSign className="h-10 w-10 text-gray-400" />} /> :
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <StatCard icon={<DollarSign className="h-6 w-6"/>} label="Base Salary" value={`$${person.payroll.baseSalary?.toLocaleString()}`} />
                                        <StatCard icon={<Gift className="h-6 w-6"/>} label="Bonus" value={`$${person.payroll.bonus?.toLocaleString()}`} />
                                        <StatCard icon={<Package className="h-6 w-6"/>} label="Stock Options" value={person.payroll.stockOptions} unit=" shares" />
                                        <StatCard icon={<Calendar className="h-6 w-6"/>} label="Last Raise Date" value={person.payroll.lastRaiseDate ? new Date(person.payroll.lastRaiseDate).toLocaleDateString() : 'N/A'} />
                                    </div>
                                )}

                                {activeTab === 'performance' && (
                                    !person.performance ? <EmptyState text="No Performance Data" icon={<TrendingUp className="h-10 w-10 text-gray-400" />} /> :
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Overall Completion</label>
                                            <div className="mt-1 flex items-center gap-4">
                                                <div className="h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-green-500" style={{ width: `${person.performance.overallCompletion}%` }}></div></div>
                                                <span className="font-semibold text-green-600">{person.performance.overallCompletion}%</span>
                                            </div>
                                            {person.performance.nextReviewDate && (
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Next Review: {new Date(person.performance.nextReviewDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-gray-800">Active Goals</h3>
                                            <div className="space-y-4">
                                                {person.performance.goals?.map((goal, idx) => {
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
            </motion.div>
        </div>
    );
};

export const EditOrganizationModal = ({ isOpen, onClose, organization, onSave }) => {
    const [formData, setFormData] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [removeLogo, setRemoveLogo] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);

    const industries = ["Healthcare and Social Assistance", "Finance and Insurance", "Professional, Scientific and Technical Services", "Information Technology (IT) and Software", "Telecommunications"];
    const companySizes = ["150-300", "300-450", "450-600", "600-850", "850-1000", "1000+", "5000+"];
    const orgTypes = ["Private", "Public", "Non-Profit", "Government"];
    const hiringLevels = ["Low", "Moderate", "High"];
    const workModels = ["Onsite", "Remote", "Hybrid", "Mixed"];

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '', industry: organization.industry || '',
                companySize: organization.companySize || '', city: organization.city || '',
                country: organization.country || '', yearFounded: organization.yearFounded || '',
                organizationType: organization.organizationType || '', numberOfOffices: organization.numberOfOffices || '',
                hrToolsUsed: organization.hrToolsUsed || '', hiringLevel: organization.hiringLevel || '',
                workModel: organization.workModel || '',
            });
            setLogoPreview(organization.logoUrl || '');
            setLogoFile(null); setRemoveLogo(false);
        }
    }, [organization]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); setRemoveLogo(false); }
    };
    const handleRemoveLogo = () => { setLogoFile(null); setLogoPreview(''); setRemoveLogo(true); };
    
    const handleSubmit = async () => {
        setBtnLoading(true);
        const dataToSave = new FormData();
        Object.keys(formData).forEach(key => {
            dataToSave.append(key, formData[key]);
        });
        if (logoFile) dataToSave.append('logoUrl', logoFile);
        if (removeLogo) dataToSave.append('removeLogo', 'true');
        
        const success = await onSave(dataToSave);
        if (success) onClose();
        setBtnLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-gray-800">Edit Organization</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Organization Name" name="name" value={formData.name} onChange={handleChange} />
                            <SelectField label="Industry" name="industry" value={formData.industry} onChange={handleChange}><option value="">Select Industry</option>{industries.map(i => <option key={i}>{i}</option>)}</SelectField>
                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                            <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
                            <InputField label="Year Founded" name="yearFounded" type="number" value={formData.yearFounded} onChange={handleChange} />
                            <InputField label="Number of Offices" name="numberOfOffices" type="number" value={formData.numberOfOffices} onChange={handleChange} />
                            <InputField label="HR Tools Used" name="hrToolsUsed" value={formData.hrToolsUsed} onChange={handleChange} />
                            <SelectField label="Company Size" name="companySize" value={formData.companySize} onChange={handleChange}><option value="">Select Size</option>{companySizes.map(s => <option key={s}>{s}</option>)}</SelectField>
                            <SelectField label="Organization Type" name="organizationType" value={formData.organizationType} onChange={handleChange}><option value="">Select Type</option>{orgTypes.map(t => <option key={t}>{t}</option>)}</SelectField>
                            <SelectField label="Hiring Level" name="hiringLevel" value={formData.hiringLevel} onChange={handleChange}><option value="">Select Level</option>{hiringLevels.map(l => <option key={l}>{l}</option>)}</SelectField>
                            <SelectField label="Work Model" name="workModel" value={formData.workModel} onChange={handleChange}><option value="">Select Model</option>{workModels.map(m => <option key={m}>{m}</option>)}</SelectField>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Organization Logo</label>
                                <div className="flex items-center gap-4">
                                    {logoPreview ? (
                                        <div className="relative"><img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-full object-cover" /><button onClick={handleRemoveLogo} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X size={14} /></button></div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Network size={32} /></div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
                            <Button variant="ghost" className="border border-slate-300" onClick={onClose} disabled={btnLoading}>Cancel</Button>
                            <Button onClick={handleSubmit} className="w-32" disabled={btnLoading}>{btnLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const EditCeoModal = ({ isOpen, onClose, organization, onSave }) => {
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState('manual');
    const [ceoPicFile, setCeoPicFile] = useState(null);
    const [ceoPicPreview, setCeoPicPreview] = useState('');
    const [removeCeoPic, setRemoveCeoPic] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        if (organization) {
            setFormData({
                ceoName: organization.ceoName || '', email: organization.email || '',
                ceoSkills: organization.ceoSkills?.join(', ') || '', ceoTools: organization.ceoTools?.join(', ') || '',
                ceoExperience: JSON.parse(JSON.stringify(organization.ceoExperience || [])),
                ceoEducation: JSON.parse(JSON.stringify(organization.ceoEducation || [])),
                ceoCertifications: JSON.parse(JSON.stringify(organization.ceoCertifications || [])),
            });
            setCeoPicPreview(organization.ceoPic || '');
            setCeoPicFile(null); setRemoveCeoPic(false); setCvFile(null); setEditMode('manual');
        }
    }, [organization]);

    if (!isOpen) return null;

    const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleArrayChange = (type, index, field, value) => setFormData(prev => ({ ...prev, [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item) }));
    const addArrayItem = (type, newItem) => setFormData(prev => ({ ...prev, [type]: [...(prev[type] || []), newItem] }));
    const removeArrayItem = (type, index) => setFormData(prev => ({ ...prev, [type]: (prev[type] || []).filter((_, i) => i !== index) }));
    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) { setCeoPicFile(file); setCeoPicPreview(URL.createObjectURL(file)); setRemoveCeoPic(false); }
    };
    const handleRemovePic = () => { setCeoPicFile(null); setCeoPicPreview(''); setRemoveCeoPic(true); };
    const handleCvFileChange = (e) => { if (e.target.files[0]) setCvFile(e.target.files[0]); };

    const handleSubmit = async () => {
        setBtnLoading(true);
        const dataToSave = new FormData();
        
        if (editMode === 'cv') {
            if (!cvFile) { toast.error("Please select a CV file to upload."); setBtnLoading(false); return; }
            dataToSave.append('cv', cvFile);
        } else {
            Object.keys(formData).forEach(key => {
                 if (Array.isArray(formData[key])) dataToSave.append(key, JSON.stringify(formData[key]));
                 else dataToSave.append(key, formData[key]);
            });
            if (ceoPicFile) dataToSave.append('ceoPic', ceoPicFile);
            if (removeCeoPic) dataToSave.append('removeCeoPic', 'true');
        }
        
        const success = await onSave(organization._id, dataToSave, editMode === 'cv');
        if (success) onClose();
        setBtnLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-gray-800">Edit CEO Profile</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="CEO Name" name="ceoName" value={formData.ceoName} onChange={handleChange} />
                                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">CEO Picture</label>
                                        <div className="flex items-center gap-4">
                                            {ceoPicPreview ? (
                                                <div className="relative"><img src={ceoPicPreview} alt="CEO" className="w-20 h-20 rounded-full object-cover" /><button onClick={handleRemovePic} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X size={14} /></button></div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><UserCircle size={32} /></div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handlePicChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                        </div>
                                    </div>

                                    <InputField label="Skills (comma separated)" name="ceoSkills" value={formData.ceoSkills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="ceoTools" value={formData.ceoTools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Experience</h3>
                                    {(formData.ceoExperience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('ceoExperience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('ceoExperience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('ceoExperience', index, 'duration', e.target.value)} />
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
                                                <textarea placeholder="Job Description" value={exp.description || ''} onChange={e => handleArrayChange('ceoExperience', index, 'description', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                                            </div>
                                            <button onClick={() => removeArrayItem('ceoExperience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoExperience', { title: '', company: '', duration: '', description: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Education</h3>
                                    {(formData.ceoEducation || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('ceoEducation', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('ceoEducation', index, 'institution', e.target.value)} />
                                            <InputField label="Duration" value={edu.year} onChange={e => handleArrayChange('ceoEducation', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('ceoEducation', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoEducation', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Certifications</h3>
                                    {(formData.ceoCertifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('ceoCertifications', index, 'title', e.target.value)} />
                                            <InputField label="Issuer" value={cert.issuer} onChange={e => handleArrayChange('ceoCertifications', index, 'issuer', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('ceoCertifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('ceoCertifications', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoCertifications', { title: '', issuer: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-gray-500 mb-2">This will parse the CV and replace existing data.</p>
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvFileChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                    {cvFile && <div className="mt-4 bg-slate-100 p-3 rounded-lg text-sm">Selected: <span className="font-medium text-indigo-600">{cvFile.name}</span></div>}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
                            <Button variant="ghost" className="border border-slate-300" onClick={onClose} disabled={btnLoading}>Cancel</Button>
                            <Button onClick={handleSubmit} className="w-40" disabled={btnLoading}>
                                {btnLoading ? <Loader2 className="animate-spin" /> : (editMode === 'cv' ? 'Upload & Save' : 'Save Changes')}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
