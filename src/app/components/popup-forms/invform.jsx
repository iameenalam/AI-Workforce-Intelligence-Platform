"use client";
import { useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CloudUpload, X, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function InvForm({ onClose }) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [employees, setEmployees] = useState([{ id: Date.now(), name: "", email: "", pic: null, picPreview: null }]);
  const fileInputRefs = useRef([]);

  const addEmployeeForm = () => {
    const newEmployee = { id: Date.now(), name: "", email: "", pic: null, picPreview: null };
    setEmployees([...employees, newEmployee]);
  };

  const removeEmployeeForm = (index) => {
    if (employees.length > 1) {
      const updatedEmployees = employees.filter((_, i) => i !== index);
      setEmployees(updatedEmployees);
      fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
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
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const updatedEmployees = [...employees];
      updatedEmployees[index].pic = file;
      updatedEmployees[index].picPreview = URL.createObjectURL(file);
      setEmployees(updatedEmployees);
    }
  };

  const handleInvite = async () => {
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      if (!emp.name.trim() || !emp.email.trim()) {
        toast.error(`Please fill in all required fields for employee ${i + 1}`);
        return;
      }
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(emp.email)) {
        toast.error(`Please enter a valid email address for employee ${i + 1}`);
        return;
      }
    }
    setBtnLoading(true);
    setSuccess("");
    try {
      const token = Cookies.get("token");
      const formData = new FormData();
      formData.append("employees", JSON.stringify(employees.map(emp => ({
        name: emp.name,
        email: emp.email
      }))));
      employees.forEach((emp, index) => {
        if (emp.pic) {
          formData.append(`pic_${index}`, emp.pic);
        }
      });
      const { data } = await axios.post("/api/invitations", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Show all error toasts, combine with email for each failed invite
      if (data.errorDetails && data.errorDetails.length > 0) {
        data.errorDetails.forEach(({ email, error }) => {
          toast.error(`Failed to send invitation to ${email}. ${error}`);
        });
      }
      if (data.invitations && data.invitations > 0) {
        toast.success(data.message || "Invitations sent successfully");
      }
      setSuccess(data.message);
      setTimeout(() => {
        onClose?.();
      }, 1500);
    } catch (error) {
      // Show all backend error messages as separate toasts if present
      const errorDetails = error.response?.data?.errorDetails;
      const errorMessage = error.response?.data?.message || "Failed to invite employees";
      if (Array.isArray(errorDetails) && errorDetails.length > 0) {
        errorDetails.forEach(({ email, error }) => {
          toast.error(`Failed to send invitation to ${email}. ${error}`);
        });
        // Do NOT show the main error message if errorDetails exist
      } else {
        toast.error(errorMessage);
      }
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
              Invite Employee(s)
            </h1>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Add employees to your organization. They will be added to the unassigned pool.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 sm:p-6">
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
                      <label className="block font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        onChange={(e) => handlePicChange(index, e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[index]?.click()}
                          className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300"
                        >
                          <CloudUpload className="w-4 h-4" />
                          Choose Image
                        </button>
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
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" value={employee.email} onChange={(e) => handleEmployeeChange(index, "email", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" placeholder="Enter employee email" required />
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

