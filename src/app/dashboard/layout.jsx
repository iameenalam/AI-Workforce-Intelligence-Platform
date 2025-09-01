import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1f2937",
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          duration: 4000,
        }}
      />
      {children}
    </div>
  );
}
