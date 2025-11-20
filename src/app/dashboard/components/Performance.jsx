"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Plus, Edit, Trash2, X, Loader2, Save, Clock, CheckCircle, AlertCircle, Play, AlertTriangle } from "lucide-react";
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

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
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800',
    };
    const variantStyle = variantStyles[variant] || variantStyles.primary;
    const sizeStyle = sizeStyles[size] || sizeStyles.default;
    return <button onClick={onClick} className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`} disabled={disabled}>{children}</button>;
};

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => (
    <div className="relative">
        <label className="text-xs font-medium text-gray-600 absolute -top-2 left-2 bg-white px-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
    </div>
);

const EmptyState = ({ text, icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
    >
        {icon}
        <h3 className="mt-4 text-xl font-bold text-gray-800">{text}</h3>
        <p className="mt-1 text-gray-500">Get started by selecting an employee from the dropdown above.</p>
    </motion.div>
);

const statusConfig = {
    not_started: { icon: <Clock className="h-4 w-4" />, styles: "bg-gray-100 text-gray-800" },
    in_progress: { icon: <TrendingUp className="h-4 w-4" />, styles: "bg-blue-100 text-blue-800" },
    completed: { icon: <CheckCircle className="h-4 w-4" />, styles: "bg-green-100 text-green-800" },
    overdue: { icon: <AlertCircle className="h-4 w-4" />, styles: "bg-red-100 text-red-800" },
    default: { icon: <Clock className="h-4 w-4" />, styles: "bg-gray-100 text-gray-800" }
};

const PerformanceModal = ({ isOpen, onClose, employee, onSaveSuccess }) => {
    const [formData, setFormData] = useState({ reviewCadence: '2', goals: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee?.performance) {
            const formattedGoals = (employee.performance.goals || []).map(goal => ({
                ...goal,
                targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : ''
            }));
            setFormData({ reviewCadence: employee.performance.reviewCadence || '2', goals: formattedGoals });
        } else {
            setFormData({ reviewCadence: '2', goals: [] });
        }
    }, [employee]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const addGoal = () => setFormData(prev => ({ ...prev, goals: [...prev.goals, { name: '', targetDate: '', completion: '', status: 'not_started' }] }));
    const updateGoal = (index, field, value) => setFormData(prev => ({ ...prev, goals: prev.goals.map((goal, i) => i === index ? { ...goal, [field]: value } : goal) }));
    const removeGoal = (index) => setFormData(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const apiData = {
            employeeId: employee._id,
            reviewCadence: formData.reviewCadence,
            goals: formData.goals.map(g => ({ ...g, completion: Number(g.completion) }))
        };
        const token = Cookies.get("token");
        const isUpdating = !!employee?.performance;
        const url = "/api/employees/performance";
        const method = isUpdating ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(apiData),
            });
            
            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "An error occurred.");
            } else {
                toast.success(result.message);
                onSaveSuccess(result.employee);
                onClose();
            }
        } catch (error) {
            toast.error("Failed to save performance data.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-gray-800">{employee?.performance ? 'Edit' : 'Set Up'} Performance Tracking</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-grow contents">
                            <div className="p-6 overflow-y-auto space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Review Cadence (per year)</label>
                                    <select name="reviewCadence" value={formData.reviewCadence} onChange={handleChange} className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
                                        <option value="1">1 (Annual)</option>
                                        <option value="2">2 (Semi-annual)</option>
                                        <option value="4">4 (Quarterly)</option>
                                    </select>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Goals</h3>
                                        <Button type="button" size="sm" variant="primary" onClick={addGoal}><Plus className="h-4 w-4" /> Add Goal</Button>
                                    </div>
                                    <div className="space-y-4">
                                        <AnimatePresence>
                                            {formData.goals.map((goal, index) => (
                                                <motion.div key={index} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} layout className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                                                    <button type="button" onClick={() => removeGoal(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"><Trash2 className="h-5 w-5" /></button>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                                                        <InputField label="Goal Name" value={goal.name} onChange={(e) => updateGoal(index, 'name', e.target.value)} placeholder="e.g., Launch new feature" required />
                                                        <InputField label="Target Date" type="date" value={goal.targetDate} onChange={(e) => updateGoal(index, 'targetDate', e.target.value)} required />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                                        <InputField label="Completion (%)" type="number" value={goal.completion} onChange={(e) => updateGoal(index, 'completion', parseInt(e.target.value) || 0)} placeholder="0" min="0" max="100" />
                                                        <div className="relative">
                                                            <label className="text-xs font-medium text-gray-600 absolute -top-2 left-2 bg-white px-1">Status</label>
                                                            <select value={goal.status} onChange={(e) => updateGoal(index, 'status', e.target.value)} className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
                                                                <option value="not_started">Not Started</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="overdue">Overdue</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {formData.goals.length === 0 && <p className="text-center text-gray-500 py-4">No goals added yet. Click 'Add Goal' to start.</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-b-2xl">
                                <Button type="button" variant="ghost" className="border border-slate-300 text-gray-800" onClick={onClose} disabled={loading}>Cancel</Button>
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : null}
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const Performance = ({ employees, onEmployeeUpdate }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const employeesWithPerformance = employees?.filter(emp => emp.performance) || [];
    const employeesWithoutPerformance = employees?.filter(emp => !emp.performance) || [];

    const handleSetupPerformance = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleEditPerformance = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleDeletePerformance = (employee) => { setEmployeeToDelete(employee); setDeleteModalOpen(true); };

    const handleSaveSuccess = (updatedEmployee) => {
        if (onEmployeeUpdate) onEmployeeUpdate(updatedEmployee);
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setSelectedEmployeeId('');
    };

    const confirmDeletePerformance = async () => {
        if (!employeeToDelete) return;
        setIsDeleteLoading(true);
        const token = Cookies.get("token");
        const url = `/api/employees/performance?employeeId=${employeeToDelete._id}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Failed to delete performance data.");
            } else {
                toast.success(result.message);
                if (onEmployeeUpdate) onEmployeeUpdate({ ...employeeToDelete, performance: null });
            }
        } catch (error) {
            toast.error("An error occurred while deleting performance data.");
        } finally {
            setDeleteModalOpen(false);
            setEmployeeToDelete(null);
            setIsDeleteLoading(false);
        }
    };

    const launchAdHocReview = async (employee) => {
        try {
            const token = Cookies.get("token");
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: "Ad Hoc Performance Review", message: `Ad hoc performance review launched for ${employee.name}`, type: "performance_review", employeeId: employee._id }),
            });
            const result = await response.json();
            if (response.ok) {
                toast.success(`Ad hoc review launched for ${employee.name}`);
                window.dispatchEvent(new CustomEvent('refreshNotifications'));
            } else {
                toast.error(result.message || "Failed to launch ad hoc review");
            }
        } catch (error) {
            toast.error("Failed to launch ad hoc review");
        }
    };

    return (
        <div className="p-0 sm:p-6 bg-slate-50/50 min-h-screen">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex-1 w-full">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Select Employee</label>
                        <select
                            value={selectedEmployeeId}
                            onChange={(e) => {
                                const employeeId = e.target.value;
                                setSelectedEmployeeId(employeeId);
                                if (employeeId) {
                                    const employee = employees?.find(emp => emp._id === employeeId);
                                    if (employee) {
                                        employee.performance ? handleEditPerformance(employee) : handleSetupPerformance(employee);
                                    }
                                }
                            }}
                            className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                        >
                            <option value="">Choose an employee...</option>
                            <optgroup label="Tracked Employees">
                                {employeesWithPerformance.map(e => <option key={e._id} value={e._id}>{e.name} ({e.performance.overallCompletion}% complete)</option>)}
                            </optgroup>
                            <optgroup label="Untracked Employees">
                                {employeesWithoutPerformance.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 pt-0 sm:pt-8 whitespace-nowrap">
                        <strong className="text-indigo-600 font-bold text-lg">{employeesWithPerformance.length}</strong> / {employees?.length || 0} employees tracked
                    </div>
                </div>
            </div>

            {employeesWithPerformance.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {employeesWithPerformance.map(employee => (
                        <div key={employee._id} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                                    <p className="text-sm text-gray-500">{employee.email}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => handleEditPerformance(employee)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit Performance"><Edit className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeletePerformance(employee)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete Performance"><Trash2 className="h-5 w-5" /></button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-700">Overall Progress</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-green-500" style={{ width: `${employee.performance.overallCompletion}%` }}></div></div>
                                    <span className="font-semibold text-green-600">{employee.performance.overallCompletion}%</span>
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h4 className="mb-3 text-sm font-semibold text-gray-800">Active Goals ({employee.performance.goals?.length || 0})</h4>
                                <div className="space-y-3">
                                    {employee.performance.goals?.slice(0, 2).map((goal, idx) => {
                                        const status = statusConfig[goal.status] || statusConfig.default;
                                        return (
                                            <div key={idx} className="rounded-lg border border-gray-200 p-3 bg-slate-50/50">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-800 text-sm">{goal.name}</p>
                                                        <p className="text-xs text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${status.styles}`}>{status.icon} {goal.status.replace('_', ' ')}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1.5 w-full rounded-full bg-gray-200"><div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${goal.completion}%` }}></div></div>
                                                    <span className="text-xs font-medium text-gray-600">{goal.completion}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {employee.performance.goals?.length > 2 && <p className="text-xs text-gray-500 text-center pt-1">+{employee.performance.goals.length - 2} more goals</p>}
                                    {employee.performance.goals?.length === 0 && <p className="text-xs text-gray-500 text-center py-4">No goals set.</p>}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Cadence:</span><span className="font-medium">{employee.performance.reviewCadence}/year</span></div>
                                {employee.performance.nextReviewDate && <div className="flex justify-between mt-1"><span className="text-gray-500">Next Review:</span><span className="font-medium">{new Date(employee.performance.nextReviewDate).toLocaleDateString()}</span></div>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState text="No Performance Data Available" icon={<TrendingUp className="h-20 w-20 text-gray-300 mx-auto" />} />
            )}

            <AnimatePresence>
                {isModalOpen && selectedEmployee && <PerformanceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedEmployee(null); setSelectedEmployeeId(''); }} employee={selectedEmployee} onSaveSuccess={handleSaveSuccess} />}
                {deleteModalOpen && employeeToDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col">
                            <div className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Delete Performance Tracking</h3>
                                <p className="mt-2 text-sm text-gray-500">Are you sure you want to remove performance tracking for <strong>{employeeToDelete.name}</strong>? This action is permanent.</p>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                <Button variant="ghost" className="border border-slate-300 text-gray-800" onClick={() => setDeleteModalOpen(false)} disabled={isDeleteLoading}>Cancel</Button>
                                <Button variant="danger" onClick={confirmDeletePerformance} className="w-28" disabled={isDeleteLoading}>
                                    {isDeleteLoading ? <Loader2 className="animate-spin" /> : 'Delete'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
