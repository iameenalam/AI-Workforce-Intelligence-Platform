"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Briefcase, BookOpen, Lightbulb, Wrench, FileText, Award, Mail, Building2, User, UserCircle, X, Loader2, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
import { InputField, AddItemButton, BackButton } from "./Reusable";


const EmployeeCard = ({ member, deptMap, onNavigate, onEditHod, onDeleteHod, onEditTm, onDeleteTm, getProfileLink }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-purple-500/50 transition-all duration-300"
        >
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-slate-900 flex-shrink-0">
                            {member.name ? member.name[0] : "?"}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white truncate">{member.name}</h3>
                            <p className="text-purple-400 font-medium">{member.role}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Button onClick={() => setDropdownOpen(!dropdownOpen)} variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-10"
                                >
                                    <button onClick={() => { onNavigate(getProfileLink(member)); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"><Eye className="h-4 w-4 text-green-400" /> View Profile</button>
                                    {member.type === 'hod' ? (
                                        <>
                                            <button onClick={() => { onEditHod(member.linkId); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"><Edit className="h-4 w-4 text-blue-400" /> Edit</button>
                                            <button onClick={() => { onDeleteHod(member.linkId); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /> Delete</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { onEditTm(member); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"><Edit className="h-4 w-4 text-blue-400" /> Edit</button>
                                            <button onClick={() => { onDeleteTm(member._id); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /> Delete</button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-400">
                        <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>{deptMap[member.department] || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export function Employees({ employees, departments, onNavigate, onEditHod, onDeleteHod, onEditTm, onDeleteTm }) {
    const deptMap = (departments || []).reduce((acc, dept) => {
        acc[dept._id] = dept.departmentName;
        return acc;
    }, {});

    const getProfileLink = (emp) => {
        switch(emp.type) {
            case 'hod': return `/hod/${emp.linkId}`;
            case 'teammember': return `/employee/${emp.linkId}`;
            default: return '#';
        }
    };

    return (
        <div className="p-4 sm:p-6">
             {(employees && employees.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {employees.map(member => (
                           <EmployeeCard
                                key={member.key}
                                member={member}
                                deptMap={deptMap}
                                onNavigate={onNavigate}
                                onEditHod={onEditHod}
                                onDeleteHod={onDeleteHod}
                                onEditTm={onEditTm}
                                onDeleteTm={onDeleteTm}
                                getProfileLink={getProfileLink}
                            />
                        ))}
                    </AnimatePresence>
                </div>
             ) : (
                <div className="text-center py-20">
                    <UserCircle className="mx-auto h-16 w-16 text-slate-600" />
                    <h3 className="mt-4 text-lg font-semibold text-white">No Employees Found</h3>
                    <p className="mt-1 text-slate-400">There are currently no employees to display.</p>
                </div>
             )}
        </div>
    );
}


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

export const EditHodModal = ({ isOpen, onClose, department, onSave }) => {
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState('manual');
    const [hodPicFile, setHodPicFile] = useState(null);
    const [hodPicPreview, setHodPicPreview] = useState('');
    const [removeHodPic, setRemoveHodPic] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const { btnLoading } = useSelector(state => state.departments);

    useEffect(() => {
        if (department) {
            setFormData({
                hodName: department.hodName || '',
                hodEmail: department.hodEmail || '',
                role: department.role || '',
                hodSkills: department.hodSkills?.join(', ') || '',
                hodTools: department.hodTools?.join(', ') || '',
                hodExperience: JSON.parse(JSON.stringify(department.hodExperience || [])),
                hodEducation: JSON.parse(JSON.stringify(department.hodEducation || [])),
                hodCertifications: JSON.parse(JSON.stringify(department.hodCertifications || [])),
            });
            setHodPicPreview(department.hodPic || '');
            setHodPicFile(null);
            setRemoveHodPic(false);
            setCvFile(null);
            setEditMode('manual');
        }
    }, [department]);

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
            setHodPicFile(file);
            setHodPicPreview(URL.createObjectURL(file));
            setRemoveHodPic(false);
        }
    };
    
    const handleRemovePic = () => {
        setHodPicFile(null);
        setHodPicPreview('');
        setRemoveHodPic(true);
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
            if (hodPicFile) {
                dataToSave.append('hodPic', hodPicFile);
            }
            if (removeHodPic) {
                dataToSave.append('removeHodPic', 'true');
            }
        }
        
        const success = await onSave(department._id, dataToSave, editMode === 'cv');
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
                            <h2 className="text-xl font-bold">Edit HOD Profile</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-900/50 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="HOD Name" name="hodName" value={formData.hodName} onChange={handleChange} />
                                    <InputField label="HOD Email" name="hodEmail" value={formData.hodEmail} onChange={handleChange} />
                                    <InputField label="Role" name="role" value={formData.role} onChange={handleChange} />
                                    
                                    <div>
                                        <label className="text-sm font-medium text-slate-300 block mb-1.5">HOD Picture</label>
                                        <div className="flex items-center gap-4">
                                            {hodPicPreview ? (
                                                <div className="relative">
                                                    <img src={hodPicPreview} alt="HOD Preview" className="w-20 h-20 rounded-full object-cover" />
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

                                    <InputField label="Skills (comma separated)" name="hodSkills" value={formData.hodSkills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="hodTools" value={formData.hodTools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Experience</h3>
                                    {(formData.hodExperience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('hodExperience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('hodExperience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('hodExperience', index, 'duration', e.target.value)} />
                                            <textarea placeholder="Job Description" value={exp.description || ''} onChange={e => handleArrayChange('hodExperience', index, 'description', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors" />
                                            <button onClick={() => removeArrayItem('hodExperience', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodExperience', { title: '', company: '', duration: '', description: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Education</h3>
                                    {(formData.hodEducation || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('hodEducation', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('hodEducation', index, 'institution', e.target.value)} />
                                            <InputField label="Year" value={edu.year} onChange={e => handleArrayChange('hodEducation', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('hodEducation', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodEducation', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Certifications</h3>
                                    {(formData.hodCertifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('hodCertifications', index, 'title', e.target.value)} />
                                            <InputField label="Location" value={cert.location} onChange={e => handleArrayChange('hodCertifications', index, 'location', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('hodCertifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('hodCertifications', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodCertifications', { title: '', location: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-slate-400 mb-2">This will parse the CV and replace all existing experience, education, skills, and certification data for this HOD.</p>
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

export const EditTeammemberModal = ({ isOpen, onClose, teammember, onSave }) => {
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState('manual');
    const [cvFile, setCvFile] = useState(null);
    const { btnLoading } = useSelector(state => state.teammembers);

    useEffect(() => {
        if (teammember) {
            setFormData({
                name: teammember.name || '',
                email: teammember.email || '',
                role: teammember.role || '',
                skills: teammember.skills?.join(', ') || '',
                tools: teammember.tools?.join(', ') || '',
                experience: JSON.parse(JSON.stringify(teammember.experience || [])),
                education: JSON.parse(JSON.stringify(teammember.education || [])),
                certifications: JSON.parse(JSON.stringify(teammember.certifications || [])),
            });
            setCvFile(null);
            setEditMode('manual');
        }
    }, [teammember]);

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
        }
        
        const success = await onSave(teammember._id, dataToSave, editMode === 'cv');
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
                            <h2 className="text-xl font-bold">Edit Team Member</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-900/50 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                                    <InputField label="Role" name="role" value={formData.role} onChange={handleChange} />
                                    <InputField label="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="tools" value={formData.tools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Experience</h3>
                                    {(formData.experience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('experience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('experience', index, 'duration', e.target.value)} />
                                            <textarea placeholder="Job Description" value={exp.description || ''} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors" />
                                            <button onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', description: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Education</h3>
                                    {(formData.education || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} />
                                            <InputField label="Year" value={edu.year} onChange={e => handleArrayChange('education', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('education', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-purple-400 border-b border-purple-800 pb-2 mt-6">Certifications</h3>
                                    {(formData.certifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('certifications', index, 'title', e.target.value)} />
                                            <InputField label="Location" value={cert.location} onChange={e => handleArrayChange('certifications', index, 'location', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('certifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('certifications', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('certifications', { title: '', location: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-slate-300 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-slate-400 mb-2">This will parse the CV and replace all existing experience, education, skills, and certification data for this Team Member.</p>
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
