"use client";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CloudUpload, X, UserPlus } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../../../../lib/toastUtils";

export default function InvForm({ onClose }) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [employees, setEmployees] = useState([{ id: Date.now(), name: "", email: "", pic: null, picPreview: null, cv: null }]);
  const fileInputRefs = useRef([]);
  const cvInputRefs = useRef([]);

  const addEmployeeForm = () => {
    const newEmployee = { id: Date.now(), name: "", email: "", pic: null, picPreview: null, cv: null };
    setEmployees([...employees, newEmployee]);
  };

  const removeEmployeeForm = (index) => {
    if (employees.length > 1) {
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
      fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
      cvInputRefs.current = cvInputRefs.current.filter((_, i) => i !== index);
    }
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const handlePicChange = (index, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      const updatedEmployees = [...employees];
      updatedEmployees[index].pic = file;
      updatedEmployees[index].picPreview = URL.createObjectURL(file);
      setEmployees(updatedEmployees);
      setError("");
    }
  };

  const handleCvChange = (index, file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("CV size must be less than 5MB");
        return;
      }
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file for CV");
        return;
      }

      const updatedEmployees = [...employees];
      updatedEmployees[index].cv = file;
      setEmployees(updatedEmployees);
      setError("");
    }
  };

  const handleInvite = async () => {
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      if (!emp.name.trim() || !emp.email.trim()) {
        setError(`Please fill in all required fields for employee ${i + 1}`);
        return;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(emp.email)) {
        setError(`Please enter a valid email address for employee ${i + 1}`);
        return;
      }
    }

    setBtnLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = Cookies.get("token");

      // Prepare form data for invitation API
      const formData = new FormData();
      formData.append("employees", JSON.stringify(employees.map(emp => ({
        name: emp.name,
        email: emp.email
      }))));

      // Add files with indexed names for proper handling in the API
      employees.forEach((emp, index) => {
        if (emp.pic) {
          formData.append(`pic_${index}`, emp.pic);
        }
        if (emp.cv) {
          formData.append(`cv_${index}`, emp.cv);
        }
      });

      const { data } = await axios.post("/api/invitations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(data.message);
      showSuccessToast(data.message);

      // Log invitation details for debugging (including manual links)
      if (data.errors && data.errors.length > 0) {
        console.log("Invitation details:", data.errors);

        // Show manual invitation links in console for easy access
        const manualLinks = data.errors.filter(error => error.includes("Share this link"));
        if (manualLinks.length > 0) {
          console.log("📧 Manual invitation links (email not configured):");
          manualLinks.forEach(link => console.log(link));
        }

        // Only show actual errors as toast notifications
        const actualErrors = data.errors.filter(error =>
          !error.includes("Manual invitation link") &&
          !error.includes("Share this link") &&
          !error.includes("✅ Invitation created")
        );

        actualErrors.forEach(error => {
          showErrorToast(error);
        });
      }

      setTimeout(() => {
        onClose?.();
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to invite employees";
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setBtnLoading(false);
    }
  };

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
              Invite Employees
            </h1>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Add employees to your organization. They will be added to the unassigned pool.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 sm:p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 font-medium text-center rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 font-medium text-center rounded-lg">
                {success}
              </div>
            )}
            <div className="space-y-4">
              {employees.map((employee, index) => (
                <div key={employee.id} className="border border-gray-200 bg-gray-50 p-4 rounded-xl relative">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Employee #{index + 1}</h2>
                    {employees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmployeeForm(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors font-bold text-2xl rounded-full bg-gray-200 hover:bg-red-100 w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
                        aria-label="Remove Employee"
                        style={{ lineHeight: "1" }}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Name *</label>
                      <input type="text" value={employee.name} onChange={(e) => handleEmployeeChange(index, "name", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" placeholder="Enter employee name" required />
                    </div>
                    <div>
                      <label className="block font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={employee.email} onChange={(e) => handleEmployeeChange(index, "email", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" placeholder="Enter employee email" required />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[index] = el)}
                          onChange={(e) => handlePicChange(index, e.target.files[0])}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300"
                        >
                          <CloudUpload className="w-4 h-4" />
                          Choose Image
                        </button>
                      </div>
                      <div>
                        <label className="block font-medium text-gray-700 mb-1">CV (Optional)</label>
                        <input
                          type="file"
                          ref={(el) => (cvInputRefs.current[index] = el)}
                          onChange={(e) => handleCvChange(index, e.target.files[0])}
                          accept=".pdf"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => cvInputRefs.current[index]?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300"
                        >
                          <CloudUpload className="w-4 h-4" />
                          Choose PDF
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-start justify-between min-h-[44px]">
                      <div className="flex-1">
                        {employee.picPreview && (
                          <div className="flex items-center gap-2">
                            <img
                              src={employee.picPreview}
                              alt="Preview"
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedEmployees = [...employees];
                                updatedEmployees[index].pic = null;
                                updatedEmployees[index].picPreview = null;
                                setEmployees(updatedEmployees);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 text-right">
                        {employee.cv && (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-gray-600 font-medium truncate">{employee.cv.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedEmployees = [...employees];
                                updatedEmployees[index].cv = null;
                                setEmployees(updatedEmployees);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">PDF only, max 5MB.</p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button type="button" onClick={addEmployeeForm} className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-base shadow-sm cursor-pointer transition border border-gray-300 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Another Employee
              </button>
              <Button onClick={handleInvite} className="w-full sm:w-auto font-bold bg-gray-900 hover:bg-black text-white px-8 py-2 rounded-lg transition-colors flex items-center justify-center gap-2" disabled={btnLoading}>
                {btnLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inviting...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Invite Employee(s)
                  </>
                )}
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
