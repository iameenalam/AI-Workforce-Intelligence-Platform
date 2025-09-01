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
    // Apply route protection
    redirectBasedOnRole("/pending");

    checkRoleStatus();

    // Check role status every 30 seconds
    const interval = setInterval(checkRoleStatus, 30000);

    return () => clearInterval(interval);
  }, [redirectBasedOnRole]);

  const checkRoleStatus = async () => {
    try {
      const token = Cookies.get("token");

      // Get current user's employee record
      const { data } = await axios.get("/api/user/permissions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update employee and organization info
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your role status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Logout Button - Top Right */}
      <div className="absolute top-6 right-6">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 shadow-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-full shadow-lg">
                <Clock className="w-12 h-12 text-yellow-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Welcome to {organization?.name || "the Organization"}!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Your invitation has been accepted successfully.
            </p>
            <p className="text-gray-500">
              Your role is currently being assigned by the administrator.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-full flex-shrink-0 shadow-sm">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">What's happening now?</h3>
                <ul className="text-sm text-gray-600 space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Your account has been created</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>You've been added to {organization?.name || "the organization"}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0 animate-pulse" />
                    <span>Waiting for role assignment by administrator</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl mb-8 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">{employee?.name || user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{employee?.email || user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-600">Current Role:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  {employee?.role || "Unassigned"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Organization:</span>
                <span className="font-medium text-gray-900">{organization?.name || "Loading..."}</span>
              </div>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-sm text-gray-600 mb-2">
              🚀 You'll be automatically redirected to the organization chart once your role is assigned.
            </p>
            <p className="text-xs text-gray-500">
              ⏱️ This page refreshes automatically every 30 seconds.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
