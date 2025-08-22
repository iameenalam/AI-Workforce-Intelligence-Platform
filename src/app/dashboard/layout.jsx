import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1f2937", 
            border: '1px solid #e2e8f0' 
          }
        }}
      />
      {children}
    </div>
  );
}
