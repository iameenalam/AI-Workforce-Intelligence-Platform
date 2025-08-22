"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Briefcase, BookOpen, Lightbulb, Wrench, FileText, Award, Mail, Building2, User, Users, UserCircle, X, Loader2, MoreVertical, Eye, AlertTriangle } from "lucide-react";
import toast from 'react-hot-toast';
import { InputField, AddItemButton, BackButton } from "./Reusable";

const Button = ({ children, onClick, variant, className = '', disabled }) => {
    const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
        ghost: 'bg-transparent hover:bg-slate-100',
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };
    const variantStyle = variantStyles[variant] || variantStyles.primary;
    return <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${className}`} disabled={disabled}>{children}</button>;
};

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


const EmployeeCard = ({ member, deptMap, onNavigate, onEdit, onDelete, getProfileLink }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-purple-300 transition-all duration-300">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white flex-shrink-0">
                            {member.name ? member.name[0] : "?"}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 truncate">{member.name}</h3>
                            <p className="text-purple-600 font-medium">{member.role}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-10"
                                >
                                    <button onClick={() => { onNavigate(getProfileLink(member)); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><Eye className="h-4 w-4 text-green-500" /> View Profile</button>
                                    <button onClick={() => { onEdit(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><Edit className="h-4 w-4 text-blue-500" /> Edit</button>
                                    <button onClick={() => { onDelete(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-800 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{deptMap[member.department] || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export function Employees({ employees, departments, onNavigate, onEditHod, onDeleteHod, onEditTm, onDeleteTm }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const deptMap = (departments || []).reduce((acc, dept) => {
        acc[dept._id] = dept.departmentName;
        return acc;
    }, {});

    const getProfileLink = (emp) => {
        switch(emp.type) {
            case 'hod': return `hod/${emp.linkId}`;
            case 'teammember': return `employee/${emp.linkId}`;
            default: return '#';
        }
    };

    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!memberToDelete) return;
        if (memberToDelete.type === 'hod') {
            onDeleteHod(memberToDelete.linkId);
        } else {
            onDeleteTm(memberToDelete._id);
        }
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
    };

    return (
        <>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${memberToDelete?.name}`}
                message="Are you sure you want to delete this employee? This action cannot be undone."
            />
            <div className="p-0 sm:p-6">
                {(employees && employees.length > 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {employees.map(member => (
                           <EmployeeCard
                                key={member.key}
                                member={member}
                                deptMap={deptMap}
                                onNavigate={onNavigate}
                                onEdit={() => member.type === 'hod' ? onEditHod(member.linkId) : onEditTm(member)}
                                onDelete={() => handleDeleteClick(member)}
                                getProfileLink={getProfileLink}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Users className="mx-auto h-16 w-16 text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Employees Found</h3>
                        <p className="mt-1 text-slate-500">There are currently no employees to display.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export const GenericProfilePage = ({ person, onBack, isCeoProfile, onEdit }) => {
    const { name, role, email, departmentName, reportsTo, pic, education = [], experience = [], skills = [], tools = [], certifications = [] } = person;
    const [activeTab, setActiveTab] = useState("experience");
    
    const TABS = [
        { value: "experience", label: "Experience", icon: <Briefcase className="w-5 h-5" /> },
        { value: "education", label: "Education", icon: <BookOpen className="w-5 h-5" /> },
        { value: "skills", label: "Skills", icon: <Lightbulb className="w-5 h-5" /> },
        { value: "tools", label: "Tools", icon: <Wrench className="w-5 h-5" /> },
        { value: "job-description", label: "Job Description", icon: <FileText className="w-5 h-5" /> },
        { value: "certifications", label: "Certifications", icon: <Award className="w-5 h-5" /> },
    ];

    const EmptyState = ({ text, icon }) => (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
            {icon}
            <p className="mt-4 font-semibold text-gray-700">{text}</p>
        </div>
    );

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
                                {activeTab === 'experience' && (experience.length > 0 ? experience.map((job, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{job.title}</h3><p className="font-medium text-gray-600">{job.company}</p><p className="text-sm text-gray-500 mt-1">{job.duration}</p></div>) : <EmptyState text="No Work Experience" icon={<Briefcase className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'education' && (education.length > 0 ? education.map((edu, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3><p className="font-medium text-gray-600">{edu.institution}</p><p className="text-sm text-gray-500 mt-1">{edu.year}</p></div>) : <EmptyState text="No Education History" icon={<BookOpen className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'skills' && (skills.length > 0 ? <div className="flex flex-wrap gap-3">{skills.map((skill, idx) => <span key={idx} className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">{skill}</span>)}</div> : <EmptyState text="No Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'tools' && (tools.length > 0 ? <div className="flex flex-wrap gap-3">{tools.map((tool, idx) => <span key={idx} className="bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full">{tool}</span>)}</div> : <EmptyState text="No Tools Listed" icon={<Wrench className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'job-description' && (experience.some(job => job.description) ? (<ul className="list-disc pl-5 space-y-2 text-gray-600">{experience.filter(job => job.description).map((job, idx) => (<li key={idx}>{job.description}</li>))}</ul>) : <EmptyState text="No Job Descriptions Available" icon={<FileText className="h-10 w-10 text-gray-400" />} />)}
                                {activeTab === 'certifications' && (certifications.length > 0 ? certifications.map((cert, idx) => <div key={idx} className="relative pl-8 sm:pl-10 pb-8 border-l-2 border-slate-200 last:pb-0"><div className="absolute left-[-9px] top-1 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full"></div><h3 className="text-lg font-bold text-gray-800">{cert.title}</h3><p className="font-medium text-gray-600">{cert.location}</p><p className="text-sm text-gray-500 mt-1">{cert.duration}</p></div>) : <EmptyState text="No Certifications Listed" icon={<Award className="h-10 w-10 text-gray-400" />} />)}
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-gray-800">Edit HOD Profile</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="HOD Name" name="hodName" value={formData.hodName} onChange={handleChange} />
                                    <InputField label="HOD Email" name="hodEmail" value={formData.hodEmail} onChange={handleChange} />
                                    <InputField label="Role" name="role" value={formData.role} onChange={handleChange} />
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1.5">HOD Picture</label>
                                        <div className="flex items-center gap-4">
                                            {hodPicPreview ? (
                                                <div className="relative">
                                                    <img src={hodPicPreview} alt="HOD Preview" className="w-20 h-20 rounded-full object-cover" />
                                                    <button onClick={handleRemovePic} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <UserCircle size={32} />
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={handlePicChange} className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                        </div>
                                    </div>

                                    <InputField label="Skills (comma separated)" name="hodSkills" value={formData.hodSkills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="hodTools" value={formData.hodTools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Experience</h3>
                                    {(formData.hodExperience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('hodExperience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('hodExperience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('hodExperience', index, 'duration', e.target.value)} />
                                            <textarea placeholder="Job Description" value={exp.description || ''} onChange={e => handleArrayChange('hodExperience', index, 'description', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                                            <button onClick={() => removeArrayItem('hodExperience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodExperience', { title: '', company: '', duration: '', description: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Education</h3>
                                    {(formData.hodEducation || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('hodEducation', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('hodEducation', index, 'institution', e.target.value)} />
                                            <InputField label="Year" value={edu.year} onChange={e => handleArrayChange('hodEducation', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('hodEducation', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodEducation', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Certifications</h3>
                                    {(formData.hodCertifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('hodCertifications', index, 'title', e.target.value)} />
                                            <InputField label="Location" value={cert.location} onChange={e => handleArrayChange('hodCertifications', index, 'location', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('hodCertifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('hodCertifications', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('hodCertifications', { title: '', location: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-gray-500 mb-2">This will parse the CV and replace all existing data.</p>
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-gray-800">Edit Team Member</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
                                <button onClick={() => setEditMode('manual')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'manual' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Manual Edit</button>
                                <button onClick={() => setEditMode('cv')} className={`w-full p-2 rounded-md text-sm font-semibold transition-colors ${editMode === 'cv' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-slate-200'}`}>Update with CV</button>
                            </div>
                            
                            {editMode === 'manual' ? (
                                <div className="space-y-4">
                                    <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
                                    <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
                                    <InputField label="Role" name="role" value={formData.role} onChange={handleChange} />
                                    <InputField label="Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} />
                                    <InputField label="Tools (comma separated)" name="tools" value={formData.tools} onChange={handleChange} />

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Experience</h3>
                                    {(formData.experience || []).map((exp, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={exp.title} onChange={e => handleArrayChange('experience', index, 'title', e.target.value)} />
                                            <InputField label="Company" value={exp.company} onChange={e => handleArrayChange('experience', index, 'company', e.target.value)} />
                                            <InputField label="Duration" value={exp.duration} onChange={e => handleArrayChange('experience', index, 'duration', e.target.value)} />
                                            <textarea placeholder="Job Description" value={exp.description || ''} onChange={e => handleArrayChange('experience', index, 'description', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                                            <button onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('experience', { title: '', company: '', duration: '', description: '' })}>Add Experience</AddItemButton>
                                    
                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Education</h3>
                                    {(formData.education || []).map((edu, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Degree" value={edu.degree} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} />
                                            <InputField label="Institution" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} />
                                            <InputField label="Year" value={edu.year} onChange={e => handleArrayChange('education', index, 'year', e.target.value)} />
                                            <button onClick={() => removeArrayItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>Add Education</AddItemButton>

                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mt-6">Certifications</h3>
                                    {(formData.certifications || []).map((cert, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-2">
                                            <InputField label="Title" value={cert.title} onChange={e => handleArrayChange('certifications', index, 'title', e.target.value)} />
                                            <InputField label="Location" value={cert.location} onChange={e => handleArrayChange('certifications', index, 'location', e.target.value)} />
                                            <InputField label="Duration" value={cert.duration} onChange={e => handleArrayChange('certifications', index, 'duration', e.target.value)} />
                                            <button onClick={() => removeArrayItem('certifications', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <AddItemButton onClick={() => addArrayItem('certifications', { title: '', location: '', duration: '' })}>Add Certification</AddItemButton>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Upload New CV</label>
                                    <p className="text-xs text-gray-500 mb-2">This will parse the CV and replace all existing data.</p>
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
