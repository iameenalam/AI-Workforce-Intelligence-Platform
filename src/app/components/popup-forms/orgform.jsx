import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Loader2, ArrowRight, ArrowLeft, Check, UploadCloud, FileText, X } from "lucide-react";

export default function OrgForm({ onClose }) {
  const { isAuth } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const ceoFileInputRef = useRef();
  const ceoCvInputRef = useRef();
  const orgLogoInputRef = useRef();

  const [currentStep, setCurrentStep] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("forward");

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
  const [ceoCv, setCeoCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");

  // New state for rotating loading messages
  const [loadingMessage, setLoadingMessage] = useState("");

  const formSteps = [
    { id: 'name', label: "What is your organization's name?", type: 'text', required: true },
    { id: 'organizationLogo', label: 'Upload your organization\'s logo.', type: 'file', required: false, fileType: 'logo' },
    { id: 'ceoName', label: "What is the CEO's full name?", type: 'text', required: true },
    { id: 'ceoPic', label: 'Please provide a picture of the CEO.', type: 'file', required: false, fileType: 'ceoPic' },
    { id: 'email', label: "What is the CEO's email address?", type: 'email', required: true },
    { id: 'ceoCv', label: 'Upload the CEO\'s CV.', type: 'file', required: false, fileType: 'ceoCv' },
    { id: 'industry', label: 'Which industry does your organization belong to?', type: 'select', required: true, options: ['Healthcare and Social Assistance', 'Finance and Insurance', 'Professional, Scientific and Technical Services', 'Information Technology (IT) and Software', 'Telecommunications'] },
    { id: 'companySize', label: 'What is the size of your company?', type: 'select', required: true, options: ['150-300', '300-450', '450-600', '600-850', '850-1000', '1000+', '5000+'] },
    // This step is now marked as required
    { id: 'location', label: 'Where is your main office located?', type: 'group', required: true, fields: [
      { id: 'city', placeholder: 'City *', required: true },
      { id: 'country', placeholder: 'Country *', required: true }
    ]},
    { id: 'yearFounded', label: 'What year was the organization founded?', type: 'number', required: true },
    { id: 'organizationType', label: 'What is the organization type?', type: 'select', required: true, options: ['Private', 'Public', 'Non-Profit', 'Government'] },
    { id: 'numberOfOffices', label: 'How many offices do you have?', type: 'number', required: true, min: 0 },
    { id: 'hrToolsUsed', label: 'What primary HR tools do you use?', type: 'text', required: true, placeholder: 'e.g. BambooHR, Workday' },
    { id: 'hiringLevel', label: 'Describe your current hiring level.', type: 'select', required: true, options: ['Low', 'Moderate', 'High'] },
    { id: 'workModel', label: "What is your company's work model?", type: 'select', required: true, options: ['Onsite', 'Remote', 'Hybrid', 'Mixed'] },
  ];

  const [completedSteps, setCompletedSteps] = useState(new Array(formSteps.length).fill(false));

  // Array of messages to display during the loading state
  const loadingMessages = [
    "Setting up your organization profile...",
    "Analyzing the CEO's CV for key insights...",
    "Polishing your new digital home...",
    "This is where the magic happens...",
    "Just a moment, we're rolling out the red carpet...",
    "Good things come to those who wait...",
    "Almost there, preparing your dashboard...",
  ];

  // This effect handles the rotation of loading messages
  useEffect(() => {
    let interval;
    if (loading) {
      // Set the first message immediately upon loading
      setLoadingMessage(loadingMessages[0]);
      let messageIndex = 0;
      // Set an interval to cycle through messages every 3 seconds
      interval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 3000);
    }
    // Cleanup function to clear the interval when the component unmounts or loading stops
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]); // This effect depends on the 'loading' state

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
        // Silently fail if organization doesn't exist
      }
    };
    checkOrganization();
  }, [isAuth, router, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (stepError) setStepError("");
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileType === 'logo') {
      setOrgLogo(file);
      setOrgLogoPreview(URL.createObjectURL(file));
    } else if (fileType === 'ceoPic') {
      setCeoPic(file);
      setCeoPicPreview(URL.createObjectURL(file));
    } else if (fileType === 'ceoCv') {
      if (file.type !== "application/pdf") {
        setStepError("CV must be a PDF file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStepError("CV file size must be less than 5MB.");
        return;
      }
      setCeoCv(file);
    }
    if (stepError) setStepError("");
  };

  const validateStep = () => {
    const currentField = formSteps[currentStep];
    if (!currentField.required) return true;

    if (currentField.type === 'group') {
      for (const field of currentField.fields) {
        if (field.required && !form[field.id]) {
          setStepError(`Please fill in the ${field.placeholder.replace('*', '').trim()}.`);
          return false;
        }
      }
    } else {
      const value = form[currentField.id];
      if (value === null || value === undefined || value.toString().trim() === "") {
        setStepError("This field is required.");
        return false;
      }
      if (currentField.type === 'email') {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(value)) {
          setStepError("Please enter a valid email address.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStepError("");
      const newCompletedSteps = [...completedSteps];
      newCompletedSteps[currentStep] = true;
      setCompletedSteps(newCompletedSteps);

      if (currentStep < formSteps.length - 1) {
        setAnimationDirection("forward");
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setStepError("");
    if (currentStep > 0) {
      setAnimationDirection("backward");
      setCurrentStep((prev) => prev - 1);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setError("");

    try {
      setLoading(true);
      const token = Cookies.get("token");
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (ceoPic) formData.append("ceoPic", ceoPic);
      if (ceoCv) formData.append("ceoCv", ceoCv);
      if (orgLogo) formData.append("organizationLogo", orgLogo);

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
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = formSteps[currentStep];
    const commonInputClass = "w-full text-xl sm:text-2xl bg-transparent border-b-2 border-gray-300 focus:border-gray-900 transition-colors duration-300 outline-none py-2";

    switch (step.type) {
      case 'text':
      case 'email':
      case 'number':
        return <input name={step.id} type={step.type} value={form[step.id]} onChange={handleChange} placeholder="Type your answer here..." className={commonInputClass} autoFocus onKeyDown={(e) => e.key === 'Enter' && handleNext()} />;

      case 'select':
        return (
          <select name={step.id} value={form[step.id]} onChange={handleChange} className={`${commonInputClass} cursor-pointer`}>
            <option value="">Select an option</option>
            {step.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );

      case 'group':
        return (
          <div className="flex flex-col sm:flex-row gap-4">
            {step.fields.map(field => (
              <input key={field.id} name={field.id} type="text" value={form[field.id]} onChange={handleChange} placeholder={field.placeholder} className={`${commonInputClass} text-center`} />
            ))}
          </div>
        );

      case 'file':
        let file, preview, ref, accept, fileTypeText;
        if (step.fileType === 'logo') { [file, preview, ref, accept, fileTypeText] = [orgLogo, orgLogoPreview, orgLogoInputRef, 'image/*', 'an image']; }
        else if (step.fileType === 'ceoPic') { [file, preview, ref, accept, fileTypeText] = [ceoPic, ceoPicPreview, ceoFileInputRef, 'image/*', 'an image']; }
        else { [file, preview, ref, accept, fileTypeText] = [ceoCv, null, ceoCvInputRef, '.pdf', 'a PDF']; }

        return (
          <div className="w-full text-center">
            <input ref={ref} type="file" accept={accept} onChange={(e) => handleFileChange(e, step.fileType)} className="hidden" />
            {!file ? (
              <button type="button" onClick={() => ref.current?.click()} className="inline-flex items-center gap-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg font-semibold text-gray-800">
                <UploadCloud size={20} /> Choose {fileTypeText} to upload
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {preview && <img src={preview} alt="Preview" className="rounded-lg shadow-md h-24 w-24 object-cover border-2 border-white" />}
                {step.fileType === 'ceoCv' && <FileText className="w-16 h-16 text-gray-500" />}
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
                  <Check size={16} />
                  <span>{file.name}</span>
                  <button type="button" onClick={() => {
                      if (step.fileType === 'logo') { setOrgLogo(null); setOrgLogoPreview(null); }
                      else if (step.fileType === 'ceoPic') { setCeoPic(null); setCeoPicPreview(null); }
                      else { setCeoCv(null); }
                  }} className="ml-2 text-red-500 hover:text-red-700">
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
            {step.fileType === 'ceoCv' && <p className="text-xs text-gray-500 mt-2">Max 5MB. CV will be parsed automatically.</p>}
          </div>
        );
      default: return null;
    }
  };

  const completedCount = completedSteps.filter(Boolean).length;
  const progress = (completedCount / formSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-sans">
      <div className="relative w-full max-w-2xl h-[70vh] max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20">
          <X size={24} />
        </button>

        <div className="p-6 sm:p-8 border-b">
            <h2 className="text-xl font-bold text-gray-800">Organizational Details</h2>
            <div className="flex justify-between items-center text-sm text-gray-500 font-medium mt-1">
                <span>Completed {completedCount} of {formSteps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-gray-800 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-hidden">
          {/* Conditional rendering: Show loading screen or form content */}
          {loading ? (
            <div className="text-center animate-step-forward">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-800" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Creating Your Profile</h3>
              {/* Display the rotating loading message */}
              <p className="mt-2 text-gray-500 min-h-[24px]">{loadingMessage}</p>
            </div>
          ) : (
            <>
              {error && <div className="absolute top-4 w-full px-10"><div className="p-3 bg-red-100 text-red-700 font-medium text-center rounded-lg text-sm">{error}</div></div>}
              <div key={currentStep} className={`w-full text-center animate-step-${animationDirection}`}>
                <label className="block text-xl sm:text-2xl font-bold text-gray-800 mb-8">
                  {currentStep + 1}. {formSteps[currentStep].label}
                  {!formSteps[currentStep].required && <span className="text-base font-normal text-gray-500 ml-2">(Optional)</span>}
                </label>
                {renderStepContent()}
                {stepError && <p className="text-red-500 text-sm mt-3 animate-shake">{stepError}</p>}
              </div>
            </>
          )}
        </div>

        {/* Hide footer buttons when loading to prevent multiple submissions */}
        {!loading && (
          <div className="p-6 bg-gray-50 border-t flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="disabled:opacity-50">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {currentStep < formSteps.length - 1 ? (
              <Button onClick={handleNext} className="bg-gray-800 hover:bg-gray-900 text-white">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submitHandler} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="mr-2 h-4 w-4" /> Create Organization
              </Button>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes slide-in-from-right {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-to-left {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-50px); opacity: 0; }
        }
        @keyframes slide-in-from-left {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-to-right {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(50px); opacity: 0; }
        }
        .animate-step-forward {
          animation: slide-in-from-right 0.4s ease-out forwards;
        }
        .animate-step-backward {
          animation: slide-in-from-left 0.4s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
