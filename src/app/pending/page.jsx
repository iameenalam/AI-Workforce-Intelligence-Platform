"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import { Clock, CheckCircle, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouteProtection } from "@/hooks/useRouteProtection";
import { logoutUser } from "@/redux/action/user";

export default function PendingRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuth } = useSelector((state) => state.user);
  const { redirectBasedOnRole } = useRouteProtection();

  const [employee, setEmployee] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    redirectBasedOnRole("/pending");
    checkRoleStatus();
    const interval = setInterval(checkRoleStatus, 30000);
    return () => clearInterval(interval);
  }, [redirectBasedOnRole]);

  const checkRoleStatus = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployee(data.employee);
      setOrganization(data.organization);
    } catch (error) {
      console.error("Error checking role status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="p-10 md:p-14 shadow-2xl border-t-4 border-indigo-500">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center mb-5">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-full shadow-lg">
                <Clock className="w-14 h-14 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Welcome to {organization?.name || "the Organization"}!
            </h1>
            <p className="text-slate-600 text-lg md:text-xl">
              Your role is currently pending assignment.
            </p>
          </div>

          <div className="bg-slate-100 p-6 rounded-xl mb-5 shadow-inner">
            <h3 className="font-semibold text-slate-800 mb-4 text-lg">
              What's happening now?
            </h3>
            <ul className="text-slate-600 space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>Your account has been created successfully.</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>You've been added to the organization.</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 animate-pulse" />
                <span>Waiting for an administrator to assign your role.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 p-6 rounded-xl shadow-inner">
            <h3 className="font-semibold text-slate-800 mb-4 text-lg">
              Your Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Name:</span>
                <span className="font-medium text-slate-800">
                  {employee?.name || user?.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Email:</span>
                <span className="font-medium text-slate-800">
                  {employee?.email || user?.email}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Current Role:</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                  {employee?.role || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}