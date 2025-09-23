"use client";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { addDepartment } from "@/redux/action/departments";

const createNewDepartment = () => ({
  id: Date.now() + Math.random(),
  departmentName: "",
  departmentDetails: "",
  subfunctions: [{ name: "", details: "" }],
});

export default function DeptForm({ onClose }) {
  const { isAuth } = useSelector((state) => state.user);
  const { btnLoading, message } = useSelector((state) => state.departments);
  const dispatch = useDispatch();
  const router = useRouter();

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
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      for (const [index, dept] of departments.entries()) {
        if (!dept.departmentName) {
          setError(`Please fill the department name for Department #${index + 1}.`);
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
        formData.append("departmentDetails", dept.departmentDetails);
        formData.append("subfunctions", JSON.stringify(dept.subfunctions));

        dispatch(addDepartment(formData));
      });
    },
    [departments, dispatch]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col">
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
              Add Department(s)
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
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Department Name *</label>
                      <input name="departmentName" type="text" value={dept.departmentName} onChange={(e) => handleDepartmentChange(index, e)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>
                    <div>
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
