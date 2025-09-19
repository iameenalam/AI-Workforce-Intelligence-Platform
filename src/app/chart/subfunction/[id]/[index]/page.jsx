"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, UserCircle, Users, Lightbulb, Target, ServerCrash, Workflow } from "lucide-react";

import { getOrganization } from "@/redux/action/org";
import { getDepartments } from "@/redux/action/departments";
import { getEmployees } from "@/redux/action/employees";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "skills", label: "Top Skills" },
  { value: "goals", label: "Goals" },
];

const EmptyState = ({ icon, text, subtext }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
    {icon}
    <p className="mt-4 font-medium text-gray-600">{text}</p>
    <p className="mt-1 text-sm text-gray-500">{subtext}</p>
  </div>
);

export default function SubfunctionPage() {
  const { id, index } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [generatedContent, setGeneratedContent] = useState({ skills: [], goals: [] });
  const [genLoading, setGenLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { organization } = useSelector((state) => state.organization);
  const { departments, loading: deptsLoading } = useSelector((state) => state.departments);
  const { employees, loading: employeesLoading } = useSelector((state) => state.employees);

  // Only fetch org if not present
  useEffect(() => {
    if (!organization) {
      dispatch(getOrganization());
    }
  }, [dispatch, organization]);

  // Only fetch depts/employees if org is present
  useEffect(() => {
    if (organization?._id) {
      if (!departments || departments.length === 0) {
        dispatch(getDepartments({ organizationId: organization._id }));
      }
      if (!employees || employees.length === 0) {
        dispatch(getEmployees());
      }
    }
  }, [dispatch, organization?._id, departments, employees]);

  const department = departments?.find(d => d._id === id);
  const subfunction = department?.subfunctions?.[parseInt(index)];
  const relevantEmployees = employees?.filter(emp =>
    emp.department &&
    (emp.department._id === id || emp.department === id) &&
    emp.subfunctionIndex === parseInt(index)
  ) || [];

  useEffect(() => {
    if (!subfunction) return;
    const generateDetails = async () => {
      try {
        setGenLoading(true);
        const res = await fetch('/api/generate-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: subfunction.name, details: subfunction.details }),
        });
        const data = await res.json();
        setGeneratedContent({ skills: data.topSkills || [], goals: data.goals || [] });
      } catch (err) {
        console.error("Failed to generate AI content");
      } finally {
        setGenLoading(false);
      }
    };
    generateDetails();
  }, [subfunction]);

  // Unified loading: only render when all data is ready and subfunction exists
  const loading = !organization || deptsLoading || employeesLoading || !departments || !employees || !department || !subfunction;

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  }
  
  if (!subfunction) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center px-4">
        <ServerCrash className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sub-function Not Found</h1>
        <p className="text-gray-600 mb-6">The sub-function data could not be found. Try returning to the main chart.</p>
        <button onClick={() => router.push('/chart')} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Chart
        </button>
      </div>
    );
  }

  const { name, details } = subfunction;

  const teamLeads = relevantEmployees.filter(emp => emp.role === "Team Lead");
  const allMembers = relevantEmployees.filter(emp => emp.role !== "HOD");

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <button onClick={() => router.back()} className="inline-flex items-center text-gray-500 hover:text-indigo-600 font-medium group transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Chart
          </button>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-violet-500 text-white rounded-full flex items-center justify-center ring-4 ring-white shadow-md">
                <Workflow className="w-12 h-12" />
              </div>
            </div>
            <div className="flex-grow text-center sm:text-left">
              <p className="text-lg font-medium text-violet-600">Sub-function</p>
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              <p className="mt-2 text-gray-600">{details}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-4" aria-label="Tabs">
              {TABS.map((tab) => (
                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                  className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex items-center gap-4">
                                <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3"><UserCircle className="w-7 h-7" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Team Lead{teamLeads.length > 1 ? 's' : ''}</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {teamLeads.length > 0 ? teamLeads.map(lead => lead.name).join(', ') : 'Not Assigned'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex items-center gap-4">
                                <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3"><Users className="w-7 h-7" /></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Team Members</p>
                                    <p className="text-lg font-semibold text-gray-800">{allMembers.length} Members</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Roster</h3>
                            {allMembers.length > 0 ? (
                                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                                    <ul className="space-y-2">
                                        {allMembers.map((member) => (
                                            <li key={`${member._id}-${member.type || 'employee'}`} className="flex items-center gap-3">
                                                <UserCircle className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-700">{member.name} - <span className="text-gray-500 text-sm">{member.role}</span></span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <EmptyState icon={<Users className="h-10 w-10 text-gray-400" />} text="No Members Assigned" subtext="This sub-function does not have any team members yet."/>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === "skills" && (
                   genLoading ? <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div> :
                   generatedContent.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {generatedContent.skills.map((skill, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full">{skill}</span>
                        ))}
                      </div>
                    ) : <EmptyState text="No Top Skills Listed" icon={<Lightbulb className="h-10 w-10 text-gray-400" />} subtext="Could not generate skills for this sub-function." />
                )}

                {activeTab === "goals" && (
                   genLoading ? <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div> :
                   generatedContent.goals.length > 0 ? (
                      <ul className="list-disc space-y-3 pl-5 text-gray-700">
                        {generatedContent.goals.map((goal, idx) => <li key={idx}>{goal}</li>)}
                      </ul>
                    ) : <EmptyState text="No Goals Defined" icon={<Target className="h-10 w-10 text-gray-400" />} subtext="Could not generate goals for this sub-function." />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
