"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Workflow, Building2, UserCircle, Users, Network, X, Loader2, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputField, AddItemButton, BackButton, ViewProfileButton } from "./Reusable";

const DepartmentCard = ({ dept, memberCount, onNavigate, onEdit, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-rose-500/50 transition-all duration-300"
        >
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-slate-900 flex-shrink-0">
                           <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white truncate">{dept.departmentName}</h3>
                            <p className="text-rose-400 font-medium">Department</p>
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
                                    <button onClick={() => { onNavigate(`/department/${dept._id}`); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"><Eye className="h-4 w-4 text-green-400" /> View Profile</button>
                                    <button onClick={() => { onEdit(dept); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"><Edit className="h-4 w-4 text-blue-400" /> Edit</button>
                                    <button onClick={() => { onDelete(dept._id); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800"><Trash2 className="h-4 w-4" /> Delete</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-3 text-slate-300">
                        <UserCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>HOD: {dept.hodName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300">
                        <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>{memberCount[dept._id] || 0} Members</span>
                    </div>
                     <div className="flex items-center gap-3 text-slate-300">
                        <Workflow className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span>{dept.subfunctions?.length || 0} Sub-functions</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export function Departments({ departments, teammembers, onNavigate, onEdit, onDelete }) {
    const memberCount = (departments || []).reduce((acc, dept) => {
        acc[dept._id] = (dept.hodName ? 1 : 0) + (teammembers || []).filter(tm => tm.department === dept._id).length;
        return acc;
    }, {});

    return (
        <div className="p-4 sm:p-6">
             {(departments && departments.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {departments.map(dept => (
                           <DepartmentCard
                                key={dept._id}
                                dept={dept}
                                memberCount={memberCount}
                                onNavigate={onNavigate}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
             ) : (
                <div className="text-center py-20">
                    <Building2 className="mx-auto h-16 w-16 text-slate-600" />
                    <h3 className="mt-4 text-lg font-semibold text-white">No Departments Found</h3>
                    <p className="mt-1 text-slate-400">There are currently no departments to display.</p>
                </div>
             )}
        </div>
    );
}

export const DepartmentProfilePage = ({ department, teammembers, onBack, onNavigate }) => {
    const relevantTeamMembers = teammembers?.filter(tm => tm.department === department._id) || [];
    const totalTeamMembers = (department.hodName ? 1 : 0) + relevantTeamMembers.length;

    return (
        <div className="p-4 sm:p-8">
            <BackButton onClick={onBack} />
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center ring-4 ring-slate-900">
                            <Building2 className="w-12 h-12" />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <p className="text-lg font-medium text-rose-400">Department</p>
                            <h1 className="text-3xl font-bold text-white">{department.departmentName}</h1>
                            <p className="mt-2 text-slate-300">{department.departmentDetails}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
                            <div className="flex-shrink-0 bg-indigo-900/50 text-indigo-400 rounded-full p-3"><UserCircle className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">Department Head</p>
                                <p className="text-lg font-semibold text-white">{department.hodName}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center gap-4">
                            <div className="flex-shrink-0 bg-indigo-900/50 text-indigo-400 rounded-full p-3"><Users className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-400">Total Team Members</p>
                                <p className="text-lg font-semibold text-white">{totalTeamMembers} Members</p>
                            </div>
                        </div>
                    </div>
                     <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Sub-functions</h3>
                      {department.subfunctions?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {department.subfunctions.map((sf, idx) => (
                            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{sf.name}</p>
                                    <p className="text-sm text-slate-400">{teammembers.filter(tm => tm.subfunctionIndex === idx && tm.department === department._id).length} Members</p>
                                </div>
                                <ViewProfileButton onClick={() => onNavigate(`/subfunction/${department._id}/${idx}`)} />
                            </div>
                          ))}
                        </div>
                      ) : (
                         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-800/50 py-12 text-center">
                            <Network className="h-10 w-10 text-slate-500" />
                            <p className="mt-4 font-medium text-slate-300">No Sub-functions</p>
                         </div>
                      )}
                     </div>
                </div>
             </motion.div>
        </div>
    );
};

export const SubfunctionProfilePage = ({ department, subfunction, teammembers, onBack, onNavigate, onEdit, onDelete }) => {
    const subfunctionMembers = teammembers.filter(tm => tm.department === department._id && tm.subfunctionIndex === subfunction.index);

    return (
        <div className="p-4 sm:p-8">
            <BackButton onClick={onBack} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50 mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center ring-4 ring-slate-900">
                            <Workflow className="w-12 h-12" />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <p className="text-lg font-medium text-teal-400">Sub-function</p>
                            <h1 className="text-3xl font-bold text-white">{subfunction.name}</h1>
                            <p className="mt-2 text-slate-300">{subfunction.details || `Key operations within the ${department.departmentName} department.`}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700/50">
                    <h2 className="text-2xl font-bold text-white mb-6">Team Members ({subfunctionMembers.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="p-4 text-sm font-semibold text-slate-300">Name</th>
                                    <th className="p-4 text-sm font-semibold text-slate-300">Role</th>
                                    <th className="p-4 text-sm font-semibold text-slate-300 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subfunctionMembers.length > 0 ? subfunctionMembers.map(member => (
                                    <tr key={member._id} className="border-b border-slate-800 hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 font-medium text-white">{member.name}</td>
                                        <td className="p-4 text-slate-300">{member.role}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <ViewProfileButton onClick={() => onNavigate(`/employee/${member._id}`)} />
                                                <Button onClick={() => onEdit(member)} variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/50 hover:text-blue-300"><Edit className="h-4 w-4" /></Button>
                                                <Button onClick={() => onDelete(member._id)} variant="ghost" size="sm" className="text-red-400 hover:bg-red-900/50 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="text-center p-8 text-slate-400">No members in this sub-function.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const EditDepartmentModal = ({ isOpen, onClose, department, onSave }) => {
    const [formData, setFormData] = useState({});
    const { btnLoading } = useSelector(state => state.departments);

    useEffect(() => {
        if (department) {
            setFormData({
                departmentName: department.departmentName || '',
                departmentDetails: department.departmentDetails || '',
                subfunctions: JSON.parse(JSON.stringify(department.subfunctions || [])),
            });
        }
    }, [department]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubfunctionChange = (index, field, value) => {
        setFormData(prev => {
            const updatedSubfunctions = [...prev.subfunctions];
            updatedSubfunctions[index] = { ...updatedSubfunctions[index], [field]: value };
            return { ...prev, subfunctions: updatedSubfunctions };
        });
    };
    
    const addSubfunction = () => {
        setFormData(prev => ({ ...prev, subfunctions: [...(prev.subfunctions || []), { name: '', details: '' }] }));
    };

    const removeSubfunction = (index) => {
        const updatedSubfunctions = (formData.subfunctions || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subfunctions: updatedSubfunctions }));
    };

    const handleSubmit = async () => {
        const dataToSave = new FormData();
        dataToSave.append('departmentName', formData.departmentName);
        dataToSave.append('departmentDetails', formData.departmentDetails);
        dataToSave.append('subfunctions', JSON.stringify(formData.subfunctions));
        
        await onSave(department._id, dataToSave);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-800/80 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <h2 className="text-xl font-bold">Edit Department</h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            <h3 className="text-lg font-semibold text-sky-400 border-b border-sky-800 pb-2">Department Info</h3>
                            <InputField label="Department Name" name="departmentName" value={formData.departmentName} onChange={handleChange} />
                            <InputField label="Department Details" name="departmentDetails" value={formData.departmentDetails} onChange={handleChange} />

                            <h3 className="text-lg font-semibold text-teal-400 border-b border-teal-800 pb-2 mt-6">Sub-functions</h3>
                            {(formData.subfunctions || []).map((sf, index) => (
                                <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 relative">
                                    <InputField label={`Sub-function ${index + 1} Name`} name={`sf-name-${index}`} value={sf.name} onChange={(e) => handleSubfunctionChange(index, 'name', e.target.value)} />
                                    <div className="mt-2">
                                        <InputField label="Details" name={`sf-details-${index}`} value={sf.details} onChange={(e) => handleSubfunctionChange(index, 'details', e.target.value)} />
                                    </div>
                                    <button onClick={() => removeSubfunction(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            <AddItemButton onClick={addSubfunction}>Add Sub-function</AddItemButton>
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
