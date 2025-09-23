"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import axios from "axios";
import { Search, Loader2, UserPlus, Save, RotateCcw, Settings } from "lucide-react";

import { getUser } from "@/redux/action/user";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { usePermissions } from "@/hooks/usePermissions";
import { getOrganization, updateOrganization, deleteOrganization, updateCeo } from "@/redux/action/org";
import { getDepartments, updateDepartment, deleteDepartment } from "@/redux/action/departments";
import { getEmployees, deleteEmployee } from "@/redux/action/employees";

import { logoutSuccess } from "@/redux/reducer/userReducer";
import { clearMessage, clearError } from "@/redux/reducer/departmentsReducer";
import { clearMessage as clearOrgMessage, clearError as clearOrgError } from "@/redux/reducer/orgReducer";
import { clearEmployeesMessage } from "@/redux/action/employees";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import { Overview, OrganizationProfilePage, GenericProfilePage as CeoProfilePage, EditOrganizationModal, EditCeoModal } from "./components/Overview";
import { Employees, GenericProfilePage as EmployeeProfilePage } from "./components/Employees";
import { Departments, DepartmentProfilePage, SubfunctionProfilePage, EditDepartmentModal } from "./components/Departments";
import { RoleAssignment } from "./components/RoleAssignment";
import { Permissions } from "./components/Permissions";
import { Button } from "@/components/ui/button";

import { Payroll } from "./components/Payroll";
import { Performance } from "./components/Performance";
import InvForm from "../components/popup-forms/invform";
import DeptForm from "../components/popup-forms/deptform";
import Popup from "../components/popup-forms/Popup";
import { Building2 } from "lucide-react";

export default function HRDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isAuth, loading: userLoading } = useSelector((state) => state.user);
  const { redirectBasedOnRole, isUnassigned, hasPermissions, userPermissions, userRole } = useRouteProtection();
  const permissions = usePermissions();
  const { organization, loading: orgLoading, loaded: orgLoaded, message: orgMessage, error: orgError } = useSelector((state) => state.organization);
  const { departments, loading: deptLoading, message, error } = useSelector((state) => state.departments);
  const { employees, loading: empLoading, message: empMessage, error: empError } = useSelector((state) => {
    return state.employees;
  });

  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.hash.substring(1) : ""
  );
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeTab') || 'overview';
    }
    return 'overview';
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDeptTerm, setSearchDeptTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [invFormOpen, setInvFormOpen] = useState(false);
  const [deptFormOpen, setDeptFormOpen] = useState(false);

  const [permissionsData, setPermissionsData] = useState({});
  const [originalPermissionsData, setOriginalPermissionsData] = useState({});
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  const [permissionsSaving, setPermissionsSaving] = useState(false);
  const [permissionsHaveChanges, setPermissionsHaveChanges] = useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState("HOD");
  const rolesForPermissions = ["HOD", "Team Lead", "Team Member"];

  const fetchPermissions = async () => {
    setPermissionsLoading(true);
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const permissionsMap = {};
      data.permissions.forEach(perm => {
        permissionsMap[perm.role] = perm;
      });

      setPermissionsData(permissionsMap);
      setOriginalPermissionsData(JSON.parse(JSON.stringify(permissionsMap)));
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
        setPermissionsLoading(false);
    }
  };
  
  const handlePermissionChange = (role, permissionKey, value) => {
    setPermissionsData(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permissionKey]: value,
      }
    }));
    setPermissionsHaveChanges(true);
  };

  const handleSavePermissions = async () => {
    setPermissionsSaving(true);
    try {
      const token = Cookies.get("token");
      
      for (const role of rolesForPermissions) {
        if (permissionsData[role]) {
          await axios.put("/api/permissions", {
            role,
            permissions: permissionsData[role],
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      toast.success("Permissions updated successfully");
      setPermissionsHaveChanges(false);
      setOriginalPermissionsData(JSON.parse(JSON.stringify(permissionsData)));
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error("Failed to save permissions");
    } finally {
      setPermissionsSaving(false);
    }
  };
  
  const handleResetPermissions = () => {
    setPermissionsData(JSON.parse(JSON.stringify(originalPermissionsData)));
    setPermissionsHaveChanges(false);
  };

  const handleInvFormClose = useCallback(() => {
    setInvFormOpen(false);
  }, [setInvFormOpen]);

  const handleDeptFormClose = useCallback(() => {
    setDeptFormOpen(false);
  }, [setDeptFormOpen]);

  useEffect(() => {
    if (userRole === "HOD" && !localStorage.getItem('activeTab')) {
      setActiveTab("employees");
    }
  }, [userRole]);

  useEffect(() => {
    // Only redirect if we're sure about the auth state
    if (!userLoading) {
      redirectBasedOnRole("/dashboard");
    }
  }, [redirectBasedOnRole, userLoading]);
  
  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    if (!isAuth && !userLoading) {
      setInvFormOpen(false);
      setDeptFormOpen(false);
    }
  }, [isAuth]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (invFormOpen) {
          handleInvFormClose();
        }
        if (deptFormOpen) {
          handleDeptFormClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [invFormOpen, deptFormOpen, handleInvFormClose, handleDeptFormClose]);

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [editingCeo, setEditingCeo] = useState(null);
  const [isCeoModalOpen, setIsCeoModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    const toastId = 'hr-dashboard-toast';
    if (message) { toast.success(message, { id: toastId }); dispatch(clearMessage()); }
    if (error) { toast.error(error, { id: toastId }); dispatch(clearError()); }
    if (orgMessage) { toast.success(orgMessage, { id: toastId }); dispatch(clearOrgMessage()); }
    if (orgError) { toast.error(orgError, { id: toastId }); dispatch(clearOrgError()); }
    if (empMessage) { toast.success(empMessage, { id: toastId }); dispatch(clearEmployeesMessage()); }
    if (empError) { toast.error(empError, { id: toastId }); dispatch(clearEmployeesMessage()); }
  }, [message, error, orgMessage, orgError, empMessage, empError, dispatch]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!isAuth && !userLoading) {
      const token = Cookies.get("token");
      if (token) dispatch(getUser()); else router.push("/login");
    }
  }, [dispatch, isAuth, userLoading, router]);

  useEffect(() => {
    if (isAuth && !organization && !orgLoading && !orgLoaded) {
      dispatch(getOrganization());
    }
  }, [dispatch, isAuth, organization, orgLoading, orgLoaded]);

  useEffect(() => {
    if (organization?._id) {
      dispatch(getDepartments({ organizationId: organization._id }));
      dispatch(getEmployees());
      // Only fetch permissions if user is admin or canViewPermissions
      if (permissions?.isAdmin || permissions?.userPermissions?.canViewPermissions) {
        fetchPermissions();
      }
    }
  }, [dispatch, organization, permissions?.isAdmin, permissions?.userPermissions?.canViewPermissions]);

  const handleNavigate = (path) => {
    if (path.startsWith('department/')) {
      router.push(`/${path}`);
    } else {
      window.location.hash = path;
    }
  };
  const handleBack = () => { window.history.back(); };

  const handleEditDept = (dept) => { setEditingDepartment(dept); setIsDeptModalOpen(true); };
  const handleDeleteDept = async (id) => {
    try {
      // First dispatch the delete action which will optimistically update the UI
      const result = await dispatch(deleteDepartment(id));
      
      // Show success message
      toast.success(result.message);

      // No need to fetch departments immediately as we're using optimistic updates
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department");
      
      // Refresh the data if the delete failed to ensure UI is in sync
      if (organization?._id) {
        dispatch(getDepartments({ organizationId: organization._id }));
      }
    }
  };
  const handleSaveDept = (id, data) => dispatch(updateDepartment(id, data));

  const handleDeleteEmployee = async (employeeId) => {
    try {
      // First dispatch the delete action which will optimistically update the UI
      const result = await dispatch(deleteEmployee(employeeId));
      
      // Show success message
      toast.success(result.message);

      // No need to fetch departments immediately as we're using optimistic updates
      // The departments will be updated on the next data refresh
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
      
      // Refresh the data if the delete failed to ensure UI is in sync
      if (organization?._id) {
        dispatch(getEmployees());
        dispatch(getDepartments({ organizationId: organization._id }));
      }
    }
  };

  const refreshDashboardData = () => {
    if (organization?._id) {
      dispatch(getEmployees());
      dispatch(getDepartments({ organizationId: organization._id }));
      toast.success("Dashboard data refreshed");
    }
  };

  const handleEditOrg = (org) => { setEditingOrg(org); setIsOrgModalOpen(true); };
  const handleDeleteOrg = () => { dispatch(deleteOrganization()); handleNavigate(''); };
  const handleSaveOrg = (data) => dispatch(updateOrganization(data));

  const handleEditCeo = (org) => { setEditingCeo(org); setIsCeoModalOpen(true); };
  const handleSaveCeo = (id, data, isCvUpload) => dispatch(updateCeo(id, data, isCvUpload));

  const logoutHandler = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logoutSuccess());
    router.push("/login");
  };

  const isLoading = userLoading || orgLoading || deptLoading || empLoading;

  const employeesOnly = useMemo(() => {
    const allEmployees = [];
    if (employees && employees.length > 0) {
      employees.forEach(emp => {
        allEmployees.push({
          ...emp,
          key: emp._id,
          linkId: emp._id,
          type: 'employee',
          department: emp.department?._id || emp.department
        });
      });
    }
    if (departments) {
      departments.forEach(dept => {
        if (dept.hodName && !allEmployees.find(emp => emp.email === dept.hodEmail)) {
          allEmployees.push({
            key: `hod-${dept._id}`,
            _id: dept._id,
            linkId: dept._id,
            name: dept.hodName,
            email: dept.hodEmail,
            role: dept.role || 'HOD',
            department: dept._id,
            type: 'hod'
          });
        }
      });
    }
    return allEmployees;
  }, [employees, departments]);

  const filteredEmployees = useMemo(() => {
      if (!employeesOnly) return [];
      return employeesOnly.filter(member => {
        const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
        const departmentMatch = filterDepartment === 'all' || member.department === filterDepartment;
        return nameMatch && departmentMatch;
    });
  }, [employeesOnly, searchTerm, filterDepartment]);

  const filteredDepartments = useMemo(() => {
    if (!departments) return [];
    return departments.filter(dept =>
        dept.departmentName.toLowerCase().includes(searchDeptTerm.toLowerCase())
    );
  }, [departments, searchDeptTerm]);

  const pathParts = currentPath.split('/').filter(Boolean);
  const pageType = pathParts[0];
  const pageId = pathParts[1];
  const subfunctionIndex = pathParts[2];

  const tabSubtitles = {
    overview: "A high-level look at your organization's structure.",
    employees: "Search, view, and manage all employees.",
    departments: "Browse and manage all company departments.",
    roles: "Drag and drop employees to assign roles and departments.",
    performance: "Track employee goals, reviews, and performance metrics.",
    payroll: "Manage employee compensation and salary information.",
    permissions: "Control what different roles can see and do.",
  };

  const renderContent = () => {
    const loadingComponent = <div className="flex items-center justify-center h-full p-10"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;

    if (isLoading && !orgLoaded) return loadingComponent;

    switch(pageType) {
        case 'organization':
            if (!organization) return loadingComponent;
            return <OrganizationProfilePage organization={organization} departments={departments} employees={employeesOnly} onBack={handleBack} onEdit={handleEditOrg} onDelete={handleDeleteOrg} />;
        case 'ceo':
            if (!organization) return loadingComponent;
            const ceoData = { name: organization?.ceoName, role: 'CEO', email: organization?.email, industry: organization?.industry, pic: organization?.ceoPic, education: organization?.ceoEducation || [], experience: organization?.ceoExperience || [], skills: organization?.ceoSkills || [], tools: organization?.ceoTools || [], certifications: organization?.ceoCertifications || [] };
            return <CeoProfilePage person={ceoData} onBack={handleBack} isCeoProfile={true} onEdit={() => handleEditCeo(organization)} />;
        case 'hod':
            const hodDept = departments?.find(d => d._id === pageId);
            if (!hodDept) return loadingComponent;
            const hodData = { name: hodDept.hodName, role: hodDept.role, email: hodDept.hodEmail, departmentName: hodDept.departmentName, reportsTo: organization?.ceoName, pic: hodDept.hodPic, education: hodDept.hodEducation || [], experience: hodDept.hodExperience || [], skills: hodDept.hodSkills || [], tools: hodDept.hodTools || [], certifications: hodDept.hodCertifications || [] };
            return <EmployeeProfilePage person={hodData} onBack={handleBack} />;
        case 'employee':
            let employee = employeesOnly?.find(emp => emp._id === pageId);
            if (!employee) return loadingComponent;
            
            const empDept = departments?.find(d => d._id === employee.department?._id || d._id === employee.department);
            const empData = {
                name: employee.name,
                role: employee.role,
                email: employee.email,
                departmentName: empDept?.departmentName,
                reportsTo: employee.reportTo,
                pic: employee.pic,
                education: employee.education || [],
                experience: employee.experience || [],
                skills: employee.skills || [],
                tools: employee.tools || [],
                certifications: employee.certifications || [],
                payroll: employee.payroll || null,
                performance: employee.performance || null
            };
            
            return <EmployeeProfilePage person={empData} onBack={handleBack} />;
        case 'department':
            const dept = departments?.find(d => d._id === pageId);
            if (!dept) return loadingComponent;
            return <DepartmentProfilePage department={dept} employees={employeesOnly} onBack={handleBack} onNavigate={handleNavigate} />;
        case 'subfunction':
            const parentDept = departments?.find(d => d._id === pageId);
            if (!parentDept || !parentDept.subfunctions?.[subfunctionIndex]) return loadingComponent;
            const subFunc = { ...parentDept.subfunctions[subfunctionIndex], index: parseInt(subfunctionIndex) };
            return <SubfunctionProfilePage department={parentDept} subfunction={subFunc} employees={employeesOnly} onBack={handleBack} onNavigate={handleNavigate} />;
        default:
            return (
                <div className="p-4 sm:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 capitalize">
                                {activeTab === 'roles' ? 'Role Assignment' : activeTab}
                            </h2>
                            <p className="text-gray-500">{tabSubtitles[activeTab]}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                            {activeTab === 'employees' && (
                                <>
                                    <div className="relative flex-1 md:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 h-12" />
                                    </div>
                                    <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-3 py-2 w-full md:w-48 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer h-12">
                                        <option value="all">All Departments</option>
                                        {(departments || []).map((dept) => (<option key={dept._id} value={dept._id}>{dept.departmentName}</option>))}
                                    </select>
                                    {permissions.canInviteEmployees && (
                                        <Button
                                            onClick={() => setInvFormOpen(true)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center md:justify-start gap-2 w-full md:w-auto cursor-pointer h-12"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Invite Employee(s)
                                        </Button>
                                    )}
                                </>
                            )}
                            {activeTab === 'departments' && (
                                <>
                                    <div className="relative flex-1 md:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input type="text" placeholder="Search departments..." value={searchDeptTerm} onChange={(e) => setSearchDeptTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-400 h-12" />
                                    </div>
                                    {permissions.canAddDepartments && (
                                        <Button
                                            onClick={() => setDeptFormOpen(true)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center md:justify-start gap-2 w-full md:w-auto cursor-pointer h-12"
                                        >
                                            <Building2 className="w-4 h-4" />
                                            Add Department(s)
                                        </Button>
                                    )}
                                </>
                            )}
                            {activeTab === 'permissions' && (
                                <div className="flex flex-wrap items-center gap-2 w-full">
                                    {permissionsHaveChanges && (
                                    <Button
                                        onClick={handleResetPermissions}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer h-12 border border-gray-300 min-w-[120px]"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reset
                                    </Button>
                                    )}
                                    <Button
                                        onClick={handleSavePermissions}
                                        disabled={!permissionsHaveChanges || permissionsSaving}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer h-12 min-w-[120px]"
                                    >
                                    <Save className="w-4 h-4" />
                                    {permissionsSaving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg min-h-[calc(100vh-200px)] p-4 sm:p-6">
                            {isLoading && loadingComponent}
                            {!isLoading && hasPermissions && (
                              <>
                                {activeTab === 'overview' && userPermissions?.canViewOverview && <Overview organization={organization} departments={departments} totalEmployees={employeesOnly.length} onNavigate={handleNavigate} setActiveTab={setActiveTab} />}
                                {activeTab === 'employees' && userPermissions?.canViewEmployees && <Employees employees={filteredEmployees} departments={departments} onNavigate={handleNavigate} onDeleteEmployee={handleDeleteEmployee} />}
                                {activeTab === 'departments' && userPermissions?.canViewDepartments && <Departments departments={filteredDepartments} employees={employeesOnly} onNavigate={handleNavigate} onEdit={handleEditDept} onDelete={handleDeleteDept} />}
                                {activeTab === 'roles' && userPermissions?.canViewRoleAssignment && <RoleAssignment />}
                                {activeTab === 'performance' && userPermissions?.canViewPerformance && <Performance employees={employeesOnly} onEmployeeUpdate={(updatedEmployee) => {
                                    dispatch({ type: 'EMPLOYEE_UPDATE_SUCCESS', payload: updatedEmployee });
                                }} />}
                                {activeTab === 'permissions' && userPermissions?.canViewPermissions && 
                                    <Permissions 
                                        permissions={permissionsData}
                                        onPermissionChange={handlePermissionChange}
                                        selectedRole={selectedRoleForPermissions}
                                        onSelectRole={setSelectedRoleForPermissions}
                                        loading={permissionsLoading}
                                    />
                                }
                                {activeTab === 'payroll' && userPermissions?.canViewPayroll && <Payroll employees={employeesOnly} />}

                                {((activeTab === 'overview' && !userPermissions?.canViewOverview) ||
                                  (activeTab === 'employees' && !userPermissions?.canViewEmployees) ||
                                  (activeTab === 'departments' && !userPermissions?.canViewDepartments) ||
                                  (activeTab === 'roles' && !userPermissions?.canViewRoleAssignment) ||
                                  (activeTab === 'performance' && !userPermissions?.canViewPerformance) ||
                                  (activeTab === 'permissions' && !userPermissions?.canViewPermissions) ||
                                  (activeTab === 'payroll' && !userPermissions?.canViewPayroll)) && (
                                  <div className="text-center py-12">
                                    <div className="text-red-500 mb-4">
                                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
                                    <p className="text-gray-600">You don't have permission to view this section.</p>
                                  </div>
                                )}
                              </>
                            )}

                            {!hasPermissions && (permissions?.isAdmin || permissions?.userPermissions?.canViewPermissions) && (
                              <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Loading permissions...</span>
                              </div>
                            )}
                            {!isLoading && activeTab === 'payroll' && <Payroll employees={employeesOnly} onEmployeeUpdate={(updatedEmployee) => {
                                dispatch({ type: 'EMPLOYEE_UPDATE_SUCCESS', payload: updatedEmployee });
                            }} />}
                        </div>
                    </div>
                </div>
            );
    }
  };

  if (!userLoading && !isAuth) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-gray-800">

        <Navbar
            logoutHandler={logoutHandler}
            onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <div className="flex flex-1 overflow-hidden">
            <Sidebar
                activeTab={activeTab}
                pageType={pageType}
                setActiveTab={setActiveTab}
                handleNavigate={handleNavigate}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                logoutHandler={logoutHandler}
                userPermissions={userPermissions}
                userRole={userRole}
            />
            <main className="flex-1 overflow-y-auto bg-slate-50">
                {renderContent()}
            </main>
        </div>

        <EditDepartmentModal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} department={editingDepartment} onSave={handleSaveDept} />
        <EditOrganizationModal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} organization={editingOrg} onSave={handleSaveOrg} />
        <EditCeoModal isOpen={isCeoModalOpen} onClose={() => setIsCeoModalOpen(false)} organization={editingCeo} onSave={handleSaveCeo} />

        <Popup open={invFormOpen} onClose={handleInvFormClose} width="max-w-3xl">
            <InvForm onClose={handleInvFormClose} />
        </Popup>

        <Popup open={deptFormOpen} onClose={handleDeptFormClose}>
            <DeptForm onClose={handleDeptFormClose} />
        </Popup>
    </div>
  );
}
