"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getOrganization } from "@/redux/action/org";
import { getDepartments } from "@/redux/action/departments";
import { getTeammembers } from "@/redux/action/teammembers";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Users, MapPin, Calendar, Building,
  Briefcase, Laptop, Scaling, Workflow, Loader2, XCircle,
  CheckCircle2, User,
} from "lucide-react";

const Alert = ({ type, message }) => {
  const isError = type === "error";
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
      {isError ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
      <p>{message}</p>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4 transition-all hover:border-indigo-200 hover:bg-white">
    <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const DepartmentCard = ({ dept, employeeCount, subFunctionCount }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1">
    <h3 className="truncate font-bold text-gray-800">{dept.departmentName}</h3>
    <div className="mt-3 space-y-2 text-sm text-gray-600">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />Employees</span>
        <strong className="font-semibold text-gray-900">{employeeCount}</strong>
      </div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2"><Workflow className="w-4 h-4 text-gray-400" />Sub-Functions</span>
        <strong className="font-semibold text-gray-900">{subFunctionCount}</strong>
      </div>
    </div>
  </div>
);

export default function OrganizationPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { organization, loading: orgLoading, error: orgError } = useSelector((state) => state.organization);
  const { departments, loading: deptLoading, error: deptError } = useSelector((state) => state.departments);
  const { teammembers, loading: teamLoading, error: teamError } = useSelector((state) => state.teammembers);

  const [metrics, setMetrics] = useState({ totalDepartments: 0, totalEmployees: 0, totalSubFunctions: 0 });
  const [showFallback, setShowFallback] = useState(false);

  const loading = orgLoading || deptLoading || teamLoading;
  const error = orgError || deptError || teamError;

  useEffect(() => {
    dispatch(getOrganization());
  }, [dispatch]);

  useEffect(() => {
    if (organization?._id) {
      dispatch(getDepartments({ organizationId: organization._id }));
      dispatch(getTeammembers({ organizationId: organization._id }));
    }
  }, [dispatch, organization]);

  useEffect(() => {
    if (organization && departments && teammembers) {
      const invitedTeammembers = teammembers.filter((tm) => tm.invited);
      const totalEmployees = 1 + (departments?.length || 0) + (invitedTeammembers?.length || 0);
      const totalSubFunctions = departments.reduce((acc, dept) => acc + (dept.subfunctions?.length || 0), 0);
      setMetrics({
        totalDepartments: departments?.length || 0,
        totalEmployees: totalEmployees,
        totalSubFunctions: totalSubFunctions,
      });
    }
  }, [organization, departments, teammembers]);

  useEffect(() => {
    if (!organization?.logoUrl) {
      setShowFallback(true);
    } else {
      setShowFallback(false);
    }
  }, [organization]);

  const employeeCountForDept = (departmentId) => {
    const invitedTeammembersInDept = teammembers.filter((tm) => tm.invited && tm.department === departmentId);
    return 1 + invitedTeammembersInDept.length;
  };

  const subFunctionCountForDept = (dept) => dept.subfunctions?.length || 0;

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="h-12 w-12 animate-spin text-indigo-600" /></div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-slate-50"><Alert type="error" message={error} /></div>;
  if (!organization) return <div className="flex h-screen items-center justify-center bg-slate-50 text-gray-700">No organization found.</div>;

  const organizationInfoDetails = [
    { label: "CEO", value: organization.ceoName, icon: <User className="h-6 w-6" /> },
    { label: "Company Size", value: organization.companySize, icon: <Users className="h-6 w-6" /> },
    { label: "Location", value: `${organization.city}, ${organization.country}`, icon: <MapPin className="h-6 w-6" /> },
    { label: "Year Founded", value: organization.yearFounded, icon: <Calendar className="h-6 w-6" /> },
    { label: "Type", value: organization.organizationType, icon: <Building2 className="h-6 w-6" /> },
    { label: "Number of Offices", value: organization.numberOfOffices, icon: <Building className="h-6 w-6" /> },
  ];

  const operationsDetails = [
    { label: "Total Employees", value: metrics.totalEmployees, icon: <Users className="h-6 w-6" /> },
    { label: "Total Departments", value: metrics.totalDepartments, icon: <Building2 className="h-6 w-6" /> },
    { label: "Total Sub-Functions", value: metrics.totalSubFunctions, icon: <Workflow className="h-6 w-6" /> },
    { label: "Work Model", value: organization.workModel, icon: <Laptop className="h-6 w-6" /> },
    { label: "Hiring Level", value: organization.hiringLevel, icon: <Scaling className="h-6 w-6" /> },
    { label: "HR Tools Used", value: organization.hrToolsUsed, icon: <Briefcase className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <button onClick={() => router.back()} className="group inline-flex items-center text-gray-500 transition-colors hover:text-indigo-600 font-medium">
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Chart
          </button>
        </div>

        <motion.div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
              {!showFallback && (
                <img
                  src={organization.logoUrl}
                  alt={`${organization.name} logo`}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                  onError={() => setShowFallback(true)}
                />
              )}
              {showFallback && (
                <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                  {organization.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{organization.name}</h1>
              <p className="text-lg font-medium text-indigo-600 sm:text-xl">{organization.industry}</p>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}>
          <div className="space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Organization Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {organizationInfoDetails.map((item, index) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
                    <StatCard icon={item.icon} label={item.label} value={item.value} />
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Operations & Metrics</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {operationsDetails.map((item, index) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}>
                    <StatCard icon={item.icon} label={item.label} value={item.value} />
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">Departments Overview</h2>
              {/* --- 🔧 MODIFIED SECTION START --- */}
              {departments && departments.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {departments.map((dept) => (
                      <DepartmentCard key={dept._id} dept={dept} employeeCount={employeeCountForDept(dept._id)} subFunctionCount={subFunctionCountForDept(dept)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">No Departments Found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You can create a new department to get departments overview.
                  </p>
                </div>
              )}
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}