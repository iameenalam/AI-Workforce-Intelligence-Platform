"use client";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { addDepartment } from "@/redux/action/departments";

const createNewDepartment = () => ({
  id: Date.now() + Math.random(),
  departmentName: "",
  hodName: "",
  hodEmail: "",
  role: "",
  departmentDetails: "",
  subfunctions: [{ name: "", details: "" }],
  hodPic: null,
  hodPicPreview: null,
});

export default function DeptForm({ onClose }) {
  const { isAuth } = useSelector((state) => state.user);
  const { btnLoading, message } = useSelector((state) => state.departments);
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRefs = useRef({});

  const [departments, setDepartments] = useState([createNewDepartment()]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuth) router.push("/login");
  }, [isAuth, router]);

  useEffect(() => {
    if (message && !btnLoading) {
      onClose?.();
    }
  }, [message, btnLoading, onClose]);

  const handleDepartmentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDepartments = [...departments];
    updatedDepartments[index] = { ...updatedDepartments[index], [name]: value };
    setDepartments(updatedDepartments);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const updatedDepartments = [...departments];
    const department = updatedDepartments[index];

    department.hodPic = file;
    if (department.hodPicPreview) {
      URL.revokeObjectURL(department.hodPicPreview);
    }
    department.hodPicPreview = file ? URL.createObjectURL(file) : null;

    setDepartments(updatedDepartments);
  };

  const handleSubfunctionChange = (deptIndex, subfIndex, field, value) => {
    const updatedDepartments = [...departments];
    updatedDepartments[deptIndex].subfunctions[subfIndex][field] = value;
    setDepartments(updatedDepartments);
  };

  const addSubfunction = (deptIndex) => {
    const updatedDepartments = [...departments];
    updatedDepartments[deptIndex].subfunctions.push({ name: "", details: "" });
    setDepartments(updatedDepartments);
  };

  const removeSubfunction = (deptIndex, subfIndex) => {
    const updatedDepartments = [...departments];
    updatedDepartments[deptIndex].subfunctions = updatedDepartments[
      deptIndex
    ].subfunctions.filter((_, i) => i !== subfIndex);
    setDepartments(updatedDepartments);
  };

  const addDepartmentForm = () => {
    setDepartments([...departments, createNewDepartment()]);
  };

  const removeDepartmentForm = (index) => {
    const deptToRemove = departments[index];
    if (deptToRemove.hodPicPreview) {
        URL.revokeObjectURL(deptToRemove.hodPicPreview);
    }
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      for (const [index, dept] of departments.entries()) {
        if (!dept.departmentName || !dept.hodName || !dept.hodEmail || !dept.role) {
          setError(`Please fill all required fields for Department #${index + 1}.`);
          return;
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(dept.hodEmail)) {
          setError(`Please enter a valid HOD email for Department #${index + 1}.`);
          return;
        }
        const subfunctionNames = dept.subfunctions.map((sf) => sf.name.trim());
        if (subfunctionNames.some((n) => n === "")) {
          setError(`All subfunctions must have a name in Department #${index + 1}.`);
          return;
        }
        if (new Set(subfunctionNames).size !== subfunctionNames.length) {
          setError(`Subfunction names must be unique within Department #${index + 1}.`);
          return;
        }
      }

      departments.forEach((dept) => {
        const formData = new FormData();
        formData.append("departmentName", dept.departmentName);
        formData.append("hodName", dept.hodName);
        formData.append("hodEmail", dept.hodEmail);
        formData.append("role", dept.role);
        formData.append("departmentDetails", dept.departmentDetails);
        if (dept.hodPic) {
          formData.append("hodPic", dept.hodPic);
        }
        formData.append("subfunctions", JSON.stringify(dept.subfunctions));

        dispatch(addDepartment(formData));
      });
    },
    [departments, dispatch]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="relative w-full max-w-3xl h-full flex flex-col">
        <div className="relative flex-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-3xl font-bold rounded-full bg-gray-100 hover:bg-red-100 w-10 h-10 flex items-center justify-center z-10 shadow"
              style={{ lineHeight: "1" }}
            >
              &times;
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 text-center">
              Add Departments
            </h1>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Fill out the details for one or more departments below.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 font-medium text-center rounded-lg">
                {error}
              </div>
            )}
            <form
              id="department-form"
              className="space-y-6 text-gray-900"
              onSubmit={submitHandler}
              autoComplete="off"
            >
              {departments.map((dept, index) => (
                <div key={dept.id} className="border border-gray-200 bg-gray-50 p-4 rounded-xl relative space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Department #{index + 1}</h2>
                    {departments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDepartmentForm(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors font-bold text-2xl rounded-full bg-gray-200 hover:bg-red-100 w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
                        aria-label="Remove Department"
                        style={{ lineHeight: "1" }}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Department Name *</label>
                      <input name="departmentName" type="text" value={dept.departmentName} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">HOD Name *</label>
                      <input name="hodName" type="text" value={dept.hodName} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-gray-700 mb-1">HOD Email *</label>
                      <input name="hodEmail" type="email" value={dept.hodEmail} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Role *</label>
                      <input name="role" type="text" value={dept.role} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>
                    <div className="flex flex-col">
                      <label className="block font-medium text-gray-700 mb-1">HOD Picture</label>
                      <div className="flex items-center gap-3 flex-1">
                        <button type="button" className="flex-1 w-full text-center justify-center relative flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm cursor-pointer hover:bg-gray-100 transition" onClick={() => fileInputRefs.current[dept.id]?.click()}>
                          <span className="mr-2">
                            <svg width="18" height="18" fill="none" className="inline-block"><path d="M5 12l2-2 3 3 4-4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="3" width="12" height="12" rx="3" stroke="#374151" strokeWidth="2" /></svg>
                          </span>
                          {dept.hodPic ? "Change" : "Choose File"}
                        </button>
                        <input ref={(el) => (fileInputRefs.current[dept.id] = el)} type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} className="hidden" />
                        {dept.hodPicPreview && <img src={dept.hodPicPreview} alt="HOD Preview" className="rounded shadow h-10 w-10 object-cover border border-gray-200" />}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-gray-700 mb-1">Department Details</label>
                      <textarea name="departmentDetails" value={dept.departmentDetails} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" rows={3} />
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Subfunctions</label>
                    {dept.subfunctions.map((sf, subfIndex) => (
                      <div key={subfIndex} className="mb-3 border border-gray-200 bg-white p-3 rounded-xl relative">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-600">Subfunction #{subfIndex + 1}</h3>
                          {dept.subfunctions.length > 1 && (
                            <button type="button" onClick={() => removeSubfunction(index, subfIndex)} className="text-gray-400 hover:text-red-500 transition-colors font-bold text-xl rounded-full bg-gray-100 hover:bg-red-100 w-8 h-8 flex items-center justify-center cursor-pointer shadow" aria-label="Remove subfunction" style={{ lineHeight: "1" }}>
                              &times;
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input type="text" placeholder="Subfunction Name *" value={sf.name} onChange={(e) => handleSubfunctionChange(index, subfIndex, "name", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mb-1 sm:mb-0 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                          <textarea placeholder="Subfunction Details" value={sf.details} onChange={(e) => handleSubfunctionChange(index, subfIndex, "details", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" rows={1} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addSubfunction(index)} className="w-full sm:w-auto mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-sm shadow-sm cursor-pointer transition border border-gray-300">
                      + Add Another Subfunction
                    </button>
                  </div>
                </div>
              ))}
            </form>
          </div>
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button type="button" onClick={addDepartmentForm} className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-base shadow-sm cursor-pointer transition border border-gray-300">
                + Add Another Department
              </button>
              <Button form="department-form" type="submit" className="w-full sm:w-auto font-bold bg-gray-900 hover:bg-black text-white" disabled={btnLoading}>
                {btnLoading ? "Creating..." : "Create Department(s)"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #d1d5db white; }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar { width: 8px; }
      `}</style>
    </div>
  );
}
