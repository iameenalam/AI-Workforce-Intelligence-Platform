"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  Workflow,
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Building,
  Laptop,
  Scaling,
  User,
} from "lucide-react";

import {
  allemployees,
  departmentsDemoData,
  orgData,
} from "../../../../../data/data";

const StatCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex items-center gap-4 transition-all hover:border-indigo-200 hover:bg-white">
    <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full p-3">
      {icon}
    </div>

    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>

      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const DepartmentCard = ({ dept, employeeCount, subFunctionCount }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1">
    <h3 className="truncate font-bold text-gray-800">{dept.name}</h3>

    <div className="mt-3 space-y-2 text-sm text-gray-600">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          Employees
        </span>

        <strong className="font-semibold text-gray-900">{employeeCount}</strong>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-gray-400" />
          Sub-Functions
        </span>

        <strong className="font-semibold text-gray-900">
          {subFunctionCount}
        </strong>
      </div>
    </div>
  </div>
);

export default function OrganizationPage() {
  const router = useRouter();
  const organization = orgData[0];
  const departments = departmentsDemoData.filter((d) => d.name);
  const filteredEmployees = allemployees.filter((e) => e.department);
  const totalEmployees = filteredEmployees.length;
  const totalDepartments = departments.length;
  const totalSubFunctions = new Set(filteredEmployees.map((e) => e.position))
    .size;

  const employeeCountForDept = (deptName) =>
    filteredEmployees.filter(
      (e) =>
        (e.department || "").toLowerCase() === (deptName || "").toLowerCase()
    ).length;

  const subFunctionCountForDept = (dept) =>
    new Set(
      filteredEmployees
        .filter(
          (e) =>
            (e.department || "").toLowerCase() ===
            (dept.name || "").toLowerCase()
        )
        .map((e) => e.position)
    ).size;

  const organizationInfoDetails = [
    {
      label: "CEO",
      value: organization.ceoName,
      icon: <User className="h-6 w-6" />,
    },

    {
      label: "Organization Size",
      value: organization.companySize,
      icon: <Users className="h-6 w-6" />,
    },

    {
      label: "Location",
      value: `${organization.city}, ${organization.country}`,
      icon: <MapPin className="h-6 w-6" />,
    },

    {
      label: "Year Founded",
      value: organization.yearFounded,
      icon: <Calendar className="h-6 w-6" />,
    },

    {
      label: "Type",
      value: organization.organizationType,
      icon: <Building2 className="h-6 w-6" />,
    },

    {
      label: "Number of Offices",
      value: organization.numberOfOffices,
      icon: <Building className="h-6 w-6" />,
    },
  ];

  const operationsDetails = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: <Users className="h-6 w-6" />,
    },

    {
      label: "Total Departments",
      value: totalDepartments,
      icon: <Building2 className="h-6 w-6" />,
    },

    {
      label: "Total Sub-Functions",
      value: totalSubFunctions,
      icon: <Workflow className="h-6 w-6" />,
    },

    {
      label: "Work Model",
      value: organization.workModel,
      icon: <Laptop className="h-6 w-6" />,
    },

    {
      label: "Hiring Level",
      value: organization.hiringLevel,
      icon: <Scaling className="h-6 w-6" />,
    },

    {
      label: "HR Tools Used",
      value: organization.hrToolsUsed,
      icon: <Briefcase className="h-6 w-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center text-gray-500 transition-colors hover:text-indigo-600 font-medium"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Demo Chart
          </button>
        </div>

        <motion.div
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-indigo-500 text-white rounded-full flex items-center justify-center text-4xl font-bold ring-4 ring-white shadow-md">
                {organization.name.charAt(0)}
              </div>
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {organization.name}
              </h1>

              <p className="text-lg font-medium text-indigo-600 sm:text-xl">
                {organization.industry}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Organization Information
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {organizationInfoDetails.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  >
                    <StatCard
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Operations & Metrics
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {operationsDetails.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  >
                    <StatCard
                      icon={item.icon}
                      label={item.label}
                      value={item.value}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Departments Overview
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {departments.map((dept) => (
                  <DepartmentCard
                    key={dept.id || dept.name}
                    dept={dept}
                    employeeCount={employeeCountForDept(dept.name)}
                    subFunctionCount={subFunctionCountForDept(dept)}
                  />
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
