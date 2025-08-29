"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Workflow, Building2, UserCircle, Users, Network, X, Loader2, MoreVertical, Eye, AlertTriangle } from "lucide-react";
import { InputField, AddItemButton, BackButton, ViewProfileButton } from "./Reusable";

const Button = ({ children, onClick, variant, className = '', disabled, size }) => {
    const baseStyle = "font-semibold transition-colors flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed";
    const sizeStyles = {
        sm: 'px-2 py-1 rounded-md text-sm',
        default: 'px-4 py-2 rounded-lg',
    };
    const variantStyles = {
        ghost: 'bg-transparent hover:bg-slate-100',
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    const variantStyle = variantStyles[variant] || variantStyles.primary;
    const sizeStyle = sizeStyles[size] || sizeStyles.default;
    return <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} disabled={disabled}>{children}</button>;
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
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


const DepartmentCard = ({ dept, employees, onNavigate, onEdit, onDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const currentHOD = (employees || []).find(emp =>
        emp.department &&
        (emp.department._id === dept._id || emp.department === dept._id) &&
        emp.role === "HOD"
    );

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-rose-300 transition-all duration-300">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl font-bold ring-4 ring-white flex-shrink-0">
                           <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 truncate">{dept.departmentName}</h3>
                            <p className="text-rose-600 font-medium">Department</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Button onClick={() => setDropdownOpen(!dropdownOpen)} variant="ghost" size="sm" className="text-slate-500 hover:bg-slate-100">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-10"
                                >
                                    <button onClick={() => { onNavigate(`/department/${dept._id}`); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><Eye className="h-4 w-4 text-green-500" /> View Department</button>
                                    <button onClick={() => { onEdit(dept); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><Edit className="h-4 w-4 text-blue-500" /> Edit</button>
                                    <button onClick={() => { onDelete(dept); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-3 text-slate-600">
                        <UserCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>HOD: {currentHOD?.name || dept.hodName || 'N/A'}</span>
                    </div>

                     <div className="flex items-center gap-3 text-slate-600">
                        <Workflow className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span>{dept.subfunctions?.length || 0} Sub-functions</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function Departments({ departments, employees, onNavigate, onEdit, onDelete }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);

    const memberCount = (departments || []).reduce((acc, dept) => {
        const deptEmployees = (employees || []).filter(emp =>
            emp.department &&
            (emp.department._id === dept._id || emp.department === dept._id) &&
            emp.role !== "Unassigned"
        );
        acc[dept._id] = deptEmployees.length;
        return acc;
    }, {});
    
    const handleDeleteClick = (department) => {
        setDepartmentToDelete(department);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!departmentToDelete) return;
        onDelete(departmentToDelete._id);
        setIsDeleteModalOpen(false);
        setDepartmentToDelete(null);
    };


    return (
        <>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title={`Delete ${departmentToDelete?.departmentName}`}
                message="Are you sure you want to delete this department? All associated data will be removed. This action cannot be undone."
            />
            <div className="p-0 sm:p-6">
                 {(departments && departments.length > 0) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {departments.map(dept => (
                           <DepartmentCard
                                key={dept._id}
                                dept={dept}
                                employees={employees}
                                onNavigate={onNavigate}
                                onEdit={onEdit}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-20">
                        <Building2 className="mx-auto h-16 w-16 text-slate-400" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Departments Found</h3>
                        <p className="mt-1 text-slate-500">There are currently no departments to display.</p>
                    </div>
                 )}
            </div>
        </>
    );
}

export const DepartmentProfilePage = ({ department, employees, onBack, onNavigate }) => {
    const relevantEmployees = employees?.filter(emp =>
        emp.department &&
        (emp.department._id === department._id || emp.department === department._id) &&
        emp.role !== "Unassigned"
    ) || [];

    const currentHOD = relevantEmployees.find(emp => emp.role === "HOD");
    const totalTeamMembers = relevantEmployees.length;

    return (
        <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
            <BackButton onClick={onBack} />
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 mb-8 shadow-md">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center ring-4 ring-white">
                            <Building2 className="w-12 h-12" />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <p className="text-lg font-medium text-indigo-600">Department</p>
                            <h1 className="text-3xl font-bold text-gray-900">{department.departmentName}</h1>
                            <p className="mt-2 text-slate-600">{department.departmentDetails}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center gap-4">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3"><UserCircle className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Department Head</p>
                                <p className="text-lg font-semibold text-gray-800">{currentHOD?.name || department.hodName || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center gap-4">
                            <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3"><Users className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Team Members</p>
                                <p className="text-lg font-semibold text-gray-800">{totalTeamMembers} Members</p>
                            </div>
                        </div>
                    </div>
                     <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sub-functions</h3>
                      {department.subfunctions?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {department.subfunctions.map((sf, idx) => {
                            const subfunctionEmployees = relevantEmployees.filter(emp => emp.subfunctionIndex === idx && emp.role !== "HOD").length;
                            const totalSubfunctionMembers = subfunctionEmployees;

                            return (
                              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                                  <div>
                                      <p className="font-semibold text-gray-800">{sf.name}</p>
                                      <p className="text-sm text-slate-500">{totalSubfunctionMembers} Members</p>
                                  </div>
                                  <ViewProfileButton onClick={() => onNavigate(`/subfunction/${department._id}/${idx}`)} />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-100/50 py-12 text-center">
                            <Network className="h-10 w-10 text-slate-400" />
                            <p className="mt-4 font-medium text-slate-600">No Sub-functions</p>
                         </div>
                      )}
                     </div>
                </div>
             </motion.div>
        </div>
    );
};

export const SubfunctionProfilePage = ({ department, subfunction, employees, onBack, onNavigate, onEdit, onDelete }) => {
    const subfunctionEmployees = employees?.filter(emp =>
        emp.department &&
        (emp.department._id === department._id || emp.department === department._id) &&
        emp.subfunctionIndex === subfunction.index &&
        emp.role !== "Unassigned" &&
        emp.role !== "HOD"
    ) || [];
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!memberToDelete) return;
        onDelete(memberToDelete._id);
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
                message="Are you sure you want to delete this team member? This action cannot be undone."
            />
            <div className="p-4 sm:p-8 bg-slate-50 min-h-screen">
                <BackButton onClick={onBack} />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md mb-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center ring-4 ring-white">
                                <Workflow className="w-12 h-12" />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <p className="text-lg font-medium text-indigo-600">Sub-function</p>
                                <h1 className="text-3xl font-bold text-gray-900">{subfunction.name}</h1>
                                <p className="mt-2 text-slate-600">{subfunction.details || `Key operations within the ${department.departmentName} department.`}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members ({subfunctionEmployees.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="p-4 text-sm font-semibold text-slate-600">Name</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subfunctionEmployees.map(employee => (
                                        <tr key={`emp-${employee._id}`} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-800">{employee.name}</td>
                                            <td className="p-4 text-slate-600">{employee.role}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <ViewProfileButton onClick={() => onNavigate(`employee/${employee._id}`)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {subfunctionEmployees.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center p-8 text-slate-500">No members in this sub-function.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export const EditDepartmentModal = ({ isOpen, onClose, department, onSave }) => {
    const [formData, setFormData] = useState({});
    const { btnLoading } = useSelector(state => state.departments);
    const [isDeleteSubfunctionModalOpen, setIsDeleteSubfunctionModalOpen] = useState(false);
    const [subfunctionToDelete, setSubfunctionToDelete] = useState(null);

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

    const handleRemoveSubfunctionClick = (index) => {
        setSubfunctionToDelete({
            index,
            name: formData.subfunctions[index].name || `Sub-function ${index + 1}`
        });
        setIsDeleteSubfunctionModalOpen(true);
    };

    const confirmRemoveSubfunction = () => {
        if (subfunctionToDelete === null) return;
        const updatedSubfunctions = (formData.subfunctions || []).filter((_, i) => i !== subfunctionToDelete.index);
        setFormData(prev => ({ ...prev, subfunctions: updatedSubfunctions }));
        setIsDeleteSubfunctionModalOpen(false);
        setSubfunctionToDelete(null);
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
        <>
            <DeleteConfirmationModal
                isOpen={isDeleteSubfunctionModalOpen}
                onClose={() => setIsDeleteSubfunctionModalOpen(false)}
                onConfirm={confirmRemoveSubfunction}
                title={`Delete ${subfunctionToDelete?.name}`}
                message="Are you sure you want to delete this sub-function? This action cannot be undone."
            />
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-gray-800">Edit Department</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                            </div>
                            <div className="p-6 overflow-y-auto space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">Department Info</h3>
                                    <div className="space-y-4">
                                        <InputField label="Department Name" name="departmentName" value={formData.departmentName} onChange={handleChange} />
                                        <InputField label="Department Details" name="departmentDetails" value={formData.departmentDetails} onChange={handleChange} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">Sub-functions</h3>
                                    <div className="space-y-4">
                                        {(formData.subfunctions || []).map((sf, index) => (
                                            <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative space-y-3 transition-shadow hover:shadow-md">
                                                <InputField label={`Sub-function ${index + 1} Name`} value={sf.name} onChange={(e) => handleSubfunctionChange(index, 'name', e.target.value)} />
                                                <InputField label="Details" value={sf.details} onChange={(e) => handleSubfunctionChange(index, 'details', e.target.value)} />
                                                <button onClick={() => handleRemoveSubfunctionClick(index)} className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full text-red-600 hover:bg-red-100 transition-colors" aria-label="Remove sub-function">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <AddItemButton onClick={addSubfunction}>Add Sub-function</AddItemButton>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                                <Button variant="ghost" className="border border-slate-300 py-1.5" onClick={onClose} disabled={btnLoading}>Cancel</Button>
                                <Button variant="primary" onClick={handleSubmit} className="px-5 py-1.5" disabled={btnLoading}>
                                    {btnLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
