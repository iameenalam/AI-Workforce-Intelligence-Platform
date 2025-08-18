"use client";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function OrgForm({ onClose }) {
  const { isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const ceoFileInputRef = useRef();
  const orgLogoInputRef = useRef();

  const [form, setForm] = useState({
    name: "",
    ceoName: "",
    email: "",
    industry: "",
    companySize: "",
    city: "",
    country: "",
    yearFounded: "",
    organizationType: "",
    numberOfOffices: "",
    hrToolsUsed: "",
    hiringLevel: "",
    workModel: "",
  });
  const [orgLogo, setOrgLogo] = useState(null);
  const [orgLogoPreview, setOrgLogoPreview] = useState(null);
  const [ceoPic, setCeoPic] = useState(null);
  const [ceoPicPreview, setCeoPicPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingOrg, setCheckingOrg] = useState(true);

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
      return;
    }
    
    const checkOrganization = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const { data } = await axios.get("/api/organization", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data && data._id) {
          if (onClose) onClose();
          router.replace("/chart");
        }
      } catch (err) {
        // It's okay if it fails, means no org exists. The form will be shown.
      } finally {
        setCheckingOrg(false);
      }
    };
    
    checkOrganization();
  }, [isAuth, router, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCeoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCeoPic(file);
      setCeoPicPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setOrgLogo(file);
      setOrgLogoPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name || !form.ceoName || !form.email || !form.industry || !form.companySize ||
      !form.city || !form.country || !form.yearFounded || !form.organizationType ||
      form.numberOfOffices === "" || !form.hrToolsUsed || !form.hiringLevel ||
      !form.workModel
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      
      if (ceoPic) {
        formData.append("ceoPic", ceoPic);
      }
      if (orgLogo) {
        formData.append("organizationLogo", orgLogo);
      }

      const { data } = await axios.post("/api/organization", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.organization) {
        dispatch({ type: "organization/addOrganizationSuccess", payload: data });
        if (onClose) onClose();
        router.push("/chart");
      } else {
        setError("Failed to save organization details.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "An unexpected error occurred.";
      if (message === "User already has an organization") {
        if (onClose) onClose();
        router.replace("/chart");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const FileInputButton = ({ label, file, preview, onButtonClick, onFileChange, inputRef, required = false }) => (
    <div>
        <label className="block font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
        <div className="flex items-center gap-3">
            <button type="button" className="flex-1 w-full text-center justify-center relative flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm cursor-pointer hover:bg-gray-100 transition" onClick={onButtonClick}>
                <span className="mr-2"><svg width="18" height="18" fill="none" className="inline-block"><path d="M5 12l2-2 3 3 4-4" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="3" y="3" width="12" height="12" rx="3" stroke="#374151" strokeWidth="2" /></svg></span>
                {file ? "Change File" : "Choose File"}
            </button>
            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            {preview && <img src={preview} alt="Preview" className="rounded shadow h-10 w-10 object-cover border border-gray-200" />}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-2 sm:p-4">
      <div className="relative w-full max-w-3xl h-full flex flex-col">
        <div className="relative flex-1 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {checkingOrg ? (
            <div className="flex-grow flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
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
                  Organizational Details
                </h1>
                <p className="text-gray-600 text-center text-sm sm:text-base">
                  Please fill out your organizational details below.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 p-4 sm:p-6">
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 font-medium text-center rounded-lg">{error}</div>}
                <form id="organization-form" className="space-y-4 text-gray-900" onSubmit={submitHandler} autoComplete="off">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Organization Name *</label>
                            <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                        <FileInputButton label="Organization Logo" file={orgLogo} preview={orgLogoPreview} onButtonClick={() => orgLogoInputRef.current?.click()} onFileChange={handleLogoChange} inputRef={orgLogoInputRef} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">CEO Name *</label>
                            <input name="ceoName" type="text" value={form.ceoName} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                        <FileInputButton label="CEO Picture" file={ceoPic} preview={ceoPicPreview} onButtonClick={() => ceoFileInputRef.current?.click()} onFileChange={handleCeoFileChange} inputRef={ceoFileInputRef} required={false} />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block font-medium text-gray-700 mb-1">CEO Email *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Industry *</label>
                        <select name="industry" value={form.industry} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none cursor-pointer bg-white" required>
                            <option value="">Select</option><option>Healthcare and Social Assistance</option><option>Finance and Insurance</option><option>Professional, Scientific and Technical Services</option><option>Information Technology (IT) and Software</option><option>Telecommunications</option>
                        </select>
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Company Size *</label>
                        <select name="companySize" value={form.companySize} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none cursor-pointer bg-white" required>
                            <option value="">Select</option><option>150-300</option><option>300-450</option><option>450-600</option><option>600-850</option><option>850-1000</option><option>1000+</option><option>5000+</option>
                        </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">City *</label>
                        <input name="city" type="text" placeholder="City" value={form.city} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Country *</label>
                        <input name="country" type="text" placeholder="Country" value={form.country} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Year Founded *</label>
                        <input name="yearFounded" type="number" value={form.yearFounded} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Organization Type *</label>
                        <select name="organizationType" value={form.organizationType} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none cursor-pointer bg-white" required>
                            <option value="">Select</option><option>Private</option><option>Public</option><option>Non-Profit</option><option>Government</option>
                        </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Number of Offices *</label>
                        <input name="numberOfOffices" type="number" value={form.numberOfOffices} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required min={0} />
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">HR Tools Used *</label>
                        <input name="hrToolsUsed" type="text" placeholder="e.g. BambooHR, Workday" value={form.hrToolsUsed} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Hiring Level *</label>
                        <select name="hiringLevel" value={form.hiringLevel} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none cursor-pointer bg-white" required>
                            <option value="">Select</option><option>Low</option><option>Moderate</option><option>High</option>
                        </select>
                        </div>
                        <div>
                        <label className="block font-medium text-gray-700 mb-1">Work Model *</label>
                        <select name="workModel" value={form.workModel} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 transition outline-none cursor-pointer bg-white" required>
                            <option value="">Select</option><option>Onsite</option><option>Remote</option><option>Hybrid</option><option>Mixed</option>
                        </select>
                        </div>
                    </div>
                </form>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <Button form="organization-form" type="submit" className="w-full font-bold bg-gray-900 hover:bg-black text-white text-base shadow cursor-pointer" disabled={loading}>
                  {loading ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            </>
          )}
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
