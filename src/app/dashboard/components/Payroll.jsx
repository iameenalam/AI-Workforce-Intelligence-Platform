"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Gift, Package, Calendar, Edit, Trash2, X, Loader2, Save, AlertTriangle } from "lucide-react";
import toast from 'react-hot-toast';
import {
    createPayroll,
    updatePayroll,
    deletePayroll,
    clearPayrollMessage,
    clearPayrollError
} from "../../../redux/action/payroll";

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

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => {
    const handleInputChange = (e) => {
        if (type === 'number') {
            const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
            const syntheticEvent = {
                target: {
                    name: e.target.name,
                    value: sanitizedValue
                }
            };
            onChange(syntheticEvent);
        } else {
            onChange(e);
        }
    };

    const isNumberInput = type === 'number';

    return (
        <div className="relative">
            <label className="text-xs font-medium text-gray-600 absolute -top-2 left-2 bg-white px-1 z-10">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={isNumberInput ? "text" : type}
                inputMode={isNumberInput ? "numeric" : undefined}
                pattern={isNumberInput ? "[0-9]*" : undefined}
                name={name}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                required={required}
                className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            />
        </div>
    );
};

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

const PayrollModal = ({ isOpen, onClose, employee, onSave }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ baseSalary: '', bonus: '', stockOptions: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee?.payroll) {
            setFormData({
                baseSalary: employee.payroll.baseSalary || '',
                bonus: employee.payroll.bonus || '',
                stockOptions: employee.payroll.stockOptions || ''
            });
        } else {
            setFormData({ baseSalary: '', bonus: '', stockOptions: '' });
        }
    }, [employee]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payrollData = { employeeId: employee._id, ...formData };

        try {
            if (employee?.payroll) {
                await dispatch(updatePayroll(payrollData));
            } else {
                await dispatch(createPayroll(payrollData));
            }

            const updatedEmployee = {
                ...employee,
                payroll: {
                    ...formData,
                    baseSalary: Number(formData.baseSalary),
                    bonus: Number(formData.bonus) || 0,
                    stockOptions: Number(formData.stockOptions) || 0,
                    lastRaiseDate: employee?.payroll?.lastRaiseDate || new Date().toISOString()
                }
            };
            
            onSave(updatedEmployee);
            onClose();
        } catch (error) {
            toast.error("Failed to save payroll information");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-gray-800">{employee?.payroll ? 'Edit' : 'Add'} Payroll Information</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors"><X className="h-6 w-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <InputField label="Base Salary ($)" name="baseSalary" type="number" value={formData.baseSalary} onChange={handleChange} placeholder="e.g., 90000" required />
                    <InputField label="Bonus ($)" name="bonus" type="number" value={formData.bonus} onChange={handleChange} placeholder="e.g., 5000" />
                    <InputField label="Stock Options (Shares)" name="stockOptions" type="number" value={formData.stockOptions} onChange={handleChange} placeholder="e.g., 1000" />
                
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

export const Payroll = ({ employees, onEmployeeUpdate }) => {
    const dispatch = useDispatch();
    const { message, error } = useSelector((state) => state.payroll);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const employeesWithPayroll = employees?.filter(emp => emp.payroll) || [];
    const employeesWithoutPayroll = employees?.filter(emp => !emp.payroll) || [];

    useEffect(() => {
        if (message) { toast.success(message); dispatch(clearPayrollMessage()); }
        if (error) { toast.error(error); dispatch(clearPayrollError()); }
    }, [message, error, dispatch]);

    const handleAddPayroll = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleEditPayroll = (employee) => { setSelectedEmployee(employee); setIsModalOpen(true); };
    const handleDeletePayroll = (employee) => { setEmployeeToDelete(employee); setDeleteModalOpen(true); };

    const handleSavePayroll = (updatedEmployee) => {
        if (onEmployeeUpdate) onEmployeeUpdate(updatedEmployee);
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const confirmDeletePayroll = () => {
        if (employeeToDelete) {
            dispatch(deletePayroll(employeeToDelete._id));
            if (onEmployeeUpdate) onEmployeeUpdate({ ...employeeToDelete, payroll: null });
        }
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
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
                                        employee.payroll ? handleEditPayroll(employee) : handleAddPayroll(employee);
                                    }
                                }
                            }}
                            className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-base"
                        >
                            <option value="">Choose an employee...</option>
                            <optgroup label="Employees with Payroll">
                                {employeesWithPayroll.map(e => <option key={e._id} value={e._id}>{e.name} (${e.payroll.baseSalary?.toLocaleString()})</option>)}
                            </optgroup>
                            <optgroup label="Employees without Payroll">
                                {employeesWithoutPayroll.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 pt-0 sm:pt-8 whitespace-nowrap">
                        <strong className="text-indigo-600 font-bold text-lg">{employeesWithPayroll.length}</strong> / {employees?.length || 0} employees with payroll
                    </div>
                </div>
            </div>

            {employeesWithPayroll.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {employeesWithPayroll.map(employee => (
                            <motion.div layout key={employee._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
                                        <p className="text-sm text-gray-500">{employee.email}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEditPayroll(employee)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Edit Payroll"><Edit className="h-5 w-5" /></button>
                                        <button onClick={() => handleDeletePayroll(employee)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete Payroll"><Trash2 className="h-5 w-5" /></button>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-grow">
                                    {[
                                        { icon: <DollarSign className="h-5 w-5 text-green-600" />, label: "Base Salary", value: `$${employee.payroll.baseSalary?.toLocaleString()}` },
                                        { icon: <Gift className="h-5 w-5 text-amber-600" />, label: "Bonus", value: `$${employee.payroll.bonus?.toLocaleString()}` },
                                        { icon: <Package className="h-5 w-5 text-sky-600" />, label: "Stock Options", value: `${employee.payroll.stockOptions?.toLocaleString()} shares` }
                                    ].map(({ icon, label, value }) => (
                                        <div key={label} className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-lg">
                                            <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">{icon}</div>
                                            <div>
                                                <p className="text-xs text-gray-500">{label}</p>
                                                <p className="font-semibold text-gray-900">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {employee.payroll.lastRaiseDate && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 text-sm flex items-center justify-center gap-2 text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>Last Raised: {new Date(employee.payroll.lastRaiseDate).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <EmptyState text="No Payroll Data Available" icon={<DollarSign className="h-20 w-20 text-gray-300 mx-auto" />} />
            )}

            <AnimatePresence>
                {isModalOpen && selectedEmployee && <PayrollModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedEmployee(null); }} employee={selectedEmployee} onSave={handleSavePayroll} />}
                {deleteModalOpen && employeeToDelete && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeleteModalOpen(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" /></div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Delete Payroll Information</h3>
                                <p className="mt-2 text-sm text-gray-500">Are you sure you want to remove payroll for <strong>{employeeToDelete.name}</strong>? This action is permanent.</p>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                                <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                                <Button variant="danger" onClick={confirmDeletePayroll}>Confirm Delete</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
