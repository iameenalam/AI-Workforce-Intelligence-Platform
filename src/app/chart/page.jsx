"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getOrganization } from "@/redux/action/org";
import { getDepartments } from "@/redux/action/departments";
import { getEmployees } from "@/redux/action/employees";
import { getTeammembers } from "@/redux/action/teammembers";
import { clearMessage as clearOrgMessage } from "@/redux/reducer/orgReducer";
import { clearMessage as clearDeptMessage } from "@/redux/reducer/departmentsReducer";
import { clearEmployeesMessage } from "@/redux/action/employees";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { logoutSuccess } from "@/redux/reducer/userReducer";
import Link from "next/link";
import OrgForm from "../components/popup-forms/orgform";
import DeptForm from "../components/popup-forms/deptform";
// import InvForm from "../components/popup-forms/invform";
import Popup from "../components/popup-forms/Popup";
import { toast, Toaster } from "react-hot-toast";
import { getUser } from "@/redux/action/user";
import { useHasMounted } from "@/hooks/useHasMounted";
import { UserPlus, LogOut, FoldVertical, UnfoldVertical, Network, Building2, Workflow, ExternalLink, LayoutDashboard } from "lucide-react";
import ChatbotBubble from "../components/chatbotorg/ChatbotBubble";
import { motion, AnimatePresence } from "framer-motion";

const BOX_WIDTH = 230;
const BOX_HEIGHT = 105;
const V_GAP = 50;
const H_GAP = 50;
const MOBILE_BREAKPOINT = 768;

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

function ChevronIcon({ up, className = "" }) {
  return (
    <svg className={`w-4 h-4 mr-1 ${className}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
    </svg>
  );
}

function HoverLink({ href, children, className = "" }) {
  const content = (
    <div className={`group relative inline-flex items-center gap-1.5 transition-colors ${className}`}>
      <span className="truncate">{children}</span>
      <ExternalLink className={`w-3.5 h-3.5 ${href ? 'text-gray-400' : 'text-gray-300'}`} />
    </div>
  );
  if (href) return <Link href={href}>{content}</Link>;
  return <div className="cursor-default">{content}</div>;
}

const lineAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

function VLine({ from, to, left }) {
  const top = Math.min(from, to);
  const height = Math.abs(to - from);
  return <motion.div style={{ position: "absolute", left, top, width: 2, height, background: "#94a3b8", zIndex: 0, transform: "translateX(-1px)" }} variants={lineAnim} />;
}

function HLine({ from, to, top }) {
  const left = Math.min(from, to);
  const width = Math.abs(to - from);
  return <motion.div style={{ position: "absolute", left, top, height: 2, width, background: "#94a3b8", zIndex: 0, transform: "translateY(-1px)" }} variants={lineAnim} />;
}

function OrgBox({ children, style = {}, className = "", highlight = "", isMobile = false, ...props }) {
  const borderClasses = {
    org: "border-teal-500",
    ceo: "border-blue-400",
    dept: "border-green-400",
    subfunction: "border-violet-400",
    tl: "border-orange-400",
    deptbox: "border-rose-400",
  };
  const border = borderClasses[highlight] || "border-slate-300";
  const mobileStyles = isMobile ? { width: '100%', height: 'auto', minHeight: BOX_HEIGHT } : { width: BOX_WIDTH, height: BOX_HEIGHT };
  return (
    <div className={`relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:z-20 border-2 ${border} ${className}`} style={{ ...mobileStyles, ...style }} {...props}>
      {children}
    </div>
  );
}

function OrganizationInfoBox({ organization, isMobile, collapsed, onCollapseChange, onAddClick }) {
  return (
    <OrgBox highlight="org" isMobile={isMobile}>
      <div className="flex items-center mb-2">
        <div className="flex-shrink-0 mr-3">
          {organization.logoUrl ? (
            <img src={organization.logoUrl} alt={`${organization.name} Logo`} className="w-11 h-11 rounded-full object-cover border-2 border-teal-200" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100">
              <Network className="h-6 w-6 text-teal-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <HoverLink href={`/chart/organization/${organization._id}`} className="font-bold text-gray-800 hover:text-teal-600">{organization.name}</HoverLink>
          <div className="text-xs text-teal-600 font-semibold">Organization</div>
          <div className="text-xs text-gray-500 truncate">{organization.industry}</div>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-auto pt-2">
        <Button size="sm" variant="outline" onClick={onCollapseChange} className="flex items-center text-xs px-2 py-1 border-teal-200 text-teal-700 hover:bg-teal-50" type="button">
          <ChevronIcon up={!collapsed} />{collapsed ? "Expand" : "Collapse"}
        </Button>
        <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-teal-200 text-teal-700 hover:bg-teal-50" onClick={onAddClick} type="button">+ Add</Button>
      </div>
    </OrgBox>
  );
}

function DepartmentBox({ organization, department, collapsed, onCollapseChange, onAddClick, isMobile }) {
  return (
    <OrgBox highlight="deptbox" isMobile={isMobile}>
      <div className="flex items-center mb-2">
        <div className="flex-shrink-0 mr-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100"><Building2 className="h-6 w-6 text-rose-600" /></div>
        </div>
        <div className="flex-1 min-w-0">
          <HoverLink href={`/chart/department/${department._id}`} className="font-bold text-gray-800 hover:text-rose-600">{department.departmentName}</HoverLink>
          <div className="text-xs text-rose-600 font-semibold">Department</div>
          <div className="text-xs text-gray-500 truncate">{organization.name}</div>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-auto pt-2">
        <Button size="sm" variant="outline" onClick={onCollapseChange} className="flex items-center text-xs px-2 py-1 border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer" type="button">
          <ChevronIcon up={!collapsed} />{collapsed ? "Expand" : "Collapse"}
        </Button>
        <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer" onClick={onAddClick} type="button">+ Add</Button>
      </div>
    </OrgBox>
  );
}

export default function ChartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const chartRef = useRef(null);
  const hasMounted = useHasMounted();
  const windowSize = useWindowSize();

  const { isAuth } = useSelector((state) => state.user);
  const { organization, loading: orgLoading, loaded: orgLoaded } = useSelector((state) => state.organization);
  const { departments, message: deptMsg } = useSelector((state) => state.departments);
  const { employees, message: empMsg } = useSelector((state) => state.employees);
  const { teammembers } = useSelector((state) => state.teammembers);
  const { message: orgMsg } = useSelector((state) => state.organization);

  const [orgCollapsed, setOrgCollapsed] = useState(false);
  const [ceoCollapsed, setCeoCollapsed] = useState(false);
  const [deptBoxCollapsed, setDeptBoxCollapsed] = useState({});
  const [deptCollapsed, setDeptCollapsed] = useState({});
  const [subfunctionCollapsed, setSubfunctionCollapsed] = useState({});

  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [deptFormOpen, setDeptFormOpen] = useState(false);
  const [invFormOpen, setInvFormOpen] = useState(false);
  const [scrollToNodeId, setScrollToNodeId] = useState(null);

  useEffect(() => {
    if (!hasMounted) return;
    const token = Cookies.get("token");
    if (token && !isAuth) dispatch(getUser());
    if (!isAuth && !token) router.replace("/login");
  }, [isAuth, dispatch, router, hasMounted]);

  useEffect(() => { if (orgMsg) { toast.success(orgMsg); dispatch(clearOrgMessage()); dispatch(getOrganization()); } }, [orgMsg, dispatch]);
  useEffect(() => { if (deptMsg) { toast.success(deptMsg); if (organization?._id) dispatch(getDepartments({ organizationId: organization._id })); dispatch(clearDeptMessage()); } }, [deptMsg, organization, dispatch]);
  useEffect(() => { if (empMsg) { toast.success(empMsg); dispatch(getEmployees()); dispatch(clearEmployeesMessage()); } }, [empMsg, dispatch]);
  useEffect(() => { if (isAuth && !organization && !orgLoading && !orgLoaded) dispatch(getOrganization()); }, [isAuth, organization, orgLoading, orgLoaded, dispatch]);
  useEffect(() => {
    if (organization?._id) {
      dispatch(getDepartments({ organizationId: organization._id }));
      dispatch(getEmployees());
      dispatch(getTeammembers({ organizationId: organization._id }));
    }
  }, [dispatch, organization]);

  useEffect(() => {
    if (departments) {
      const initialDeptState = {};
      const initialDeptBoxState = {};
      departments.forEach(d => {
        initialDeptState[d._id] = false;
        initialDeptBoxState[d._id] = false;
      });
      setDeptCollapsed(initialDeptState);
      setDeptBoxCollapsed(initialDeptBoxState);
    }
  }, [departments]);

  // Filter employees to only show those with assigned roles and departments
  const assignedEmployees = employees?.filter(emp => emp.role !== "Unassigned" && emp.department) || [];

  // Get subfunction members from both employees and legacy team members
  const getSubfunctionMembers = (deptId, sfIndex, role = null) => {
    // Get from current employees system
    const employeeMembers = assignedEmployees.filter(emp =>
      emp.department?._id === deptId &&
      emp.subfunctionIndex === sfIndex &&
      (role ? emp.role === role : true)
    );

    // Get from legacy team members system
    const legacyMembers = teammembers?.filter(tm =>
      tm.department === deptId &&
      tm.subfunctionIndex === sfIndex &&
      (role ? tm.role === role : true)
    ) || [];

    // Combine both sources
    return [...employeeMembers, ...legacyMembers];
  };
  const getSubfunctionKey = (deptId, sfIndex) => `${deptId}__${sfIndex}`;
  const handleDeptFormClose = () => { setDeptFormOpen(false); if (organization?._id) dispatch(getDepartments({ organizationId: organization._id })); };
  const handleInvFormClose = () => { setInvFormOpen(false); dispatch(getEmployees()); };

  const handleExpandAll = () => {
    setOrgCollapsed(false);
    setCeoCollapsed(false);
    setDeptBoxCollapsed(departments.reduce((acc, d) => ({ ...acc, [d._id]: false }), {}));
    setDeptCollapsed(departments.reduce((acc, d) => ({ ...acc, [d._id]: false }), {}));
    setSubfunctionCollapsed({});
    setScrollToNodeId('organization_root');
  };

  const handleCollapseAll = () => {
    setOrgCollapsed(true);
    setCeoCollapsed(true);
    setDeptBoxCollapsed(departments.reduce((acc, d) => ({ ...acc, [d._id]: true }), {}));
    setDeptCollapsed(departments.reduce((acc, d) => ({ ...acc, [d._id]: true }), {}));
    setScrollToNodeId('organization_root');
  };

  function buildChartTree() {
    if (!organization) return null;
    const orgRootNode = {
      id: "organization_root",
      type: "org",
      box: (isMobile) => <OrganizationInfoBox organization={organization} isMobile={isMobile} collapsed={orgCollapsed} onCollapseChange={() => { setOrgCollapsed(c => !c); setScrollToNodeId('organization_root'); }} onAddClick={() => setDeptFormOpen(true)} />,
      children: [],
      expanded: !orgCollapsed,
    };

    const ceoNode = {
      id: "ceo",
      type: "ceo",
      box: (isMobile) => (
        <OrgBox className="ceo-box" highlight="ceo" isMobile={isMobile}>
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 mr-3">
              {organization.ceoPic ? <img src={organization.ceoPic} alt="CEO" className="w-11 h-11 rounded-full object-cover border-2 border-blue-200" /> : <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">CEO</div>}
            </div>
            <div className="flex-1 min-w-0">
              <HoverLink href={`/chart/ceo/${organization._id}`} className="font-bold text-gray-800 hover:text-blue-600">{organization.ceoName}</HoverLink>
              <div className="text-xs text-blue-600 font-semibold">CEO</div>
              <div className="text-xs text-gray-500 truncate">{organization.name}</div>
            </div>
          </div>
          <div className="flex justify-between gap-2 mt-auto pt-2">
            <Button size="sm" variant="outline" onClick={() => { setCeoCollapsed(c => !c); setScrollToNodeId('ceo'); }} className="flex items-center text-xs px-2 py-1 border-blue-200 text-blue-600 hover:bg-blue-50" type="button">
              <ChevronIcon up={!ceoCollapsed} />{ceoCollapsed ? "Expand" : "Collapse"}
            </Button>
            {organization && <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => setDeptFormOpen(true)} type="button">+ Add</Button>}
          </div>
        </OrgBox>
      ),
      children: [],
      expanded: !ceoCollapsed,
    };

    if (!orgCollapsed) orgRootNode.children = [ceoNode];

    if (!ceoCollapsed && departments.length > 0) {
      ceoNode.children = departments.map((department) => {
        const deptBoxNode = {
          id: `${department._id}_deptbox`,
          type: "deptbox",
          box: (isMobile) => <DepartmentBox organization={organization} department={department} collapsed={deptBoxCollapsed[department._id]} onCollapseChange={() => { setDeptBoxCollapsed(p => ({ ...p, [department._id]: !p[department._id] })); setScrollToNodeId(`${department._id}_deptbox`); }} onAddClick={() => setDeptFormOpen(true)} isMobile={isMobile} />,
          children: [],
          expanded: !deptBoxCollapsed[department._id],
        };

        // Find HOD for this department
        const hodEmployee = assignedEmployees.find(emp => emp.department?._id === department._id && emp.role === "HOD");

        const hodNode = hodEmployee ? {
          id: `hod_${department._id}`,
          type: "dept",
          box: (isMobile) => (
            <OrgBox highlight="dept" isMobile={isMobile}>
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-3">
                  {hodEmployee.pic ? <img src={hodEmployee.pic} alt={hodEmployee.name} className="w-11 h-11 rounded-full object-cover border-2 border-green-200" /> : <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm font-bold">HOD</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <HoverLink href={`/chart/employee/${hodEmployee._id}`} className="font-bold text-gray-800 hover:text-green-600">{hodEmployee.name}</HoverLink>
                  <div className="text-xs text-green-600 font-semibold">{hodEmployee.role}</div>
                  <div className="text-xs text-gray-500 truncate">{department.departmentName}</div>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-auto pt-2">
                <Button size="sm" variant="outline" onClick={() => { setDeptCollapsed(p => ({ ...p, [department._id]: !p[department._id] })); setScrollToNodeId(department._id); }} className="flex items-center text-xs px-2 py-1 border-green-200 text-green-600 hover:bg-green-50" type="button">
                  <ChevronIcon up={!deptCollapsed[department._id]} />{deptCollapsed[department._id] ? "Expand" : "Collapse"}
                </Button>
              </div>
            </OrgBox>
          ),
          children: [],
          expanded: !deptCollapsed[department._id],
        } : null;

          // Assign children to department based on HOD presence
          if (!deptBoxCollapsed[department._id]) {
            if (hodNode) {
              // If HOD exists, HOD goes under department, subfunctions under HOD
              deptBoxNode.children = [hodNode];
              if (department.subfunctions?.length > 0) {
                hodNode.children = department.subfunctions.map((sf, sfIndex) => {
                  const subfunctionKey = getSubfunctionKey(department._id, sfIndex);
                  const teamLeads = getSubfunctionMembers(department._id, sfIndex, "Team Lead");
                  const teamMembers = getSubfunctionMembers(department._id, sfIndex, "Team Member");

                  // Debug logging
                  console.log(`Subfunction ${sf.name} (${sfIndex}):`, {
                    teamLeads: teamLeads.length,
                    teamMembers: teamMembers.length,
                    allEmployeesForDept: assignedEmployees.filter(emp => emp.department?._id === department._id).map(emp => ({
                      name: emp.name,
                      role: emp.role,
                      subfunctionIndex: emp.subfunctionIndex
                    }))
                  });

                  const sfNode = {
              id: `${department._id}_sfBox_${sfIndex}`,
              type: "subfunction",
              box: (isMobile) => (
                <OrgBox highlight="subfunction" isMobile={isMobile}>
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 mr-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100"><Workflow className="h-6 w-6 text-violet-600" /></div></div>
                    <div className="flex-1 min-w-0">
                      <HoverLink href={`/chart/subfunction/${department._id}/${sfIndex}`} className="font-bold text-gray-800 hover:text-violet-600">{sf.name}</HoverLink>
                      <div className="text-xs text-violet-600 font-semibold">Sub-Function</div>
                      <div className="text-xs text-gray-500 truncate">{department.departmentName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 mt-auto pt-2">
                    <Button size="sm" variant="outline" onClick={() => setSubfunctionCollapsed(p => ({ ...p, [subfunctionKey]: !p[subfunctionKey] }))} className="flex items-center text-xs px-2 py-1 border-violet-200 text-violet-700 hover:bg-violet-50" type="button">
                      <ChevronIcon up={!subfunctionCollapsed[subfunctionKey]} />{subfunctionCollapsed[subfunctionKey] ? "Expand" : "Collapse"}
                    </Button>
                    {/* <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => setInvFormOpen(true)} type="button">+ Add</Button> */}
                  </div>
                </OrgBox>
              ),
              children: [],
              expanded: !subfunctionCollapsed[subfunctionKey],
            };

            if (!subfunctionCollapsed[subfunctionKey] && (teamLeads.length > 0 || teamMembers.length > 0)) {
              // Create nodes for all team leads
              const teamLeadNodes = teamLeads.map((tl, tlIndex) => ({
                id: `${department._id}_sf_${sfIndex}_tl_${tlIndex}`,
                type: "tl",
                box: (isMobile) => (
                  <OrgBox highlight="tl" isMobile={isMobile}>
                    <div className="flex items-center mb-2">
                      <div className="flex-shrink-0 mr-3">
                        {tl.pic ? (
                          <img src={tl.pic} alt={tl.name} className="w-11 h-11 rounded-full object-cover border-2 border-orange-200" />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">TL</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <HoverLink href={`/chart/employee/${tl._id}`} className="font-bold text-gray-800 hover:text-orange-600">{tl.name}</HoverLink>
                        <div className="text-xs text-orange-600 font-semibold">Team Lead</div>
                        <div className="text-xs text-gray-500 truncate">{sf.name}</div>
                      </div>
                    </div>
                  </OrgBox>
                ),
                children: [],
                expanded: true,
              }));

              // Team leads will be added directly to subfunction without container

              // Add team members and team leads directly to subfunction
              const allNodes = [];

              // Add team leads first
              if (teamLeads.length > 0) {
                allNodes.push(...teamLeadNodes);
              }

              // Add team members
              if (teamMembers.length > 0) {
                const teamMemberNodes = teamMembers.map((tm) => ({
                  id: tm._id,
                  type: "member",
                  box: (isMobile) => (
                    <OrgBox isMobile={isMobile}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {tm.pic ? (
                            <img src={tm.pic} alt={tm.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">TM</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <HoverLink href={`/chart/employee/${tm._id}`} className="font-bold text-gray-800 hover:text-slate-600">{tm.name}</HoverLink>
                          <div className="text-xs text-slate-600 font-semibold">Team Member</div>
                          <div className="text-xs text-gray-500 truncate">{sf.name}</div>
                        </div>
                      </div>
                    </OrgBox>
                  ),
                  children: [],
                  expanded: true,
                }));
                allNodes.push(...teamMemberNodes);
              }

              // Set all nodes directly under subfunction
              if (allNodes.length > 0) {
                sfNode.children = allNodes;
              }
            }
                  return sfNode;
                });
              }
            } else if (department.subfunctions?.length > 0) {
              // If no HOD, subfunctions go directly under department
              deptBoxNode.children = department.subfunctions.map((sf, sfIndex) => {
                const subfunctionKey = getSubfunctionKey(department._id, sfIndex);
                const teamLeads = getSubfunctionMembers(department._id, sfIndex, "Team Lead");
                const teamMembers = getSubfunctionMembers(department._id, sfIndex, "Team Member");

                const sfNode = {
                  id: `${department._id}_sfBox_${sfIndex}`,
                  type: "subfunction",
                  box: (isMobile) => (
                    <OrgBox highlight="subfunction" isMobile={isMobile}>
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 mr-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100"><Workflow className="h-6 w-6 text-violet-600" /></div></div>
                        <div className="flex-1 min-w-0">
                          <HoverLink href={`/chart/subfunction/${department._id}/${sfIndex}`} className="font-bold text-gray-800 hover:text-violet-600">{sf.name}</HoverLink>
                          <div className="text-xs text-violet-600 font-semibold">Sub-Function</div>
                          <div className="text-xs text-gray-500 truncate">{department.departmentName}</div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-2 mt-auto pt-2">
                        <Button size="sm" variant="outline" onClick={() => setSubfunctionCollapsed(p => ({ ...p, [subfunctionKey]: !p[subfunctionKey] }))} className="flex items-center text-xs px-2 py-1 border-violet-200 text-violet-700 hover:bg-violet-50" type="button">
                          <ChevronIcon up={!subfunctionCollapsed[subfunctionKey]} />{subfunctionCollapsed[subfunctionKey] ? "Expand" : "Collapse"}
                        </Button>
                        {/* <Button size="sm" variant="outline" className="text-xs px-2 py-1 border-violet-200 text-violet-700 hover:bg-violet-50" onClick={() => setInvFormOpen(true)} type="button">+ Add</Button> */}
                      </div>
                    </OrgBox>
                  ),
                  children: [],
                  expanded: !subfunctionCollapsed[subfunctionKey],
                };

                // Apply the same simplified team lead and member logic as the HOD case
                if (!subfunctionCollapsed[subfunctionKey] && (teamLeads.length > 0 || teamMembers.length > 0)) {
                  // Create nodes for all team leads
                  const teamLeadNodes = teamLeads.map((tl, tlIndex) => ({
                    id: `${department._id}_sf_${sfIndex}_tl_${tlIndex}`,
                    type: "tl",
                    box: (isMobile) => (
                      <OrgBox highlight="tl" isMobile={isMobile}>
                        <div className="flex items-center mb-2">
                          <div className="flex-shrink-0 mr-3">
                            {tl.pic ? (
                              <img src={tl.pic} alt={tl.name} className="w-11 h-11 rounded-full object-cover border-2 border-orange-200" />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">TL</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <HoverLink href={`/chart/employee/${tl._id}`} className="font-bold text-gray-800 hover:text-orange-600">{tl.name}</HoverLink>
                            <div className="text-xs text-orange-600 font-semibold">Team Lead</div>
                            <div className="text-xs text-gray-500 truncate">{sf.name}</div>
                          </div>
                        </div>
                      </OrgBox>
                    ),
                    children: [],
                    expanded: true,
                  }));

                  // Add team members and team leads directly to subfunction
                  const allNodes = [];

                  // Add team leads first
                  if (teamLeads.length > 0) {
                    allNodes.push(...teamLeadNodes);
                  }

                  // Add team members
                  if (teamMembers.length > 0) {
                    const teamMemberNodes = teamMembers.map((tm) => ({
                      id: tm._id,
                      type: "member",
                      box: (isMobile) => (
                        <OrgBox isMobile={isMobile}>
                          <div className="flex items-center mb-2">
                            <div className="flex-shrink-0 mr-3">
                              {tm.pic ? (
                                <img src={tm.pic} alt={tm.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200" />
                              ) : (
                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">TM</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <HoverLink href={`/chart/employee/${tm._id}`} className="font-bold text-gray-800 hover:text-slate-600">{tm.name}</HoverLink>
                              <div className="text-xs text-slate-600 font-semibold">Team Member</div>
                              <div className="text-xs text-gray-500 truncate">{sf.name}</div>
                            </div>
                          </div>
                        </OrgBox>
                      ),
                      children: [],
                      expanded: true,
                    }));
                    allNodes.push(...teamMemberNodes);
                  }

                  // Set all nodes directly under subfunction
                  if (allNodes.length > 0) {
                    sfNode.children = allNodes;
                  }
                }

                return sfNode;
              });
            }
          }

        return deptBoxNode;
      });
    }
    return orgRootNode;
  }

  const tree = buildChartTree();
  const isMobile = windowSize.width < MOBILE_BREAKPOINT;
  let layout, chartWidth = "100%", chartHeight = "100%", chartNodes = [], chartLines = [];

  if (tree && !isMobile) {
    const computeLayout = (node, depth = 0, xOffset = 0) => {
      const childrenToLayout = (node.expanded && node.children) ? node.children : [];
      if (childrenToLayout.length === 0) return { ...node, x: xOffset, y: depth * (BOX_HEIGHT + V_GAP), width: BOX_WIDTH, children: [] };
      const laidOutChildren = [];
      let childX = xOffset;
      for (const child of childrenToLayout) {
        const cLayout = computeLayout(child, depth + 1, childX);
        laidOutChildren.push(cLayout);
        childX += cLayout.width + H_GAP;
      }
      const totalChildrenWidth = laidOutChildren.reduce((acc, c) => acc + c.width, 0) + H_GAP * (laidOutChildren.length - 1);
      const myX = xOffset + (totalChildrenWidth - BOX_WIDTH) / 2;
      return { ...node, x: myX, y: depth * (BOX_HEIGHT + V_GAP), width: Math.max(totalChildrenWidth, BOX_WIDTH), children: laidOutChildren };
    };
    layout = computeLayout(tree, 0, 0);

    const getBounds = (n) => {
      let minX = n.x, maxX = n.x + BOX_WIDTH, maxY = n.y + BOX_HEIGHT;
      if (n.children) {
        for (const c of n.children) {
          const b = getBounds(c);
          minX = Math.min(minX, b.minX);
          maxX = Math.max(maxX, b.maxX);
          maxY = Math.max(maxY, b.maxY);
        }
      }
      return { minX, maxX, maxY };
    };
    const { minX, maxX, maxY } = getBounds(layout);
    chartWidth = maxX - minX;
    chartHeight = maxY + BOX_HEIGHT;
    const centeredLayout = computeLayout(tree, 0, -minX);

    const renderHorizontalTree = (layout) => {
      const nodes = [];
      const lines = [];
      const nodeAnim = {
        initial: { opacity: 0, scale: 0.85 },
        animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
        exit: { opacity: 0, scale: 0.85, transition: { type: "spring", stiffness: 260, damping: 20 } },
      };
      function walk(n) {
        nodes.push(<motion.div layout key={n.id} variants={nodeAnim} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', left: n.x, top: n.y, zIndex: 1 }} data-node-id={n.id}>{n.box(false)}</motion.div>);
        if (n.expanded && n.children?.length > 0) {
          const parentCenterX = n.x + BOX_WIDTH / 2;
          const parentBottomY = n.y + BOX_HEIGHT;
          if (n.children.length === 1) {
            const c = n.children[0];
            lines.push(<VLine key={`v-${n.id}-${c.id}`} from={parentBottomY} to={c.y} left={parentCenterX} />);
          } else {
            lines.push(<VLine key={`v-${n.id}-multi`} from={parentBottomY} to={parentBottomY + V_GAP / 2} left={parentCenterX} />);
            const leftMost = n.children[0].x + BOX_WIDTH / 2;
            const rightMost = n.children[n.children.length - 1].x + BOX_WIDTH / 2;
            lines.push(<HLine key={`h-${n.id}-multi`} from={leftMost} to={rightMost} top={parentBottomY + V_GAP / 2} />);
            n.children.forEach(c => lines.push(<VLine key={`v-link-${n.id}-${c.id}`} from={parentBottomY + V_GAP / 2} to={c.y} left={c.x + BOX_WIDTH / 2} />));
          }
          n.children.forEach(walk);
        }
      }
      walk(layout);
      return { nodes, lines };
    };
    const rendered = renderHorizontalTree(centeredLayout);
    chartNodes = rendered.nodes;
    chartLines = rendered.lines;
  }

  useEffect(() => {
    if (!scrollToNodeId || !chartRef.current || isMobile) return;
    const chartContainer = chartRef.current;
    setTimeout(() => {
      const targetNode = chartContainer.querySelector(`[data-node-id="${scrollToNodeId}"]`);
      if (targetNode) {
        const containerRect = chartContainer.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        const scrollLeft = (targetRect.left + chartContainer.scrollLeft - containerRect.left) - (containerRect.width / 2) + (targetRect.width / 2);
        const scrollTop = (targetRect.top + chartContainer.scrollTop - containerRect.top) - (containerRect.height / 2) + (targetRect.height / 2);
        chartContainer.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
      }
      setScrollToNodeId(null);
    }, 400);
  }, [scrollToNodeId, isMobile]);

  const renderVerticalTree = (node, level = 0) => {
    const nodeAnim = {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    };
    return (
      <motion.div key={node.id} layout="position" variants={nodeAnim} initial="initial" animate="animate" exit="exit" className="w-full">
        <div style={{ paddingLeft: `${level * 20}px` }} className="mb-3">{node.box(true)}</div>
        <AnimatePresence>
          {node.expanded && node.children?.length > 0 && (
            <div className="relative">
              {level > 0 && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-300" style={{ left: `${level * 20 - 10}px` }}></div>}
              {node.children.map(child => renderVerticalTree(child, level + 1))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const logoutHandler = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logoutSuccess());
    router.push("/login");
  };

  if (!hasMounted) return null;
  const hasDepartments = departments && departments.length > 0;
  const navbarFont = "font-semibold tracking-tight";
  const isFullyExpanded = hasDepartments && !ceoCollapsed && !orgCollapsed && Object.values(deptCollapsed).every(v => !v);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm">
        <div className="flex flex-row justify-between items-center gap-4 max-w-full px-2 sm:px-6 py-4">
          <div className="flex-1 flex items-center min-w-0">
            <h1 className="hidden sm:block text-2xl font-bold text-gray-800">Organizational Chart</h1>
            <span className="block sm:hidden text-lg font-bold text-gray-800">OrgChart</span>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-3">
            {organization && (
              <>
                <Button variant="outline" size="sm" className={`shadow-sm flex items-center text-black ${navbarFont} px-2 cursor-pointer`} onClick={isFullyExpanded ? handleCollapseAll : handleExpandAll} type="button">
                  {isFullyExpanded ? <FoldVertical className="text-black w-5 h-5" /> : <UnfoldVertical className="text-black w-5 h-5" />}
                  <span className="hidden sm:inline text-base ml-2">{isFullyExpanded ? "Collapse All" : "Expand All"}</span>
                </Button>
                <Button variant="outline" size="sm" className={`shadow-sm flex items-center text-black ${navbarFont} px-2 cursor-pointer`} onClick={() => setDeptFormOpen(true)} type="button">
                  <Building2 className="w-6 h-6 text-black" />
                  <span className="hidden sm:inline text-base ml-2">Add Department(s)</span>
                </Button>
              </>
            )}
            {/* {hasDepartments && (
              <Button variant="outline" size="sm" className={`shadow-sm flex items-center text-black ${navbarFont} px-2 cursor-pointer`} onClick={() => setInvFormOpen(true)} type="button">
                <UserPlus className="w-6 h-6 text-black" />
                <span className="hidden sm:inline text-base ml-2">Invite Employee(s)</span>
              </Button>
            )} */}
            {organization && (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className={`shadow-sm flex items-center text-black ${navbarFont} px-2 cursor-pointer`} type="button">
                  <LayoutDashboard className="w-6 h-6 text-black" />
                  <span className="hidden sm:inline text-base ml-2">Dashboard</span>
                </Button>
              </Link>
            )}
            <Button variant="destructive" size="sm" onClick={logoutHandler} className={`shadow-sm flex items-center bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 ${navbarFont} px-2 cursor-pointer`} style={{ color: "#fff" }}>
              <LogOut className="w-6 h-6" color="#fff" />
              <span className="hidden sm:inline text-base ml-2" style={{ color: "#fff" }}>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      <main className="min-h-screen bg-slate-100 pt-[80px]">
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div ref={chartRef} className="relative overflow-auto h-[calc(100vh-80px)] w-full p-4 md:p-8">
          {!orgLoading && orgLoaded && !organization ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg mb-4">No organization chart found.</p>
              <Button variant="default" className="shadow-lg" onClick={() => setOrgFormOpen(true)} type="button">Create Your Organization</Button>
            </div>
          ) : (
            organization && tree && (
              isMobile ? (
                <div className="w-full max-w-2xl mx-auto"><AnimatePresence>{renderVerticalTree(tree)}</AnimatePresence></div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: chartHeight, width: "100%" }}>
                  <div style={{ position: "relative", width: chartWidth, height: chartHeight }}>
                    <AnimatePresence>{chartLines}</AnimatePresence>
                    <AnimatePresence>{chartNodes}</AnimatePresence>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </main>
      <Popup open={orgFormOpen} onClose={() => setOrgFormOpen(false)}><OrgForm onClose={() => setOrgFormOpen(false)} /></Popup>
      <Popup open={deptFormOpen} onClose={handleDeptFormClose}><DeptForm onClose={handleDeptFormClose} /></Popup>
      {/* <Popup open={invFormOpen} onClose={handleInvFormClose} width="max-w-3xl"><InvForm onClose={handleInvFormClose} /></Popup> */}
      <ChatbotBubble />
    </>
  );
}
