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
import { Eye, EyeOff, CheckCircle, Building2, Mail, User } from "lucide-react";
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
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const { data } = await axios.get(`/api/invitations/accept?token=${token}`);
      setInvitation(data.invitation);
      setUserExists(data.userExists);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired invitation");
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (e) => {
    e.preventDefault();
    setError("");

    if (!userExists) {
      if (!password || !confirmPassword) {
        setError("Password and confirmation are required");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
    }

    setAccepting(true);

    try {
      const { data } = await axios.post("/api/invitations/accept", {
        token,
        password: userExists ? undefined : password,
        confirmPassword: userExists ? undefined : confirmPassword,
        userExists,
      });

      // Set auth token
      Cookies.set("token", data.token, { expires: 5, secure: true, path: "/" });

      // Update Redux state
      dispatch(loginSuccess({
        user: data.user,
        message: data.message,
        token: data.token,
      }));

      toast.success(data.message);

      // Redirect to pending role assignment page
      setTimeout(() => {
        router.push("/pending");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to accept invitation");
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to {invitation?.organization?.name}!
              </h1>
              <p className="text-gray-600">
                You've been invited to join the team
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <User className="w-4 h-4 text-blue-600 mr-2" />
                <span className="font-medium text-gray-900">{invitation?.name}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-gray-600">{invitation?.email}</span>
              </div>
            </div>

            {userExists ? (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800">
                    Account found! You'll be signed in automatically.
                  </span>
                </div>
              </div>
            ) : (
              <form id="invitation-form" onSubmit={handleAcceptInvitation} className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Create your password to complete the invitation:
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <Button
              onClick={handleAcceptInvitation}
              type="button"
              className="w-full mt-6"
              disabled={accepting}
            >
              {accepting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Accepting Invitation...
                </>
              ) : (
                "Accept Invitation & Join Team"
              )}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                By accepting this invitation, you agree to join {invitation?.organization?.name}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
