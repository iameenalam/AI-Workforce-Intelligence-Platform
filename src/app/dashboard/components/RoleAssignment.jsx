"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Building2, Crown, Shield, User,
  ChevronRight, Loader2, GripVertical, UploadCloud
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from 'react-hot-toast';
import { getEmployees } from "@/redux/action/employees";
import { getDepartments } from "@/redux/action/departments";

const EmployeeCard = ({ employee, onDragStart, onDragEnd, isDragging, canDrag = true }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      draggable={canDrag}
      onDragStart={canDrag ? (e) => onDragStart(e, employee) : undefined}
      onDragEnd={canDrag ? onDragEnd : undefined}
      className={`
        bg-white border border-slate-200 rounded-lg p-2.5 transition-all duration-200
        ${canDrag ? 'cursor-move hover:shadow-lg hover:border-indigo-400' : 'cursor-default'}
        ${isDragging ? 'opacity-50 rotate-3 scale-105 shadow-xl' : ''}
        ${!canDrag ? 'opacity-75' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-grab" />
        <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {employee.name ? employee.name[0].toUpperCase() : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{employee.name}</h3>
          <p className="text-xs text-gray-500 truncate">{employee.email}</p>
        </div>
      </div>
    </motion.div>
  );
};

const DepartmentSection = ({ department, employees, onDrop, onDragOver, expandedDepts, toggleDept, expandedSubfuncs, toggleSubfunc, onDragStart, onDragEnd, draggedEmployee, dragOverState, setDragOverState, canAssignRoles = true }) => {
  const deptEmployees = employees.filter(emp => emp.department?._id === department._id);
  const hodEmployees = deptEmployees.filter(emp => emp.role === "HOD");

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm transition-shadow hover:shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer p-4"
        onClick={() => toggleDept(department._id)}
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: expandedDepts[department._id] ? 90 : 0 }}>
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </motion.div>
          <Building2 className="w-5 h-5 text-rose-600" />
          <h3 className="text-lg font-semibold text-gray-900">{department.departmentName}</h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {deptEmployees.length}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {expandedDepts[department._id] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4 space-y-4 border-t border-slate-100"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                <Crown className="w-4 h-4" />
                <h4 className="text-sm font-medium text-gray-700">Head of Department</h4>
                <span className="text-xs text-gray-500">({hodEmployees.length}/1)</span>
              </div>
              <div
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, department._id, "HOD")}
                onDragEnter={() => setDragOverState(`${department._id}-HOD`)}
                onDragLeave={() => setDragOverState(null)}
                className={`min-h-[60px] border-2 border-dashed rounded-lg p-2 transition-all duration-200 border-purple-300 bg-purple-50/50 hover:border-purple-400 hover:bg-purple-50 ${dragOverState === `${department._id}-HOD` ? 'scale-105 border-solid bg-white shadow-inner' : ''}`}
              >
                <div className="space-y-2">
                  {hodEmployees.map(emp => (
                    <EmployeeCard key={emp._id} employee={emp} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggedEmployee?._id === emp._id} canDrag={canAssignRoles} />
                  ))}
                  {hodEmployees.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4 flex flex-col items-center justify-center">
                      <UploadCloud className="w-6 h-6 mb-1 text-gray-300"/>
                      <span>Drop HOD here</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {department.subfunctions && department.subfunctions.length > 0 && (
              <div className="space-y-3 pt-2">
                {department.subfunctions.map((subfunction, sfIndex) => {
                  const subfuncKey = `${department._id}_${sfIndex}`;
                  const subfuncEmployees = deptEmployees.filter(emp => emp.subfunctionIndex === sfIndex);
                  const teamLeads = subfuncEmployees.filter(emp => emp.role === "Team Lead");
                  const teamMembers = subfuncEmployees.filter(emp => emp.role === "Team Member");

                  return (
                    <div key={sfIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50/70">
                      <div className="flex items-center justify-between cursor-pointer mb-3" onClick={() => toggleSubfunc(subfuncKey)}>
                        <div className="flex items-center gap-2">
                          <motion.div animate={{ rotate: expandedSubfuncs[subfuncKey] ? 90 : 0 }}>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          </motion.div>
                          <h5 className="font-medium text-gray-800">{subfunction.name}</h5>
                          <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border">{subfuncEmployees.length}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSubfuncs[subfuncKey] && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-blue-600">
                                    <Shield className="w-4 h-4" />
                                    <h4 className="text-sm font-medium text-gray-700">Team Leads</h4>
                                    <span className="text-xs text-gray-500">({teamLeads.length})</span>
                                </div>
                                <div
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, department._id, "Team Lead", sfIndex)}
                                    onDragEnter={() => setDragOverState(`${subfuncKey}-Team Lead`)}
                                    onDragLeave={() => setDragOverState(null)}
                                    className={`min-h-[60px] border-2 border-dashed rounded-lg p-2 transition-all duration-200 border-blue-300 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50 ${dragOverState === `${subfuncKey}-Team Lead` ? 'scale-105 border-solid bg-white shadow-inner' : ''}`}
                                >
                                    <div className="space-y-1">
                                        {teamLeads.map(emp => <EmployeeCard key={emp._id} employee={emp} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggedEmployee?._id === emp._id} canDrag={canAssignRoles} />)}
                                        {teamLeads.length === 0 && <div className="text-center text-gray-400 text-xs py-2">Drop Team Leads</div>}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-green-600">
                                    <User className="w-4 h-4" />
                                    <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
                                    <span className="text-xs text-gray-500">({teamMembers.length})</span>
                                </div>
                                <div
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, department._id, "Team Member", sfIndex)}
                                    onDragEnter={() => setDragOverState(`${subfuncKey}-Team Member`)}
                                    onDragLeave={() => setDragOverState(null)}
                                    className={`min-h-[60px] border-2 border-dashed rounded-lg p-2 transition-all duration-200 border-green-300 bg-green-50/30 hover:border-green-400 hover:bg-green-50 ${dragOverState === `${subfuncKey}-Team Member` ? 'scale-105 border-solid bg-white shadow-inner' : ''}`}
                                >
                                    <div className="space-y-1">
                                        {teamMembers.map(emp => <EmployeeCard key={emp._id} employee={emp} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggedEmployee?._id === emp._id} canDrag={canAssignRoles} />)}
                                        {teamMembers.length === 0 && <div className="text-center text-gray-400 text-xs py-2">Drop Team Members</div>}
                                    </div>
                                </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function RoleAssignment() {
  const dispatch = useDispatch();
  const { organization } = useSelector((state) => state.organization);
  const { employees: reduxEmployees, loading: employeesLoading } = useSelector((state) => state.employees);
  const { departments: reduxDepartments, loading: deptsLoading } = useSelector((state) => state.departments);

  // Role-based access control state
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);
  const [canAssignRoles, setCanAssignRoles] = useState(false);
  const [accessibleEmployees, setAccessibleEmployees] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedEmployee, setDraggedEmployee] = useState(null);
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedSubfuncs, setExpandedSubfuncs] = useState({});
  const [dragOverState, setDragOverState] = useState(null);

  // Check user permissions on component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch("/api/user/permissions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
          setUserPermissions(data.permissions);
          setCanAssignRoles(data.permissions?.canAssignRoles || data.role === "Admin");
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        toast.error("Failed to load permissions");
      }
    };

    checkPermissions();
  }, []);

  useEffect(() => {
    // Use Redux data if available, otherwise fetch
    if (reduxEmployees && reduxEmployees.length > 0) {
      setEmployees(reduxEmployees);
      setLoading(false); // Set loading to false immediately when we have Redux data
    }
    if (reduxDepartments && reduxDepartments.length > 0) {
      setDepartments(reduxDepartments);
      setLoading(false); // Set loading to false immediately when we have Redux data
      // Set up initial expanded states
      const initialExpandedDepts = {};
      const initialExpandedSubfuncs = {};
      reduxDepartments.forEach(dept => {
        initialExpandedDepts[dept._id] = true;
        if (dept.subfunctions) {
          dept.subfunctions.forEach((_, sfIndex) => {
            initialExpandedSubfuncs[`${dept._id}_${sfIndex}`] = true;
          });
        }
      });
      setExpandedDepts(initialExpandedDepts);
      setExpandedSubfuncs(initialExpandedSubfuncs);
    }

    // Only fetch if we don't have Redux data
    if ((!reduxEmployees || reduxEmployees.length === 0) && (!reduxDepartments || reduxDepartments.length === 0)) {
      fetchData();
    }
  }, [reduxEmployees, reduxDepartments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const [employeesRes, departmentsRes] = await Promise.all([
        axios.get("/api/employees", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/departments", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setEmployees(employeesRes.data.employees || []);
      const departmentsData = Array.isArray(departmentsRes.data) ? departmentsRes.data : (departmentsRes.data.departments || []);
      setDepartments(departmentsData);
      const initialExpandedDepts = {};
      const initialExpandedSubfuncs = {};
      departmentsData.forEach(dept => {
        initialExpandedDepts[dept._id] = true;
        if (dept.subfunctions) {
          dept.subfunctions.forEach((_, sfIndex) => {
            initialExpandedSubfuncs[`${dept._id}_${sfIndex}`] = true;
          });
        }
      });
      setExpandedDepts(initialExpandedDepts);
      setExpandedSubfuncs(initialExpandedSubfuncs);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on user access scope
  useEffect(() => {
    if (userRole === "HOD" && userPermissions?.accessScope === "department" && employees.length > 0) {
      // HODs can only see employees in their department or unassigned employees
      const filteredEmps = employees.filter(emp => {
        // Always show unassigned employees (they can be assigned to any department)
        if (!emp.department || emp.role === "Unassigned") return true;

        // For assigned employees, check if they're in the same department
        // Note: This would need the current user's employee record to determine their department
        return true; // For now, show all - this can be refined based on actual user department
      });
      setAccessibleEmployees(filteredEmps);
    } else {
      setAccessibleEmployees(employees);
    }
  }, [employees, userRole, userPermissions]);

  const handleDragStart = (e, employee) => { setDraggedEmployee(employee); e.dataTransfer.effectAllowed = "move"; };
  const handleDragEnd = () => { setDraggedEmployee(null); setDragOverState(null); };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };

  const handleDrop = async (e, departmentId, role, subfunctionIndex = null) => {
    e.preventDefault();
    if (!draggedEmployee) return;

    // Role assignment is allowed for users who can access this component

    // Check if the employee is being dropped into the same role and department they are already in
    const currentDeptId = draggedEmployee.department?._id || draggedEmployee.department;
    if (draggedEmployee.role === role && currentDeptId === departmentId && draggedEmployee.subfunctionIndex === subfunctionIndex) {
      toast.error("Employee is already in this role.");
      setDraggedEmployee(null);
      setDragOverState(null);
      return;
    }

    // Check if trying to assign HOD when one already exists
    if (role === "HOD") {
      const existingHOD = employees.find(emp =>
        emp.role === "HOD" &&
        emp.department &&
        (emp.department._id === departmentId || emp.department === departmentId) &&
        emp._id !== draggedEmployee._id
      );

      if (existingHOD) {
        toast.error(`Department already has an HOD: ${existingHOD.name}. Please unassign the current HOD first.`);
        setDraggedEmployee(null);
        setDragOverState(null);
        return;
      }
    }

    try {
      const token = Cookies.get("token");
      const updateData = { employeeId: draggedEmployee._id, role, departmentId };
      if (subfunctionIndex !== null) updateData.subfunctionIndex = subfunctionIndex;
      await axios.put("/api/employees", updateData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${draggedEmployee.name} assigned as ${role}`);

      // Dispatch Redux actions for immediate updates (no spinner)
      dispatch(getEmployees());
      if (organization?._id) {
        dispatch(getDepartments({ organizationId: organization._id }));
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee assignment");
    } finally {
      setDraggedEmployee(null);
      setDragOverState(null);
    }
  };

  const handleDropToUnassigned = async (e) => {
    e.preventDefault();
    if (!draggedEmployee) return;

    // Role assignment is allowed for users who can access this component

    if (draggedEmployee.role === "Unassigned" || !draggedEmployee.department) {
      toast.error("Employee is already unassigned.");
      setDraggedEmployee(null);
      setDragOverState(null);
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.put("/api/employees", { employeeId: draggedEmployee._id, role: "Unassigned", departmentId: null }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${draggedEmployee.name} moved to unassigned pool`);

      // Dispatch Redux actions for immediate updates (no spinner)
      dispatch(getEmployees());
      if (organization?._id) {
        dispatch(getDepartments({ organizationId: organization._id }));
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee assignment");
    } finally {
        setDraggedEmployee(null);
        setDragOverState(null);
    }
  };

  const toggleDept = (deptId) => setExpandedDepts(prev => ({ ...prev, [deptId]: !prev[deptId] }));
  const toggleSubfunc = (subfuncKey) => setExpandedSubfuncs(prev => ({ ...prev, [subfuncKey]: !prev[subfuncKey] }));

  // Only show loading if we don't have any data at all
  if (loading && (!reduxEmployees || reduxEmployees.length === 0) && (!reduxDepartments || reduxDepartments.length === 0)) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  const unassignedEmployees = accessibleEmployees.filter(emp => emp.role === "Unassigned" || !emp.department);

  return (
    <div className="space-y-6">
      {/* Permission Notice */}


      {/* Main Role Assignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full p-4 lg:p-0">
      <div className="lg:col-span-4 xl:col-span-3">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-17rem)]">
          {/* We've removed the fixed height on mobile for this container */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-auto lg:h-full">
            <div className="flex items-center gap-3 mb-4 flex-shrink-0">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Unassigned Employees</h3>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{unassignedEmployees.length}</span>
            </div>
            <div
              // On large screens, this container will become scrollable
              className={`flex-grow min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50 overflow-y-auto transition-all duration-200 ${dragOverState === 'unassigned' ? 'border-solid bg-indigo-50' : 'hover:border-gray-400'}`}
              onDragOver={handleDragOver}
              onDrop={handleDropToUnassigned}
              onDragEnter={() => setDragOverState('unassigned')}
              onDragLeave={() => setDragOverState(null)}
            >
              {unassignedEmployees.length > 0 ? (
                <div className="space-y-3">
                  {unassignedEmployees.map(employee => <EmployeeCard key={employee._id} employee={employee} onDragStart={handleDragStart} onDragEnd={handleDragEnd} isDragging={draggedEmployee?._id === employee._id} canDrag={canAssignRoles} />)}
                </div>
              ) : (
                <div className="text-center text-gray-400 h-full flex flex-col justify-center items-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">All employees assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8 xl:col-span-9 space-y-4">
        {departments.length > 0 ? (
          departments.map(department => (
            <DepartmentSection key={department._id} department={department} employees={accessibleEmployees} onDrop={handleDrop} onDragOver={handleDragOver} expandedDepts={expandedDepts} toggleDept={toggleDept} expandedSubfuncs={expandedSubfuncs} toggleSubfunc={toggleSubfunc} onDragStart={handleDragStart} onDragEnd={handleDragEnd} draggedEmployee={draggedEmployee} dragOverState={dragOverState} setDragOverState={setDragOverState} canAssignRoles={canAssignRoles} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium">No departments found</p>
            <p className="text-sm">Create departments first to assign employees.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
