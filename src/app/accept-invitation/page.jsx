"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loginSuccess } from "@/redux/reducer/userReducer";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  CheckCircle,
  Building2,
  Mail,
  User,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AcceptInvitationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link. No token provided.");
      setLoading(false);
      return;
    }
    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data } = await axios.get(
        `/api/invitations/accept?token=${token}`
      );
      setInvitation(data.invitation);
      setUserExists(data.userExists);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "This invitation is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (e) => {
    e.preventDefault();
    setError("");

    if (!userExists) {
      if (!password || !confirmPassword) {
        return setError("Please fill out both password fields.");
      }
      if (password.length < 6) {
        return setError("Password must be at least 6 characters long.");
      }
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
    }

    setAccepting(true);

    try {
      const payload = { token };

      if (!userExists) {
        payload.password = password;
        payload.confirmPassword = confirmPassword;
      }

      const { data } = await axios.post("/api/invitations/accept", payload);

      Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

      dispatch(
        loginSuccess({
          user: data.user,
          message: data.message,
          token: data.token,
        })
      );

      toast.success(data.message || "Invitation accepted successfully!");

      setTimeout(() => {
        router.push("/pending");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to accept invitation. Please try again."
      );
      setAccepting(false);
    }
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

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 text-center shadow-xl">
          <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Invitation Error
          </h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="p-10 md:p-14 shadow-2xl border-t-4 border-indigo-500">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-5">
              {invitation?.organization?.logoUrl ? (
                <img
                  src={invitation?.organization?.logoUrl}
                  alt={`${invitation?.organization?.name} Logo`}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-full shadow-lg">
                  <Building2 className="w-14 h-14 text-white" />
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              You're invited to join {invitation?.organization?.name}!
            </h1>
            <p className="text-slate-600 text-lg md:text-xl">
              Accept the invitation to start collaborating with the team.
            </p>
          </div>

          <div className="bg-slate-100 p-6 rounded-xl mb-8 shadow-inner">
            <div className="flex items-center mb-4">
              <User className="w-6 h-6 text-indigo-500 mr-4" />
              <span className="font-medium text-slate-800 text-lg">
                {invitation?.name}
              </span>
            </div>
            <div className="flex items-center">
              <Mail className="w-6 h-6 text-indigo-500 mr-4" />
              <span className="text-slate-600 text-lg">
                {invitation?.email}
              </span>
            </div>
          </div>

          <form onSubmit={handleAcceptInvitation}>
            {userExists ? (
              <div className="bg-emerald-50 border-l-4 border-emerald-400 p-5 rounded-md mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-7 h-7 text-emerald-500 mr-4" />
                  <span className="text-emerald-800 text-lg font-medium">
                    We found an existing account for this email.
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-slate-700 text-lg mb-4">
                  Create your password to complete the invitation:
                </p>
                <div className="grid md:grid-cols-2 md:gap-x-6 space-y-4 md:space-y-0">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="font-semibold text-slate-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-12 pr-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="font-semibold text-slate-700"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="h-12 pr-10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-md mb-6">
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              disabled={accepting}
            >
              {accepting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  <span>Accepting Invitation...</span>
                </div>
              ) : (
                "Accept & Join Organization"
              )}
            </Button>
            <p className="text-center text-sm text-slate-500 mt-6">
              By accepting this invitation, you agree to join{" "}
              {invitation?.organization?.name}.
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}