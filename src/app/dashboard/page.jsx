"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import { Search, Loader2 } from "lucide-react";

import { getUser } from "@/redux/action/user";
import { getOrganization, updateOrganization, deleteOrganization, updateCeo } from "@/redux/action/org";
import { getDepartments, updateDepartment, deleteDepartment, updateHod, deleteHod } from "@/redux/action/departments";
import { getTeammembers, updateTeammember, deleteTeammember } from "@/redux/action/teammembers";
import { logoutSuccess } from "@/redux/reducer/userReducer";

import { clearMessage, clearError } from "@/redux/reducer/departmentsReducer";
import { clearMessage as clearTmMessage, clearError as clearTmError } from "@/redux/reducer/teammembersReducer";
import { clearMessage as clearOrgMessage, clearError as clearOrgError } from "@/redux/reducer/orgReducer";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import { Overview, OrganizationProfilePage, GenericProfilePage as CeoProfilePage, EditOrganizationModal, EditCeoModal } from "./components/Overview";
import { Employees, GenericProfilePage as EmployeeProfilePage, EditHodModal, EditTeammemberModal } from "./components/Employees";
import { Departments, DepartmentProfilePage, SubfunctionProfilePage, EditDepartmentModal } from "./components/Departments";

export default function HRDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isAuth, loading: userLoading } = useSelector((state) => state.user);
  const { organization, loading: orgLoading, loaded: orgLoaded, message: orgMessage, error: orgError } = useSelector((state) => state.organization);
  const { departments, loading: deptLoading, message, error } = useSelector((state) => state.departments);
  const { teammembers, loading: teamLoading, message: tmMessage, error: tmError } = useSelector((state) => state.teammembers);

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

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingHod, setEditingHod] = useState(null);
  const [isHodModalOpen, setIsHodModalOpen] = useState(false);
  const [editingTeammember, setEditingTeammember] = useState(null);
  const [isTmModalOpen, setIsTmModalOpen] = useState(false);
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
    if (message) { toast.success(message); dispatch(clearMessage()); }
    if (error) { toast.error(error); dispatch(clearError()); }
    if (tmMessage) { toast.success(tmMessage); dispatch(clearTmMessage()); }
    if (tmError) { toast.error(tmError); dispatch(clearTmError()); }
    if (orgMessage) { toast.success(orgMessage); dispatch(clearOrgMessage()); }
    if (orgError) { toast.error(orgError); dispatch(clearOrgError()); }
  }, [message, error, tmMessage, tmError, orgMessage, orgError, dispatch]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path) => { window.location.hash = path; };
  const handleBack = () => { window.history.back(); };

  const handleEditDept = (dept) => { setEditingDepartment(dept); setIsDeptModalOpen(true); };
  const handleDeleteDept = (id) => { if (window.confirm("Delete this department?")) dispatch(deleteDepartment(id)); };
  const handleSaveDept = (id, data) => dispatch(updateDepartment(id, data));

  const handleEditHod = (deptId) => { const dept = departments.find(d => d._id === deptId); setEditingHod(dept); setIsHodModalOpen(true); };
  const handleDeleteHod = (deptId) => { if (window.confirm("Remove this HOD?")) dispatch(deleteHod(deptId)); };
  const handleSaveHod = (id, data, isCvUpload) => dispatch(updateHod(id, data, isCvUpload));

  const handleEditTm = (tm) => { setEditingTeammember(tm); setIsTmModalOpen(true); };
  const handleDeleteTm = (id) => { if (window.confirm("Delete this team member?")) dispatch(deleteTeammember(id)); };
  const handleSaveTm = (id, data, isCvUpload) => dispatch(updateTeammember(id, data, isCvUpload));

  const handleEditOrg = (org) => { setEditingOrg(org); setIsOrgModalOpen(true); };
  const handleDeleteOrg = () => { if (window.confirm("Delete entire organization?")) { dispatch(deleteOrganization()); handleNavigate(''); } };
  const handleSaveOrg = (data) => dispatch(updateOrganization(data));

  const handleEditCeo = (org) => { setEditingCeo(org); setIsCeoModalOpen(true); };
  const handleSaveCeo = (id, data, isCvUpload) => dispatch(updateCeo(id, data, isCvUpload));

  useEffect(() => {
    if (!isAuth && !userLoading) {
      const token = Cookies.get("token");
      if (token) dispatch(getUser()); else router.push("/login");
    }
  }, [dispatch, isAuth, userLoading, router]);

  useEffect(() => {
    if (isAuth && !organization && !orgLoading && !orgLoaded) dispatch(getOrganization());
  }, [dispatch, isAuth, organization, orgLoading, orgLoaded]);

  useEffect(() => {
    if (organization?._id) {
      dispatch(getDepartments({ organizationId: organization._id }));
      dispatch(getTeammembers({ organizationId: organization._id }));
    }
  }, [dispatch, organization]);

  const logoutHandler = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logoutSuccess());
    router.push("/login");
  };

  const isLoading = userLoading || orgLoading || deptLoading || teamLoading;

  const employeesOnly = useMemo(() => {
    const employees = [];
    if (departments) departments.forEach(dept => {
        if (dept.hodName) {
            employees.push({ key: `hod-${dept._id}`, _id: dept._id, linkId: dept._id, name: dept.hodName, email: dept.hodEmail, role: dept.role || 'HOD', department: dept._id, type: 'hod' });
        }
    });
    if (teammembers) teammembers.forEach(tm => employees.push({ ...tm, key: tm._id, linkId: tm._id, type: 'teammember' }));
    return employees;
  }, [departments, teammembers]);

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
    settings: "Manage your dashboard settings."
  };

  const renderContent = () => {
    const loadingComponent = <div className="flex items-center justify-center h-full p-10"><Loader2 className="h-8 w-8 animate-spin text-sky-400" /></div>;

    if (isLoading && !orgLoaded) return loadingComponent;

    switch(pageType) {
        case 'organization':
            if (!organization) return loadingComponent;
            return <OrganizationProfilePage organization={organization} departments={departments} teammembers={teammembers} onBack={handleBack} onEdit={handleEditOrg} onDelete={handleDeleteOrg} />;
        case 'ceo':
            if (!organization) return loadingComponent;
            const ceoData = { name: organization?.ceoName, role: 'CEO', email: organization?.email, pic: organization?.ceoPic, education: organization?.ceoEducation || [], experience: organization?.ceoExperience || [], skills: organization?.ceoSkills || [], tools: organization?.ceoTools || [], certifications: organization?.ceoCertifications || [] };
            return <CeoProfilePage person={ceoData} onBack={handleBack} isCeoProfile={true} onEdit={() => handleEditCeo(organization)} />;
        case 'hod':
            const hodDept = departments?.find(d => d._id === pageId);
            if (!hodDept) return loadingComponent;
            const hodData = { name: hodDept.hodName, role: hodDept.role, email: hodDept.hodEmail, departmentName: hodDept.departmentName, reportsTo: organization?.ceoName, pic: hodDept.hodPic, education: hodDept.hodEducation || [], experience: hodDept.hodExperience || [], skills: hodDept.hodSkills || [], tools: hodDept.hodTools || [], certifications: hodDept.hodCertifications || [] };
            return <EmployeeProfilePage person={hodData} onBack={handleBack} />;
        case 'employee':
            const employee = teammembers?.find(tm => tm._id === pageId);
            if (!employee) return loadingComponent;
            const empDept = departments?.find(d => d._id === employee.department);
            const empData = { name: employee.name, role: employee.role, email: employee.email, departmentName: empDept?.departmentName, reportsTo: employee.reportTo, pic: null, education: employee.education || [], experience: employee.experience || [], skills: employee.skills || [], tools: employee.tools || [], certifications: employee.certifications || [] };
            return <EmployeeProfilePage person={empData} onBack={handleBack} />;
        case 'department':
            const dept = departments?.find(d => d._id === pageId);
            if (!dept) return loadingComponent;
            return <DepartmentProfilePage department={dept} teammembers={teammembers} onBack={handleBack} onNavigate={handleNavigate} />;
        case 'subfunction':
            const parentDept = departments?.find(d => d._id === pageId);
            if (!parentDept || !parentDept.subfunctions?.[subfunctionIndex]) return loadingComponent;
            const subFunc = { ...parentDept.subfunctions[subfunctionIndex], index: parseInt(subfunctionIndex) };
            return <SubfunctionProfilePage department={parentDept} subfunction={subFunc} teammembers={teammembers} onBack={handleBack} onNavigate={handleNavigate} onEdit={handleEditTm} onDelete={handleDeleteTm} />;
        default:
            if (activeTab === 'settings') {
                return <Settings />;
            }
            return (
                <div className="p-4 sm:p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white capitalize">{activeTab}</h2>
                            <p className="text-slate-400">{tabSubtitles[activeTab]}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {activeTab === 'employees' && (
                                <>
                                    <div className="relative flex-1 md:flex-none">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                        <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-500" />
                                    </div>
                                    <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-3 py-2 w-48 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors">
                                        <option value="all">All Departments</option>
                                        {(departments || []).map((dept) => (<option key={dept._id} value={dept._id}>{dept.departmentName}</option>))}
                                    </select>
                                </>
                            )}
                            {activeTab === 'departments' && (
                                <div className="relative flex-1 md:flex-none">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                    <input type="text" placeholder="Search departments..." value={searchDeptTerm} onChange={(e) => setSearchDeptTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors placeholder-slate-500" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 min-h-[calc(100vh-200px)]">
                        {isLoading && loadingComponent}
                        {!isLoading && activeTab === 'overview' && <Overview organization={organization} departments={departments} totalEmployees={employeesOnly.length} onNavigate={handleNavigate} setActiveTab={setActiveTab} />}
                        {!isLoading && activeTab === 'employees' && <Employees employees={filteredEmployees} departments={departments} onNavigate={handleNavigate} onEditHod={handleEditHod} onDeleteHod={handleDeleteHod} onEditTm={handleEditTm} onDeleteTm={handleDeleteTm} />}
                        {!isLoading && activeTab === 'departments' && <Departments departments={filteredDepartments} teammembers={teammembers} onNavigate={handleNavigate} onEdit={handleEditDept} onDelete={handleDeleteDept} />}
                    </div>
                </div>
            );
    }
  };

  if (!userLoading && !isAuth) return null;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
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
            />
            <main className="flex-1 overflow-y-auto bg-slate-900/50" style={{backgroundImage: 'radial-gradient(circle at top left, rgba(14, 165, 233, 0.1), transparent-30%)'}}>
                {renderContent()}
            </main>
        </div>

        <EditDepartmentModal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} department={editingDepartment} onSave={handleSaveDept} />
        <EditHodModal isOpen={isHodModalOpen} onClose={() => setIsHodModalOpen(false)} department={editingHod} onSave={handleSaveHod} />
        <EditTeammemberModal isOpen={isTmModalOpen} onClose={() => setIsTmModalOpen(false)} teammember={editingTeammember} onSave={handleSaveTm} />
        <EditOrganizationModal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} organization={editingOrg} onSave={handleSaveOrg} />
        <EditCeoModal isOpen={isCeoModalOpen} onClose={() => setIsCeoModalOpen(false)} organization={editingCeo} onSave={handleSaveCeo} />
    </div>
  );
}
