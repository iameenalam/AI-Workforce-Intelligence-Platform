"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { orgData, allemployees, departmentsDemoData } from "../../../data/data";
import { Button } from "@/components/ui/button";
import { Network, Loader2, Building2, ExternalLink, FoldVertical, UnfoldVertical } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotBubble from "../components/chatbot/ChatbotBubble";

const BOX_WIDTH = 230;
const BOX_HEIGHT = 105;
const V_GAP = 50;
const H_GAP = 50;
const MOBILE_BREAKPOINT = 768;

function groupByDepartment(data) {
  const departments = {};
  for (const emp of data) {
    if (!emp.department || !emp.department.trim()) continue;
    const dept = emp.department.trim();
    const deptObj = departmentsDemoData.find(
      (d) => d.name && dept.toLowerCase().includes(d.name.toLowerCase())
    );
    const deptId = deptObj ? deptObj.id : dept.toLowerCase().replace(/\s+/g, "_");
    if (!departments[deptId]) {
      departments[deptId] = { deptObj, emps: [] };
    }
    departments[deptId].emps.push(emp);
  }
  return departments;
}

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
      {href && <ExternalLink className="w-3.5 h-3.5 text-gray-400" />}
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
  return <motion.div style={{ position: "absolute", left, top: Math.min(from, to), width: 2, height: Math.abs(to - from), background: "#94a3b8", zIndex: 0, transform: "translateX(-1px)" }} variants={lineAnim} />;
}

function HLine({ from, to, top }) {
  return <motion.div style={{ position: "absolute", top, left: Math.min(from, to), height: 2, width: Math.abs(to - from), background: "#94a3b8", zIndex: 0, transform: "translateY(-1px)" }} variants={lineAnim} />;
}

function OrgBox({ children, style = {}, className = "", highlight = "", isMobile = false, ...props }) {
  const borderClasses = {
    org: "border-teal-500",
    ceo: "border-blue-400",
    dept: "border-rose-400",
    employee: "border-slate-300",
  };
  const border = borderClasses[highlight] || "border-slate-300";
  const mobileStyles = isMobile ? { width: '100%', height: 'auto', minHeight: BOX_HEIGHT } : { width: BOX_WIDTH, height: BOX_HEIGHT };
  return (
    <div className={`relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 hover:z-20 border-2 ${border} ${className}`} style={{ ...mobileStyles, ...style }} {...props}>
      {children}
    </div>
  );
}

function OrganizationInfoBox({ organization, isMobile, collapsed, onCollapseChange }) {
  return (
    <OrgBox highlight="org" isMobile={isMobile} className="org-root-box">
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
          <HoverLink href={`/demo/organization/${organization.id}`} className="font-bold text-gray-800 hover:text-teal-600">
            {organization.name}
          </HoverLink>
          <div className="text-xs text-teal-600 font-semibold">Organization</div>
          <div className="text-xs text-gray-500 truncate">{organization.industry}</div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-auto pt-2">
        <Button size="sm" variant="outline" onClick={onCollapseChange} className="flex items-center text-xs px-2 py-1 border-teal-200 text-teal-700 hover:bg-teal-50" type="button">
          <ChevronIcon up={!collapsed} />{collapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
    </OrgBox>
  );
}

export default function OrgChartDemoStyledLikeOrgChart() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orgCollapsed, setOrgCollapsed] = useState(false);
  const [ceoCollapsed, setCeoCollapsed] = useState(false);
  const [deptCollapsed, setDeptCollapsed] = useState({});
  const [scrollToNodeId, setScrollToNodeId] = useState(null);
  const windowSize = useWindowSize();
  const chartContainerRef = useRef(null);
  const companyInfo = orgData[0];

  const handleExpandAll = () => {
    setOrgCollapsed(false);
    setCeoCollapsed(false);
    const allDeptIds = Object.keys(groupByDepartment(allemployees));
    const newDeptState = {};
    allDeptIds.forEach(id => { newDeptState[id] = false; });
    setDeptCollapsed(newDeptState);
    setScrollToNodeId('organization_root');
  };

  const handleCollapseAll = () => {
    setOrgCollapsed(true);
    setCeoCollapsed(true);
    const allDeptIds = Object.keys(groupByDepartment(allemployees));
    const newDeptState = {};
    allDeptIds.forEach(id => { newDeptState[id] = true; });
    setDeptCollapsed(newDeptState);
    setScrollToNodeId('organization_root');
  };

  const buildChartTree = () => {
    if (!companyInfo) return null;
    const employeesForDepts = allemployees.filter(emp => emp.name !== companyInfo.ceoName);
    const departments = groupByDepartment(employeesForDepts);

    const orgRootNode = {
      id: "organization_root",
      type: "org",
      box: (isMobile) => (
        <OrganizationInfoBox
          organization={companyInfo}
          isMobile={isMobile}
          collapsed={orgCollapsed}
          onCollapseChange={() => {
            setOrgCollapsed(c => !c);
            setScrollToNodeId('organization_root');
          }}
        />
      ),
      children: [],
      expanded: !orgCollapsed,
    };

    const ceoNode = {
      id: "ceo",
      type: "ceo",
      name: companyInfo.ceoName,
      position: "Chief Executive Officer",
      box: (isMobile) => (
        <OrgBox className="ceo-box" highlight="ceo" isMobile={isMobile}>
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 mr-3">
              {companyInfo.ceoPic ? (
                <img src={companyInfo.ceoPic} alt={companyInfo.ceoName} className="w-11 h-11 rounded-full object-cover border-2 border-blue-200"/>
              ) : (
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                  {companyInfo.ceoName.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <HoverLink href={`/demo/employee/ceo`} className="font-bold text-gray-800 hover:text-blue-600">{companyInfo.ceoName}</HoverLink>
              <div className="text-xs text-blue-600 font-semibold">CEO</div>
              <div className="text-xs text-gray-500 truncate">{companyInfo.name}</div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-auto pt-2">
            <Button size="sm" variant="outline" onClick={() => { setCeoCollapsed(c => !c); setScrollToNodeId('ceo'); }} className="flex items-center text-xs px-2 py-1 border-blue-200 text-blue-600 hover:bg-blue-50" type="button">
              <ChevronIcon up={!ceoCollapsed} />{ceoCollapsed ? "Expand" : "Collapse"}
            </Button>
          </div>
        </OrgBox>
      ),
      children: [],
      expanded: !ceoCollapsed,
    };

    if (!orgCollapsed) {
      orgRootNode.children = [ceoNode];
    }

    if (!ceoCollapsed) {
      ceoNode.children = Object.entries(departments).map(([deptId, { deptObj, emps }]) => {
        const departmentName = deptObj ? deptObj.name : deptId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const deptNode = {
          id: `dept-${deptId}`,
          type: 'dept',
          name: departmentName,
          box: (isMobile) => (
            <OrgBox highlight="dept" isMobile={isMobile}>
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100"><Building2 className="h-6 w-6 text-rose-600" /></div></div>
                <div className="flex-1 min-w-0">
                  <HoverLink href={`/demo/department/${deptId}`} className="font-bold text-gray-800 hover:text-rose-600">{departmentName}</HoverLink>
                  <div className="text-xs text-rose-600 font-semibold">Department</div>
                  <div className="text-xs text-gray-500 truncate">{companyInfo.name}</div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-auto pt-2">
                <Button size="sm" variant="outline" onClick={() => { setDeptCollapsed(prev => ({ ...prev, [deptId]: !prev[deptId] })); setScrollToNodeId(`dept-${deptId}`); }} className="flex items-center text-xs px-2 py-1 border-rose-200 text-rose-700 hover:bg-rose-50" type="button">
                  <ChevronIcon up={!deptCollapsed[deptId]} />{deptCollapsed[deptId] ? "Expand" : "Collapse"}
                </Button>
              </div>
            </OrgBox>
          ),
          children: [],
          expanded: !deptCollapsed[deptId],
        };

        deptNode.children = emps.map(emp => ({
          id: emp.id,
          type: 'employee',
          name: emp.name,
          position: emp.position,
          box: (isMobile) => (
            <OrgBox highlight="employee" isMobile={isMobile}>
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3"><div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">{emp.name.split(' ').map(n => n[0]).join('')}</div></div>
                <div className="flex-1 min-w-0">
                  <HoverLink href={`/demo/employee/${emp.id}`} className="font-bold text-gray-800 hover:text-slate-600">{emp.name}</HoverLink>
                  <div className="text-xs text-slate-600 font-semibold">{emp.position}</div>
                </div>
              </div>
            </OrgBox>
          ),
          children: [],
          expanded: true,
        }));
        return deptNode;
      });
    }
    return orgRootNode;
  };

  useEffect(() => {
    const initialDeptState = {};
    Object.keys(groupByDepartment(allemployees)).forEach(deptId => { initialDeptState[deptId] = true; });
    setDeptCollapsed(initialDeptState);
    setLoading(false);
    setScrollToNodeId('organization_root');
  }, []);

  const tree = !loading ? buildChartTree() : null;
  const isMobile = windowSize.width < MOBILE_BREAKPOINT;

  let layout, chartWidth = "100%", chartHeight = "100%", chartNodes = [], chartLines = [];
  if (tree && !isMobile) {
    const computeLayout = (node, depth = 0, xOffset = 0) => {
      const childrenToLayout = (node.expanded && node.children) ? node.children : [];
      if (childrenToLayout.length === 0) {
        return { ...node, x: xOffset, y: depth * (BOX_HEIGHT + V_GAP), width: BOX_WIDTH, children: childrenToLayout };
      }
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
    }
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
    }
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
        nodes.push(
          <motion.div layout key={n.id} variants={nodeAnim} initial="initial" animate="animate" exit="exit" style={{ position: 'absolute', left: n.x, top: n.y, zIndex: 1 }} data-node-id={n.id}>
            {n.box(false)}
          </motion.div>
        );
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
            n.children.forEach(c => {
              lines.push(<VLine key={`v-link-${n.id}-${c.id}`} from={parentBottomY + V_GAP / 2} to={c.y} left={c.x + BOX_WIDTH / 2} />);
            });
          }
          n.children.forEach(walk);
        }
      }
      walk(layout);
      return { nodes, lines };
    }
    const rendered = renderHorizontalTree(centeredLayout);
    chartNodes = rendered.nodes;
    chartLines = rendered.lines;
  }

  useEffect(() => {
    if (!scrollToNodeId || !chartContainerRef.current || isMobile) return;
    const chartContainer = chartContainerRef.current;
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
  }

  const navbarFont = "font-semibold tracking-tight";
  const isFullyExpanded = !orgCollapsed && !ceoCollapsed && Object.values(deptCollapsed).every(isCollapsed => !isCollapsed);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-200">
      <div className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-full flex-row items-center justify-between gap-4 px-2 py-4 sm:px-6">
          <div className="flex flex-1 items-center">
            <span className="block truncate text-lg font-bold text-gray-800 sm:hidden">DemoChart</span>
            <h1 className="hidden text-2xl font-bold text-gray-800 sm:block">Demo Organizational Chart</h1>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-3">
            <Button variant="outline" size="sm" className={`flex cursor-pointer items-center px-2 text-black shadow-sm ${navbarFont}`} onClick={isFullyExpanded ? handleCollapseAll : handleExpandAll} type="button">
              {isFullyExpanded ? <FoldVertical className="h-5 w-5 text-black" /> : <UnfoldVertical className="h-5 w-5 text-black" />}
              <span className="hidden sm:inline text-base ml-2">{isFullyExpanded ? "Collapse All" : "Expand All"}</span>
            </Button>
            <Button variant="outline" size="sm" className={`flex cursor-pointer items-center px-2 text-black shadow-sm ${navbarFont}`} type="button" onClick={() => router.push("/signup")}>
              <Network className="h-6 w-6 text-black" />
              <span className="sm:inline text-base ml-2">Create Org Chart</span>
            </Button>
          </div>
        </div>
      </div>
      <div style={{ height: 80 }} />
      <div ref={chartContainerRef} className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-8" style={{ minWidth: "100%" }}>
        {isMobile ? (
          tree && (<div className="w-full max-w-2xl mx-auto"><AnimatePresence>{renderVerticalTree(tree)}</AnimatePresence></div>)
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: chartHeight, minWidth: "100%", width: "100%" }}>
            <div style={{ position: "relative", width: chartWidth, minHeight: chartHeight, background: "transparent" }}>
              <AnimatePresence>{chartLines}</AnimatePresence>
              <AnimatePresence>{chartNodes}</AnimatePresence>
            </div>
          </div>
        )}
      </div>
      <ChatbotBubble />
    </div>
  );
}
