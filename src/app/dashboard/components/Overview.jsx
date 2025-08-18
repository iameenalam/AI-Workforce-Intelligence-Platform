"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Network, User, Users, Building2, Workflow, MapPin, Calendar, Building, Laptop, Scaling, Mail, BookOpen, Lightbulb, Wrench, FileText, Award, Briefcase, UserCircle, Edit, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { InputField, SelectField, AddItemButton, BackButton, ViewProfileButton } from "./Reusable";

const StatCard = ({ title, value, icon, onButtonClick }) => (
    <div className="bg-slate-800/70 p-6 rounded-xl border border-slate-700/80 flex items-center justify-between transition-all duration-300 hover:border-sky-500/50">
        <div className="flex items-center gap-5">
            <div className="p-3 rounded-full bg-slate-800">{icon}</div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-white truncate">{value}</p>
            </div>
        </div>
        <ViewProfileButton onClick={onButtonClick} />
    </div>
);

export function Overview({ organization, departments, onNavigate, setActiveTab, totalEmployees }) {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Organization" 
                    value={organization?.name || 'N/A'} 
                    icon={<Network className="h-7 w-7 text-sky-400" />} 
                    onButtonClick={() => onNavigate(`/organization/${organization?._id}`)}
                />
                <StatCard 
                    title="CEO" 
                    value={organization?.ceoName || 'N/A'} 
                    icon={<User className="h-7 w-7 text-purple-400" />} 
                    onButtonClick={() => onNavigate(`/ceo/${organization?._id}`)}
                />
                <StatCard 
                    title="Total Employees" 
                    value={totalEmployees} 
                    icon={<Users className="h-7 w-7 text-purple-400" />} 
                    onButtonClick={() => setActiveTab('employees')}
                />
                <StatCard 
                    title="Total Departments" 
                    value={departments?.length || 0} 
                    icon={<Building2 className="h-7 w-7 text-rose-400" />} 
                    onButtonClick={() => setActiveTab('departments')}
                />
            </div>
        </div>
    );
}

export const OrganizationProfilePage = ({ organization, departments, teammembers, onBack, onEdit, onDelete }) => {
    if (!organization) {
        return (
            <div className="p-4 sm:p-8 h-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
            </div>
        );
    }

    const totalHods = departments?.length || 0;
    const totalTeamMembers = teammembers?.length || 0;
    const totalEmployees = totalHods + totalTeamMembers;
    const totalSubFunctions = departments?.reduce((acc, dept) => acc + (dept.subfunctions?.length || 0), 0);

    const StatCard = ({ icon, label, value }) => (
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 flex items-center gap-4">
        <div className="flex-shrink-0 bg-sky-900/50 text-sky-400 rounded-full p-3">{icon}</div>
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    );

    return (
        <div className="p-4 sm:p-8">
            <BackButton onClick={onBack} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="flex-shrink-0">
                            {organization.logoUrl ? (
                                <img src={organization.logoUrl} alt={`${organization.name} Logo`} className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-900" />
                            ) : (
                                <div className="w-24 h-24 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-slate-900">
                                    <Network className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold text-white sm:text-4xl">{organization.name}</h1>
                            <p className="text-lg font-medium text-sky-400 sm:text-xl">{organization.industry}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <Button onClick={() => onEdit(organization)} variant="ghost" className="text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 flex items-center gap-2 px-3 py-2"><Edit className="h-4 w-4"/>Edit</Button>
                            <Button onClick={() => onDelete()} variant="ghost" className="text-red-400 hover:bg-red-900/50 hover:text-red-300 flex items-center gap-2 px-3 py-2"><Trash2 className="h-4 w-4"/>Delete</Button>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50">
                    <h2 className="mb-6 text-2xl font-bold text-white">Organization Details</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard icon={<User className="h-6 w-6" />} label="CEO" value={organization.ceoName} />
                        <StatCard icon={<Users className="h-6 w-6" />} label="Total Employees" value={totalEmployees} />
                        <StatCard icon={<Building2 className="h-6 w-6" />} label="Total Departments" value={totalHods} />
                        <StatCard icon={<Workflow className="h-6 w-6" />} label="Total Sub-Functions" value={totalSubFunctions} />
                        <StatCard icon={<MapPin className="h-6 w-6" />} label="Location" value={`${organization.city}, ${organization.country}`} />
                        <StatCard icon={<Calendar className="h-6 w-6" />} label="Year Founded" value={organization.yearFounded} />
                        <StatCard icon={<Building className="h-6 w-6" />} label="Number of Offices" value={organization.numberOfOffices} />
                        <StatCard icon={<Laptop className="h-6 w-6" />} label="Work Model" value={organization.workModel} />
                        <StatCard icon={<Scaling className="h-6 w-6" />} label="Hiring Level" value={organization.hiringLevel} />
                        <StatCard icon={<Scaling className="h-6 w-6" />} label="Company Size" value={organization.companySize} />
                        <StatCard icon={<Building className="h-6 w-6" />} label="Organization Type" value={organization.organizationType} />
                        <StatCard icon={<Wrench className="h-6 w-6" />} label="HR Tools Used" value={organization.hrToolsUsed} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const GenericProfilePage = ({ person, onBack, isCeoProfile, onEdit }) => {
    const { name, role, email, departmentName, reportsTo, pic, education = [], experience = [], skills = [], tools = [], certifications = [] } = person;
    const [activeTab, setActiveTab] = useState("experience");
    
    const TABS = [
        { value: "experience", label: "Experience", icon: <Briefcase /> },
        { value: "education", label: "Education", icon: <BookOpen /> },
        { value: "skills", label: "Skills", icon: <Lightbulb /> },
        { value: "tools", label: "Tools", icon: <Wrench /> },
        { value: "job-description", label: "Job Description", icon: <FileText /> },
        { value: "certifications", label: "Certifications", icon: <Award /> },
    ];

    const EmptyState = ({ text, icon }) => (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/50 py-12 text-center">
            {icon}
            <p className="mt-4 font-medium text-slate-300">{text}</p>
        </div>
    );

    return (
        <div className="p-4 sm:p-8">
            <BackButton onClick={onBack} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                            {pic ? (
                                <img src={pic} alt={name} className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-900" />
                            ) : (
                                <div className="w-24 h-24 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-slate-900">
                                    {name ? name[0] : "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow text-center sm:text-left min-w-0">
                            <h1 className="truncate text-3xl font-bold text-white">{name}</h1>
                            <p className="text-lg font-medium text-purple-400">{role}</p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2 text-slate-300">
                                <span className="flex items-center gap-2 truncate"><Mail className="w-5 h-5 text-slate-500" />{email}</span>
                                {departmentName && <span className="flex items-center gap-2 truncate"><Building2 className="w-5 h-5 text-slate-500" />{departmentName}</span>}
                                {reportsTo && <span className="font-medium flex items-center gap-2 truncate"><User className="w-5 h-5 text-slate-500" />Reports To: <span className="font-normal">{reportsTo}</span></span>}
                            </div>
                        </div>
                        {isCeoProfile && (
                             <div className="flex-shrink-0">
                                 <Button onClick={onEdit} variant="ghost" className="text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 flex items-center gap-2 px-3 py-2"><Edit className="h-4 w-4"/>Edit</Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50">
                    <div className="border-b border-slate-700">
                        <nav className="-mb-px flex justify-start gap-x-6 overflow-x-auto" aria-label="Tabs">
                            {TABS.map((tab) => (
                                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                                    className={`shrink-0 flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                                    activeTab === tab.value ? "border-purple-500 text-purple-400" : "border-transparent text-slate-400 hover:border-slate-600 hover:text-white"
                                    }`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                {activeTab === 'experience' && (experience.length > 0 ? experience.map((job, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-700 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-slate-900 border-2 border-purple-500 rounded-full"></div><h3 className="text-lg font-bold text-white">{job.title}</h3><p className="font-medium text-slate-300">{job.company}</p><p className="text-sm text-slate-400 mt-1">{job.duration}</p></div>) : <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-slate-500" />} />)}
                                {activeTab === 'education' && (education.length > 0 ? education.map((edu, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-700 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-slate-900 border-2 border-purple-500 rounded-full"></div><h3 className="text-lg font-bold text-white">{edu.degree}</h3><p className="font-medium text-slate-300">{edu.institution}</p><p className="text-sm text-slate-400 mt-1">{edu.year}</p></div>) : <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-slate-500" />} />)}
                                {activeTab === 'skills' && (skills.length > 0 ? <div className="flex flex-wrap gap-3">{skills.map((skill, idx) => <span key={idx} className="bg-purple-500/10 text-purple-300 text-sm font-medium px-4 py-2 rounded-full">{skill}</span>)}</div> : <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-slate-500" />} />)}
                                {activeTab === 'tools' && (tools.length > 0 ? <div className="flex flex-wrap gap-3">{tools.map((tool, idx) => <span key={idx} className="bg-purple-500/10 text-purple-300 text-sm font-medium px-4 py-2 rounded-full">{tool}</span>)}</div> : <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-slate-500" />} />)}
                                {activeTab === 'job-description' && (experience.some(job => job.description) ? (<ul className="list-disc pl-5 space-y-2 text-slate-300">{experience.filter(job => job.description).map((job, idx) => (<li key={idx}>{job.description}</li>))}</ul>) : <EmptyState text="No Job Descriptions Available" icon={<FileText className="h-10 w-10 text-slate-500" />} />)}
                                {activeTab === 'certifications' && (certifications.length > 0 ? certifications.map((cert, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-700 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-slate-900 border-2 border-purple-500 rounded-full"></div><h3 className="text-lg font-bold text-white">{cert.title}</h3><p className="font-medium text-slate-300">{cert.location}</p><p className="text-sm text-slate-400 mt-1">{cert.duration}</p></div>) : <EmptyState text="No Certifications Listed" icon={<Award className="h-10 w-10 text-slate-500" />} />)}
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
    const { btnLoading } = useSelector(state => state.organization);

    const industries = ["Healthcare and Social Assistance", "Finance and Insurance", "Professional, Scientific and Technical Services", "Information Technology (IT) and Software", "Telecommunications"];
    const companySizes = ["150-300", "300-450", "450-600", "600-850", "850-1000", "1000+", "5000+"];
    const orgTypes = ["Private", "Public", "Non-Profit", "Government"];
    const hiringLevels = ["Low", "Moderate", "High"];
    const workModels = ["Onsite", "Remote", "Hybrid", "Mixed"];

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                industry: organization.industry || '',
                companySize: organization.companySize || '',
                city: organization.city || '',
                country: organization.country || '',
                yearFounded: organization.yearFounded || '',
                organizationType: organization.organizationType || '',
                numberOfOffices: organization.numberOfOffices || '',
                hrToolsUsed: organization.hrToolsUsed || '',
                hiringLevel: organization.hiringLevel || '',
                workModel: organization.workModel || '',
            });
            setLogoPreview(organization.logoUrl || '');
            setLogoFile(null);
            setRemoveLogo(false);
        }
    }, [organization]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            setRemoveLogo(false);
        }
    };
    
    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(true);
    };

    const handleSubmit = async () => {
        const dataToSave = new FormData();
        Object.keys(formData).forEach(key => {
            dataToSave.append(key, formData[key]);
        });
        if (logoFile) {
            dataToSave.append('logoUrl', logoFile);
        }
        if (removeLogo) {
            dataToSave.append('removeLogo', 'true');
        }
        
        const success = await onSave(dataToSave);
        if (success) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800/80 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold">Edit Organization</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Organization Name" name="name" value={formData.name} onChange={handleChange} />
                            <SelectField label="Industry" name="industry" value={formData.industry} onChange={handleChange}>
                                <option value="">Select Industry</option>
                                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                            </SelectField>
                            <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
                            <InputField label="Country" name="country" value={formData.country} onChange={handleChange} />
                            <InputField label="Year Founded" name="yearFounded" type="number" value={formData.yearFounded} onChange={handleChange} />
                            <InputField label="Number of Offices" name="numberOfOffices" type="number" value={formData.numberOfOffices} onChange={handleChange} />
                            <InputField label="HR Tools Used" name="hrToolsUsed" value={formData.hrToolsUsed} onChange={handleChange} />
                             <SelectField label="Company Size" name="companySize" value={formData.companySize} onChange={handleChange}>
                                <option value="">Select Size</option>
                                {companySizes.map(size => <option key={size} value={size}>{size}</option>)}
                            </SelectField>
                            <SelectField label="Organization Type" name="organizationType" value={formData.organizationType} onChange={handleChange}>
                                <option value="">Select Type</option>
                                {orgTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </SelectField>
                            <SelectField label="Hiring Level" name="hiringLevel" value={formData.hiringLevel} onChange={handleChange}>
                                <option value="">Select Level</option>
                                {hiringLevels.map(level => <option key={level} value={level}>{level}</option>)}
                            </SelectField>
                            <SelectField label="Work Model" name="workModel" value={formData.workModel} onChange={handleChange}>
                                <option value="">Select Model</option>
                                {workModels.map(model => <option key={model} value={model}>{model}</option>)}
                            </SelectField>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-slate-300 block mb-1.5">Organization Logo</label>
                                <div className="flex items-center gap-4">
                                    {logoPreview ? (
                                        <div className="relative">
                                            <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 rounded-full object-cover" />
                                            <button onClick={handleRemoveLogo} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-slate-500">
                                            <Network size={32} />
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleLogoChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-900/50 file:text-sky-300 hover:file:bg-sky-900" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose} disabled={btnLoading}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-sky-600 hover:bg-sky-700 text-white w-32" disabled={btnLoading}>
                                {btnLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                            </Button>
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
    const { btnLoading } = useSelector(state => state.organization);

    useEffect(() => {
        if (organization) {
            setFormData({
                ceoName: organization.ceoName || '',
                email: organization.email || '',
                ceoSkills: organization.ceoSkills?.join(', ') || '',
                ceoTools: organization.ceoTools?.join(', ') || '',
                ceoExperience: JSON.parse(JSON.stringify(organization.ceoExperience || [])),
                ceoEducation: JSON.parse(JSON.stringify(organization.ceoEducation || [])),
                ceoCertifications: JSON.parse(JSON.stringify(organization.ceoCertifications || [])),
            });
            setCeoPicPreview(organization.ceoPic || '');
            setCeoPicFile(null);
            setRemoveCeoPic(false);
            setCvFile(null);
            setEditMode('manual');
        }
    }, [organization]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleArrayChange = (type, index, field, value) => {
        setFormData(prev => {
            const newArray = [...prev[type]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [type]: newArray };
        });
    };

    const addArrayItem = (type, newItem) => {
        setFormData(prev => ({...prev, [type]: [...(prev[type] || []), newItem]}));
    };

    const removeArrayItem = (type, index) => {
        setFormData(prev => ({...prev, [type]: (prev[type] || []).filter((_, i) => i !== index)}));
    };

    const handlePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCeoPicFile(file);
            setCeoPicPreview(URL.createObjectURL(file));
            setRemoveCeoPic(false);
        }
    };
    
    const handleRemovePic = () => {
        setCeoPicFile(null);
        setCeoPicPreview('');
        setRemoveCeoPic(true);
    };

    const handleCvFileChange = (e) => {
        if (e.target.files[0]) {
            setCvFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        const dataToSave = new FormData();
        
        if (editMode === 'cv') {
            if (!cvFile) {
                toast.error("Please select a CV file to upload.");
                return;
            }
            dataToSave.append('cv', cvFile);
        } else {
            Object.keys(formData).forEach(key => {
                 if (Array.isArray(formData[key])) {
                    dataToSave.append(key, JSON.stringify(formData[key]));
                } else {
                    dataToSave.append(key, formData[key]);
                }
            });
            if (ceoPicFile) {
                dataToSave.append('ceoPic', ceoPicFile);
            }
            if (removeCeoPic) {
                dataToSave.append('removeCeoPic', 'true');
            }
        }
        
        const success = await onSave(organization._id, dataToSave, editMode === 'cv');
        if (success) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800/80 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold">Edit CEO Profile</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-900/50 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="CEO Name" name="ceoName" value={formData.ceoName} onChange={handleChange} />
                                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                                    
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-1.5">CEO Picture</label>
                                        <div className="flex items-center gap-4">
                                            {ceoPicPreview ? (
                                                <div className="relative">
                                                    <img src={ceoPicPreview} alt="CEO Preview" className="w-20 h-20 rounded-full object-cover" />
                                                    <button onClick={handleRemovePic} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-slate-500">
                                                    <UserCircle size={32} />
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handlePicChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-900/50 file:text-sky-300 hover:file:bg-sky-900" />
                                        </div>
                                    </div>

                                    <InputField label="Skills (comma separated)" name="ceoSkills" value={formData.ceoSkills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="ceoTools" value={formData.ceoTools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Experience</h3>
                                    {(formData.ceoExperience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('ceoExperience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('ceoExperience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('ceoExperience', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('ceoExperience', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoExperience', { title: '', company: '', duration: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Education</h3>
                                    {(formData.ceoEducation || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('ceoEducation', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('ceoEducation', index, 'institution', e.target.value)} />
                                            <InputField label="Year" value={edu.year} onChange={e => handleArrayChange('ceoEducation', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('ceoEducation', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoEducation', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Certifications</h3>
                                    {(formData.ceoCertifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('ceoCertifications', index, 'title', e.target.value)} />
                                            <InputField label="Location" value={cert.location} onChange={e => handleArrayChange('ceoCertifications', index, 'location', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('ceoCertifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('ceoCertifications', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('ceoCertifications', { title: '', location: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-slate-400 mb-2">This will parse the CV and replace all existing experience, education, skills, and certification data for the CEO.</p>
                                    <div className="flex items-center gap-4">
                                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvFileChange} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-900/50 file:text-sky-300 hover:file:bg-sky-900" />
                                    </div>
                                    {cvFile && (
                                        <div className="mt-4 bg-slate-700/50 p-3 rounded-lg text-sm">
                                            Selected file: <span className="font-medium text-sky-300">{cvFile.name}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose} disabled={btnLoading}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-sky-600 hover:bg-sky-700 text-white w-40" disabled={btnLoading}>
                                {btnLoading ? <Loader2 className="animate-spin" /> : (editMode === 'cv' ? 'Upload & Save' : 'Save Changes')}
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
