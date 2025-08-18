import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      {children}
    </div>
  );
}
