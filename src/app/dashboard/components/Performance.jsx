"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Plus, Edit, Trash2, X, Loader2, Save, Clock, CheckCircle, AlertCircle, Play, AlertTriangle } from "lucide-react";
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const useDispatch = () => (action) => console.log("Dispatched:", action);
const useSelector = (selector) => selector({ performance: { message: null, error: null } });
const createPerformance = (data) => ({ type: 'performance/create', payload: data });
const updatePerformance = (data) => ({ type: 'performance/update', payload: data });
const deletePerformance = (id) => ({ type: 'performance/delete', payload: id });
const clearPerformanceMessage = () => ({ type: 'performance/clearMessage' });
const clearPerformanceError = () => ({ type: 'performance/clearError' });

const Button = ({ children, onClick, variant = 'primary', className = '', disabled, size = 'md' }) => {
    const baseStyle = "rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 focus:outline-none focus:ring-4";
    const sizeStyles = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3 text-base"
    };
    const variantStyles = {
        primary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg focus:ring-indigo-300",
        secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-200",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-200",
        danger: "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg focus:ring-red-300"
    };
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
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
    in_progress: { icon: <Play className="h-4 w-4" />, styles: "bg-blue-100 text-blue-800" },
    completed: { icon: <CheckCircle className="h-4 w-4" />, styles: "bg-green-100 text-green-800" },
    overdue: { icon: <AlertCircle className="h-4 w-4" />, styles: "bg-red-100 text-red-800" },
    default: { icon: <Clock className="h-4 w-4" />, styles: "bg-gray-100 text-gray-800" }
};

const PerformanceModal = ({ isOpen, onClose, employee, onSave }) => {
    const dispatch = useDispatch();
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
    const addGoal = () => setFormData(prev => ({ ...prev, goals: [...prev.goals, { name: '', targetDate: '', completion: 0, status: 'not_started' }] }));
    const updateGoal = (index, field, value) => setFormData(prev => ({ ...prev, goals: prev.goals.map((goal, i) => i === index ? { ...goal, [field]: value } : goal) }));
    const removeGoal = (index) => setFormData(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const performanceData = { employeeId: employee._id, ...formData };

        try {
            if (employee?.performance) {
                dispatch(updatePerformance(performanceData));
            } else {
                dispatch(createPerformance(performanceData));
            }

            const calculateNextReviewDate = (cadence) => {
                const monthsUntilNext = 12 / cadence;
                const nextDate = new Date();
                nextDate.setMonth(nextDate.getMonth() + monthsUntilNext);
                return nextDate.toISOString();
            };

            const updatedEmployee = {
                ...employee,
                performance: {
                    ...formData,
                    overallCompletion: formData.goals.length > 0 ?
                        Math.round(formData.goals.reduce((sum, goal) => sum + (goal.completion || 0), 0) / formData.goals.length) : 0,
                    lastReviewDate: new Date().toISOString(),
                    nextReviewDate: calculateNextReviewDate(Number(formData.reviewCadence) || 2)
                }
            };

            onSave(updatedEmployee);
            onClose();
        } catch (error) {
            toast.error("Failed to save performance information");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-gray-800">{employee?.performance ? 'Edit' : 'Set Up'} Performance Tracking</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors"><X className="h-6 w-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                     <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Review Cadence (per year)</label>
                        <select name="reviewCadence" value={formData.reviewCadence} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                            <option value="1">1 (Annual)</option>
                            <option value="2">2 (Semi-annual)</option>
                            <option value="4">4 (Quarterly)</option>
                        </select>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Goals</h3>
                            <Button type="button" size="sm" onClick={addGoal}><Plus className="h-4 w-4" /> Add Goal</Button>
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
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
                                                <select value={goal.status} onChange={(e) => updateGoal(index, 'status', e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
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
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" onClick={handleSubmit} disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export const Performance = ({ employees, onEmployeeUpdate }) => {
    const dispatch = useDispatch();
    const { message, error } = useSelector((state) => state.performance);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const employeesWithPerformance = employees?.filter(emp => emp.performance) || [];
    const employeesWithoutPerformance = employees?.filter(emp => !emp.performance) || [];

    useEffect(() => {
        if (message) { toast.success(message); dispatch(clearPerformanceMessage()); }
        if (error) { toast.error(error); dispatch(clearPerformanceError()); }
    }, [message, error, dispatch]);

    const handleSetupPerformance = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleEditPerformance = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleDeletePerformance = (employee) => { setEmployeeToDelete(employee); setDeleteModalOpen(true); };

    const handleSavePerformance = (updatedEmployee) => {
        if (onEmployeeUpdate) onEmployeeUpdate(updatedEmployee);
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const confirmDeletePerformance = () => {
        if (employeeToDelete) {
            dispatch(deletePerformance(employeeToDelete._id));
            if (onEmployeeUpdate) onEmployeeUpdate({ ...employeeToDelete, performance: null });
        }
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
    };

    const launchAdHocReview = async (employee) => {
        try {
            const token = Cookies.get("token");
            const response = await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ title: "Ad Hoc Performance Review", message: `Ad hoc performance review launched for ${employee.name}`, type: "performance_review", employeeId: employee._id }),
            });
            if (response.ok) {
                toast.success(`Ad hoc review launched for ${employee.name}`);
                window.dispatchEvent(new CustomEvent('refreshNotifications'));
            } else {
                toast.error("Failed to launch ad hoc review");
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
                                setSelectedEmployeeId(e.target.value);
                                if (e.target.value) {
                                    const employee = employees?.find(emp => emp._id === e.target.value);
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
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {employeesWithPerformance.map(employee => (
                            <motion.div layout key={employee._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                                        <p className="text-sm text-gray-500">{employee.email}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[
                                            { action: () => launchAdHocReview(employee), icon: Play, title: "Launch Ad Hoc Review", color: "green" },
                                            { action: () => handleEditPerformance(employee), icon: Edit, title: "Edit Performance", color: "indigo" },
                                            { action: () => handleDeletePerformance(employee), icon: Trash2, title: "Delete Tracking", color: "red" }
                                        ].map(({ action, icon: Icon, title, color }) => (
                                            <button key={title} onClick={action} className={`p-2 text-gray-500 hover:text-${color}-600 hover:bg-${color}-50 rounded-full transition-colors`} title={title}><Icon className="h-5 w-5" /></button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700">Overall Progress</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <div className="h-2.5 w-full rounded-full bg-gray-200"><div className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-teal-500" style={{ width: `${employee.performance.overallCompletion}%` }}></div></div>
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
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <EmptyState text="No Performance Data Available" icon={<TrendingUp className="h-20 w-20 text-gray-300 mx-auto" />} />
            )}

            <AnimatePresence>
                {isModalOpen && selectedEmployee && <PerformanceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedEmployee(null); }} employee={selectedEmployee} onSave={handleSavePerformance} />}
                {deleteModalOpen && employeeToDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" /></div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Delete Performance Tracking</h3>
                                <p className="mt-2 text-sm text-gray-500">Are you sure you want to remove performance tracking for <strong>{employeeToDelete.name}</strong>? This action is permanent.</p>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                                <Button variant="danger" onClick={confirmDeletePerformance}>Confirm Delete</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
